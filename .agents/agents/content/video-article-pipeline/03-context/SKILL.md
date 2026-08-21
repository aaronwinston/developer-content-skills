---
name: arize-video-article-03-context
description: >
  Arize video article step 3. Gather arize.com context via crosslinks and optional
  site-scoped web discovery, then prepare concise context snippets for the
  generation step.
"last updated": 2026-05-30
"last run": 2026-05-30
---

Step 0: Read [../../../../../references/agent-runtime.md](../../../../../references/agent-runtime.md) for workflow standards (runtime HTTP, logging, ephemeral rules).

# Arize video-article pipeline — 03 Context

Log line prefix: `[run-debug] workflow=arize/video-article-pipeline | CONTEXT | <facts>`

## Read local assets

- [`crosslinks.txt`](../crosslinks.txt) at the workflow root (optional).
- Optional values from local gitignored `config.json`: `discover_arize_context`, `site_search_domain`, `max_context_urls`, `search_allowed_domains`.

## Steps

1. Parse URLs from `crosslinks.txt`. Ignore comments and blank lines.
2. Add any user-supplied context URLs.
3. Optional discovery. If `discover_arize_context` is true, run a site-scoped search like `site:arize.com <topic>` (or `site:www.arize.com`) using the title and a transcript excerpt.
4. Keep only allowed domains. The default allow list is `arize.com` and `www.arize.com` unless `search_allowed_domains` overrides it.
5. GET each kept URL over HTTPS and extract concise supporting snippets.

## Rules

- Prefer first-party Arize pages for positioning and product claims.
- Ignore inaccessible or non-200 URLs and continue.
- Deduplicate URLs before fetch.

## Outputs for the generation step

- `context_snippets` with source URLs.
- finalized `crosslink_url_list`.

Log: `[run-debug] workflow=arize/video-article-pipeline | CONTEXT | snippets=<n> urls=<n>`

Next: [../04-generate/SKILL.md](../04-generate/SKILL.md)
