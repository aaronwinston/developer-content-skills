---
name: semrush
description: Use this skill for live Semrush API access, starting with the Standard API and SEO API over an API key. Use it for keyword, domain, backlink, and competitive SEO pulls directly from Semrush; prefer analysis or plotting skills after export when the task moves from retrieval to interpretation.
---

# Semrush

Use this skill when the task needs live Semrush API data instead of warehouse SQL.

This is the parent Semrush skill. Use it for:

- auth and connection checks
- unit-balance checks
- deciding which Semrush child skill fits the task
- enforcing approval before any unit-consuming request
- enforcing mandatory local storage of approved paid responses

This first version is centered on the Semrush API key flow used by:

- Standard API
- SEO API
- Projects API (API key)

Do not assume this skill covers every Semrush API family the same way. Semrush also has OAuth 2.0 flows for some APIs such as Map Rank Tracker and Projects API (OAuth 2.0). Use those only when the task explicitly requires them.

Mandatory storage location for this skill:

- `.agents/skills/content/semrush/data/`

Every approved Semrush API pull must be saved there before the task is considered complete.

Current child skills:

- `.agents/skills/content/semrush/keyword-overview/SKILL.md` for keyword popularity lookups

## What this skill is for

Use it for:

- live SEO research from Semrush
- domain and keyword lookups
- competitor discovery
- backlinks and referring-domain pulls
- checking API unit balance before running expensive requests
- exporting Semrush results for later analysis

Prefer BigQuery or plotting skills after the data is already exported locally and the task becomes analysis rather than API retrieval.

## Credential

Semrush API key auth for the Standard API is a query parameter, not a bearer token:

```bash
https://api.semrush.com/?key=${SEMRUSH_API_KEY}&type=...
```

For Listing Management API, Semrush documents a different header-based pattern. This skill does not default to that path yet.

For setup, see [set-up/semrush-api.md](set-up/semrush-api.md).

## Prerequisites

- `SEMRUSH_API_KEY` in `.env`
- a Semrush subscription level that actually allows API access
- available API units for Standard API requests
- `curl`

Important Semrush access rule from the current docs: Standard API access requires an **SEO Business** subscription, and you must also buy **API units** before you can copy and use the API key.

## Quick Check

Validate auth with the free API unit balance endpoint before any paid request:

```bash
set -a && source .env && set +a

curl -fsS \
  "https://www.semrush.com/users/countapiunits.html?key=${SEMRUSH_API_KEY}"
```

Expected result: a CSV-like integer such as `1000`.

Interpretation:

- numeric response -> key works
- empty env / shell expansion issue -> local setup problem
- auth or entitlement error -> wrong key, no API access, or missing Business subscription / API units

## Default Workflow

1. Confirm `SEMRUSH_API_KEY` is set.
2. Check unit balance with the free endpoint.
3. Pick the most specific child skill for the task when one exists.
4. Tell the human if the next request will consume API units and get explicit approval before running it.
5. Build the smallest API request that answers the question.
6. Start with a low row limit on any line-billed endpoint.
7. Save the raw response plus request metadata under `.agents/skills/content/semrush/data/`, preferably via `scripts/save_api_response.sh`.
8. Hand off to BigQuery or Plotly skills only after the Semrush pull is complete and saved.

## Base Request Pattern

```bash
curl -fsS \
  "https://api.semrush.com/?key=${SEMRUSH_API_KEY}&type=<REPORT>&export_columns=<COLS>&display_limit=<N>&domain=<DOMAIN>&database=<DB>"
```

Semrush SEO API responses are commonly returned as CSV, not JSON.

## Examples

Check API unit balance:

```bash
curl -fsS \
  "https://www.semrush.com/users/countapiunits.html?key=${SEMRUSH_API_KEY}"
```

Example SEO API request:

```bash
curl -fsS \
  "https://api.semrush.com/?key=${SEMRUSH_API_KEY}&type=domain_rank&domain=arize.com&database=us"
```

## Practical Rules

- always check unit balance before large pulls
- do not run any Semrush request that may consume API units until the human explicitly approves that spend for the specific task
- treat unit-consuming Semrush calls as billable operations that require a clear pre-execution confirmation
- free verification steps such as the API unit balance check are allowed without extra approval
- saving approved pull results under `.agents/skills/content/semrush/data/` is mandatory
- do not rely on Semrush alone as the durable store for paid responses; keep a local saved copy in this repo
- prefer child skills for task-specific workflows instead of putting report-specific logic in this parent file
- start with narrow limits before scaling a request
- do not print or share the raw API key
- Semrush charges API units differently by endpoint and, for some reports, by returned lines
- historical data can cost materially more than live data
- Semrush docs currently restrict caching API data for more than one month without written consent, so treat this repo copy as an operational working set rather than a permanent archive
- if the user needs repeatable internal analysis, save the raw export first and only then transform it

## Handoff

- `.agents/skills/content/semrush/keyword-overview/SKILL.md` for keyword popularity lookups
- `.agents/skills/operational/plotly/SKILL.md` for charts after export
- `.agents/skills/operational/google-big-query/SKILL.md` if Semrush data is loaded into the warehouse later
- `set-up/semrush-api.md` for access, API key placement, and verification

## References

- API access: https://developer.semrush.com/api/get-started/api-access/
- Authorization: https://developer.semrush.com/api/get-started/authorization/
- API unit balance: https://developer.semrush.com/api/basics/api-units-balance/
- SEO API overview: https://developer.semrush.com/api/seo/overview/
