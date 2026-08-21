---
name: glossary-term-agent
description: >-
  Glossary term ("What is X") agent. Runs research, draft, crosslink, polish, eval, then WordPress glossary
  delivery using shared content references; artifacts in tmp/. Step 06 stages one `glossary` CPT draft on
  arize.com only after 05-eval is all A/B (no polish retry).
---

# Glossary term agent

End state: a polished Markdown glossary entry (`tmp/{id}.md`), evaluation notes (`tmp/{id}-eval.md`), and—**once** eval is clean—a WordPress `glossary` custom post type **draft** (`status=draft`) on `https://arize.com` staged from the manuscript (`06-deliver-wp-glossary`). The Markdown manuscript is the canonical artifact; step 06 converts and stages it. No Google Doc.

After a batch of entries, refresh the alphabetized glossary index page via [.agents/skills/operational/wordpress/glossary/index-page-builder/SKILL.md](../../../skills/operational/wordpress/glossary/index-page-builder/SKILL.md). WordPress publish stays human-gated.

## Inputs

- User question (e.g. `What is Agentic RAG?`) **or** bare topic / keyword
- Short slug `{id}` (optional; default: slugify the term)

## Outputs

All per-run artifacts live under [`tmp/`](tmp/.gitignore) and should not be committed.

| Stage | Output |
|---|---|
| 01-research | `tmp/{id}-arize-research.md`, `tmp/{id}-crosslinks.md` |
| 02-draft | `tmp/{id}.md` |
| 03-crosslink | in-place edits to `tmp/{id}.md` |
| 04-polish | in-place edits to `tmp/{id}.md` |
| 05-eval | `tmp/{id}-eval.md` (grades; **no** delivery in this step) |
| 06-deliver-wp-glossary | One WordPress `glossary` CPT draft (`status=draft`) on arize.com staged from `tmp/{id}.md` (ACF Heading/Term/Definition, slug = `{id}`); eval file updated with the wp-admin edit URL — **only** when every 05 grade is **A** or **B** |

## Run order

1. [01-research/SKILL.md](01-research/SKILL.md)
2. [02-draft/SKILL.md](02-draft/SKILL.md)
3. [03-crosslink/SKILL.md](03-crosslink/SKILL.md)
4. [04-polish/SKILL.md](04-polish/SKILL.md)
5. [05-eval/SKILL.md](05-eval/SKILL.md)
6. [06-deliver-wp-glossary/SKILL.md](06-deliver-wp-glossary/SKILL.md) (skip if any 05 grade is below **B**)

## References

Same shared content references as the buyer’s guide:

- [voice-and-tone.md](../../../../references/content/voice-and-tone.md)
- [brand-lexicon.md](../../../../references/content/brand-lexicon.md)
- [formatting.md](../../../../references/content/formatting.md)
- [evaluation.md](../../../../references/content/evaluation.md)
