---
name: competitive-alternatives-05-eval
description: Grade the manuscript on seven criteria; write tmp/{id}-eval.md only unless the user requests fixes.
---

# 05 - Eval

## Prerequisites

Steps 01 through 04 must be complete for this `{id}` in the same run. See [../AGENT.md](../AGENT.md).

## References

Re-read [../04-polish/SKILL.md](../04-polish/SKILL.md), [voice-and-tone.md](../../../../../references/content/voice-and-tone.md), [brand-lexicon.md](../../../../../references/content/brand-lexicon.md), and [evaluation.md](../../../../../references/content/evaluation.md) before you grade.

## Output

Write `tmp/{id}-eval.md` using the scaffold below. Do not edit `tmp/{id}.md` unless the user explicitly asks for fixes in the same run.

## Seven criteria

1. Sheet alignment. The article should reflect focal row facts from `tmp/{id}-sheet-row.md` and should not contradict them without explaining a deliberate update after vendor verification.

2. Research depth. Claims should feel grounded in the research artifacts, and you should not see obvious hallucinated specifics.

3. Fairness. Strengths and limits should be even-handed, without punch-down tone.

4. Decision usefulness. A reader should be able to shortlist tools using the criteria the article states.

5. Lexicon and voice. Vocabulary should match the brand lexicon and [voice-and-tone.md](../../../../../references/content/voice-and-tone.md), and 04-polish prose rules should still hold.

6. Formatting and structure. The piece should follow 04-polish rules, match the outline’s information architecture, and include seven internal arize.com links.

7. Close and call to action. The ending should give a concrete Arize next step that fits the reader.

## Grade scale

Use grades A, B, C, D, and F as defined in [evaluation.md](../../../../../references/content/evaluation.md).

## Artifact scaffold for tmp/{id}-eval.md

```md
# Competitive alternatives eval — {id}

- Manuscript: `tmp/{id}.md`
- Evaluated:

## Summary

| # | Criterion | Grade |
|---|-----------|-------|
| 1 | Sheet alignment |  |
| 2 | Research depth |  |
| 3 | Fairness |  |
| 4 | Decision usefulness |  |
| 5 | Lexicon and voice |  |
| 6 | Formatting and structure |  |
| 7 | Close and CTA |  |

## Notes

### 1. Sheet alignment



### 2. Research depth



### 3. Fairness



### 4. Decision usefulness



### 5. Lexicon and voice



### 6. Formatting and structure



### 7. Close and CTA



## Overall


```

If the manuscript misses workflow mechanics such as the H1 pattern, outline sections, the opening preview, the link minimum, or the call to action, say so under Overall.

## Next

When any criterion receives grade C or below, delete `tmp/{id}*` and restart at [01-sheet-and-research](../01-sheet-and-research/SKILL.md) per [../AGENT.md](../AGENT.md). Do not patch the manuscript and re-run only this eval step.

When every criterion is A or B, run [06-deliver-google-doc](../06-deliver-google-doc/SKILL.md).
