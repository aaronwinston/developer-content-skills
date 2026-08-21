---
name: edit-gdoc
description: >-
  Edit specific paragraphs in an existing Google Doc. Pull the doc, read
  paragraphs, decide the change, and replace by index via a DOCX roundtrip.
  Use when the user wants to edit, update, fix, remove, or revise Doc text.
---

# Edit Google Doc

Edit an existing Google Doc by paragraph index. Always pull the latest version. Always replace by index. Complements [`../markdown-to-google-doc/SKILL.md`](../markdown-to-google-doc/SKILL.md), which **creates** a Doc from Markdown.

## Prerequisites

- `python-docx`, `google-auth`, `google-api-python-client`
- Application Default Credentials with Drive access

```bash
python3 -m pip install python-docx google-auth google-api-python-client
gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/drive.file
```

`drive.file` only reaches files **this OAuth client created**. Docs uploaded by a different app or client need a broader Drive scope or that same client. Enable the Google Drive API on the GCP project.

## Workflow

No shortcuts. The model chooses the index; the script only applies it.

### 1. Pull

```bash
python3 .agents/skills/content/edit-gdoc/scripts/edit_gdoc.py pull "<doc-url>" --full
```

Read every paragraph index and style.

### 2. Choose the paragraph

The user might say "remove the mainframe line," "rewrite the closer," or "fix the third section." You match that to an index. Do not delegate matching to Python.

### 3. Write the replacement

- Edit inside a paragraph: replacement text without the cut clause
- Rewrite: the new paragraph
- Blank a paragraph: a single space (structure stays)

### 4. Replace by index

```bash
python3 .agents/skills/content/edit-gdoc/scripts/edit_gdoc.py replace "<doc-url>" --paragraph N --text "The new paragraph text."
```

### Multiple edits

Work **last index to first** so earlier indices stay valid. Pull once, then replace in descending order.

## What it preserves

- Images, tables, headers, and content outside the target paragraph
- Paragraph position and style (Heading 1, Normal, …)
- Edits made in the Google Docs UI, because each run exports the latest

## Limitations

- Bold/italic inside the replaced paragraph is not preserved
- Cannot insert or delete paragraph structure, only replace content
- `drive.file` cannot edit arbitrary Docs the user owns but this client did not create

## Command reference

| Command | Arguments | Description |
|---|---|---|
| `pull` | `<doc>` `[--full]` `[--json]` | Export latest; print paragraphs with indices |
| `replace` | `<doc>` `-p INDEX` `-t TEXT` | Replace paragraph at index |

## Related

| Need | Skill |
|---|---|
| Create a Doc from Markdown | [`../markdown-to-google-doc/SKILL.md`](../markdown-to-google-doc/SKILL.md) |
| OAuth / Drive setup | [`../../operational/google-workspace/SKILL.md`](../../operational/google-workspace/SKILL.md) |
