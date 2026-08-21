---
name: arize-video-article-07-deliver
description: >
  Arize video article step 7 (terminal): append normalized transcript and provenance,
  write final Markdown, convert to HTML, and create the Google Doc in the Arize
  Drive folder—single consolidated output step.
"last updated": 2026-05-30
"last run": 2026-05-30
---

Step 0: Read [../../../../../references/agent-runtime.md](../../../../../references/agent-runtime.md) (workflow standards: runtime HTTP, logging, ephemeral rules).

# Arize video-article pipeline — 07 Deliver (Markdown + Google Doc)

**Terminal step.** Run only after [../06-eval-style-guide/SKILL.md](../06-eval-style-guide/SKILL.md). This step **consolidates all publishing output**: append transcript, write the canonical repo Markdown, and create the Drive Doc.

**Transcript rule:** Append `## Video transcript (source)` and the **display-normalized** transcript **only here**—after polish and eval—so no prior writing pass sees or duplicates transcript content in the working files.

Log line prefix:

`[run-debug] workflow=arize/video-article-pipeline | DELIVER | <facts>` (Markdown write) and `| DRIVE |` (upload).

## Inputs

- **Polished article** — `tmp/{transcript_slug}--{video_id}.polished.md` from step 05 (same path stem as step 04 `.article.md`).
- **`transcript_text`** — from step 02 (full source). **Normalize for appendix:** trim ends; collapse runs of whitespace **within each paragraph** to a single ASCII space. **Format for readability:** split into multiple paragraphs (blank line between in Markdown; multiple `<p>` in the Google Doc). Split on podcast segment cues when present (`So clip number N`, `Next clip`, etc.); otherwise ~4 sentences or ~900 characters per paragraph. Do not summarize unless the user asked; if trimmed, log `[run-debug] workflow=arize/video-article-pipeline | TRANSCRIPT_APPENDIX | truncated=true`.
- **`youtube_url`**, **`video_id`**, **`parents_folder_id`** — from step 01.
- **OAuth** — Drive-scoped bearer for export (not needed for assembly unless you re-verify) and for `files.create` multipart upload (`supportsAllDrives=true` if the folder is on a shared drive).

## 1. Assemble final Markdown

1. Read the polished `.polished.md` file; strip any accidental `## Video transcript` block if present (should not happen). Remove every line that is only `---` (optional surrounding whitespace) from the article body before assembly.
2. Prepend the **HTML provenance comment** once (above the `#` H1):

```html
<!--
  arize-video-article-pipeline
  style_guide: references/content/*.md (composed; brand-lexicon, voice-and-tone, write-in-voice, formatting, evaluation)
  assembly_template: prompt.txt
  youtube_url: <full URL from step 01 or empty if user-only transcript>
  video_id: <VIDEO_ID>
-->
```

3. One blank line, then the polished article body.
4. One blank line, then exactly `## Video transcript (source)`, one blank line, then the **normalized, paragraph-split** transcript from step 02 (blank line between paragraphs).

5. Write **`tmp/{transcript_slug}--{video_id}.md`** (final artifact). Log: `[run-debug] workflow=arize/video-article-pipeline | DELIVER | path=tmp/{transcript_slug}--{video_id}.md`

6. Optional: after a successful Doc create, delete `tmp/{transcript_slug}--{video_id}.article.md` and `.polished.md` to reduce clutter (log if you do).

## 2. Google Doc (HTML + multipart)

1. Read [../../../../skills/content/markdown-to-google-doc/SKILL.md](../../../../skills/content/markdown-to-google-doc/SKILL.md) and follow it exactly for:
   - Markdown → allowed HTML fragment (headings, lists, links, emphasis, paragraphs).
   - **`## Video transcript (source)`:** follow the shared skill subsection—**multiple `<p>` blocks** (readable paragraphs), not one giant wall of text. Within each paragraph, collapse internal whitespace to a single space; never one `<br />` per caption line. Split on podcast segment cues when present (`So clip number N`, `Next clip`, etc.) and otherwise every ~4 sentences or ~900 characters.
   - Strip the leading HTML provenance comment before conversion to HTML body (metadata + article still per shared skill).
   - **No dividers in the Google Doc:** do not emit `<hr />` anywhere (including after the metadata list). When converting article Markdown, **omit** lines that are only `---` (do not render them as horizontal rules).
   - Metadata block (`ul` only, no `<hr>` after it): **Original URL** = YouTube watch URL when known; **Generated** = UTC `YYYY-MM-DD HH:MM:SS UTC`; **Changes made** = one line (e.g. `Video article; transcript appendix: Yes; polish+eval before deliver`).
   - Full HTML shell: `DOCTYPE`, `meta charset`, minimal `style` in `head`, `body` wrapper.

2. **Doc title** — from the article H1 after stripping provenance; sanitize Drive-forbidden characters (`/\:*?"<>|`); truncate if needed. Optional suffix ` (video)` if it avoids collisions.

3. **Drive create** — `POST https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true`

   - Headers: `Authorization: Bearer …`, `Content-Type: multipart/related; boundary=<token>`
   - **Boundary:** single ASCII token **without spaces** (e.g. `arizeVideoPublishBoundary01`).
   - Part 1 (JSON): `name`, `mimeType`: `application/vnd.google-apps.document`, `parents`: `[ parents_folder_id ]`
   - Part 2 (media): `Content-Type: text/html; charset=UTF-8` with the full HTML document.

Use `curl` or an equivalent direct HTTP client assembled at runtime; do not add a repo script file.

Log: `[run-debug] workflow=arize/video-article-pipeline | DRIVE | host=www.googleapis.com path=/upload/drive/v3/files status=<n> doc_id=<id>`

## Output

- Final Markdown path: `tmp/{transcript_slug}--{video_id}.md`
- Doc URL: `https://docs.google.com/document/d/{id}/edit`
- One-line handoff (approximate word counts for article vs transcript section).

Next: none (terminal step).

## Related

- Markdown contract: [../../../../skills/content/markdown-to-google-doc/SKILL.md](../../../../skills/content/markdown-to-google-doc/SKILL.md)
- Eval: [../06-eval-style-guide/SKILL.md](../06-eval-style-guide/SKILL.md)
- Hub: [../AGENT.md](../AGENT.md)
