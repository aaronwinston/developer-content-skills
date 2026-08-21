---
name: notion-sync-content-calendar
description: >-
  On-demand: scan WordPress for items published in the last 30 days, match them to
  the Agency tasks / content calendar in Notion, and offer to mark matching rows
  Published with the live URL. Human confirms before any Notion write. Use when
  someone says "sync content calendar", "update Notion from WordPress", or asks
  which recent publishes still need a calendar update.
---

# Notion — sync content calendar from WordPress

**On-demand only.** Run when someone asks — there is no schedule, webhook, or background job.

WordPress is the source of truth for what went live. This skill scans the configured site for content **published in the last 30 days**, finds matching rows in the Notion content calendar (see `config/content-calendar.json`), and **offers** to update Notion. It does not write until a human confirms.

Humans publish in WordPress admin. This skill only updates Notion calendar rows (Status + live URL).

## What happens on each run

1. **Scan WordPress** — all configured post types with `status=publish` and publish date within the last **30 days**.
2. **Load Notion calendar** — every row in the Agency tasks database.
3. **Match by title** — normalized fuzzy match (threshold 0.88).
4. **Classify each WordPress item:**
   - **ready** — Notion row matched, Status and/or URL not yet correct → **offer to update**
   - **already_synced** — Status and URL already match → skip (not offered)
   - **no_match** — live on WP, no calendar row → report only
   - **ambiguous** — multiple close title matches → human must pick before any write
5. **Present the offer** — list **ready** items only; do not patch Notion yet.
6. **Apply** — only after explicit human confirmation, patch confirmed rows.

## Target database

| Field | Value |
|-------|--------|
| Name | Your content calendar database |
| URL | Set `notion_url` in `config/content-calendar.json` |
| Database ID | Set `database_id` in `config/content-calendar.json` |
| Status property | `Status` |
| URL property | Auto-detected (prefers **Post URL**, **Final URL**, **Live URL**, then any `url` field) |
| Published status value | Auto-detected (prefers **Published**, then **Live**) |

## Prerequisites

- **Notion MCP (this workspace)** — project config at [`.cursor/mcp.json`](../../../../../.cursor/mcp.json) points at Notion’s hosted OAuth MCP (`https://mcp.notion.com/mcp`). Open this repo in Cursor → **Settings → Tools & MCP** → connect **notion** → complete OAuth. Scoped to this workspace only (not global `~/.cursor/mcp.json`). See [`../set-up/notion-api.md`](../set-up/notion-api.md).
- Or `NOTION_SECRET` in `.env` for the headless sync script (requires workspace admin to create an integration)
- Agency tasks database shared with the integration
- `WORDPRESS_*` credentials — [`../../wordpress/set-up/wordpress-api.md`](../../wordpress/set-up/wordpress-api.md)

## Preferred access order

1. **Agent + Notion MCP** — interactive review and confirmed patches.
2. **Sync script** — same logic (`python3 .../sync_from_wordpress.py` with no args).

## Agent workflow

Run only when the user asks (e.g. "sync content calendar").

### 1. Scan WordPress (last 30 days)

Use [`wordpress`](../../wordpress/SKILL.md) REST or the sync script:

```bash
python3 .agents/skills/operational/notion/sync-content-calendar/scripts/sync_from_wordpress.py --json
```

Post types: `posts`, `glossary`, `guide`, `content`, `customer_story`, `research_hub_item` — see [`config/content-calendar.json`](config/content-calendar.json).

Override window: `--days 14` (default is **30** from config).

### 2. Load Notion calendar

**MCP:** `retrieve-a-database` → `query-data-source` (paginate all rows).

### 3. Match and classify

Same logic as the script. Only **ready** items belong in the offer.

### 4. Offer to the human

If `ready` is empty, say so and optionally summarize **already_synced**, **no_match**, and **ambiguous**.

**Every item in the offer and in every summary section must include both direct links:**

| Field | Source |
|-------|--------|
| **WordPress** | Public live URL from WordPress REST `link` (e.g. `https://arize.com/blog/...`). Omit only if the item is not publicly published. |
| **Notion** | Direct page URL for the calendar row (e.g. `https://app.notion.com/p/3776abf4ec3c80238c5ff199ce2627ca`). Required whenever a row is matched or listed as a candidate. |

Present **ready** items as a table with at minimum:

| # | Title | Change | WordPress | Notion |
|---|-------|--------|-----------|--------|

- **Change** — current Notion status → proposed status; current Post URL → proposed Post URL (when relevant).
- **WordPress** — full public URL, markdown-linked.
- **Notion** — full page URL, markdown-linked.

Apply the same link columns for **already_synced**, **no_match** (WordPress only; add Notion links for close title candidates), and **ambiguous** (WordPress + each candidate Notion link).

Ask: *"Update these N calendar rows in Notion? (yes / pick items / skip)"*

**Never patch Notion without explicit confirmation.**

### 5. Apply confirmed updates

After confirmation:

```bash
python3 .agents/skills/operational/notion/sync-content-calendar/scripts/sync_from_wordpress.py \
  --apply-ready --live
```

Or **MCP:** `API-patch-page` per confirmed row with resolved property names:

```json
{
  "properties": {
    "Status": { "status": { "name": "Published" } },
    "Post URL": { "url": "https://arize.com/blog/..." }
  }
}
```

Use the same `--days` window for `--apply-ready` as the review that produced the offer.

### Single-URL shortcut

If the user pastes one live URL, run match → offer → confirm → patch for that item only:

```bash
python3 .../sync_from_wordpress.py --url "https://arize.com/blog/..."
```

## Script commands

```bash
# Default: 30-day review + offer (dry run — no Notion writes)
python3 .agents/skills/operational/notion/sync-content-calendar/scripts/sync_from_wordpress.py

# JSON for agents
python3 .../sync_from_wordpress.py --json

# After human confirms
python3 .../sync_from_wordpress.py --apply-ready --live

# Shorter window
python3 .../sync_from_wordpress.py --days 14

# Schema discovery (once)
python3 .../sync_from_wordpress.py --discover-schema
```

## How matching works

No stored join key. Both MCP agents and the script:

1. Normalize titles (HTML entities, punctuation, case).
2. Fuzzy match at **0.88**; exact match wins.
3. Flag **ambiguous** when top two scores are within **0.05**.
4. Skip **already_synced** when Notion Status is Published and URL matches WordPress `link`.

## Constraints

- **On-demand only** — no scheduled or automatic runs in this skill.
- **Offer first, write second** — always confirm with the human.
- Only updates existing Notion rows; does not create calendar tasks.
- Does not publish or change WordPress.
- Default is dry-run; `--live` required for writes.

## Handoff

| Need | Skill |
|------|-------|
| Stage WordPress drafts | [`../../wordpress/SKILL.md`](../../wordpress/SKILL.md) |
| Content routing | [`../../content-staging/SKILL.md`](../../content-staging/SKILL.md) |
| Create Review row for a new draft Doc | [`scripts/create_draft_review_row.py`](scripts/create_draft_review_row.py) — step 07 of [aparna-x-to-wordpress](../../../../agents/content/aparna-x-to-wordpress/07-deliver/SKILL.md) |
| Notion MCP setup | [`../SKILL.md`](../SKILL.md) |
