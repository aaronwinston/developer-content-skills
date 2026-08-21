# Developer content agent skills

A shareable pack of **agent skills** for a head of developer content: editorial judgment, CMS staging, SEO research, longform pipelines, and developer-native distribution.

Two sources, one repo:

| Tree | What it is | Original home |
|---|---|---|
| `skills/`, `playbooks/`, `core/`, `briefs/`, `rubrics/`, `prompts/`, `context/` | Editorial operating system: specialist writers, reviewers, and sequenced playbooks | [ForgeOS](https://github.com/aaronwinston/forgeos) (already public, MIT) |
| `.agents/skills/`, `.agents/agents/content/` | Production skills and multi-step pipelines: WordPress drafts, SEO APIs, video→article, glossary, competitive, refresh | Extracted from a private marketing-agents repo and stripped of credentials, corpora, and warehouse queries |

Credentials, content corpora, BigQuery analytics, CRM/sales skills, and company strategy maps are **not** in this pack. Remaining product names in examples are worked examples — swap them. See [ADAPTING.md](ADAPTING.md).

## Start here (head of developer content)

If you only load a handful of files before a conversation, load these:

1. [`core/DEVELOPER_FLUENCY.md`](core/DEVELOPER_FLUENCY.md) — what “sounds like a developer wrote it” actually means
2. [`context/01_philosophy/developer-marketing-manifesto.md`](context/01_philosophy/developer-marketing-manifesto.md) — workflows, not features
3. [`skills/foundation/dev-copywriter/SKILL.md`](skills/foundation/dev-copywriter/SKILL.md) + [`skills/foundation/dev-reviewer/SKILL.md`](skills/foundation/dev-reviewer/SKILL.md)
4. [`.agents/skills/operational/wordpress/SKILL.md`](.agents/skills/operational/wordpress/SKILL.md) — CMS contract: **agents stage drafts, humans publish**
5. [`skills/specialization/technical-fact-checker/SKILL.md`](skills/specialization/technical-fact-checker/SKILL.md) + [`skills/quality/claims-risk-reviewer/SKILL.md`](skills/quality/claims-risk-reviewer/SKILL.md)
6. [`.agents/agents/content/video-article-pipeline/AGENT.md`](.agents/agents/content/video-article-pipeline/AGENT.md) — talk or demo → article
7. [`playbooks/blog-production.md`](playbooks/blog-production.md) + [`playbooks/technical-guide.md`](playbooks/technical-guide.md)
8. [`skills/specialization/editorial-review-agents/DEVREL-QUICK-START.md`](skills/specialization/editorial-review-agents/DEVREL-QUICK-START.md) — technical / voice / SEO review chain

Full inventory: [CATALOG.md](CATALOG.md).

## How to use this repo

Clone it and open it in Cursor, Claude Code, or any agent runtime that discovers `SKILL.md` files.

- **ForgeOS-shaped runtimes** read `skills/`, `playbooks/`, `core/`, and `context/` at the repo root.
- **Cursor / Claude-style runtimes** discover `.agents/skills/**/SKILL.md` and follow `.agents/agents/**/AGENT.md` pipelines.
- Copy individual skill folders into your own repo if you do not want the whole pack.

Do not put API keys in git. Copy [`.env.example`](.env.example) to `.env` and fill only what you need.

Default CMS rule, inherited from the WordPress skill: **stage as `draft`. Never publish unless a human explicitly asks.**

## What this is not

This is not a dump of a company’s marketing org. Excluded on purpose:

- Salesforce, Gong, HubSpot MQL, ads pipeline, and other GTM/CRM skills
- Warehouse-bound analytics (Search Console, LinkedIn, YouTube, content-performance SQL bound to one BigQuery project)
- Founder-specific social→blog pipelines and team-page CMS tools
- Content corpora, brand lexicons, and unpublished strategy maps
- GitHub-internal frameworks and product messaging docs

The full ForgeOS cockpit (Next.js app, scrapers, pipelines UI) stays in [aaronwinston/forgeos](https://github.com/aaronwinston/forgeos). This pack is the markdown brain: skills, playbooks, and production procedures.

## Provenance

See [NOTICE.md](NOTICE.md). ForgeOS files keep the upstream MIT license. Production skills were generalized so they can run against *your* CMS, calendar, and keyword tools.
