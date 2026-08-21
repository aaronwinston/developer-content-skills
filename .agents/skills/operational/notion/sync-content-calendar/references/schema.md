# Agency tasks / content calendar — Notion schema

Run once after `NOTION_SECRET` is set and the database is shared with the integration:

```bash
python3 .agents/skills/operational/notion/sync-content-calendar/scripts/sync_from_wordpress.py \
  --discover-schema
```

Paste the resolved mapping below and pin values in `config/content-calendar.json` when stable.

## Database

- **Name:** Your content calendar database
- **ID:** Set `database_id` in `config/content-calendar.json`
- **URL:** Set `notion_url` in `config/content-calendar.json`

## Resolved property map

| Role | Property name | Notes |
|------|---------------|--------|
| Title (match key) | *(page title)* | Matched to WordPress `title.rendered` |
| Status | `Status` | Set to published value on sync |
| Live URL | *TBD — run discover-schema* | WordPress `link` |
| Published status value | *TBD — run discover-schema* | e.g. `Published` |

## All properties

*Pending first `--discover-schema` run.*
