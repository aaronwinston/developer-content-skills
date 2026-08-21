---
name: arize-video-article-05-polish-style-guide
description: >
  Arize video article step 5: polish the draft article against the Arize style guide
  (local references/content/*.md); no transcript; output feeds eval then final deliver.
"last updated": 2026-05-30
"last run": 2026-05-30
---

Step 0: Read [../../../../../references/agent-runtime.md](../../../../../references/agent-runtime.md) (workflow standards: runtime HTTP, logging, ephemeral rules).

# Arize video-article pipeline — 05 Polish (style guide)

Run after [../04-generate/SKILL.md](../04-generate/SKILL.md) and before [../06-eval-style-guide/SKILL.md](../06-eval-style-guide/SKILL.md).

**Do not** add `## Video transcript (source)` or transcript text in this step. Transcript is appended only in [../07-deliver/SKILL.md](../07-deliver/SKILL.md).

Canonical style guide (local repo references under `references/content/`):

- [`brand-lexicon.md`](../../../../../references/content/brand-lexicon.md)
- [`voice-and-tone.md`](../../../../../references/content/voice-and-tone.md)
- [`write-in-voice.md`](../../../../../references/content/write-in-voice.md)
- [`formatting.md`](../../../../../references/content/formatting.md)
- [`evaluation.md`](../../../../../references/content/evaluation.md)

Read and concatenate these local files for the style guide, the same set step 04 uses. Do not fetch a Google Doc.

Log line prefix:

`[run-debug] workflow=arize/video-article-pipeline | POLISH | <facts>`

## Inputs

- **Draft article** — `tmp/{transcript_slug}--{video_id}.article.md` from step 04 (article Markdown only; no provenance HTML, no transcript).
- **Style guide** — full plain text composed from the local `references/content/*.md` files listed above (the committed repo copy is canonical).

## Model pass (polish)

- Preferred: Anthropic Messages API `https://api.anthropic.com/v1/messages`
- Fallback: Gemini `generateContent` if Anthropic is unavailable.

Instructions to the model (substance):

- You are editing an Arize marketing-science article. Apply the **Arize style guide** literally: voice, terminology, headings, links, claims vs evidence, banned phrases, punctuation, and structure.
- Preserve the **H1** as the sole `#` title (same meaning as the requested title unless a tiny clarity fix is required by the guide).
- Do **not** add new factual claims, speakers, or statistics beyond what the draft already supports from the video; tighten and align wording only.
- Keep natural Markdown crosslinks that already point at allowed arize.com URLs; fix anchor text if the guide requires it.
- Remove any `---` horizontal-rule lines; separate sections with headings only (the Google Doc must not contain dividers).
- Output **only** the polished article Markdown (no preamble, no transcript, no HTML provenance block).

Log before call: `[run-debug] workflow=arize/video-article-pipeline | POLISH | draft_chars=… guide_chars=…`

## Output

- Write the polished body to **`tmp/{transcript_slug}--{video_id}.polished.md`** (same slug and `video_id` as the `.article.md` input). Log: `[run-debug] workflow=arize/video-article-pipeline | POLISH | path=tmp/{transcript_slug}--{video_id}.polished.md`

Next: [../06-eval-style-guide/SKILL.md](../06-eval-style-guide/SKILL.md)

## Related

- Prior: [../04-generate/SKILL.md](../04-generate/SKILL.md)
- Hub: [../AGENT.md](../AGENT.md)
