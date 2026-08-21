# Notion API Setup

Use this when an agent needs local access to Notion through the Notion MCP connector or direct Notion API.

For this repo, the default setup should be a **Notion internal integration** unless you explicitly need a public OAuth app.

## Agent setup rule

Agents should do every setup step they can perform locally: inspect existing MCP tools, create or update local/private MCP config, verify environment variables, and run smoke tests. Ask a human only for the parts that require Notion workspace permissions or approval:

- creating or approving the Notion integration token
- approving a hosted connector in Claude or Cursor
- sharing target Notion pages or databases with the integration through `Add connections`

Do not ask a human to copy commands or edit files when the agent can make the local change directly.

## 1. Create the integration

Create a new internal integration in the Notion integrations dashboard.

During setup:

- choose the correct workspace
- choose the minimum capabilities the integration needs
- copy the integration secret

Store the integration secret locally:

```bash
cp .env.example .env
```

Then add:

```bash
NOTION_SECRET=your_notion_integration_secret_here
```

## 2. Configure the Notion MCP connector

Prefer the Notion MCP connector for live agent work in Cursor or Claude. Keep real tokens in local/private settings or `.env`; never commit a token or MCP header containing a token.

In Cursor, open `Cursor Settings` -> `Tools & MCP` and add a Notion MCP server. If the agent has access to the local Cursor MCP config, it can create or update the config directly.

Use this server shape:

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

Replace `YOUR_NOTION_SECRET` with the local integration secret only in a private config. After saving, reload Cursor or toggle the MCP server, then confirm Notion tools are visible before doing Notion work.

### Claude (Claude Code)

Claude has a hosted Notion connector. If it is already enabled, use it and skip local setup.

If the hosted connector's access token is **not available** (not approved / no token), the agent should set up the local Notion MCP server itself rather than handing the work back to a human. Add it via the CLI:

```bash
claude mcp add notion \
  --env OPENAPI_MCP_HEADERS='{"Authorization":"Bearer YOUR_NOTION_SECRET","Notion-Version":"2026-03-11"}' \
  -- npx -y @notionhq/notion-mcp-server
```

Or add it to project `.mcp.json`, referencing `NOTION_SECRET` from the environment so no raw token is committed:

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

After adding, run `claude mcp list` (or reload) and confirm the Notion tools appear before starting Notion work. Only escalate to a human if the hosted connector needs approval, the integration token must be created, or pages/databases need sharing via `Add connections`.

## 3. Share pages or databases with the integration

This is the step most people miss.

Creating the integration secret is not enough. Before the integration can access a page or database, that resource must be explicitly shared with the integration in Notion.

For each top-level page or database you want the integration to use:

1. open it in Notion
2. click `...` in the top right
3. select `Add connections`
4. find the integration
5. add it

Important context:

- if you skip this step, API requests will fail even if `NOTION_SECRET` is valid
- if an integration is added to a page, it can access that page and its children
- there is generally not a single “connect everything in Notion at once” flow for an internal integration
- the practical workaround is to share the top-level pages or databases that contain the content you care about

## 4. Verify the integration secret

```bash
set -a
source .env
set +a

curl -fsS \
  -H "Authorization: Bearer ${NOTION_SECRET}" \
  -H "Notion-Version: 2026-03-11" \
  -H "Content-Type: application/json" \
  "https://api.notion.com/v1/users"
```

## 5. Verify page or database access

After sharing a page or database with the integration, use the appropriate endpoint against that resource ID.

If the integration secret works but page-level requests fail, the most likely issue is missing `Add connections` access rather than a bad secret.

## 6. If you need a public integration instead

Use a public integration only when the app must work across multiple unrelated Notion workspaces.

In that case:

- configure OAuth redirect URIs
- use the public integration authorization flow
- let users authorize and select pages during the Notion auth flow

## Notes for agents

- default to internal integrations for internal team automation
- prefer the MCP connector for interactive/live agent work
- treat `NOTION_SECRET` as the stored Notion integration secret
- do local MCP setup yourself when the token and config access are available
- ask a human only for token creation, hosted connector approval, or page/database sharing
- if access errors occur, check `Add connections` before rotating credentials
- use minimum capabilities to reduce installation friction

## Sources

- Authorization guide: https://developers.notion.com/guides/get-started/authorization
- Integration capabilities: https://developers.notion.com/reference/capabilities
- Build your first integration: https://developers.notion.com/docs/create-a-notion-integration
