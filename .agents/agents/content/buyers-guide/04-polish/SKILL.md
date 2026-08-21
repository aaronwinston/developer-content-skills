---
name: buyers-guide-04-polish
description: Final buyer's guide pass. Enforce prose style, voice, lexicon, formatting, structure, length, CTA, and internal-link rules using shared content references.
---

# 04 - Polish

## Prerequisites

- `03-crosslink` completed in a prior edit
- shared references reviewed before editing

## Shared references

Use these as source of truth during this pass:

- [voice-and-tone](../../../../../references/content/voice-and-tone.md)
- [brand-lexicon](../../../../../references/content/brand-lexicon.md)
- [formatting](../../../../../references/content/formatting.md)
- [evaluation](../../../../../references/content/evaluation.md)

## Prose style (enforce)

Applies to `tmp/{id}.md` from this step through delivery. Research artifacts (`*-arize-research.md`) may stay terse.

H1 title format: `# {Topic}: A buyer's guide` (for example `# Evaluation harnesses: A buyer's guide`).

### Emphasis and markup

- Do not use bold (`**...**`) or italics (`*...*` / `_..._`) anywhere in the manuscript body, including lists and tables.
- Headings use markdown heading syntax only (`#`, `##`, `###`). Do not bold words inside paragraphs or bullets for emphasis.
- Links use descriptive anchor text; no bold inside anchors.

### Sentence shape

- Write at a tenth-grade reading level.
- Write in full sentences with ordinary conjunctions and transitions (`and`, `but`, `because`, `when`, `so`, `although`, `that means`).
- Connect ideas across sentences and paragraphs so the reader can follow cause, consequence, and scope without inferring jumps.
- Prefer verbs and clauses over compressed noun phrases.
  - Avoid: "Context propagation gap drives orphan-span blind spots."
  - Prefer: "When one service stops propagating trace context, downstream spans look unrelated and you lose the full request path."
- One idea per sentence.
- Unpack compressed sentences into verbs and clauses so a busy reader can follow without re-reading.
- Use hyphens, not en dashes.
- If you find anything higher than an eleventh-grade reading level, make it simpler to understand.
- One idea per sentence.

### Tone

- Functional and clear, not punchy or aphoristic.
- Avoid slogan lines, dramatic fragments, and stacked one-line bullets that read like slide titles.
- Avoid telegraphic list items that omit subjects or verbs unless the item is a true label (for example a table cell).
- Contractions are fine when they sound natural in technical prose.
- Expand acronyms on first use.

### TL;DR block

- Keep a short TL;DR after the opening lede when the draft needs one.
- Each bullet is one complete sentence that ends with a concrete "so you can ..." outcome.
- No bold or italics inside TL;DR bullets.

### FAQs

- Under `## FAQs`, each entry is `### Question text` followed by one or more answer paragraphs.
- Do not use bold for questions, numbered FAQ lists, or `Q:` / `A:` prefixes.

### Tables

- Table cells use plain text sentences or short phrases, not bold column headers inside cells (markdown table header row is fine).

### What this is not

- Not marketing hype, not founder-thread cadence, not SEO choppy stubs.

## Global rules

0. Accuracy: no invented metrics, customers, or integrations.
1. Audience: practitioner tone, connected full sentences, no buzzword soup or slide-deck fragments.
2. Structure: one H1 in the form `# {Topic}: A buyer's guide`, logical H2/H3, no orphan headings.
3. Length: about 2,000 words plus or minus 250.
4. Lists: numbered lists for sequences and criteria, bullets for grouped points.
5. CTA: one clear primary CTA in Next steps.
6. Competitors: no competitor names, links, or comparison framing.
7. Anchor text: descriptive, not generic.
8. Code and examples: only include them if verified against current docs.
9. Links: at least seven distinct `https://arize.com` destinations.
10. Demo questions: H2 `Ask these questions in any demo` with 6–10 numbered, evaluation-aligned questions (see [../02-draft/SKILL.md](../02-draft/SKILL.md)).
11. FAQs: H3 question heading, then answer paragraph(s) — no bold questions or `Q:` / `A:` format (see [../02-draft/SKILL.md](../02-draft/SKILL.md)).

## Core-eval closers

End Evaluation criteria or Rollout with three to five concrete checks the reader can run in a week.

## Checklist before handoff

- [ ] Word count in band
- [ ] At least seven distinct internal Arize links
- [ ] No competitor references
- [ ] Title line at top if helpful for handoff
- [ ] Product terms consistent with the brand lexicon
- [ ] Plainspoken practitioner tone with connected sentences
- [ ] No bold or italics in body
- [ ] TL;DR lines are full sentences ending with "so you can ..."
- [ ] No en dashes
- [ ] No aphoristic fragments or compressed noun-stack lines
- [ ] Evaluation checklist addressed
- [ ] Ask these questions in any demo section present (6+ concrete questions)
- [ ] FAQs use ### question / answer paragraph format

## Reference

- [.agents/skills/content/keywords-to-content/SKILL.md](../../../../skills/content/keywords-to-content/SKILL.md)

## Next

Run [../05-eval/SKILL.md](../05-eval/SKILL.md).
