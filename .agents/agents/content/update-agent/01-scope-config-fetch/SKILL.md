---
name: update-01-scope-config-fetch
description: >-
  Update agent step 1: validate input, merge config, resolve credentials, and resolve the source
  content. Prefers WordPress REST (posts → pages → glossary) as the source of truth; falls back to
  public URL fetch for off-CMS pages, or to Google Doc export when the input is a Doc URL / id.
---

# Update agent — 01 Scope, config, resolve

Log line prefix: `[run-debug] workflow=content/update-agent | 01-scope | <facts>`

## Goal

Take a single `source_url` input (URL, slug, or Google Doc id) and produce the inputs the rest of the pipeline depends on: `source_url`, `source_title`, `source_description`, `content_html`, optional `wp_post`, and `cms_publish_eligible`.

`source_description` is the public-facing meta description / excerpt for the page — used in step 02 alongside `source_title` to bump outdated year tokens to the current year (see [`../02-enhance/SKILL.md`](../02-enhance/SKILL.md) §"Year update"). It is a plain-text string (HTML stripped) and may be empty when no description is available.

## Accepted inputs

- An `arize.com` URL with any path (`/blog/<slug>`, `/blog-course/<slug>`, `/<slug>/`, etc.).
- A bare slug matching `^[a-z0-9-]+$` (resolved against `WORDPRESS_BASE_URL`).
- A Google Doc URL (`https://docs.google.com/document/d/<id>/…`) or a raw Doc id (`^[a-zA-Z0-9-_]{20,}$`).

If the input matches none of these, stop and ask for a clearer input.

## Merge config (later overrides earlier)

1. Repo `.env` — `WORDPRESS_*`, `ANTHROPIC_API_KEY`, `GOOGLE_OAUTH_*`, `SERPAPI_API_KEY`, `GOOGLE_DRIVE_UPDATE_AGENT_FOLDER_ID`.
2. Optional `config.json` in this folder. Recognised keys:
   - `wordpress.site_url` — override `WORDPRESS_BASE_URL` (e.g. staging host).
   - `wordpress.post_types` — array; defaults to `["posts", "pages", "glossary"]`.
   - `anthropic.model` — override the default Claude model.
   - `google_drive.folder_id` — destination folder for the new Doc.
   - `workflow_specific.update_agent.calendar` — optional sheet config for step 03 (see that step).
   - `crosslinks.serpapi.enabled` — boolean; defaults to `true` when `SERPAPI_API_KEY` is set.

## Resolve credentials

- **WordPress**: `WORDPRESS_USERNAME` + `WORDPRESS_APPLICATION_PASSWORD` (Basic auth). Same convention as [.agents/skills/operational/wordpress/SKILL.md](../../../../skills/operational/wordpress/SKILL.md).
- **Anthropic**: `ANTHROPIC_API_KEY`; default model `claude-sonnet-4-6` (same default as [apps/internal/arize-marketing-dashboards/scripts/fetch-llm-visibility-snapshot.js](../../../../../apps/internal/arize-marketing-dashboards/scripts/fetch-llm-visibility-snapshot.js)).
- **Google OAuth**: prefer the gitignored bundle at [`../.credentials/token_unified.json`](../.credentials/README.md); fall back to `GOOGLE_OAUTH_CLIENT_ID` + `GOOGLE_OAUTH_CLIENT_SECRET` + `GOOGLE_OAUTH_REFRESH_TOKEN`. Scopes must include Drive; add Sheets when the calendar block is configured.

Resolve **`WP_BASE`** from (in order): `wordpress.site_url` from merged config; else `WORDPRESS_BASE_URL`. Strip trailing slash. **`WP_API` = `{WP_BASE}/wp-json/wp/v2`**.

## Resolve source content

This is the canonical CMS-direct fetch for the Arize update agent. Three paths, tried in order.

### Path A — Google Doc input

Detect a Doc input when:

- The input contains `docs.google.com/document/d/`, **or**
- The whole input matches `^[a-zA-Z0-9-_]{20,}$` and is not also a valid `arize.com` slug.

Extract the doc id with regex `/document/d/([a-zA-Z0-9-_]+)` (or use the bare id directly).

1. `GET https://www.googleapis.com/drive/v3/files/{doc_id}?fields=name` → `source_title`.
2. `GET https://www.googleapis.com/drive/v3/files/{doc_id}/export?mimeType=text%2Fhtml` → `content_html`. If HTML export fails, retry with `mimeType=text/plain` and wrap the body in a single `<pre>` block.
3. Set `source_url = https://docs.google.com/document/d/{doc_id}/edit`, `source_description = ""` (Docs have no meta description), and **`cms_publish_eligible = false`**.

### Path B — WordPress REST (preferred)

Otherwise, derive the slug from the input:

- URL with `/<segment>/` path: take the last non-empty segment matching `[a-z0-9-]+`.
- Bare slug input: use as-is.

Preflight: `GET {WP_API}/users/me` with Basic auth. On `401`, stop and ask the operator to verify the Application Password for the exact host (staging vs production use different passwords).

Try each REST resource configured in `wordpress.post_types` (default `["posts", "pages", "glossary"]`) in order:

```
GET {WP_API}/{resource}?slug={slug}&_fields=id,slug,status,title,content,excerpt,link,type,yoast_head_json
```

On the first non-empty match:

- `wp_post` = first element.
- `post_id` = `wp_post.id`; `post_type` = `wp_post.type` or the resource that matched; `rest_route` = `/wp-json/wp/v2/{resource}/{post_id}`.
- `content_html` = `wp_post.content.rendered`.
- `source_title` = `wp_post.title.rendered` (HTML-decode entities).
- `source_description` (plain text, HTML stripped, entities decoded) = first non-empty of:
  1. `wp_post.yoast_head_json.description`
  2. `wp_post.yoast_head_json.og_description`
  3. `wp_post.excerpt.rendered` (strip tags).
- `source_url` = `wp_post.link` if present, else `{WP_BASE}/{slug}/`.
- `cms_publish_eligible = true`.

If the `yoast_head_json` field is not exposed by the site, the request still succeeds (WordPress simply omits the key) and the agent falls back to `excerpt.rendered`. Empty `source_description` is fine; step 02 will just skip the year-update on description.

If no resource returns a match, fall through to Path C.

### Path C — URL fallback

For inputs that are full URLs but no WordPress REST resource matched (off-CMS pages, microsites, marketing landing pages):

1. Normalize: ensure `https`, strip URL fragments. Follow at most one redirect.
2. `GET source_url` with a browser-like User-Agent (e.g. `ArizeUpdateAgent/1.0 (+https://arize.com)`), 60s timeout.
3. Title selection: first substantive `<h1>` text → `<meta property="og:title">` → `<title>`.
4. Description selection (plain text, HTML-decode entities): first non-empty of `<meta name="description">`, `<meta property="og:description">`, `<meta name="twitter:description">`. Empty string is fine.
5. Pick the main subtree: try `main`, `article`, `[role='main']`, the largest article-like container, then `body`.
6. Strip `script`, `style`, `noscript`, `iframe`, `nav`, `header`, `footer`, `aside`, and `[role='complementary']`.
7. Serialize to HTML and cap at ~55,000 characters before passing forward.

Set `cms_publish_eligible = false`. The agent's deliverable is still the Doc.

## Carry forward

- `source_url`, `source_title`, `source_description`, `content_html`
- `wp_post`, `post_id`, `post_type`, `rest_route` (Path B only)
- `cms_publish_eligible` (`true` for Path B, `false` for A and C)
- `client_config` (merged)
- `drive_folder_id` from `client_config.google_drive.folder_id` (else `GOOGLE_DRIVE_UPDATE_AGENT_FOLDER_ID` from env)

## Logging

Log:

- `resolve_source=wp_rest|url|google_doc`
- For Path B: `post_type=<...> post_id=<...> rest_route=<...> description_len=<n>`
- For Path A: `doc_id=<...> title_source=drive_name`
- For Path C: `status=<http> title_source=h1|og|title description_source=meta|og|twitter|none content_length=<n>`
- `drive_folder_id` (no secrets), `source_url` (no secrets)

## Failure handling

- Non-2xx on the WordPress preflight: stop with the response body's first ~500 chars.
- Non-2xx on Path C fetch: stop and surface status + body excerpt.
- Empty `content_html` after any path: hard failure.

## Next

[../02-enhance/SKILL.md](../02-enhance/SKILL.md)
