---
name: update-03-doc-handoff
description: >-
  Update agent step 3: assemble the Google Doc body (metadata → list of changes → updated article) as a
  Markdown-described manuscript, deliver it via the markdown-to-google-doc skill, verify the Doc back,
  and optionally write the new doc_url into a tracking Google Sheet row that matches source_url.
---

# Update agent — 03 Doc handoff

Log line prefix: `[run-debug] workflow=content/update-agent | 03-doc | <facts>`

## Prerequisites

From step 02:

- `enhanced_html`, `change_summary_markdown` (Markdown bullet list).
- `source_url`, `source_title`, `source_description`, `target_keyword`, `links_added`, `faq_added`.
- `current_year`, `title_rendered`, `meta_description_rendered`, `title_year_updated`, `description_year_updated`.
- `wp_post`, `post_id`, `post_type`, `rest_route`, `cms_publish_eligible` (when REST-resolved).
- `client_config`, `drive_folder_id` (non-empty).
- Human gate passed (`y` / `yes`).

## Delivery contract

This step delivers through the content skill: [`../../../../skills/content/markdown-to-google-doc/SKILL.md`](../../../../skills/content/markdown-to-google-doc/SKILL.md). That skill is the single source of truth for the metadata `<ul>` block, the DOCTYPE/`<style>` HTML shell, the hand-built `multipart/related` Drive upload (fixed boundary, CRLF), and the read-back check.

**HTML fidelity exception (read this).** Unlike the content-generation agents, the update agent does not round-trip the article through Markdown. The "Updated article" body is `enhanced_html` from step 02, and step 02's link-preservation check guarantees every original href survives. Converting that HTML to Markdown and back would risk dropping links or structure, so the article section is passed to the shared skill **as a preserved allowed-HTML fragment**, not regenerated from Markdown. The metadata block and the "List of changes" (which are Markdown / structured) follow the shared skill's Markdown → HTML inline rules.

## Drive credentials

Use the unified OAuth bundle resolved in step 01:

- Prefer the gitignored [`../.credentials/token_unified.json`](../.credentials/README.md) (`refresh_token`, `client_id`, `client_secret`, `token_uri`).
- Else `GOOGLE_OAUTH_CLIENT_ID` + `GOOGLE_OAUTH_CLIENT_SECRET` + `GOOGLE_OAUTH_REFRESH_TOKEN` from `.env`.

Mint the access token via `grant_type=refresh_token` against `token_uri` (default `https://oauth2.googleapis.com/token`). Drive scope is required; Sheets scope is required only when the optional calendar block is configured.

If `drive_folder_id` is empty, stop and ask the operator.

## Doc title

`(Update) {source_title} — YYYY-MM-DD` (UTC date). Strip filesystem-hostile characters (`/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`) from `source_title`; collapse runs of whitespace.

## Doc body (assemble, then hand to the shared skill)

Build the inner body in this exact structural order; it matches the canonical update-doc-handoff shape used by every `client-workflows/*/update-agent/`:

1. `<h1>(Update) {source_title}</h1>`
2. Metadata `<ul>` (per the shared skill's "Metadata inside body", extended for the update agent):

   ```
   <ul>
     <li><strong>Original URL:</strong> <a href="{source_url}">{source_url}</a></li>
     <li><strong>Generated:</strong> {YYYY-MM-DD HH:MM:SS} UTC</li>
     <li><strong>Target keyword:</strong> {target_keyword}</li>
     <li><strong>Crosslinks added:</strong> {links_added}</li>
     <li><strong>FAQ section:</strong> {Yes|No}</li>
     <li><strong>Current year:</strong> {current_year}</li>
     <li><strong>Original title:</strong> {source_title}</li>
     <li><strong>Proposed title:</strong> {title_rendered}{ " (unchanged)" when !title_year_updated }</li>
     <li><strong>Original meta description:</strong> {source_description or "(none)"}</li>
     <li><strong>Proposed meta description:</strong> {meta_description_rendered or "(none)"}{ " (unchanged)" when !description_year_updated }</li>
     {when wp_post present:}
     <li><strong>WordPress post id:</strong> {post_id} ({post_type})</li>
     <li><strong>REST route:</strong> {rest_route}</li>
   </ul>
   ```
3. `<hr>`
4. `<h2>List of changes</h2>` followed by `change_summary_markdown` rendered to HTML using the content skill's **inline Markdown** rules: top-level `- ...` lines -> `<li>` in a single `<ul>`; inline backticks -> `<code>`; Markdown links with an anchor and URL -> `<a href="url">anchor</a>`; escape raw `<` / `>` / `&` outside those constructs.
5. `<hr>`
6. `<h2>Updated article</h2>` followed by `enhanced_html` **verbatim** (preserved HTML fragment — do not convert to Markdown).

Keep the two `<hr>` lines and the two `<h2>` headings as the only `<h2>` elements inside the metadata wrapper.

Then wrap the assembled body in the content skill's **HTML shell** and upload it with the content skill's **Drive upload** sequence:

- `name` = the Doc title above.
- `mimeType` = `application/vnd.google-apps.document`.
- `parents` = `[ drive_folder_id ]`.

## Verify

Per the content skill's **Check** step, read the Doc back with `GET https://www.googleapis.com/drive/v3/files/{doc_id}?fields=name,parents,webViewLink&supportsAllDrives=true` and log:

```
[run-debug] workflow=content/update-agent | 03-doc | doc_verify=ok folder=<drive_folder_id> doc_id=<doc_id> crosslinks_added=<n> faq_added=<bool> title_year_updated=<bool> description_year_updated=<bool>
```

Capture `doc_url`: prefer the response's `webViewLink`; else `https://docs.google.com/document/d/{doc_id}/edit`.

On any non-2xx, surface the response body's first ~500 chars but do **not** roll back the Doc — the Doc URL is still the deliverable.

## Calendar write (optional)

Read `client_config.workflow_specific.update_agent.calendar`:

```json
{
  "spreadsheet_id": "",
  "tab": "",
  "url_match_column": "",
  "doc_url_column": "",
  "create_row_if_missing": false
}
```

If `spreadsheet_id` is empty / missing, log `calendar=skip reason=not-configured` and return — no error.

Otherwise:

1. `GET https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{tab}!{url_match_column}:{url_match_column}` to read the URL column.
2. Find the **first** row (1-based) where the cell value equals `source_url` after normalization (lowercase host, strip trailing slash, strip query and fragment).
3. If a match is found:
   - `PUT https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{tab}!{doc_url_column}{row}?valueInputOption=USER_ENTERED`
   - Body: `{ "values": [[doc_url]] }`.
   - Log `calendar=updated row=<n> doc_col=<col>`.
4. If no match and `create_row_if_missing` is `true`:
   - `POST .../values/{tab}!A:Z:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS` with the new row.
   - Log `calendar=appended doc_col=<col>`.
5. If no match and `create_row_if_missing` is `false`, log `calendar=no-match url=<source_url>` and return without writing.

A 4xx from Sheets must not roll back the prior Doc creation. Surface the failure to the operator with the response body and continue the run as a soft failure.

## Deliverable

`doc_url` — `https://docs.google.com/document/d/{doc_id}/edit` (or `webViewLink`). Hand this back to the operator.

## After the Doc

Updating WordPress is **not** automatic. After editorial sign-off, the operator applies the approved HTML via [.agents/skills/operational/wordpress/SKILL.md](../../../../skills/operational/wordpress/SKILL.md) — typically `POST {rest_route}` as `status: draft` for another review round. This boundary matches every canonical client update-agent (see `client-workflows/hydrolix/update-agent/wordpress-post-update/05-patch-and-handoff/SKILL.md` for the explicit-request-only pattern).
