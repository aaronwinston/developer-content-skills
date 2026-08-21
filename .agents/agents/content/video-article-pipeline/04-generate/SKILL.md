---
name: arize-video-article-04-generate
description: >
  Arize video article step 4: assemble prompt sections, load Arize style guide from
  the local references/content/*.md files, call Anthropic or Gemini, and save article-only Markdown
  (no transcript appendix; final deliverable is step 07).
"last updated": 2026-05-30
"last run": 2026-05-30
---

Step 0: Read [../../../../../references/agent-runtime.md](../../../../../references/agent-runtime.md) (workflow standards: runtime HTTP, logging, ephemeral rules).

# Arize video-article pipeline — 04 Generate (article only)

Canonical style guide (local repo references under `references/content/`):

- [`brand-lexicon.md`](../../../../../references/content/brand-lexicon.md)
- [`voice-and-tone.md`](../../../../../references/content/voice-and-tone.md)
- [`write-in-voice.md`](../../../../../references/content/write-in-voice.md)
- [`formatting.md`](../../../../../references/content/formatting.md)
- [`evaluation.md`](../../../../../references/content/evaluation.md)

These committed local files are the source of truth for Arize style. Read them at run time; do not fetch a Google Doc.

Generation input assembly:

1. Read `prompt.txt` and preserve required section markers.
2. Load Arize style guide text for `<<<STYLE_GUIDE_BODY>>>` by reading and concatenating the local reference files listed above (`references/content/brand-lexicon.md`, `voice-and-tone.md`, `write-in-voice.md`, `formatting.md`, `evaluation.md`). Use their combined contents as the full style guide. Do not fetch a Google Doc.
3. Inject:
   - requested article title
   - transcript text (primary source)
   - context snippets from arize.com pages
   - crosslink list for internal links
   - full style guide body into `<<<STYLE_GUIDE_BODY>>>`
4. Keep token budgets practical; truncate only low-value context before trimming transcript—do not truncate the style guide unless the model context window forces it, in which case log `[run-debug] workflow=arize/video-article-pipeline | STYLE_GUIDE | truncated=true` and keep terminology, voice, and claims/evidence sections first (use the guide’s own headings to decide priority).

Model call:

- Preferred: Anthropic Messages API `https://api.anthropic.com/v1/messages`
- Output target: Markdown body with requested title and natural crosslinks only. The model must **not** emit a `## Video transcript` section or the full transcript—the transcript is appended only in [../07-deliver/SKILL.md](../07-deliver/SKILL.md) after polish and eval.
- Do **not** use `---` horizontal rules or other divider lines between sections; use `##` headings only (see [../prompt.txt](../prompt.txt)).

## Save (draft article only)

Write **article body only** under `tmp/` (relative to the `video-article-pipeline` folder). **Do not** prepend the HTML provenance block here. **Do not** append `## Video transcript (source)` or any transcript text in this step.

1. **Filename** — Build `transcript_slug` from **display-normalized** `transcript_text` from step 02 (trim; collapse every run of whitespace to a single ASCII space—the same normalization step 07 will use for the appendix):
   - Optionally drop a leading line if it is only stage noise like `[Music]`, `(music)`, or `(inaudible)`.
   - Take the first 8–14 whitespace-separated tokens that contain at least one letter or digit (drop pure punctuation tokens).
   - Lowercase ASCII; strip surrounding punctuation on each token; remove ASCII apostrophes inside tokens (e.g. `here's` → `heres`); join with `-`; collapse multiple `-`; trim `-`.
   - Limit the slug to max 48 characters (truncate on a `-` boundary when you can, otherwise hard truncate). If the slug is empty or shorter than 3 characters, build from requested `article_title` from step 01; if still empty, use `article`.
   - Path: `tmp/{transcript_slug}--{video_id}.article.md` (double hyphen before `video_id`). Log: `[run-debug] workflow=arize/video-article-pipeline | GENERATE | path=tmp/{transcript_slug}--{video_id}.article.md`

2. **Body** — Write only the article Markdown from the model (strip any duplicate H1 or preamble the model added). If the model emitted `## Video transcript` or a full transcript block, remove it entirely.

3. Return a short handoff in chat (path, caveats: missing context pages, etc.).

Next: [../05-polish-style-guide/SKILL.md](../05-polish-style-guide/SKILL.md)
