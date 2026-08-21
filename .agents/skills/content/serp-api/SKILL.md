---
name: serp-api
description: Use this skill for live Google SERP retrieval through SerpApi when a content or SEO workflow needs current top-ranking pages, SERP features, related searches, or location-specific search results. Use it to fetch and save SERP data, then hand off to a separate analysis skill for intent, page-type, and content-gap interpretation.
---

# SERP API

Use this skill when the task needs live Google search results instead of stale assumptions.

This skill is for retrieval, not interpretation.

Use it to:

- fetch current Google SERP results for a keyword
- capture top-ranking pages and SERP features
- resolve location-specific Google results
- save a reproducible SERP snapshot before analysis

Do not use this skill as the final SEO strategist. After retrieval, hand off to `.agents/skills/content/serp-api/serp-analysis/SKILL.md`.

## Why this skill exists

Content planning gets weak fast when the agent guesses what the SERP looks like.

The right split is:

1. fetch live SERP data
2. save the raw snapshot
3. analyze intent, page types, gaps, and page strategy in a separate skill

That keeps evidence collection separate from judgment.

## Use this skill for

- live keyword SERP snapshots
- top 10 or top 20 ranking-page pulls
- related searches and People Also Ask support data
- country, language, and city-specific Google result retrieval
- reproducible SERP evidence for downstream briefing

## Do not use this skill for

- writing the brief itself
- final page strategy recommendations
- internal-link recommendations
- warehouse analysis

## Setup

Use [set-up/serpapi-api.md](set-up/serpapi-api.md).

Required env var:

```bash
SERPAPI_API_KEY=
```

## Default workflow

1. Confirm `SERPAPI_API_KEY` is present.
2. Run the free account check before paid retrieval work.
3. Lock the search context:
   - keyword
   - `gl` country
   - `hl` language
   - `location` when local nuance matters
   - device, usually `desktop` for editorial SERP review
4. If location is ambiguous, resolve it with the free `locations.json` API first.
5. Fetch the smallest useful Google SERP snapshot, usually first page first.
6. Save the raw JSON under `.agents/skills/content/serp-api/serp-results/` before analysis.
7. Pass the saved snapshot to `.agents/skills/content/serp-api/serp-analysis/SKILL.md`.

## Account check

SerpApi exposes a free account endpoint for remaining quota and hourly rate limits.

```bash
set -a && source .env && set +a

curl -fsS \
  "https://serpapi.com/account.json?api_key=${SERPAPI_API_KEY}"
```

Interpretation:

- JSON with plan and remaining searches: key works
- `401`: wrong or missing key
- `429`: account has no searches left or exceeded rate limits

## Default Google request

Use the Google engine endpoint and save JSON output.

```bash
set -a && source .env && set +a

mkdir -p .agents/skills/content/serp-api/serp-results

curl -fsS \
  "https://serpapi.com/search.json?engine=google&q=llm+evaluation&gl=us&hl=en&location=United+States&device=desktop&num=10&api_key=${SERPAPI_API_KEY}" \
  > .agents/skills/content/serp-api/serp-results/llm-evaluation-us-desktop.json
```

## Location lookup

When city- or region-level precision matters, use the free locations endpoint first.

```bash
curl -fsS \
  "https://serpapi.com/locations.json?q=Austin&limit=5"
```

Then use the returned canonical location name in the search request.

## Useful fields for downstream analysis

The downstream analysis skill should usually inspect:

- `organic_results`
- `related_searches`
- `related_questions`
- `ai_overview` when present
- `answer_box` when present
- `search_information`
- `search_metadata`

Start with `organic_results`. Use the others as support signals, not replacements for the ranking pages.

## Practical rules

- treat SerpApi pulls as live external data, not as assumptions
- save the raw JSON before summarizing
- default local storage for this skill is `.agents/skills/content/serp-api/serp-results/`
- prefer `desktop` unless the task explicitly needs mobile SERP review
- set `gl` and `hl` deliberately; do not let them float implicitly
- use `location` when geography matters for ranking patterns
- use `start=10`, `20`, and so on only when the first page is not enough
- avoid `no_cache=true` unless the user specifically needs a fresh uncached pull
- if you need asynchronous retrieval, use Search Archive after submission instead of improvising polling
- do not print or share the raw API key

## Pair with other skills

- Use `.agents/skills/content/serp-api/serp-analysis/SKILL.md` after retrieval for page-type classification, intent, gaps, and page strategy.
- Use `.agents/skills/content/semrush/SKILL.md` when keyword metrics, competing domains, or additional SEO exports are needed.
- Use `.agents/skills/content/keywords-to-content/SKILL.md` only after the SERP analysis has been turned into a real brief.

## References

- Google Search API: https://serpapi.com/search-api
- Account API: https://serpapi.com/account-api
- Search Archive API: https://serpapi.com/search-archive-api
- Locations API: https://serpapi.com/locations-api
- Related Searches: https://serpapi.com/related-searches
- Related Questions: https://serpapi.com/related-questions
- AI Overview: https://serpapi.com/ai-overview
