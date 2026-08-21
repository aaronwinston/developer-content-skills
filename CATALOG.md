# Catalog

Skills a head of developer content can actually run. Paths are relative to this repo root.

## Editorial operating system (ForgeOS)

These are the specialists. Playbooks in `playbooks/` sequence them.

### Foundation (write and research)

| Skill | Path | Use for |
|---|---|---|
| `dev-copywriter` | `skills/foundation/dev-copywriter/SKILL.md` | Developer blogs, explainers, product education |
| `dev-reviewer` | `skills/foundation/dev-reviewer/SKILL.md` | Fluency, specificity, anti-hype |
| `ai-researcher` | `skills/foundation/ai-researcher/SKILL.md` | Sources, competitor narrative, pain points |
| `founder-x-recap` | `skills/foundation/founder-x-recap/SKILL.md` | Exec/social recap → content opportunities |

### Editorial desk

| Skill | Path | Use for |
|---|---|---|
| `editorial-director` | `skills/editorial/editorial-director/SKILL.md` | Angle, audience, narrative before draft |
| `managing-editor` | `skills/editorial/managing-editor/SKILL.md` | Production plan, owners, review path |
| `copy-chief` | `skills/editorial/copy-chief/SKILL.md` | Line edit, voice, polish |
| `content-ops-manager` | `skills/editorial/content-ops-manager/SKILL.md` | Calendar, intake, handoffs |

### Quality gates

| Skill | Path | Use for |
|---|---|---|
| `technical-fact-checker` | `skills/specialization/technical-fact-checker/SKILL.md` | Product, architecture, benchmark claims |
| `claims-risk-reviewer` | `skills/quality/claims-risk-reviewer/SKILL.md` | Unsupported, competitive, customer claims |
| `narrative-consistency-reviewer` | `skills/quality/narrative-consistency-reviewer/SKILL.md` | Voice and messaging alignment |
| `final-publish-reviewer` | `skills/quality/final-publish-reviewer/SKILL.md` | Last pass: metadata, links, CTA |
| `dev-campaign-reviewer` | `skills/quality/dev-campaign-reviewer/SKILL.md` | Ads, LPs, launch/video scripts |

DevRel three-gate review (technical / voice / SEO): `skills/specialization/editorial-review-agents/`.

### Specialists

| Skill | Path | Use for |
|---|---|---|
| `seo-strategist` | `skills/specialization/seo-strategist/SKILL.md` | Discoverability without dumbing it down |
| `social-editor` | `skills/specialization/social-editor/SKILL.md` | LinkedIn, X, exec, company social from a source asset |
| `content-repurposer` | `skills/specialization/content-repurposer/SKILL.md` | One source → channel derivatives |
| `launch-comms-writer` | `skills/specialization/launch-comms-writer/SKILL.md` | Product, feature, integration, partner launches |
| `workflow-extractor` | `skills/specialization/workflow-extractor/SKILL.md` | Features/docs → concrete developer workflows |
| `dev-ad-writer` | `skills/specialization/dev-ad-writer/SKILL.md` | Developer-facing ads for CLI, IDE, API, infra |
| `customer-story-producer` | `skills/specialization/customer-story-producer/SKILL.md` | Case-study potential, interview guides |
| `competitive-intelligence` | `skills/specialization/competitive-intelligence/SKILL.md` | Differentiation during production, not only at the end |
| `pmm-lead` | `skills/specialization/pmm-lead/SKILL.md` | Positioning and feature-to-benefit before drafting |
| `lifecycle-email-writer` | `skills/specialization/lifecycle-email-writer/SKILL.md` | Onboarding, nurture, launch email |
| `executive-comms-writer` | `skills/specialization/executive-comms-writer/SKILL.md` | Technical exec communications |
| `x-to-wordpress-scraper` | `skills/specialization/x-to-wordpress-scraper/SKILL.md` | X/Twitter → WordPress-ready files |
| `analyst-relations-writer` | `skills/specialization/analyst-relations-writer/SKILL.md` | Optional; briefings and AR narrative |

### Playbooks

`playbooks/blog-production.md`, `technical-guide.md`, `product-launch.md`, `social-distribution.md`, `thought-leadership.md`, `case-study.md`, `newsletter.md`, `campaign.md`, `dev-campaign-system.playbook.md`, `founder-social.md`, `analyst-response.md`.

Matching brief templates live in `briefs/`. Rubrics live in `rubrics/` (`developer-fluency.md`, `editorial-quality.md`, `seo-quality.md`, `developer-campaign-quality-rubric.md`, …).

## CMS and publishing

The WordPress skill is the reference implementation of a safe CMS connector.

| Skill | Path | Use for |
|---|---|---|
| `wordpress` | `.agents/skills/operational/wordpress/SKILL.md` | REST create/update of **drafts**, media, taxonomies |
| `glossary-builder` | `.agents/skills/operational/wordpress/glossary/glossary-builder/SKILL.md` | Glossary CPT drafts + ACF settings |
| `index-page-builder` | `.agents/skills/operational/wordpress/glossary/index-page-builder/SKILL.md` | Alphabetized glossary index page |
| `content-staging` | `.agents/skills/operational/content-staging/SKILL.md` | Router: URL / topic / video / markdown → the right pipeline |
| `kinsta` | `.agents/skills/operational/kinsta/SKILL.md` | Hosted WordPress ops (cache, env, backups) if you use Kinsta |
| `notion` | `.agents/skills/operational/notion/SKILL.md` | Read/update Notion that the integration can see |
| `notion-sync-content-calendar` | `.agents/skills/operational/notion/sync-content-calendar/SKILL.md` | Match recent CMS publishes to calendar rows (human confirms writes) |

## Drafting

| Skill | Path | Use for |
|---|---|---|
| `write-blog` | `.agents/skills/content/write-blog/SKILL.md` | Two-phase longform: find the thread, then draft |
| `write-in-voice` | `.agents/skills/content/write-in-voice/SKILL.md` | Practitioner LinkedIn / X / blog format craft and anti-sales-pattern rules |
| `edit-gdoc` | `.agents/skills/content/edit-gdoc/SKILL.md` | Paragraph-index edits on an existing Google Doc |
| `local-excalidraw` | `.agents/skills/design/local-excalidraw/SKILL.md` | Local `.excalidraw` JSON from a post or outline (no API) |

## SEO and content strategy

| Skill | Path | Use for |
|---|---|---|
| `semrush` | `.agents/skills/content/semrush/SKILL.md` | Live Semrush API (keyword, domain, backlink) |
| `semrush-keyword-overview` | `.agents/skills/content/semrush/keyword-overview/SKILL.md` | Volume, CPC, difficulty; unit-consuming calls need approval |
| `serp-api` | `.agents/skills/content/serp-api/SKILL.md` | Fetch current Google SERP |
| `serp-analysis` | `.agents/skills/content/serp-api/serp-analysis/SKILL.md` | Intent, page-type, gaps from saved SERP |
| `keywords-to-content` | `.agents/skills/content/keywords-to-content/SKILL.md` | Brief → title set, sections, metadata |
| `refresh-and-decay` | `.agents/skills/content/refresh-and-decay/SKILL.md` | Ranking/query drift → focused update plan |
| `internal-backlinking` | `.agents/skills/content/internal-backlinking/SKILL.md` | Link recommendations from real site inventory (CMS + optional docs repos) |
| `external-backlinks` | `.agents/skills/content/external-backlinks/SKILL.md` | Legitimate docs PRs that cite your pages |

## Production pipelines

Each pipeline is an `AGENT.md` plus numbered step skills. Run the agent end-to-end; do not interleave CMS writes inside a draft step.

| Pipeline | Path | Output |
|---|---|---|
| Video → article | `.agents/agents/content/video-article-pipeline/AGENT.md` | Transcript + style-checked Markdown + Google Doc |
| Glossary term | `.agents/agents/content/glossary-term/AGENT.md` | Researched term → WordPress glossary draft |
| Existing-page update | `.agents/agents/content/update-agent/AGENT.md` | Google Doc with changes; CMS PATCH only on explicit ask |
| Buyer’s guide | `.agents/agents/content/buyers-guide/AGENT.md` | Longform Markdown + Doc handoff |
| Competitive / alternatives | `.agents/agents/content/competitive/AGENT.md` | Alternatives article from a live matrix row |

Shared delivery: `.agents/skills/content/markdown-to-google-doc/SKILL.md` (create), `.agents/skills/content/edit-gdoc/SKILL.md` (edit), `.agents/skills/operational/google-workspace/SKILL.md`.

## Social and distribution

| Skill | Path | Use for |
|---|---|---|
| `write-in-voice` | `.agents/skills/content/write-in-voice/SKILL.md` | Practitioner social and longform (not brand-account promo) |
| `write-social-post` | `.agents/skills/content/write-social-post/SKILL.md` | Corporate X/LinkedIn from a URL, launch, or event |
| `typefully-draft-with-utm` | `.agents/skills/operational/typefully/draft-with-utm/SKILL.md` | Typefully draft with a tracking link |
| `generate-utm-link` | `.agents/skills/operational/generate-utm-link/SKILL.md` | Canonical UTM taxonomy (treat the included map as an example) |
| `youtube-transcription` | `.agents/skills/content/youtube-transcription/SKILL.md` | Local yt-dlp + Whisper when captions APIs fail |
| `slide-maker-with-ai` | `.agents/skills/design/slide-maker-with-ai/SKILL.md` | Outline → grill-me → Claude Design or Beamer |
| `local-excalidraw` | `.agents/skills/design/local-excalidraw/SKILL.md` | Diagram a concept as local Excalidraw JSON |
| `hubspot-dead-links` | `.agents/skills/operational/hubspot/dead-links/SKILL.md` | Audit automated email links (report-only by default) |

## Authoring more skills

| Skill | Path | Use for |
|---|---|---|
| `skill-authoring` | `.agents/skills/operational/skill-authoring/SKILL.md` | How to write, split, and discover skills |
| Review rules | `.agents/skills/AGENTS.md` | Frontmatter, progressive disclosure, write-safety |

Example editorial references (replace product names): `references/content/voice-and-tone.md`, `formatting.md`, `evaluation.md`.
