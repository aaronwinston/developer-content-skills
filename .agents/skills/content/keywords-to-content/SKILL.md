---
name: keywords-to-content
description: Use this skill when the user already has a completed content brief for a keyword or topic and wants to turn that brief into a draft-ready article structure, title set, metadata ideas, section plan, or content asset for SEO or SEM-aligned content production.
---

# Keywords to Content

Use this skill only after a human or upstream workflow has already filled in a content brief.

This skill is not for raw keyword ideation. It is for turning a completed brief into a strong content asset without losing search intent.

## First principle

Ranking is not “put keyword in article.”

Ranking is:

- be the best answer for a specific search intent
- prove expertise
- make the page easy to understand
- connect it to the rest of the site’s authority

For Arize, this means avoiding generic AI copy and pushing toward technical, evidence-backed assets that can actually win.

## Use this skill for

- completed brief to article structure
- completed brief to landing page structure
- completed brief to title, H1, section, and CTA plan
- completed brief to metadata ideas and FAQ candidates
- turning a validated keyword target into a draft-ready outline for a writer or agent

## Do not run this skill unless the brief is filled out

If the user does not have a filled brief, stop and route back to a human instead of improvising.

Minimum brief fields:

- primary keyword
- search intent
- target reader
- funnel stage
- page type or asset type
- primary CTA
- required sections
- SME or product requirements, if known

Useful but optional:

- supporting keywords
- SERP notes
- competitive angle
- cannibalization notes
- internal links to include
- assets required such as screenshots, notebooks, charts, or quotes

Use [`briefs/brief-template.md`](briefs/brief-template.md) when a human needs a starting point.

## Why this skill exists

The weak workflow is “generate a 1,500-word article about X.”

The stronger workflow is:

1. clarify intent
2. understand the search bar and competitive bar
3. identify the content moat
4. lock the brief
5. write with constraints

This skill starts at step 4, not step 1.

## Content strategy assumptions behind this skill

- One keyword can map to multiple intents, and each intent usually deserves a different page.
- A generic page rarely wins across beginner, practitioner, buyer, comparison, and pain-driven searches at the same time.
- AI should enforce strategy, not just generate text.
- Arize should win by adding things competitors cannot easily copy: code, screenshots, traces, taxonomies, benchmarks, expert quotes, templates, and product-connected examples.
- Helpful, reliable, people-first content matters more than keyword stuffing.

## Default workflow

1. Validate that the brief is complete enough to execute.
2. Identify the exact search intent and keep the page scoped to that single intent.
3. Translate the brief into a content structure that answers the core question immediately.
4. Build a draft-ready output:
   - title options
   - H1
   - section structure
   - CTA placement
   - metadata ideas
   - FAQ candidates only if genuinely useful
5. Flag every place where human or SME input is still required.
6. Keep the piece aligned to the brief. Do not drift into broader thought leadership or adjacent keywords unless the brief explicitly calls for it.

## Output patterns

### Draft-ready article or page structure

Include:

- primary keyword
- supporting keywords
- search intent
- audience
- funnel stage
- asset type
- working title options
- H1 recommendation
- outline or section structure
- CTA goal
- required original assets
- internal-link needs
- human-input blockers

### Human-input checklist

Include:

- SME quote needed
- product screenshot needed
- code example needed
- internal doc or Phoenix reference needed
- cannibalization review needed
- benchmark or chart needed

## Pair with other skills when useful

- Use `.agents/skills/content/semrush/SKILL.md` when live keyword or competitor data is needed first.
- Use `.agents/skills/operational/wordpress/SKILL.md` when the user wants the result staged as a WordPress draft.
- Use `.agents/agents/content/aparna-x-to-wordpress/AGENT.md` when the source material starts as Aparna's X posts rather than keyword research.
- Use `.agents/skills/content/internal-backlinking/SKILL.md` after the page structure is settled and you need internal-link recommendations.
- Use `.agents/skills/content/refresh-and-decay/SKILL.md` after publish when the page needs monitoring, refresh logic, or decay analysis.

## Constraints

- Do not create the brief from scratch inside this skill.
- Do not continue if the brief is under-specified; ask for human clarification instead.
- Do not pretend to have live SERP data unless it was provided or fetched with another skill.
- Distinguish clearly between assumptions, user-provided inputs, and inferred recommendations.
- Put the keyword naturally in the title, H1, first paragraph, URL suggestion, and selected headings.
- Answer the core question early.
- Prefer examples before abstraction.
- Prefer concise, draftable outputs over long explanations.
