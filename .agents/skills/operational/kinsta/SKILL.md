---
name: kinsta
description: Work with live Kinsta hosting resources through Kinsta's REST API. Use when inspecting or managing Kinsta WordPress sites, environments, domains, DNS records, caches, PHP/SFTP settings, plugins, themes, backups, logs, analytics, company users, API keys, activity logs, available regions, or long-running Kinsta operations.
---

# Kinsta

Use this skill for live Kinsta API work. Kinsta's API covers WordPress Hosting, Company, DNS Management, and Operations resources.

Kinsta's API is public beta, so verify endpoint payloads in the API reference before new write workflows or less common endpoints.

## Auth

Kinsta uses bearer-token API key auth:

- base URL: `https://api.kinsta.com/v2`
- auth header: `Authorization: Bearer $KINSTA_API_KEY`
- setup page: `https://my.kinsta.com/company/apiKeys`
- local setup instructions: [set-up/kinsta-api.md](set-up/kinsta-api.md)

Supported env variables:

```bash
KINSTA_API_KEY=
KINSTA_COMPANY_ID=
KINSTA_BASE_URL=https://api.kinsta.com/v2
```

`KINSTA_COMPANY_ID` is optional because `GET /validate` returns the company id visible to the key. Set it when automation should use a pinned company id instead of deriving it from the key each run.

## Quick Check

Validate auth before deeper work:

```bash
set -a; source .env; set +a

KINSTA_BASE_URL="${KINSTA_BASE_URL:-https://api.kinsta.com/v2}"

curl -fsS \
  -H "Authorization: Bearer $KINSTA_API_KEY" \
  "$KINSTA_BASE_URL/validate" | jq
```

Use the returned `company` value for company-scoped endpoints:

```bash
COMPANY_ID="${KINSTA_COMPANY_ID:-$(curl -fsS \
  -H "Authorization: Bearer $KINSTA_API_KEY" \
  "$KINSTA_BASE_URL/validate" | jq -r '.company')}"
```

## Default Workflow

1. Confirm `KINSTA_API_KEY` is set. If not, follow [set-up/kinsta-api.md](set-up/kinsta-api.md).
2. Validate the key with `GET /validate`.
3. Resolve the company id from `KINSTA_COMPANY_ID` or the validation response.
4. Use read-only list/detail endpoints before any mutation.
5. For endpoints that return an `operation_id`, poll `GET /operations/{operation_id}` until it returns a terminal status.
6. Use write endpoints only when the user explicitly asks to make the change.

## High-Value Endpoints

Read-only starting points:

- `GET /validate` - validate the key and discover the company id
- `GET /sites?company=<company_id>&include_environments=true` - list WordPress sites and environments
- `GET /company/{id}/api-keys` - list company API keys and statuses
- `GET /company/{id}/users` - list company users
- `GET /company/{id}/activity-logs` - inspect company activity
- `GET /company/{id}/available-regions` - list available regions
- DNS endpoints under `/domains`
- WordPress environment, domains, plugins/themes, backups, logs, and analytics endpoints under the WordPress sections of the API reference
- `GET /operations/{operation_id}` - poll long-running operations

Common operational areas:

- clear site, edge, or CDN cache
- restart PHP or change PHP/SFTP settings
- manage domains and DNS records
- list and update plugins or themes
- create, clone, push, reset, or delete WordPress sites and environments
- create, restore, or delete backups

## Examples

List sites:

```bash
KINSTA_BASE_URL="${KINSTA_BASE_URL:-https://api.kinsta.com/v2}"
COMPANY_ID="${KINSTA_COMPANY_ID:-$(curl -fsS \
  -H "Authorization: Bearer $KINSTA_API_KEY" \
  "$KINSTA_BASE_URL/validate" | jq -r '.company')}"

curl -fsS -G \
  -H "Authorization: Bearer $KINSTA_API_KEY" \
  --data-urlencode "company=$COMPANY_ID" \
  --data-urlencode "include_environments=true" \
  "$KINSTA_BASE_URL/sites" | jq
```

List company API keys:

```bash
curl -fsS \
  -H "Authorization: Bearer $KINSTA_API_KEY" \
  "$KINSTA_BASE_URL/company/$COMPANY_ID/api-keys" | jq
```

Poll an operation:

```bash
curl -fsS \
  -H "Authorization: Bearer $KINSTA_API_KEY" \
  "$KINSTA_BASE_URL/operations/$OPERATION_ID" | jq
```

## Practical Rules

- Start read-only unless the user explicitly asks for a change.
- Do not print, commit, or paste API keys into final output or logs.
- Treat `401` as missing/invalid key; treat `404` on company-scoped endpoints as either a wrong id or insufficient key permissions.
- Respect Kinsta's documented rate limits: 120 requests per minute per company id, 1000 requests per minute per IP, and 5 resource-creation requests per minute.
- Check rate-limit headers on recent responses when paging or automating.
- Application, Database, and Static Site Hosting endpoints moved to Sevalla as of February 2, 2026; use the Sevalla API for those services, not Kinsta.
- Kinsta key access depends on the MyKinsta user role that created the key. If an endpoint is denied, ask for a key from a company owner/admin or a user with the needed access.

## References

- Kinsta API docs: https://kinsta.com/docs/kinsta-api/
- API reference: https://api-docs.kinsta.com/
- Documentation index for endpoint discovery: https://api-docs.kinsta.com/llms.txt
- MyKinsta API keys: https://my.kinsta.com/company/apiKeys
