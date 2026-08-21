---
name: hubspot-dead-links
description: Use this skill when an agent needs to audit HubSpot workflow or automated email links, find dead or broken URLs, and report which email assets need human fixes. Best for HubSpot onboarding, nurture, welcome, or lifecycle emails where the agent should inspect workflows, extract links, and verify HTTP status codes without publishing content changes by default.
---

# HubSpot Dead Links

Use this skill to find broken links in HubSpot workflow automation emails.

This is a read-first audit skill. The default output is:

- which workflow or email was checked
- which links were found
- which links returned `200`
- which links redirected
- which links returned `4xx` or `5xx`
- which email asset a human should fix in HubSpot

Do not auto-edit or publish email content unless the user explicitly asks.

## Default auth

Prefer `HUBSPOT_SERVICE_KEY` for all HubSpot API calls in this skill.

Do not use `HUBSPOT_PERSONAL_ACCESS_KEY` as a direct bearer token. That key is for HubSpot CLI authentication.

Minimum useful scopes for this skill:

- `automation`
- `content`

These two scopes should be attached to `HUBSPOT_SERVICE_KEY`.

If publish/write work is later requested, additional email publish scopes may be required.

## When to use it

Use this skill when the user asks to:

- check dead links in HubSpot emails
- audit onboarding, nurture, welcome, or lifecycle email links
- inspect a HubSpot workflow and validate the emails it sends
- confirm whether updated links now return `200`
- find which email asset contains a broken URL

## Default workflow

1. Confirm the HubSpot auth works with `GET /integrations/v1/me`.
2. Identify the target:
   - a specific email ID
   - a specific workflow ID
   - or a workflow/email name to search by
3. If starting from a workflow:
   - fetch the workflow with `GET /automation/v4/flows/{flowId}`
   - inspect actions for email-send actions
   - collect `content_id` values from workflow actions
4. Fetch each referenced email with `GET /marketing/v3/emails/{emailId}`.
5. Extract links from the email content HTML.
6. Check each URL over HTTP with redirects enabled.
7. Report the final status for each link and identify broken ones.
8. Include the HubSpot UI URL for any workflow or email the human may need to inspect, edit, or publish.
9. If the user asks to fix links, stop after proposing exact replacements unless they explicitly want edits.

## Workflow API pattern

List workflows:

```bash
curl -fsS -H "Authorization: Bearer $HUBSPOT_SERVICE_KEY" \
  "https://api.hubapi.com/automation/v4/flows?limit=100"
```

Fetch one workflow:

```bash
curl -fsS -H "Authorization: Bearer $HUBSPOT_SERVICE_KEY" \
  "https://api.hubapi.com/automation/v4/flows/<workflow_id>"
```

In workflow payloads, look for actions with a `fields.content_id` value. Those are the linked email assets.

## Email API pattern

Fetch one email:

```bash
curl -fsS -H "Authorization: Bearer $HUBSPOT_SERVICE_KEY" \
  "https://api.hubapi.com/marketing/v3/emails/<email_id>"
```

For published-vs-draft investigations:

- published email: `GET /marketing/v3/emails/{emailId}`
- draft email: `GET /marketing/v3/emails/{emailId}/draft`

This distinction matters when a user says they updated an email but the live version still shows old links.

## HubSpot UI URLs

When handing results back to a human, print the likely HubSpot UI link for the affected asset.

Patterns:

- workflow editor:
  `https://app.hubspot.com/workflows/<portal_id>/platform/flow/<workflow_id>/edit`
- email editor:
  `https://app.hubspot.com/email/<portal_id>/edit-beta/<email_id>/content`

Use the active portal ID from `GET /integrations/v1/me`.

Include these links whenever:

- the agent finds a broken link in a workflow-linked email
- the draft and published versions differ
- the user will need to publish manually in the HubSpot UI

## Link extraction

Most HubSpot automated emails in this repo use drag-and-drop content. A practical approach is:

1. read the email JSON
2. locate rich text HTML in `content.widgets.*.body.html`
3. extract `href="..."` URLs from all matching HTML blobs

Do not assume links only live in `primary_rich_text_module`. Check all widgets with HTML bodies when doing a broad audit.

If needed, scan the serialized `content` object for `href="..."` patterns as a fallback.

## HTTP status rules

Use `curl -I -L` or equivalent with a reasonable timeout.

Classify results like this:

- `200-299`: healthy
- `300-399`: redirected; report final destination and final status
- `400-499`: broken
- `500-599`: broken
- timeout / TLS / DNS failure: broken or unreachable

Recommended shell pattern:

```bash
curl -sSIL --max-redirs 10 --connect-timeout 10 "<url>"
```

Capture:

- original URL
- final URL after redirects
- final HTTP status

## Investigation rules

- Prefer checking the currently published email first.
- If the published email still has dead links, check the draft only if the user says they already edited it.
- If a workflow references multiple emails, audit all of them unless the user narrows scope.
- When searching by name, list candidate workflows or emails first, then fetch the specific match.
- Keep the audit read-only unless the user explicitly requests edits.

## Output shape

Report results in a way a human can act on quickly:

- workflow name and ID
- workflow UI URL when applicable
- email name and ID
- email UI URL
- published or draft
- each link and its final status
- exact broken URLs
- exact replacement URLs if obvious
- whether HubSpot still needs a manual publish

Good example:

- Workflow `Hosted Phoenix Onboarding Nurture` (`601720934`)
- Workflow UI: `https://app.hubspot.com/workflows/<portal_id>/platform/flow/601720934/edit`
- Email `AX AI Engineer Nurture Email #1 - Welcome` (`253437467369`)
- Email UI: `https://app.hubspot.com/email/<portal_id>/edit-beta/253437467369/content`
- Published links checked: 4
- Broken:
  - `https://example.com/old-page` -> `404`
- Healthy:
  - `https://example.com/new-page` -> `200`

## Boundaries

- Do not publish email changes unless the user asks and the auth scopes allow it.
- Do not assume a `403` means the URL is dead; distinguish application auth failures from external link failures.
- Do not treat HubSpot preview URLs as evidence that the public destination works.

## Related skills

- `.agents/skills/operational/hubspot/SKILL.md` for general HubSpot auth and API guidance
- `.agents/skills/operational/hubspot/set-up/hubspot-service-key.md` for service key setup and required scopes
