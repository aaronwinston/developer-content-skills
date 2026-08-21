---
name: arize-video-article-pipeline
description: >
  Turns a YouTube video into an Arize Markdown article using seven steps:
  config/scope, transcript, arize.com context, draft generation, style-guide polish,
  style-guide eval, then a single deliver step that appends the transcript and
  writes both final Markdown and the Google Doc. Style rules load at runtime from
  the local references/content/*.md files (not a Google Doc). Transcript appears only in the final
  deliver step after all writing passes. HTTP and user input only; no local Python runner.
"last updated": 2026-05-30
"last run": 2026-05-30
---

Step 0: Read [../../../../references/agent-runtime.md](../../../../references/agent-runtime.md) (workflow standards: runtime HTTP, logging, ephemeral rules).

# Arize video-article pipeline

Log line prefix (format in Step 0):

`[run-debug] workflow=arize/video-article-pipeline | <PHASE> | <facts>`

Run the steps in this order:

1. [01-scope-config/SKILL.md](01-scope-config/SKILL.md)
2. [02-transcript/SKILL.md](02-transcript/SKILL.md)
3. [03-context/SKILL.md](03-context/SKILL.md)
4. [04-generate/SKILL.md](04-generate/SKILL.md)
5. [05-polish-style-guide/SKILL.md](05-polish-style-guide/SKILL.md)
6. [06-eval-style-guide/SKILL.md](06-eval-style-guide/SKILL.md)
7. [07-deliver/SKILL.md](07-deliver/SKILL.md)

Use these assets:

| Asset | Role |
|--------|------|
| `prompt.txt` | Labeled sections used in the article generation call (step 04). |
| `crosslinks.txt` | Optional arize.com URLs to bias internal links. |
| `config.json` (optional, gitignored) | Local overrides; see `config.example.json` (Drive parent folder id). |
| Canonical style guide | Local repo references under [`references/content/`](../../../../references/content/) (`brand-lexicon.md`, `voice-and-tone.md`, `write-in-voice.md`, `formatting.md`, `evaluation.md`) — read in steps 04–06; no Google Doc fetch. |
| `tmp/{slug}--{video_id}.article.md` | Step 04: draft article body only (no transcript). |
| `tmp/{slug}--{video_id}.polished.md` | Step 05: style-guide polish output (no transcript). |
| `tmp/{slug}--{video_id}.md` | Step 07: final Markdown (provenance HTML comment + article + `## Video transcript (source)` + paragraph-split transcript). |
| Arize Drive folder | Resolved in step 07 uses `parents_folder_id` from step 01; new Doc created in step 07 via [../../../skills/content/markdown-to-google-doc/SKILL.md](../../../skills/content/markdown-to-google-doc/SKILL.md). |

## Google Doc output contract (step 07)

When publishing to Drive, the Doc must be editor-ready:

- **No dividers** — no `<hr />` and no `---` horizontal rules in the article body (headings only between sections).
- **Readable transcript** — `## Video transcript (source)` uses multiple paragraphs (blank lines in Markdown; one `<p>` per paragraph in HTML), not a single wall of text. Split on Open House segment cues (`So clip number N`, `Next clip`, etc.) when present; otherwise ~4 sentences or ~900 characters per paragraph.
- **Metadata** — leading `<ul>` with Original URL, Generated (UTC), Changes made; **no** `<hr />` after the list.

Details: [07-deliver/SKILL.md](07-deliver/SKILL.md). Generation must not emit `---` dividers: [prompt.txt](prompt.txt).
