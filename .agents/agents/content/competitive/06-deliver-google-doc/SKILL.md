---
name: competitive-alternatives-06-deliver-google-doc
description: >-
  After 05-eval is all A or B, deliver tmp/{id}.md as one formatted Google Doc using the shared
  markdown-to-google-doc skill, then append title + URL to the competitive matrix Review tab.
---

# 06 - Deliver Google Doc + Review sheet

## Goal

1. Create **exactly one** new Google Doc from the Markdown manuscript `tmp/{id}.md`, formatted (Heading 1–3, hyperlinks, tables, lists), using the shared delivery skill.
2. Append the **title** and **Doc URL** to the Review tab of the spreadsheet in `GOOGLE_SHEETS_COMPETITIVE_REVIEW_SPREADSHEET_ID`.

The canonical input is the Markdown manuscript. This step converts and uploads it; it does not rewrite it.

## Prerequisites

Steps 01 through 05 must be complete for this `{id}` in the same run. See [../AGENT.md](../AGENT.md).

Every criterion in `tmp/{id}-eval.md` must be A or B. If any grade is lower, follow the revision path in [../05-eval/SKILL.md](../05-eval/SKILL.md) and return here only after a clean eval.

## OAuth

Use the same credential chain as [update-agent](../../update-agent/03-doc-handoff/SKILL.md). Set `GOOGLE_OAUTH_*` in `.env` or use `.agents/agents/content/update-agent/.credentials/token_unified.json`. Scopes must include **Drive**, **Docs**, and **Sheets**. Optional environment variables are documented in `.env.example`, including `GOOGLE_SHEETS_COMPETITIVE_REVIEW_SPREADSHEET_ID`, `GOOGLE_SHEETS_COMPETITIVE_REVIEW_GID`, and `GOOGLE_DRIVE_COMPETITIVE_FOLDER_ID`.

## Step 1 — Create the Google Doc (shared skill)

Read and follow [`../../../../skills/content/markdown-to-google-doc/SKILL.md`](../../../../skills/content/markdown-to-google-doc/SKILL.md). It is the single source of truth for Markdown → safe HTML fragment → DOCTYPE shell → multipart `files.create` Drive upload (hand-built `multipart/related` boundary; `<ul>`/`<li>` balance checks).

For this workflow:

- **Manuscript:** `tmp/{id}.md`.
- **Doc title:** the first `#` H1 (strip `#`, trim); sanitize Drive-forbidden characters (`/\:*?"<>|`).
- **Parent folder:** `GOOGLE_DRIVE_COMPETITIVE_FOLDER_ID` when set; otherwise the authenticated user's Drive root.
- **Metadata block:** the shared skill's short metadata `<ul>` (Generated UTC timestamp; one-line "Changes made", e.g. `Alternatives guide; crosslinks: N`). Use the manuscript title in place of "Original URL".

Capture `doc_id` and `doc_url`. Read the Doc back per the shared skill's **Check** section.

Log: `[run-debug] agent=content/competitive | 06-deliver-google-doc | doc_id=…`

## Step 2 — Append the Review row

Append one row to the Review tab with the **title** and **Doc URL**.

1. Resolve the sheet title for `GOOGLE_SHEETS_COMPETITIVE_REVIEW_GID` on `GOOGLE_SHEETS_COMPETITIVE_REVIEW_SPREADSHEET_ID`.
2. Read row 1 to locate the **Title** and **Google Doc** / **Link** / **URL** columns (fall back to columns A and B).
3. `POST https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{sheetTitle}!A:Z:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS` with the title and `doc_url`.

**Refresh an existing Doc:** when you need to replace a prior delivery, trash the old Drive file (`PATCH /drive/v3/files/{oldId}` with `{ "trashed": true }`), then locate the Review row whose link cell contains the old doc id and update that row's title + link cells in place instead of appending a duplicate.

## Step 3 — Record links in the eval file

Update `tmp/{id}-eval.md` with `- **Google Doc:** {doc_url}` and `- **Review sheet:** …`. Return both URLs to the user.

## Do not

Do not deliver before steps 01 through 05 are complete, and do not deliver while any eval grade is below B. Do not edit `tmp/{id}.md` during delivery. Do not append duplicate Review rows on re-runs unless the user explicitly wants a second row; refresh the existing row instead.

## Next

A human edits the Doc and the Review tab. Content management system handoff stays ad hoc.
