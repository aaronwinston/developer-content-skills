# Adapting these skills

Production skills still mention example hostnames, product names, and category language from the environment they were written in. Treat those as worked examples.

## Minimum swaps

1. **CMS origin** — set `WORDPRESS_BASE_URL` (or your CMS base) in `.env`. Do not keep a copied production URL.
2. **Credentials** — WordPress application password, Semrush, SerpApi, Notion, Google OAuth, Typefully, Kinsta. Never commit `.env`.
3. **Calendar** — put your Notion database ID in `.agents/skills/operational/notion/sync-content-calendar/config/content-calendar.json`.
4. **Competitive matrix** — set `GOOGLE_SHEETS_COMPETITIVE_MATRIX_SPREADSHEET_ID` (no default spreadsheet is shipped).
5. **Glossary index** — pass your WordPress page ID into `index-page-builder`. There is no shipped default page ID.
6. **Voice** — replace `references/content/voice-and-tone.md` and `core/VOICE.md` / `core/BRAND_VOICE.md` with yours. Keep `core/DEVELOPER_FLUENCY.md` unless your readers are not developers. `write-in-voice` is format craft; put named-exec rules in `references/content/write-in-voice.md`.
7. **Crosslinks** — pipeline `crosslinks.txt` files are empty templates. Fill them with your IA, not a copied sitemap.
8. **Diagram palette** — hex values in `local-excalidraw` are a default role map. Swap them for brand colors; keep the roles.

## Discovery layouts

Keep both trees unless you are sure of the runtime:

- ForgeOS-style: `skills/**/SKILL.md` at repo root
- Cursor/Claude-style: `.agents/skills/**/SKILL.md`

If you copy a skill into another repo, copy its `scripts/`, `set-up/`, and `references/` siblings too. Relative links inside `SKILL.md` assume that layout.

## Write safety

Live CMS, calendar, and social-draft writes still require a human confirmation in the owning skill. Do not add auto-publish. The WordPress skill’s rule is the pack default: agents stage drafts; humans publish.
