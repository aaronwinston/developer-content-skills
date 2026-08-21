# Kinsta API Setup

Kinsta API access uses a MyKinsta company API key.

## Create a key

1. Open `https://my.kinsta.com/company/apiKeys`.
2. In MyKinsta, go to username > Company settings > API Keys.
3. Click **Create API Key**.
4. Choose an expiration, or set a custom start date and lifetime.
5. Give the key a clear name, generate it, and copy it immediately. Kinsta only shows the raw key once.

Company owners, company administrators, and company developers can create keys. The key inherits the access level of the user who created it.

## Store locally

Add the key to the repo `.env` file:

```bash
KINSTA_API_KEY=
KINSTA_COMPANY_ID=
KINSTA_BASE_URL=https://api.kinsta.com/v2
```

`KINSTA_COMPANY_ID` is optional. `GET /validate` returns the company id, but a pinned value is useful for scheduled jobs and repeatable scripts.

## Validate

```bash
set -a; source .env; set +a

KINSTA_BASE_URL="${KINSTA_BASE_URL:-https://api.kinsta.com/v2}"

curl -fsS \
  -H "Authorization: Bearer $KINSTA_API_KEY" \
  "$KINSTA_BASE_URL/validate" | jq
```

A valid key returns its name, expiration, company id, and status. If validation works but a later endpoint fails, check whether the key's MyKinsta user role has access to that company resource.

## Security

- Do not commit `.env` or raw API keys.
- Revoke old keys from MyKinsta when a user leaves the company or no longer needs access.
- Prefer a named automation key with a clear expiration for recurring agent work.
