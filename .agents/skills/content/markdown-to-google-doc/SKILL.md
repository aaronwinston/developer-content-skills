---
name: markdown-to-google-doc
description: >-
  Convert Markdown or approved HTML fragments into formatted Google Docs via
  Drive upload. Use when content agents need a Google Doc handoff, review Doc,
  or Markdown-to-Docs delivery.
---

# Markdown to Google Doc

## When to read this

## Markdown to HTML body (agent)

You convert the enhanced Markdown to one HTML fragment (no outer `<html>` / `<body>` here). No `generateContent` or other model HTTP call for this conversion—do it in your reasoning and emit the fragment. Faithfully reflect the Markdown; preserve all links and structure.

Do **not** add or rely on repository Python modules for this conversion; correctness comes from following the block and inline rules below before upload.

### Blog-style Markdown (block rules)

Drive’s HTML → Google Doc import breaks when `<ul>` / `<li>` / `<p>` boundaries are wrong. Walk the source **top to bottom** and apply:

1. **Headings:** `# title` → one `<h1>`; `## title` → one `<h2>` (trim leading `#` / `##`). Before emitting any heading, **close an open `<ul>`** with `</ul>` if the previous lines were a list.
2. **Horizontal rule:** a line that is only `---` (optional surrounding whitespace) → `<hr />`. Close an open `<ul>` first.
3. **Bullet lists:** lines starting with `- ` share **one** `<ul>`. On the **first** `- ` line after any non-list context, emit `<ul>`. Each `- ` line → `<li>…</li>` (inline rules on the remainder). Keep that `<ul>` open across blank lines **only** while subsequent non-empty lines continue to start with `- `.
4. **Paragraphs:** any other non-empty line → `<p>…</p>` (inline rules below). **Always emit `</ul>` before this `<p>` if a list is open** (same for headings and horizontal rules).
5. **Sanity check before upload:** count `<ul>` and `</ul>` in the fragment—they must be equal. No `<li>` outside `<ul>/<ol>`. No orphan `<ul>` without `</ul>` before a `<h1>`, `<h2>`, `<hr />`, or `<p>`.

### Inline Markdown (within headings, paragraphs, list items)

- `[*label text*](https://…)` → `<a href="…" rel="noopener noreferrer"><em>label text</em></a>` (escape attribute and text per HTML rules).
- `**bold**` → `<strong>…</strong>`. When mixing with links, resolve placeholders per the bold rule below so escaping stays correct.

The fragment must obey:

- Tags only from: h1, h2, h3, h4, p, ul, ol, li, a, strong, em, code, pre, blockquote, br, table, thead, tbody, tr, th, td
- On `a` tags: `href` and optional `title` only; optional `rel="noopener noreferrer"` if used consistently
- No script, iframe, img, svg, style, video, object, embed, input, form; `href` schemes only http, https, mailto

If you are unsure about a construct, use the simplest valid allowed markup that preserves text and links. Re-check the fragment for forbidden tags before upload; fix in place if needed.

Markdown `bold` → `<strong>`: If you hand-roll conversion, replace bold with ASCII-only placeholders (for example `\x00STRONG_OPEN\x00` … `\x00STRONG_CLOSE\x00`), run `html.escape` on the segment, then substitute real `<strong>` / `</strong>`. Placeholders that contain `<` or `>` (e.g. `<<<B>>>…<<<BEND>>>`) will be escaped before you can swap them in, leaving literal junk in the Doc.

### `## Video transcript (source)` appendix (when present)

Some workflows append a transcript under this exact H2. The **text under this heading must be only** the Whisper (or step-02–specified) transcript file contents supplied by that workflow—no other sources mixed in. When converting to HTML for Google Docs:

- Treat everything under that heading as **body copy**, not a code block or narrow column.
- **Collapse whitespace** inside each paragraph (newlines, multiple spaces) to a **single space** per run, `strip` ends, then `html.escape` and wrap each paragraph in its own `<p>`. Use **multiple `<p>` blocks** for long transcripts — not one wall-of-text paragraph. Split on trusted segment markers when the source has them (e.g. `So clip number N`, `Next clip`); otherwise group roughly every 4 sentences or ~900 characters. **Do not** insert a `<br />` after each source line; **do not** use `<pre>` for the transcript unless the active skill explicitly asks for monospace. This is presentation only; do not change words or drop sentences compared to the source file.
- Result: Docs show the transcript as readable, reflowable paragraphs (like normal body copy).

## Metadata inside body

Before the article HTML: a short HTML list (not pre), then hr, then the article fragment.

List items (each as li, labels may use strong):

1. Original URL: hyperlink whose text equals href
2. Generated: one line, UTC as YYYY-MM-DD HH:MM:SS UTC
3. Changes made: one line, e.g. Crosslinks added: N; FAQ section: Yes

Close the list, add hr, then the article HTML fragment.

**Workflow overrides:** An active workflow skill may forbid dividers (e.g. Haus video-article step 07: metadata `<ul>` only, no `<hr />`; omit `---` lines in the article). Follow the workflow skill when it is stricter than this section.

## HTML shell

Wrap metadata plus article in:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    p,
    ul,
    ol,
    table,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-bottom: 10pt;
    }
    h2 {
      margin-top: 20pt;
    }
    li {
       margin-bottom: 2pt;
    }
  </style>
</head>
<body>
  … inner HTML …
</body>
</html>
```

## Drive upload

POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true

Headers: Authorization Bearer (OAuth), Content-Type multipart/related.

Parts: (1) JSON metadata with name, mimeType application/vnd.google-apps.document, parents array with folder_id; (2) media body text/html; charset=UTF-8 with the full document from the shell above.

### Multipart pitfall

Generic MIME helpers have produced **`400 Bad Request`** from Drive while the same metadata and HTML succeeded with a **hand-built `multipart/related` body**: fixed `boundary` string, **CRLF line endings** (`\r\n`), part 1 headers `Content-Type: application/json; charset=UTF-8`, blank line, raw JSON, part 2 headers `Content-Type: text/html; charset=UTF-8`, blank line, HTML payload, closing `--{boundary}--`. Prefer that explicit construction (or another HTTP client known to match Drive’s expectations) unless you have verified a library against this endpoint.

On success, id yields https://docs.google.com/document/d/{id}/edit

## Check

Read back in the file that was created to ensure it is formatted correctly.
