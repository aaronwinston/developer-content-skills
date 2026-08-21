# SerpAPI setup

This repo uses simple API key auth for SerpApi.

## Credential

Get the key from the SerpApi account page:

- https://serpapi.com/manage-api-key

Add it to the repo `.env`:

```bash
SERPAPI_API_KEY=
```

## Verify the key

The free account endpoint is the safest first check because it does not consume monthly search quota.

```bash
set -a && source .env && set +a

curl -fsS \
  "https://serpapi.com/account.json?api_key=${SERPAPI_API_KEY}"
```

Expected result: JSON showing account usage, remaining searches, and hourly throughput.

## First live Google search

```bash
set -a && source .env && set +a

mkdir -p .agents/skills/content/serp-api/serp-results

curl -fsS \
  "https://serpapi.com/search.json?engine=google&q=llm+evaluation&gl=us&hl=en&location=United+States&device=desktop&num=10&api_key=${SERPAPI_API_KEY}" \
  > .agents/skills/content/serp-api/serp-results/llm-evaluation-us-desktop.json
```

## Location lookup

If the search should simulate a specific city or metro, resolve the location first:

```bash
curl -fsS \
  "https://serpapi.com/locations.json?q=San+Francisco&limit=5"
```

Use the returned canonical location string as the `location` parameter in the search request.

## Common failure cases

- `401 Unauthorized`: invalid or missing API key
- `429 Too Many Requests`: no searches remaining or hourly throughput exceeded
- `400 Bad Request`: missing required search params such as `q`

## Notes

- Use `gl` for country and `hl` for language even when `location` is set.
- Identical cached requests can be served from SerpApi cache and not count against monthly quota unless `no_cache=true`.
- Save raw SERP JSON locally in `.agents/skills/content/serp-api/serp-results/` before passing it into an analysis skill.
