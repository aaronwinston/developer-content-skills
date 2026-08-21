---
name: glossary-term-02-draft
description: >-
  First glossary draft. Read research files and write tmp/{id}.md from the section contract.
  Optional Gemini using ../prompts/glossary-draft.prompt.txt. Run after research and before crosslink.
"last run": 2026-06-07
---

# 02 - First draft

## Prerequisites

- `tmp/{id}-arize-research.md`
- `tmp/{id}-crosslinks.md`

Use the same `{id}` as filename stem: `tmp/{id}.md`.

## Section contract

**H1:** exactly one line in **sentence case** (per [formatting.md](../../../../../references/content/formatting.md)): `# What is {term}?` Match the term from research, lowercase the term unless it is a proper noun or acronym (e.g. `# What is RAG?`, `# What is Arize AX?`), and end with a question mark.

**All other headings (`##`, `###`) are also sentence case.** Keep acronyms uppercase (FAQ, AX, UI, RAG, AI, LLM) and proper nouns capitalized (Arize, BigQuery, Phoenix, Alyx).

**Order** (adjust headings for the topic when needed, but keep this shape):

1. Opening paragraph(s): plain-language definition and why the reader should care (before Key takeaways).
2. `## Key takeaways` — 3–5 bullets, concrete outcomes.
3. Body sections as `##` / `###` (deeper explanation, how it works, tradeoffs, relationships to adjacent ideas).
4. `## FAQ` — several `###` question headings with answers below. Question headings are sentence case (e.g. `### What is the difference between agent analytics and agent observability?`).

Optional: short `## Related reading` only if research lists strong Arize pages that do not fit inline.

## Crosslinks in this pass

- Prefer natural placement using `tmp/{id}-crosslinks.md`.
- Aim for several distinct `https://arize.com` links; **03-crosslink** enforces the minimum.

## Length

Target roughly **700–1,400 words** before polish (glossary, not a long guide).

## Optional model assist

If you use Gemini: fill [../prompts/glossary-draft.prompt.txt](../prompts/glossary-draft.prompt.txt), paste salient bullets from `tmp/{id}-arize-research.md`, then **edit** the model output for accuracy and lexicon before saving `tmp/{id}.md`.

## Do not

- Link to competitors or comparison sites by name.
- Fabricate statistics, customer names, or roadmap claims not supported by research or a cited URL.

## Next

Run [../03-crosslink/SKILL.md](../03-crosslink/SKILL.md).
