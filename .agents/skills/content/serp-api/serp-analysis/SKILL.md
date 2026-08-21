---
name: serp-analysis
description: Use this skill when live SERP evidence already exists and the task is to interpret it into search intent, page-type patterns, common section patterns, content gaps, and a recommended page strategy for a target keyword or topic.
---

# SERP Analysis

Use this skill after live SERP data has already been gathered.

This is the interpretation layer for content strategy.

Use `.agents/skills/content/serp-api/SKILL.md` first when the SERP has not been fetched yet.

## Use this skill for

- keyword-level SERP interpretation
- page-type classification of ranking results
- dominant intent identification
- common section and angle extraction
- identifying what the current SERP is missing
- recommending the right page strategy before writing

## Do not use this skill for

- raw API retrieval
- live keyword metric pulls
- drafting the article before strategy is clear

## Inputs expected

Bring in one of these:

- a saved SerpApi JSON response
- a manually captured Google SERP summary
- Semrush exports or notes
- optional Ahrefs notes if a human already provided them

Do not pretend to have live SERP evidence if none was provided or fetched.

## Default workflow

Given keyword `X`:

1. Pull or load the top ranking pages.
2. Classify page types.
3. Identify dominant intent.
4. Extract common sections and recurring themes.
5. Identify missing angles.
6. Recommend page strategy.

This is the minimum viable workflow. Do not overcomplicate early versions with clustering, backlink scoring, or broad multi-tool analysis unless the user asks for that depth.

## Page-type classification

Use practical buckets such as:

- product page
- landing page
- technical guide
- beginner explainer
- vendor blog
- documentation
- comparison page
- open-source project page
- category or directory page
- forum or community page
- video result

Keep the taxonomy compact. The goal is to understand the SERP, not to build an ontology.

## Intent classification

Use the dominant ranking pattern to infer the main reader job:

- informational
- practical or how-to
- comparative
- navigational
- transactional
- mixed, when the SERP is genuinely split

Then describe the likely reader in plain language, such as:

- ML engineer
- AI platform engineer
- developer evaluating tooling
- practitioner looking for implementation help

## Common sections

Extract what top pages repeatedly include, for example:

- definition or framing section
- why it matters
- workflow or implementation steps
- metrics and evaluation criteria
- examples or case studies
- tooling comparison
- FAQ

If section detail is not visible from snippets alone, open the top few ranking pages before concluding.

## Missing angles

Look for gaps the current SERP does not cover well, such as:

- production debugging examples
- real traces or screenshots
- code-first implementation guidance
- failure taxonomies
- evaluation tradeoffs
- enterprise governance details
- open-source versus vendor framing

For Arize, prefer gaps connected to product truth and technical evidence instead of generic marketing claims.

## Output format

Include:

- keyword
- dominant intent
- main reader
- top page-type pattern
- common sections
- missing angles
- recommended page strategy
- reasons this page can win
- blockers or unknowns

## Example shape

For `llm evaluation`, a strong answer might look like:

- dominant intent: practical and informational
- SERP pattern: guides, vendor blogs, open-source docs
- reader: ML engineer or AI platform engineer
- missing angle: production debugging examples with real traces
- recommended page: technical guide with Phoenix workflow, metrics table, code examples, and failure taxonomy

That is materially better than jumping straight to “write a blog post.”

## Pair with other skills

- Use `.agents/skills/content/serp-api/SKILL.md` when the SERP still needs to be fetched.
- Use `.agents/skills/content/semrush/SKILL.md` when live keyword metrics or competitor-domain exports are needed.
- Use `.agents/skills/content/keywords-to-content/SKILL.md` after this analysis has been turned into a complete brief.

## Constraints

- do not confuse SERP evidence with brand preference
- do not recommend a page type that the current SERP clearly rejects without calling out that risk
- do not invent content gaps that are not visible in the ranking set
- separate observed patterns from inferred recommendations
