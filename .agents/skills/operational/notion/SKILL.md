---
name: notion
description: Use this skill for live Notion operational access through a Notion integration. Use it to read and update pages, databases, comments, and workspace content that has been explicitly shared with the integration.
---

# Notion

Use this skill for live Notion API or MCP-backed Notion work.

For this repo, the default path should be an **internal integration** unless you are intentionally building a public multi-workspace app. When Cursor or Claude has a Notion MCP connector available, prefer that connector as the live agent surface and use direct REST calls only when MCP is unavailable or the task needs an endpoint the connector does not expose.

## Important mental model

Creating the integration and copying the integration secret is **not enough**.

For an internal integration, Notion access is granted by sharing specific pages or databases with the integration in the UI:

- open the page or database in Notion
- click the `...` menu in the top right
- choose `Add connections`
- select the integration

If the page or database is not shared, API requests will fail even if the integration secret is valid.

Also important:

- if an integration is added to a page, it can access that page and its children
- there is usually no single “connect my whole workspace at once” switch for an internal integration
- the practical pattern is to share the top-level pages or databases you want the integration to use

## When to use it

Use this skill when the user wants to:

- read or search Notion pages and databases
- create or update pages or blocks
- query database entries and schemas
- write comments
- automate internal workspace content

## Internal vs public integrations

- **Internal integration**: best for one workspace and internal tooling
- **Public integration**: use only if the integration must work across many unrelated Notion workspaces

For public integrations, users go through OAuth and can select pages during the auth flow. For internal integrations, page/database sharing is manual through `Add connections`.

## Capabilities

Set the minimum Notion capabilities the integration needs:

- `Read content` for exporting or reading content
- `Insert content` for creating pages or blocks
- `Update content` for updating existing content
- comment or user capabilities only if the workflow actually needs them

## Prerequisites

- a Notion integration created in the Notion integrations dashboard, or an approved Notion MCP connector
- the Notion integration secret stored locally in `NOTION_SECRET` or configured in the local/private MCP server settings
- the target pages or databases shared with the integration

For local setup, see `set-up/notion-api.md`.

## Preferred access order

1. Use an already-enabled Notion MCP connector in Cursor or Claude.
2. If the user has a Notion integration secret, set up the Notion MCP connector locally and verify it.
3. If MCP is unavailable, fall back to direct Notion REST API calls with `NOTION_SECRET`.
4. Ask a human only for actions the agent cannot do: creating the token when admin/owner permissions are required, approving the connector, or sharing target pages/databases through `Add connections`.

## MCP connector setup

### Cursor

In Cursor, add the Notion MCP connector from `Cursor Settings` -> `Tools & MCP`, or by creating/updating the private MCP config used by Cursor. Do not commit real tokens to the repo.

Use the official Notion MCP server with the integration secret in the request headers:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\":\"Bearer YOUR_NOTION_SECRET\",\"Notion-Version\":\"2026-03-11\"}"
      }
    }
  }
}
```

After setup, reload Cursor or toggle the MCP server, then confirm the Notion tools are available before starting the user task.

### Claude (Claude Code)

Claude has a hosted Notion connector. When it is already enabled, prefer it and skip local setup.

If the hosted connector is **not available** (no access token / not approved), set up the same local Notion MCP server yourself instead of asking the human to do it. Two ways:

1. CLI — add the server directly:

   ```bash
   claude mcp add notion -- npx -y @notionhq/notion-mcp-server
   ```

   then set the header env so the token stays out of tracked files:

   ```bash
   claude mcp add notion \
     --env OPENAPI_MCP_HEADERS='{"Authorization":"Bearer YOUR_NOTION_SECRET","Notion-Version":"2026-03-11"}' \
     -- npx -y @notionhq/notion-mcp-server
   ```

2. Project `.mcp.json` — reference `NOTION_SECRET` so no raw token is committed (Claude Code expands `${VAR}` from the environment):

   ```json
   {
     "mcpServers": {
       "notion": {
         "command": "npx",
         "args": ["-y", "@notionhq/notion-mcp-server"],
         "env": {
           "OPENAPI_MCP_HEADERS": "{\"Authorization\":\"Bearer ${NOTION_SECRET}\",\"Notion-Version\":\"2026-03-11\"}"
         }
       }
     }
   }
   ```

After adding the server, run `claude mcp list` (or reload) and confirm the Notion tools appear before starting the user task. The agent should complete this local setup itself whenever it has the token and file/settings access — only ask a human when the hosted connector needs approval, the integration token must be created, or target pages/databases need sharing via `Add connections`.

## Default workflow

1. Decide whether this should be an internal integration or a public integration.
2. For repo and team operations, default to an internal integration.
3. Check for an enabled Notion MCP connector and use it if available.
4. If the connector is missing and the token is available, configure the local MCP connector before falling back to REST.
5. Confirm `NOTION_SECRET` is set when using REST or when local verification needs the raw token.
6. Confirm the target page or database has been shared via `Add connections`.
7. Use the minimum required capabilities.
8. If a request fails, check page/database sharing before assuming the integration secret is wrong.

## Request pattern

Notion uses the integration secret in the `Authorization` header plus the `Notion-Version` header:

```bash
curl -fsS \
  -H "Authorization: Bearer ${NOTION_SECRET}" \
  -H "Notion-Version: 2026-03-11" \
  -H "Content-Type: application/json" \
  "https://api.notion.com/v1/users"
```

## Practical rules

- default to internal integrations for internal workspace automation
- prefer the Notion MCP connector for live agent work when it is available
- agents should complete local setup and verification themselves when they have the token and file/settings access
- ask a human only for token creation, connector approval, or Notion page/database sharing that requires workspace permissions
- do not assume a valid integration secret can access every page in the workspace
- share the specific root pages or databases you need, then rely on child access where appropriate
- request the minimum capabilities necessary
- keep `NOTION_SECRET` and MCP headers containing the token out of tracked files

## Handoff

- use `set-up/notion-api.md` when a user needs to create the integration, configure MCP, or share resources with it
- after a human publishes on arize.com, update the Agency tasks / content calendar via [`sync-content-calendar/SKILL.md`](sync-content-calendar/SKILL.md)
- if the user needs a public multi-workspace app, switch from internal integration auth to the OAuth flow described in Notion's authorization docs
