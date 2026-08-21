---
name: glossary-term-05-eval
description: >-
  After polish, grade the glossary entry on seven criteria from shared references. Writes tmp/{id}-eval.md.
  Does not deliver here—when every grade is A or B, run ../06-deliver-wp-glossary/SKILL.md to stage the WordPress glossary draft.
"last run": 2026-06-07
---

# 05 - Eval

## Goal

Produce one evaluation artifact for the finished glossary manuscript. **Do not** deliver in this step. After grading, if every criterion is **A** or **B**, run [../06-deliver-wp-glossary/SKILL.md](../06-deliver-wp-glossary/SKILL.md) to stage `tmp/{id}.md` as a WordPress `glossary` draft. This step scores only unless the user explicitly asks for fixes in the same run.

## Prerequisites

- polished manuscript: `tmp/{id}.md`
- shared references re-read before grading

## Shared references

- [voice-and-tone](../../../../../references/content/voice-and-tone.md)
- [brand-lexicon](../../../../../references/content/brand-lexicon.md)
- [formatting](../../../../../references/content/formatting.md)
- [evaluation](../../../../../references/content/evaluation.md)

## Output

1. Grade all seven criteria and draft `tmp/{id}-eval.md` (see template). If **any** criterion is **C**, **D**, or **F**: save the eval file **without** delivering; use `- **WordPress draft:** _deferred — re-run 04 then 05 after fixes_` (or omit). Note under **Overall** that delivery waits until grades are clean.

2. If **every** criterion is **A** or **B**: finish `tmp/{id}-eval.md`, then run [../06-deliver-wp-glossary/SKILL.md](../06-deliver-wp-glossary/SKILL.md) to stage the `glossary` CPT draft on arize.com and write `- **WordPress draft:** …` (the wp-admin edit URL) into the eval file. Return the edit URL to the user after step **06** completes.

## Seven criteria

1. Clear definition up front
2. Practitioner voice
3. Grounded specifics (links, caveats, scope)
4. Honest narration (no puff or invented stats)
5. Lexicon and calm authority
6. Formatting discipline (headings, lists, links)
7. FAQ usefulness and depth

## Grade scale

- **A:** meets bar with little or no revision needed  
- **B:** good; small polish would strengthen  
- **C:** material gap; revise before publishing  
- **D:** major gap  
- **F:** fails criterion or is off-brand  

## Output format

When grades require another polish pass, omit the WordPress draft line or use:

`- **WordPress draft:** _deferred — re-run 04 then 05 after fixes_`

When handing off:

```md
# Glossary term eval - {id}

- **Manuscript:** `tmp/{id}.md`
- **WordPress draft:** https://arize.com/wp-admin/post.php?post={post_id}&action=edit
- **Evaluated:** <!-- date -->

## Summary

| # | Criterion | Grade |
|---|---|---|
| 1 | Clear definition up front |  |
| 2 | Practitioner voice |  |
| 3 | Grounded specifics |  |
| 4 | Honest narration |  |
| 5 | Lexicon and calm authority |  |
| 6 | Formatting discipline |  |
| 7 | FAQ usefulness |  |
```

Keep notes specific. If the manuscript misses length band or internal-link count, say so under **Overall**.

WordPress glossary staging lives in [../06-deliver-wp-glossary/SKILL.md](../06-deliver-wp-glossary/SKILL.md).

## Do not

Edit `{id}.md` in this step unless the user explicitly asks for revisions in the same run.

## Next

If any grade is **C** or below, run [../04-polish/SKILL.md](../04-polish/SKILL.md) again using `{id}-eval.md`, then re-run this step. When every criterion is **A** or **B**, run [../06-deliver-wp-glossary/SKILL.md](../06-deliver-wp-glossary/SKILL.md) (not before).
