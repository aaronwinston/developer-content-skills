---
name: buyers-guide-02-draft
description: Buyer guide pass 1. Read research and write `tmp/{id}.md` from the section contract. Run after research and before crosslink. Prose is fully enforced in 04-polish.
---

# 02 - First draft

## Prerequisites

- `tmp/{id}-arize-research.md`
- `tmp/{id}-crosslinks.md`

Use the same `{id}` as filename stem: `tmp/{id}.md`.

## Prose style (required)

- No bold or italics in body copy, lists, tables, or TL;DR bullets.
- Full sentences with conjunctions and transitions; unpack compressed noun phrases into what happens, who does it, and why it matters.
- Functional and clear tone — not punchy, aphoristic, or fragment-heavy.
- Aim for an eleventh-grade reading level.


## Section-by-section contract

Use exactly one H1 in this format (sentence case on the topic phrase):

```md
# {Topic}: A buyer's guide
```

Example: `# Distributed tracing: A buyer's guide`. Do not use “Buyer's guide: {Topic}” or other variants.

A short opening lede before the first H2 is fine when it sets context in connected sentences.

Required H2 sections, in this order unless the topic requires small wording changes:

Introduction: One paragraph simply explaining what [X] is, and then another paragraph explaining why it's important.

2. Who this guide is for
3. Definitions and scope
4. Evaluation criteria
5. Architecture and workflows
6. Data, security, and governance
7. Rollout plan
8. Ask these questions in any demo
9. FAQs
10. Next steps / CTA

Optional sections if research supports them:

- Common mistakes
- Glossary

## Ask these questions in any demo (section 8)

Use the H2 title `Ask these questions in any demo` (small wording tweaks are fine if the topic demands it).

- Include 6–10 numbered questions the reader can ask in a vendor demo or proof-of-concept review.
- Tie each question to a capability or risk from Evaluation criteria (sessions, traces, evals, governance, rollout, cost, and similar).
- Phrase questions so a skeptical buyer gets a verifiable answer (what to show live, what artifact to receive after, what breaks if the claim is false).
- No generic filler ("What is your roadmap?", "Why are you better?") unless research flags a real gap.

## FAQs (section 9)

Under the H2 `FAQs`, use one H3 per question and a plain answer paragraph immediately below. Do not use bold questions, numbered lists, or `Q:` / `A:` labels.

```md
## FAQs

### Do we still need logs if we have tracing?
Yes, because logs remain useful for ...

### Is Phoenix only for prototyping?
Many teams use Phoenix for ...
```

Each answer should be one or more full sentences. Links are fine inside answers.

## Crosslinks in this pass

- Prefer natural placement.
- Aim for five or more distinct `https://arize.com` links if they fit.
- Do not stress about hitting seven yet. `03-crosslink` finishes the budget.

## Length

Target roughly 1,800 to 2,200 words before polish.

## Do not

- Link to competitors or comparison sites by name.
- Fabricate statistics, customer names, or roadmap claims not in research.

## Next

Run [../03-crosslink/SKILL.md](../03-crosslink/SKILL.md).
