# Developer content agent skills

A pack of agent skills for someone who runs **developer content**: blog development, technical explainers, launch narratives, talk-to-article work, and the review bar that keeps all of it credible with engineers.

Clone it, open it in Cursor or Claude Code or Copilot app, and point an agent at a `SKILL.md`. Copy any folder into your own repo if you only want one capability.

Swap brand, CMS, and credentials for GitHub’s. Example product names in some files are leftovers from the environments these skills were written in — see [ADAPTING.md](ADAPTING.md).

Full inventory: [CATALOG.md](CATALOG.md).

## If you only load a few files

1. [`core/DEVELOPER_FLUENCY.md`](core/DEVELOPER_FLUENCY.md) — what “a developer wrote this” actually means
2. [`context/01_philosophy/developer-marketing-manifesto.md`](context/01_philosophy/developer-marketing-manifesto.md) — developers adopt workflows, not features
3. [`.agents/skills/content/write-blog/SKILL.md`](.agents/skills/content/write-blog/SKILL.md) — find the thread with the writer, then draft
4. [`.agents/skills/content/write-in-voice/SKILL.md`](.agents/skills/content/write-in-voice/SKILL.md) — LinkedIn / X / blog craft and anti-pitch-deck rules
5. [`skills/foundation/dev-copywriter/SKILL.md`](skills/foundation/dev-copywriter/SKILL.md) + [`skills/foundation/dev-reviewer/SKILL.md`](skills/foundation/dev-reviewer/SKILL.md)
6. [`skills/specialization/editorial-review-agents/DEVREL-QUICK-START.md`](skills/specialization/editorial-review-agents/DEVREL-QUICK-START.md) — technical / voice / SEO review before publish

## Mapped to developer content work

| You need | Start here |
|---|---|
| A blog post from a messy outline or SME dump | [`write-blog`](.agents/skills/content/write-blog/SKILL.md) — Phase 1 asks questions until there is one thread; Phase 2 drafts only after you approve it |
| Social that sounds like a practitioner, not a brand account | [`write-in-voice`](.agents/skills/content/write-in-voice/SKILL.md) |
| A diagram in the post (architecture, workflow, before/after) | [`local-excalidraw`](.agents/skills/design/local-excalidraw/SKILL.md) — writes a `.excalidraw` file locally, no API |
| Redlines in an existing Google Doc | [`edit-gdoc`](.agents/skills/content/edit-gdoc/SKILL.md) — pull paragraphs, replace by index |
| New Doc from Markdown | [`markdown-to-google-doc`](.agents/skills/content/markdown-to-google-doc/SKILL.md) |
| Universe / meetup / demo → article | [`video-article-pipeline`](.agents/agents/content/video-article-pipeline/AGENT.md) |
| Launch copy (product, feature, integration) | [`launch-comms-writer`](skills/specialization/launch-comms-writer/SKILL.md) + [`playbooks/product-launch.md`](playbooks/product-launch.md) |
| Turn a feature into a developer workflow story | [`workflow-extractor`](skills/specialization/workflow-extractor/SKILL.md) |
| Glossary / conceptual SEO page | [`glossary-term`](.agents/agents/content/glossary-term/AGENT.md) |
| Refresh a URL that’s decaying in search | [`refresh-and-decay`](.agents/skills/content/refresh-and-decay/SKILL.md) + [`update-agent`](.agents/agents/content/update-agent/AGENT.md) |
| Internal links from real site or docs inventory | [`internal-backlinking`](.agents/skills/content/internal-backlinking/SKILL.md) |
| Keyword → brief → outline | [`keywords-to-content`](.agents/skills/content/keywords-to-content/SKILL.md), [`semrush`](.agents/skills/content/semrush/SKILL.md), [`serp-analysis`](.agents/skills/content/serp-api/serp-analysis/SKILL.md) |
| One asset → many channels | [`content-repurposer`](skills/specialization/content-repurposer/SKILL.md) + [`social-editor`](skills/specialization/social-editor/SKILL.md) |
| Stage a CMS draft (humans still publish) | [`wordpress`](.agents/skills/operational/wordpress/SKILL.md) — portable REST pattern even if GitHub Blog is not WordPress |

## Drafting loop

This is the path most blog work should take:

1. **Thread** — `write-blog` Phase 1. One sentence the reader walks away believing. Do not draft yet.
2. **Draft** — `write-blog` Phase 2, under `write-in-voice` rules (no credibility flexes, no tagline closers, first sentence earns the read).
3. **Figure** — `local-excalidraw` if the argument needs a picture.
4. **Review** — `dev-reviewer`, `technical-fact-checker`, then the DevRel three-gate review.
5. **Handoff** — `markdown-to-google-doc` to create a Doc, `edit-gdoc` for later paragraph fixes, CMS skill only when you want a **draft**.

Agents stage. Humans publish.

## Editorial operating system

`skills/`, `playbooks/`, `core/`, `briefs/`, and `rubrics/` are a specialist desk: editorial director, managing editor, copy chief, SEO strategist, claims reviewer, launch writer. [`playbooks/blog-production.md`](playbooks/blog-production.md) and [`playbooks/technical-guide.md`](playbooks/technical-guide.md) sequence them.

ForgeOS-shaped runtimes read that tree at the repo root. Cursor / Claude-style runtimes also discover `.agents/skills/**/SKILL.md` and `.agents/agents/**/AGENT.md`.

## How to run it

```bash
git clone https://github.com/aaronwinston/developer-content-skills.git
cp .env.example .env   # fill only what you need; never commit it
```

Default CMS end state is `draft`. Do not add auto-publish.

## Provenance

Skills come from three places and were stripped for sharing: [ForgeOS](https://github.com/aaronwinston/forgeos) (editorial OS, already public), production CMS/SEO pipelines, and content-automation drafting skills. Credentials, corpora, warehouse analytics, and CRM tools are not in this repo. Details: [NOTICE.md](NOTICE.md).
