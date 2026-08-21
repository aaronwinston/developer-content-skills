---
name: glossary-term-01-research
description: >-
  Pre-draft pass for a glossary term. Parse “What is …?” input, search arize.com for related pages,
  then write tmp/{id}-arize-research.md and tmp/{id}-crosslinks.md. Run before ../02-draft/SKILL.md.
"last run": 2026-06-07
---

# 01 - Research

## Goal

Lock the **term** to cover, map what Arize already publishes near it (for accuracy and internal links), and emit a crosslink candidate list for the draft stage.

## Parse input

- If the user asked a question: strip `(?i)^\s*what\s+is\s+` and trailing `\s*\?\s*$`; the remainder is the **topic** (e.g. `What is Agentic RAG?` → `Agentic RAG`).
- Choose `{id}` as a short slug (lowercase, hyphenated); if omitted, slugify the topic.

## Freshness rule

Include a page only if any of the following is true:

- first published within the last 12 months
- last substantively updated within 12 months
- date is unclear but the content is clearly current

## Steps

1. Delete `tmp/{id}-arize-research.raw.md` if it exists.
2. Search `arize.com` for pages that help **define**, **disambiguate**, or **contextualize** the term (docs, blog, product, learning hub).
3. For each candidate URL, capture:
   - URL
   - title and content type
   - why it matters for this glossary entry
   - freshness basis
   - one or two quotable or paraphrasable facts
4. Write `tmp/{id}-arize-research.md` with:
   - the term and suggested H1 wording (`# What Is …?`)
   - executive summary
   - grouped link list
   - gaps the draft still needs (outside sources, caveats, disambiguation)
5. Write `tmp/{id}-crosslinks.md` with one row per internal link target.

## Output template

```md
| URL | Suggested anchor |
|---|---|
| https://arize.com/docs/... | optional phrase |
```

## Next

Run [../02-draft/SKILL.md](../02-draft/SKILL.md).
