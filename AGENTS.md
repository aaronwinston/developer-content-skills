# Developer content skills

Shared workspace of reusable agent skills for developer content: editorial review, CMS staging, SEO research, and production pipelines.

## Layout

- `skills/` — ForgeOS specialist skills (editorial, foundation, quality, specialization)
- `playbooks/`, `briefs/`, `rubrics/`, `prompts/`, `core/`, `context/` — editorial OS that those skills read
- `.agents/skills/` — production skills (CMS, SEO APIs, social drafts, calendar)
- `.agents/agents/content/` — multi-step pipelines (`AGENT.md` plus numbered steps)
- `references/content/` — example voice, formatting, and pre-publish checklist

Discovery is the filesystem. Do not maintain a second catalog in this file. See [CATALOG.md](CATALOG.md).

## Rules

- Skills are reusable instructions. Pipelines live under `.agents/agents/` and combine skills.
- Frontmatter on every `SKILL.md`: exactly `name` and `description`, with a `Use when ...` clause.
- Default CMS end state is `draft`. Do not publish unless the user explicitly asks.
- Read credentials from `.env`. Never commit secrets.
- Put scratch output in a local `tmp/` next to the owning skill or agent. Do not commit `tmp/`.

Writing conventions for new skills: `.agents/skills/operational/skill-authoring/SKILL.md` and `.agents/skills/AGENTS.md`.
