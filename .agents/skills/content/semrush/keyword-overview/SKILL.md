---
name: semrush-keyword-overview
description: Use this skill for Semrush keyword popularity lookups via Keyword Overview reports. Best for search volume, CPC, competition, trends, difficulty, and quick batch checks on specific keywords. All unit-consuming requests require explicit human approval first and must be saved under .agents/skills/content/semrush/data/.
---

# Semrush Keyword Overview

Use this skill with [.agents/skills/content/semrush/SKILL.md](../SKILL.md).

This is the first task-specific Semrush skill for keyword popularity lookups.

## Use it for

- search volume lookups for one keyword
- quick comparison of a small keyword list
- CPC and paid competition checks
- keyword difficulty checks
- trend checks from the overview report

## Preferred reports

For most popularity questions, use these reports:

- `phrase_this` for one keyword in one database
- `phrase_all` for one keyword across all databases
- batch keyword overview for up to 100 keywords in one database

Default recommendation:

- use `phrase_this` when the user has a target market such as `us`
- use batch keyword overview only when the user already has a bounded keyword list
- avoid historical requests unless the user explicitly needs them and explicitly approves the higher unit spend

## Unit cost

Per the current Semrush docs:

- keyword overview reports cost `10 API units per line` for regular data
- historical keyword overview data costs `50 API units per line`

That means:

- one `phrase_this` request returning one row is typically a small paid request
- a 100-keyword batch can still add up quickly

Always say the expected unit spend before running the request and wait for explicit approval.

## Default workflow

1. Confirm the user’s market / database, such as `us`.
2. Estimate unit cost from expected returned rows.
3. Tell the human the request will spend Semrush units and get explicit approval.
4. Use the smallest request that answers the question.
5. Save the request and raw response under `.agents/skills/content/semrush/data/`.
6. Summarize the result from the saved response.

## Safe defaults

- default to current data, not historical
- default to one database, not all databases, unless the user asks for cross-market coverage
- default to a small bounded list
- default export columns to the minimum needed

## Common request patterns

Single keyword in one database:

```bash
https://api.semrush.com/?type=phrase_this&key=${SEMRUSH_API_KEY}&phrase=<KEYWORD>&database=<DB>&export_columns=Ph,Nq,Cp,Co,Nr,Td
```

Single keyword across all databases:

```bash
https://api.semrush.com/?type=phrase_all&key=${SEMRUSH_API_KEY}&phrase=<KEYWORD>&export_columns=Dt,Db,Ph,Nq,Cp,Co,Nr
```

## Save pattern

After approval, prefer the shared save helper:

```bash
.agents/skills/content/semrush/scripts/save_api_response.sh \
  --slug keyword-overview-seo-us \
  --url "https://api.semrush.com/?type=phrase_this&key=${SEMRUSH_API_KEY}&phrase=seo&database=us&export_columns=Ph,Nq,Cp,Co,Nr,Td" \
  --report-type phrase_this \
  --query-type keyword \
  --query-value seo \
  --database us \
  --expected-units 10 \
  --output-ext csv
```

Do not run that helper until the human has explicitly approved the unit spend for that exact request.

## Related skills

- parent auth and policy: [../SKILL.md](../SKILL.md)
- charts after export: [../../../operational/plotly/SKILL.md](../../../operational/plotly/SKILL.md)

## References

- https://developer.semrush.com/api/seo/keyword-reports/
- https://developer.semrush.com/api/get-started/api-units-balance/
