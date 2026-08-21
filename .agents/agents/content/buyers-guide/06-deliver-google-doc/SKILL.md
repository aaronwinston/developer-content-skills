---
name: buyers-guide-06-deliver-google-doc
description: >-
  After 05-eval passes (every criterion A or B), deliver tmp/{id}.md as one formatted Google Doc using the
  markdown-to-google-doc skill, then append title + Doc URL to the buyers-guide Review tab and record
  the Doc URL in tmp/{id}-eval.md.
---

# 06 - Deliver Google Doc + Review sheet

## Goal

When a buyer's guide run is ready for editorial review:

1. Create **exactly one** new Google Doc from the Markdown manuscript `tmp/{id}.md`, using the shared delivery skill so it imports with semantic formatting (Heading 1–3, hyperlinks, tables, lists) — not raw Markdown pasted as plain text.
2. Append **title** and **Doc URL** as a new row on the **Review** tab: [Buyer's guide review queue](https://docs.google.com/spreadsheets/d/1qnWSDLWQCyJzCveB8xfSjSDMRs57SkU0rXH9vXoevg8/edit?gid=1097685951#gid=1097685951) (spreadsheet id `1qnWSDLWQCyJzCveB8xfSjSDMRs57SkU0rXH9vXoevg8`, sheet gid `1097685951`).

The canonical input is the Markdown manuscript. This step does not rewrite it; it converts and uploads.

## Prerequisites

Steps 01 through 05 must be complete for this `{id}` in the same run. See [../AGENT.md](../AGENT.md).

Every criterion in `tmp/{id}-eval.md` must be A or B. If any grade is lower, follow the revision path in [../05-eval/SKILL.md](../05-eval/SKILL.md) and return here only after a clean eval from a full pipeline rerun.

## OAuth setup (local)

Same credential chain as [update-agent](../../update-agent/03-doc-handoff/SKILL.md):

1. Prefer gitignored [`.agents/agents/content/update-agent/.credentials/token_unified.json`](../../update-agent/.credentials/README.md) (`refresh_token`, `client_id`, `client_secret`, `token_uri`).
2. Or set `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, and `GOOGLE_OAUTH_REFRESH_TOKEN` in repo-root `.env`.

Scopes must include **Drive**, **Docs**, and **Sheets**. If delivery fails with insufficient scope, re-run [Google Workspace OAuth setup](../../../../skills/operational/google-workspace/SKILL.md) and update the refresh token or `token_unified.json`.

Optional env (see `.env.example`):

- `GOOGLE_DRIVE_BUYERS_GUIDE_FOLDER_ID` — parent folder for new Docs (omit to create in the authenticated user's Drive root).
- `GOOGLE_SHEETS_BUYERS_GUIDE_REVIEW_SPREADSHEET_ID` — defaults to the review spreadsheet above.
- `GOOGLE_SHEETS_BUYERS_GUIDE_REVIEW_GID` — defaults to `1097685951` (Review tab).

## Step 1 — Create the Google Doc (shared skill)

Read and follow [`../../../../skills/content/markdown-to-google-doc/SKILL.md`](../../../../skills/content/markdown-to-google-doc/SKILL.md). It is the single source of truth for Markdown → safe HTML fragment → DOCTYPE shell → multipart `files.create` Drive upload, including the hand-built `multipart/related` boundary and the `<ul>`/`<li>` balance checks.

For this workflow:

- **Manuscript:** `tmp/{id}.md`.
- **Doc title:** the first `#` H1 in the manuscript (strip the leading `#`, trim). Sanitize Drive-forbidden characters (`/\:*?"<>|`).
- **Parent folder:** `GOOGLE_DRIVE_BUYERS_GUIDE_FOLDER_ID` when set; otherwise create in the authenticated user's Drive root.
- **Metadata block:** include the shared skill's short metadata `<ul>` (Generated UTC timestamp; one-line "Changes made", e.g. `Buyer's guide; crosslinks: N; FAQ: Yes`). Buyer's guides have no source URL, so use the manuscript title in place of "Original URL".

Capture `doc_id` and `doc_url` (`https://docs.google.com/document/d/{doc_id}/edit`). Read the Doc back per the shared skill's **Check** section to confirm formatting imported correctly.

Log: `[run-debug] agent=content/buyers-guide | 06-deliver-google-doc | doc_id=…`

## Step 2 — Append the Review row

Append one row to the Review tab with the **title** and **Doc URL**.

1. Resolve the sheet title for `GOOGLE_SHEETS_BUYERS_GUIDE_REVIEW_GID` (default `1097685951`) on `GOOGLE_SHEETS_BUYERS_GUIDE_REVIEW_SPREADSHEET_ID`.
2. Read row 1 to locate the **Title** and **Google Doc** / **Link** / **URL** columns (fall back to columns A and B).
3. `POST https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{sheetTitle}!A:Z:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS` with the title in the Title column and `doc_url` in the link column.

Do not skip the sheet row.

## Step 3 — Record links in the eval file

Update `tmp/{id}-eval.md`:

- `- **Google Doc:** {doc_url}`
- `- **Review sheet:** https://docs.google.com/spreadsheets/d/{spreadsheetId}/edit#gid={gid}`

Return the Doc URL and Review sheet URL to the user.

## Do not

- Create the Doc or append the sheet before 01–05 are complete for this run.
- Edit `tmp/{id}.md` during delivery (fixes require a full pipeline rerun per [../AGENT.md](../AGENT.md)).
- Append duplicate rows for the same `{id}` on re-runs unless the user explicitly wants a second review row.

## Next

Human editing in the Doc and Review tab; CMS handoff remains ad hoc per [../AGENT.md](../AGENT.md).
