---
name: buyers-guide-01-research
description: Pre-draft pass. Search arize.com for fresh related pages, then write `tmp/{id}-arize-research.md` plus `tmp/{id}-crosslinks.md`. Run before `../02-draft/SKILL.md`.
---

# 01 - Research

## Goal

Build an evidence table of what Arize already publishes on or near the topic, scoped to fresh pages, then emit a crosslink candidate list for the draft stage. Research files may use terse notes; manuscript prose is enforced in [../04-polish/SKILL.md](../04-polish/SKILL.md).

## Clean slate once per run

Read [../AGENT.md](../AGENT.md) for the run-level rule. Choose `{id}` as a short slug and delete every file that matches `tmp/{id}*` before you create new artifacts.

## Freshness rule

Include a page only if any of the following is true:

- first published within the last 12 months
- last substantively updated within 12 months
- date is unclear but the content is clearly current

## Steps

1. Search `arize.com` for pages matching the target keyword and close variants.
4. For each candidate URL, capture:
   - URL
   - title and content type
   - why it matters for the guide
   - freshness basis
   - one or two quotable or paraphrasable facts
5. Write `tmp/{id}-arize-research.md` with:
   - executive summary
   - grouped link list
   - gaps the guide still needs to cover
6. Write `tmp/{id}-crosslinks.md` with one row per internal link target.

## Output template

```md
| URL | Suggested anchor |
|---|---|
| https://arize.com/docs/... | optional phrase |
```

## Next

Run [../02-draft/SKILL.md](../02-draft/SKILL.md).
