---
name: internal-backlinking
description: Use this skill when a target page, draft, brief, or published URL already exists and the user wants internal-link recommendations grounded in real site inventory. Use WordPress for CMS pages, optional local repos for docs or repo-managed content, and optional GSC evidence to strengthen the recommendations.
---

# Internal Backlinking

Use this skill for internal linking strategy around a target page.

This is the “internal linking agent” in the content workflow.

## Why this skill exists

SEO is not only about the quality of one page. A page performs better when search engines can see that it belongs inside a coherent topical cluster.

This skill exists to help agents and humans:

- find relevant existing pages on the live site
- recommend links from the target page out to older pages
- recommend links from older relevant pages back into the target page
- reinforce topical relationships instead of treating every article as a standalone asset

## System connections

This skill should prefer real site inventory over guessed page lists.

Default connection model:

- **WordPress** is the source of truth for blog and CMS-managed pages.
- **Local repos** can be used for docs or other repo-managed content surfaces.
- **Sitemaps** help confirm which URLs are live and canonical.
- **Google Search Console / BigQuery** is optional but useful when link recommendations should be prioritized by search evidence instead of topic similarity alone.

This skill should not edit WordPress or repo files by default. It should analyze first and hand off execution to the relevant content-management skill when requested.

## Site assumptions

The stable public surfaces for this repo are:

- main site: `https://arize.com/`
- AX docs: `https://arize.com/docs/ax`
- PX docs: `https://arize.com/docs/px`
- Phoenix docs: `https://arize.com/docs/phoenix`

Treat those as the default live destinations unless the user explicitly says otherwise.

## Default environment variables

Internal backlinking uses existing WordPress credentials plus optional local content roots from `.env`.

```bash
# Uses the WordPress credentials defined elsewhere in .env
WORDPRESS_BASE_URL=https://arize.com
WORDPRESS_USERNAME=
WORDPRESS_APPLICATION_PASSWORD=""

# Optional repo paths for docs or repo-managed content
BACKLINKING_ARIZE_MAIN_REPO_PATH=/Users/datngo/PycharmProjects/arize
BACKLINKING_PX_DOCS_REPO_PATH=
BACKLINKING_AX_DOCS_REPO_PATH=

# Optional extra local content roots, comma-separated absolute paths
BACKLINKING_EXTRA_CONTENT_ROOTS=
```

Only fill in the sources you actually use. The skill should degrade gracefully when some sources are missing.

## Use this skill for

- internal-link recommendations for a new article or landing page
- identifying older pages that should link into a new target page
- finding cluster relationships across related topics
- spotting missing internal-link support for an important page
- linking blog content to docs when that relationship is real and useful
- linking docs pages to supporting blog or product pages when appropriate

## Inventory sources

Build the page inventory in this priority order:

1. **Target page itself**
   - published URL
   - draft
   - brief
   - outline
2. **WordPress inventory**
   - posts
   - pages
   - categories
   - tags
   - current URLs
3. **Repo-managed content**
   - docs or markdown content from configured local repos
4. **Live URL verification**
   - use the known Arize site and docs surfaces
   - confirm URLs via sitemap or live fetch when needed
   - prefer canonical live URLs over guessed file-path mappings
5. **Optional search evidence**
   - query overlap
   - page impressions
   - decaying pages that may benefit from stronger internal support

If the site inventory is incomplete, say so clearly instead of pretending the recommendations are comprehensive.

## Default workflow

1. Confirm the target page exists as a brief, outline, draft, or published URL.
2. Identify the core topic, supporting topics, audience, and target intent.
3. Build a real page inventory from the connected systems:
   - WordPress for CMS content
   - configured repo paths for docs or repo-managed pages
4. Map local content to likely live URLs using the known Arize site structure, then verify when needed.
5. Find related pages by topic, product area, use case, and search intent.
6. Recommend two link directions:
   - links the target page should include
   - existing pages that should add links into the target page
7. Explain briefly why each proposed link matters.
8. Flag which recommendations are high-confidence versus which depend on incomplete inventory or missing live verification.

## Ranking logic

Prefer candidates that have:

- strong topical overlap
- matching user intent
- clear product or use-case adjacency
- natural anchor opportunities in context
- live confirmed URLs
- optional search evidence that the pages compete for adjacent or complementary queries

Prefer lower confidence on candidates that rely only on title similarity or guessed URL mapping.

## Output format

Include:

- target page
- target topic
- inventory sources used
- suggested outbound internal links
- suggested inbound linking candidates
- suggested anchor-text direction
- cluster rationale
- confidence notes
- missing systems or data that would improve the recommendation

## Pair with other skills when useful

- Use `.agents/skills/content/keywords-to-content/SKILL.md` before this when the page structure is not settled yet.
- Use `.agents/skills/content/refresh-and-decay/SKILL.md` after publish when a page needs re-linking because rankings or traffic changed.
- Use `.agents/skills/operational/wordpress/SKILL.md` when the user wants the recommended CMS changes inspected or applied in WordPress.
- Use `.agents/skills/operational/google-search-console/SKILL.md` when query overlap, click decay, or search visibility should influence which pages deserve stronger internal support.

This skill is for internal links only. External backlinks should use `.agents/skills/content/external-backlinks/SKILL.md`.

## Constraints

- Prefer topical relevance over forced keyword anchors.
- Do not invent site pages that have not been provided or found.
- Do not assume a local repo file is live without URL mapping or live confirmation.
- Use generic recommendations only when the site inventory is incomplete, and say that explicitly.
