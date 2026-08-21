---
name: google-workspace
description: >-
  Google Drive, Docs, and Sheets OAuth setup and helper scripts for repo agents.
  Use when a workflow needs Google Workspace credentials, Drive/Docs/Sheets API
  access, or token import/setup for content handoffs.
---

# Google Workspace

Operational ownership for Google Drive, Docs, and Sheets access used by content
and reporting workflows.

## Prerequisites

- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REFRESH_TOKEN`

Set these in repo-root `.env` or provide a gitignored unified token file at
`.agents/agents/content/update-agent/.credentials/token_unified.json`.

## OAuth Setup

From the repo root:

```bash
GOOGLE_OAUTH_CLIENT_ID='123456789-xxxx.apps.googleusercontent.com' \
GOOGLE_OAUTH_CLIENT_SECRET='GOCSPX-xxxx' \
node .agents/skills/operational/google-workspace/scripts/google-drive-oauth-setup.mjs
```

To import an existing Python pickle:

```bash
node .agents/skills/operational/google-workspace/scripts/google-drive-oauth-setup.mjs \
  --from-pickle /path/to/token.pickle
```

## Helper Scripts

Scripts under `scripts/` are imported by owning content skills and agents. They
must stay generic to Google Workspace auth/API access and must not contain
content-agent-specific logic.

## Handoff

| Need | Skill / Agent |
|------|---------------|
| Markdown to Google Doc handoff | [`../../content/markdown-to-google-doc/SKILL.md`](../../content/markdown-to-google-doc/SKILL.md) |
| WordPress content operations | [`../wordpress/SKILL.md`](../wordpress/SKILL.md) |
| Content update handoff credentials | [`../../../agents/content/update-agent/.credentials/README.md`](../../../agents/content/update-agent/.credentials/README.md) |
