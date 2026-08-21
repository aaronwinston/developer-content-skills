# Semrush API setup

**Skill (how to use the API):** [`.agents/skills/content/semrush/SKILL.md`](../SKILL.md)

This file is the setup runbook. A human gets the Semrush subscription access and places the key in `.env`; an agent validates and troubleshoots.

---

## Human

Semrush Standard API access is not enabled by default.

Per the current Semrush docs, as of **April 22, 2026**, Standard API access requires:

1. an **SEO Business** subscription
2. a separately purchased **API unit package**

Important detail: after upgrading to the Business plan, your API units are still `0` until you buy a package.

### 1. Get Semrush API access in the UI

1. Sign in to Semrush.
2. Upgrade to the **SEO Business** plan if the account is not already on it.
3. Open the account menu in the top-right corner.
4. Go to **Subscription info**.
5. Open the **API Units** tab.
6. Buy an API unit package.
7. Copy the API key shown on that page.

### 2. Put the key in `.env`

From the repo root, create `.env` if needed:

```bash
cp .env.example .env
```

Then add:

```bash
SEMRUSH_API_KEY=your_api_key_here
```

Do not commit `.env`.

---

## Agent

1. Confirm `.env` exists. If not, run:

   ```bash
   cp .env.example .env
   ```

2. Load env and verify without printing the key:

   ```bash
   set -a && source .env && set +a

   if [ -z "${SEMRUSH_API_KEY:-}" ]; then
     echo "SEMRUSH_API_KEY is not set in .env"
     exit 1
   fi

   code=$(curl -sS -o /tmp/semrush_units.txt -w "%{http_code}" \
     "https://www.semrush.com/users/countapiunits.html?key=${SEMRUSH_API_KEY}")

   echo "HTTP $code"
   head -c 200 /tmp/semrush_units.txt
   echo
   rm -f /tmp/semrush_units.txt
   ```

3. Interpret results:

- HTTP `200` with a numeric body such as `1000` -> auth works and the key is active
- body indicates an error, or the key does not return a numeric balance -> wrong key, API access missing, or no units purchased
- HTTP `401` / `403` / redirect loops -> check Semrush subscription entitlement, API unit purchase, or network/proxy issues

4. If verification fails, check these in order:

- `SEMRUSH_API_KEY` is actually present in `.env`
- the human copied the key from **Subscription info -> API Units**
- the Semrush account is on **SEO Business**
- at least one API unit package was purchased

5. Before any expensive production pull, optionally test one small request after the balance check:

   ```bash
   curl -fsS \
     "https://api.semrush.com/?key=${SEMRUSH_API_KEY}&type=domain_rank&domain=arize.com&database=us" \
     | head -c 500
   echo
   ```

   Only do this if the human explicitly approves spending Semrush API units for that request. Do not use this optional test as the default connectivity check.

---

## Notes

- Standard API auth uses the `key` query parameter
- Semrush warns that the API key also gives access to the API unit balance, so treat it like a billable secret
- Standard API and SEO API responses are often CSV rather than JSON
- unit consumption varies by endpoint, and historical data can cost more than live data
- default safe connectivity test: `countapiunits.html` only
- when running approved paid requests later, save responses under `.agents/skills/content/semrush/data/`
- prefer `.agents/skills/content/semrush/scripts/save_api_response.sh` for approved paid pulls so request metadata and raw responses are stored together

## Sources

- [API access](https://developer.semrush.com/api/get-started/api-access/)
- [Authorization](https://developer.semrush.com/api/get-started/authorization/)
- [API unit balance](https://developer.semrush.com/api/basics/api-units-balance/)
