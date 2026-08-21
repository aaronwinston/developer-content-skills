---
name: buyers-guide-05-eval
description: >-
  After polish (04), grade the manuscript on seven criteria.
  Writes tmp/{id}-eval.md only. When every grade is A or B, run ../06-deliver-google-doc/SKILL.md
  to create a Google Doc and append title + link to the Review sheet tab.
---

# 05 - Eval

## Goal

Produce one evaluation artifact that grades the finished buyer's guide on seven criteria. **Do not** create a Google Doc or update the Review sheet in this step. After grading, if every criterion is **A** or **B**, run [../06-deliver-google-doc/SKILL.md](../06-deliver-google-doc/SKILL.md). This step scores only; fixes require a full pipeline rerun per [../AGENT.md](../AGENT.md).

## Prerequisites

- polished manuscript: `tmp/{id}.md` ([04-polish](../04-polish/SKILL.md) completed)
- shared references re-read before grading

## Shared references

- [voice-and-tone.md](../../../../../references/content/voice-and-tone.md)
- [brand-lexicon.md](../../../../../references/content/brand-lexicon.md)
- [formatting.md](../../../../../references/content/formatting.md)
- [evaluation.md](../../../../../references/content/evaluation.md)
- [../04-polish/SKILL.md](../04-polish/SKILL.md) (prose style section)

## Output

1. Grade all seven criteria and draft `tmp/{id}-eval.md` (see template). If **any** criterion is **C**, **D**, or **F**: save the eval file with `- **Google Doc:** _deferred — delete tmp/{id}* and restart at 01 per AGENT.md_` (or omit). Note under **Overall** that delivery waits until a full pipeline rerun passes eval.

2. If **every** criterion is **A** or **B**: finish `tmp/{id}-eval.md`, then run [../06-deliver-google-doc/SKILL.md](../06-deliver-google-doc/SKILL.md) to create the Doc and append **title** + **Doc URL** to the [Review tab](https://docs.google.com/spreadsheets/d/1qnWSDLWQCyJzCveB8xfSjSDMRs57SkU0rXH9vXoevg8/edit?gid=1097685951#gid=1097685951). Return the Doc URL after step **06** completes.

## Seven criteria

1. Specific opening
2. Practitioner voice
3. Named specifics
4. Honest narration
5. Lexicon and calm authority
6. Formatting discipline
7. Close and actionable

## Grade scale

- A: meets bar with little or no revision needed
- B: good, but small polish would strengthen it
- C: material gap, revise before publishing
- D: major gap
- F: fails criterion or is off-brand

## Output format

```md
# Buyer's guide eval - {id}

- **Manuscript:** `tmp/{id}.md`
- **Google Doc:** <!-- filled by 06-deliver-google-doc when grades pass -->
- **Review sheet:** https://docs.google.com/spreadsheets/d/1qnWSDLWQCyJzCveB8xfSjSDMRs57SkU0rXH9vXoevg8/edit?gid=1097685951#gid=1097685951
- **Evaluated:** <!-- date -->

## Summary

| # | Criterion | Grade |
|---|---|---|
| 1 | Specific opening |  |
| 2 | Practitioner voice |  |
| 3 | Named specifics |  |
| 4 | Honest narration |  |
| 5 | Lexicon and calm authority |  |
| 6 | Formatting discipline |  |
| 7 | Close and actionable |  |
```

Keep notes specific. If the manuscript misses agent requirements (H1 format `# {Topic}: A buyer's guide`, word-count band, internal-link count, Ask these questions in any demo section with 6+ questions, or prose rules in [../04-polish/SKILL.md](../04-polish/SKILL.md) — bold/italics in body, fragment-heavy or noun-stack prose), mention that under Overall.

### Prose style (grade under criterion 2 and/or 6)

- **Grade down** if body copy uses bold or italics, reads in telegraphic fragments, or stacks noun phrases without unpacking.
- **Grade up** when sentences connect ideas with transitions and the tone stays functional and clear.

## Do not

- Edit `{id}.md` in this step. Failed grades require a full pipeline rerun per [../AGENT.md](../AGENT.md), not in-place fixes.

## Next

When any criterion receives grade C or below, delete `tmp/{id}*` and restart at [01-research](../01-research/SKILL.md) per [../AGENT.md](../AGENT.md). Do not patch the manuscript and re-run only this eval step.

When every criterion is A or B, run [06-deliver-google-doc](../06-deliver-google-doc/SKILL.md).
