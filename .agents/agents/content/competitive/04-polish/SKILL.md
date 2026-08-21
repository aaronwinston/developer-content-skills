---
name: competitive-alternatives-04-polish
description: House pass — enforce manuscript prose, outline IA, length, seven internal links, and CTA. Run before 05-eval.
---

# 04 - Polish

## Prerequisites

Step 03 must be complete for this `{id}` in the same run. See [../AGENT.md](../AGENT.md).

## Scope

These rules apply to `tmp/{id}.md` from this step through delivery. Research files such as `*-competitive-research.md` and `*-sheet-row.md` may stay terse because agents read them, not customers.

Section structure, the H1 pattern, the opening preview sentence, and information architecture come from [../templates/article-outline.md](../templates/article-outline.md).

In published copy, do not mention the competitive matrix sheet, the queue spreadsheet, or internal research files. When you need to support a claim, cite vendor sites and public documentation instead.

## Shared references

Read before you edit:

- [../templates/article-outline.md](../templates/article-outline.md)
- [voice-and-tone.md](../../../../../references/content/voice-and-tone.md)
- [brand-lexicon.md](../../../../../references/content/brand-lexicon.md)
- [formatting.md](../../../../../references/content/formatting.md)
- [evaluation.md](../../../../../references/content/evaluation.md)

## Emphasis and markup

- Do not use bold or italics in the manuscript body, including lists and tables.
- Headings use markdown heading syntax only (`#`, `##`, `###`). When you label subsections inside a tool entry, use a `###` heading rather than a bold line.

## Sentence shape

- Write at a tenth-grade reading level.
- Write in full sentences and connect ideas with ordinary transitions such as and, but, because, when, and so that.
- Prefer verbs and clauses instead of stacking nouns into compressed phrases.
- One main idea per sentence. If a sentence lists three or more parallel causes, split it or lead with the primary friction and explain the rest in follow-on sentences.
- Functional and clear tone, not punchy, aphoristic, or fragment-heavy. Expand acronyms on first use. Use hyphens, not en dashes.

## Anti-patterns (rewrite on sight)

- Abstract buyer framing: "Buyers shop when…", "Teams evaluate when…" — describe what happens in the product (for example, evaluator runs billing as traces).
- Research-bullet compression: multiple pricing or ecosystem facts in one comma chain with no hierarchy.
- Noun stacks: "deepest ergonomics," "unified trace meter," slide-deck fragments without a concrete failure mode.
- Vague superiority: "better at AI" — say what breaks, what improves, and who each option is for.

## Competitive tone

- Name competitors fairly. No trash talk, punch-down language, or rumor.
- Observational framing works well: explain that teams who need a given capability often run into a specific constraint, with a concrete example when possible.

## Manuscript requirements

- H1: `# Alternatives to [Competitor]: A guide`, using the competitor name from the sheet row unless the row specifies a different canonical string.
- Length: about 1,300 words, acceptable band 1,200 to 1,450 after polish.
- Internal links: at least seven distinct `https://arize.com` URLs in the manuscript.
- Close: clear Arize call to action in the final substantive section — what to do next and why it matters.
- Accuracy: do not invent metrics, customer names, certifications, or pricing. When a claim is uncertain, soften it or remove it.

## Checklist before you hand off to step 05

- [ ] Word count falls in the 1,200 to 1,450 band
- [ ] The H1, opening preview sentence, and section structure match the outline
- [ ] Opening states one primary friction in connected prose, not a compressed multi-cause list
- [ ] The manuscript includes at least seven distinct internal links to arize.com
- [ ] The article covers four to seven alternatives with honest fit guidance and a fair description of the focal competitor's strengths
- [ ] The close includes a clear Arize call to action
- [ ] Lexicon and formatting follow the shared references
- [ ] The body copy contains no inline bold or italics
- [ ] No aphoristic fragments, noun-stack lines, or abstract "buyers shop when" sentences

## Next

Run [../05-eval/SKILL.md](../05-eval/SKILL.md).
