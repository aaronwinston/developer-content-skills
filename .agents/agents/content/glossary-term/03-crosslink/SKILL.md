---
name: glossary-term-03-crosslink
description: >-
  After the glossary draft, read tmp/{id}-crosslinks.md, verify at least five distinct https://arize.com
  crosslinks using link-only edits, and dedupe URLs. Do not run polish in the same edit.
"last run": 2026-06-07
---

# 03 - Crosslink pass

## Goal

Meet internal linking expectations without rewriting voice or structure except where needed to insert or fix links and anchor text.

## Prerequisites

- `tmp/{id}.md`
- `tmp/{id}-crosslinks.md`

## Rules

1. Minimum **five** distinct `https://arize.com` URLs in the manuscript after this pass.
2. Link-only edits. No heading rewrites and no new paragraphs except short transitional clauses when strictly necessary.
3. Dedupe destinations unless repeated links serve clearly different reader value.
4. Descriptive anchor text. No naked URLs or “click here.”
5. Verify each URL resolves.

## Process

1. Read `{id}-crosslinks.md` and list candidate URLs plus anchors.
2. Audit `{id}.md` for existing Arize links.
3. Add or swap links until the draft uses at least five distinct targets.
4. Save `{id}.md`.

## Do not

Run [../04-polish/SKILL.md](../04-polish/SKILL.md) in the same edit session.

## Next

Run [../04-polish/SKILL.md](../04-polish/SKILL.md).
