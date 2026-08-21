---
name: arize-video-article-06-eval-style-guide
description: >
  Arize video article step 6. Evaluate polished Markdown against the Arize style
  guide (the local references/content/*.md files) and emit a PASS/WARN/FAIL
  conformance card. Runs after polish and before final delivery.
"last updated": 2026-05-30
"last run": 2026-05-30
---

Step 0: Read [../../../../../references/agent-runtime.md](../../../../../references/agent-runtime.md) for workflow standards (runtime HTTP, logging, ephemeral rules).

# Arize video-article pipeline — 06 Evaluate against style guide

Run this step after [../05-polish-style-guide/SKILL.md](../05-polish-style-guide/SKILL.md) and before [../07-deliver/SKILL.md](../07-deliver/SKILL.md). It is an editorial conformance pass on the polished article body, distinct from any separate publication-risk review.

Canonical style guide (local repo references under `references/content/`): [`brand-lexicon.md`](../../../../../references/content/brand-lexicon.md), [`voice-and-tone.md`](../../../../../references/content/voice-and-tone.md), [`write-in-voice.md`](../../../../../references/content/write-in-voice.md), [`formatting.md`](../../../../../references/content/formatting.md), [`evaluation.md`](../../../../../references/content/evaluation.md).

Read and concatenate these local files for the style guide. Do not fetch a Google Doc.

Log line prefix: `[run-debug] workflow=arize/video-article-pipeline | EVAL_STYLE | <facts>`

## Inputs

1. Article Markdown from step 05: `tmp/{transcript_slug}--{video_id}.polished.md`. Chat paste or attachment is acceptable when the file path is unavailable. There is no transcript appendix in the normal pipeline. If a legacy file still contains `## Video transcript (source)`, strip from that exact heading through end-of-file before evaluating, and log `[run-debug] workflow=arize/video-article-pipeline | EVAL_STYLE | transcript_heading_present=true`. Evaluate from the first `#` through end of article body.
2. Style guide. Load the guide text by reading and concatenating the local `references/content/*.md` files listed above (the same set step 05 polish used). These committed files are canonical; do not fetch a Google Doc.

Log: `[run-debug] workflow=arize/video-article-pipeline | EVAL_STYLE | article_chars=... guide_chars=...`

## Evaluation method

1. Map checks to the guide. Every finding must cite a section or heading from the loaded guide text (for example, quote the guide's subsection title or the first words of that bullet block). Do not invent rules beyond what appears in that export.
2. Mechanical scans first. Where the guide states explicit banned phrases, required terms, capitalization, or punctuation rules, run targeted searches (for example `rg` on the article path or a temp copy). Log each scan: `[run-debug] workflow=arize/video-article-pipeline | EVAL_STYLE | scan=<id> hits=n`. Use scan ids derived from the guide (for example, a slug of the banned phrase), not a fixed third-party list.
3. Judgment second. Structure, voice, claims vs evidence, and link anchor quality each get one short note, only where you have high confidence and the guide gives a clear criterion.

### Severity levels

- FAIL — Violates an explicit must-not, always, or never rule in the guide for body copy.
- WARN — Borderline cases, density issues, or should-level guidance from the guide.
- Pass — Aligns with the guide for that row.

Build the summary table rows from the guide's own major sections (voice, terminology, headings, links, claims, and so on). If the guide's outline differs, mirror its headings in the table instead of forcing a fixed schema.

## Overall outcome

- PASS — No Fail rows; at most a few minor Warn items (3 or fewer) that a quick edit can fix.
- WARN — No Fail rows; Warn items need an explicit edit pass before publish.
- FAIL — Any Fail row, or systematic violations.

Log: `[run-debug] workflow=arize/video-article-pipeline | EVAL_STYLE | outcome=PASS|WARN|FAIL`

## Output: style conformance card

Render this block for the user. Replace bracketed fields. Specific findings must include quoted spans or line references only when you have high confidence.

```
## Arize style-guide evaluation

Article: [title from H1 or first ~12 words]
Source: [path or "inline / chat"]
Style guide: local repo references — references/content/{brand-lexicon,voice-and-tone,write-in-voice,formatting,evaluation}.md

### Outcome

Overall: [PASS / WARN / FAIL]

### Summary table

| Area (from guide outline) | Result | Notes |
|------|--------|-------|
| [row per major guide section] | P/W/F | [one line] |
| ... | ... | ... |

### Mechanical scan log

[Bullets: scan id -> hits -> representative snippet if hits > 0]

### Specific findings (fix before publish)

[Ordered list: severity (FAIL/WARN), guide section name, quote or location, suggested fix]

### Residual risks

[Optional: judgment calls, anything deferred to a human editor]
```

## Related

- Polish: [../05-polish-style-guide/SKILL.md](../05-polish-style-guide/SKILL.md)
- Deliver: [../07-deliver/SKILL.md](../07-deliver/SKILL.md)
- Hub: [../AGENT.md](../AGENT.md)
