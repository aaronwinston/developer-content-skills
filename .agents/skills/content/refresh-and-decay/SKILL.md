---
name: refresh-and-decay
description: Use this skill when a page already exists and the user wants to monitor rankings, impressions, clicks, traffic decay, query drift, competitor movement, or refresh opportunities, then turn that signal into concrete content update recommendations.
---

# Refresh and Decay

Use this skill after a page is published or already live.

This is the “refresh and decay agent” in the content workflow.

## Why this skill exists

SEO is not publish-once work.

Pages decay. Search intent shifts. Competitors add better sections. A page may start ranking for adjacent queries it does not fully answer. A call to action (CTA) may underperform even if the page still gets traffic.

This skill exists to help agents and humans:

- monitor whether a page is gaining or losing traction
- identify what the page is actually ranking for
- detect content gaps, query drift, or SERP movement
- recommend focused updates instead of full rewrites by default

## Important context for this skill

- A page can rank without converting, so traffic alone is not enough.
- Search Console query behavior matters because it shows what Google thinks the page is about.
- Competitor movement matters because the search bar changes even when your content does not.
- Good refreshes are often additive and specific: new examples, comparison tables, metrics sections, updated screenshots, stronger linking, or clearer CTAs.
- AI should recommend strategically useful updates, not generic “refresh the content” advice.

## Use this skill for

- diagnosing traffic or ranking decline
- spotting accidental rankings and query drift
- identifying new sections the page now needs
- recommending refresh priorities across a content set
- checking whether a page’s CTA or conversion path still fits the traffic intent

## Default workflow

1. Confirm the target page and the time window being analyzed.
2. Gather available signals:
   - rankings
   - impressions
   - clicks
   - queries
   - traffic trend
   - competitor changes
   - conversion or CTA performance, if available
3. Classify the issue:
   - decay
   - query drift
   - intent mismatch
   - missing depth
   - stale assets
   - weak linking
   - weak CTA alignment
4. Recommend the smallest meaningful update set.
5. Flag what needs human review or additional data.

## Output format

Include:

- target page
- observed problem
- evidence summary
- recommended updates
- why each update matters
- priority
- human-input blockers

## Example recommendations

- add a dedicated metrics table because the page ranks for a metrics-specific query set
- add code examples because the SERP shifted toward practitioner content
- update screenshots because product UX changed
- add stronger links from related pages in the same cluster
- split one page into multiple intent-specific pages if it is trying to rank for incompatible intents

## Pair with other skills when useful

- Use `.agents/skills/content/keywords-to-content/SKILL.md` when a refresh turns into a substantial rewrite with a new brief.
- Use `.agents/skills/content/internal-backlinking/SKILL.md` when the refresh recommendation includes stronger cluster linking.
- Use `.agents/skills/operational/google-search-console/SKILL.md` when Search Console or query-level warehouse analysis is needed.

## Constraints

- Do not recommend a full rewrite unless the evidence points to intent mismatch or structural failure.
- Distinguish between signal that is observed and conclusions that are inferred.
- Prefer concrete refresh actions over generic advice.
