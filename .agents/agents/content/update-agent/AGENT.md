---
name: update-agent
description: >-
  Update an existing piece of Arize content (WordPress post / page / glossary entry, or a Google Doc draft).
  Prefers WordPress REST as the source of truth; falls back to public URL fetch or Google Doc export.
  Builds runtime crosslinks dynamically (crosslinks.json + optional SerpAPI top 10 within the last year),
  enhances via Anthropic (no prose changes; only crosslinks + FAQ, sentence-cased title and body headings,
  plus outdated-year tokens in the title and meta description bumped to the current year), verifies link
  preservation, gates on a human reviewer,
  and produces a Google Doc with a list of changes at top and the updated article at bottom. Publishing
  back to WordPress is a separate, explicit step after editorial approval.
---

# Update agent (Arize content)

End state: a Google Doc in the configured Drive folder containing run metadata, a Markdown list of every change made, and the updated article. WordPress is updated only after explicit operator approval (see **After the Doc**).

This agent matches the canonical update-agent shape used across `client-workflows/*/update-agent/`: WordPress REST is the preferred source, off-CMS URLs fall back to live HTML fetch, Google Docs can be the input, crosslinks are built at runtime, and the deliverable is always a review Doc — never a direct CMS write.

## Inputs

- **`source_url`** — required. One of:
  - An `arize.com` URL with `/blog/<slug>`, `/blog-course/<slug>`, `/<slug>/`, or any path the WordPress REST API knows about.
  - A bare slug matching `^[a-z0-9-]+$` (resolved against `WORDPRESS_BASE_URL`).
  - A Google Doc URL (`https://docs.google.com/document/d/<id>/…`) or a raw Doc id (`^[a-zA-Z0-9-_]{20,}$`).
- **WordPress** (for REST-resolved posts): `WORDPRESS_BASE_URL`, `WORDPRESS_USERNAME`, `WORDPRESS_APPLICATION_PASSWORD` from `.env`; HTTP Basic auth. See [.agents/skills/operational/wordpress/SKILL.md](../../../skills/operational/wordpress/SKILL.md).
- **Anthropic**: `ANTHROPIC_API_KEY` from `.env`; optional `CLAUDE_MODEL`; optional `config.json` override `anthropic.model`. Same credentials as [apps/internal/arize-marketing-dashboards/scripts/fetch-llm-visibility-snapshot.js](../../../../apps/internal/arize-marketing-dashboards/scripts/fetch-llm-visibility-snapshot.js).
- **Google Drive / Sheets**: OAuth bundle in [`.credentials/token_unified.json`](.credentials/README.md) (preferred) or `GOOGLE_OAUTH_*` env vars. Drive scope is required; Sheets scope is required only when the optional calendar-write block is configured.
- **SerpAPI** (optional): `SERPAPI_API_KEY` in `.env`. When set, augments the static crosslinks list with the top 10 organic results for the inferred `target_keyword` (≤ 1 year old).

## Outputs

- New Google Doc in the configured Drive folder; title `(Update) {source_title} — YYYY-MM-DD` (UTC).
- Optional: a tracking-sheet row updated with the new `doc_url` (only when `workflow_specific.update_agent.calendar.spreadsheet_id` is set).
- Optional scratch files under [`tmp/`](tmp/.gitignore) — do not commit generated content.

## Run order

1. [01-scope-config-fetch/SKILL.md](01-scope-config-fetch/SKILL.md) — validate input, merge config, resolve auth, **prefer WordPress REST** for resolution, fall back to public URL fetch, or take a Google Doc input directly. Carries forward `source_url`, `source_title`, `source_description`, `content_html`, `wp_post` (when REST-resolved), and `cms_publish_eligible`.
2. [02-enhance/SKILL.md](02-enhance/SKILL.md) — build runtime crosslinks (base list + optional SerpAPI), infer `target_keyword`, call Anthropic for the enhancement (no prose changes; only crosslinks + FAQ in the body, **sentence-case the title and every body heading**, **plus outdated-year tokens in the title and meta description bumped to the current year**), run the **link-preservation check**, then a second Anthropic call to produce `change_summary_markdown`. Requires a **human gate** (`y` / `yes`) before any Drive write.
3. [03-doc-handoff/SKILL.md](03-doc-handoff/SKILL.md) — assemble the Doc body (metadata + proposed title/description → `## List of changes` → `---` → `## Updated article`), multipart-upload to Drive, verify with `files.get`, optionally write `doc_url` into the configured tracking sheet row matching `source_url`.

## After the Doc

Updating WordPress is **not** automatic. After editorial sign-off, apply the approved HTML via [.agents/skills/operational/wordpress/SKILL.md](../../../skills/operational/wordpress/SKILL.md) (typically `POST /wp-json/wp/v2/{posts,pages,glossary}/{id}` as `draft` for another review round). The agent never PATCHes WordPress on its own — that boundary is intentional and matches every canonical client update-agent.

## Logging prefix

Use a consistent prefix on every step so traces are easy to grep:

`[run-debug] workflow=content/update-agent | <PHASE> | <facts>`

Each step's `SKILL.md` repeats this format with its own `<PHASE>` slug (`01-scope`, `02-enhance`, `03-doc`).

## Assets

- [`crosslinks.json`](crosslinks.json) — curated allowlist of Arize internal URLs and approved anchors. Base list for the runtime crosslinks builder.
- `crosslinks.txt` — legacy plain-text allowlist kept for reference and quick edits; only `crosslinks.json` is consumed at runtime.
- [`prompts/enhance_article.txt`](prompts/enhance_article.txt) — Anthropic enhancement prompt; substitutes `{article_content}`, `{crosslinks}`, `{target_keyword}`.
- [`prompts/diff_summary.txt`](prompts/diff_summary.txt) — second-call Anthropic prompt that turns the original-vs-enhanced diff into an agent-readable Markdown bullet list.
- Optional `config.json` — per-run overrides for `wordpress.site_url`, `anthropic.model`, `google_drive.folder_id`, `workflow_specific.update_agent.calendar`, and `crosslinks.serpapi.enabled`.

## References

- [references/content/voice-and-tone.md](../../../../references/content/voice-and-tone.md)
- [references/content/brand-lexicon.md](../../../../references/content/brand-lexicon.md)
- [references/content/formatting.md](../../../../references/content/formatting.md)
- [.agents/skills/content/internal-backlinking/SKILL.md](../../../skills/content/internal-backlinking/SKILL.md)
- [.agents/skills/content/refresh-and-decay/SKILL.md](../../../skills/content/refresh-and-decay/SKILL.md)
