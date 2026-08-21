---
name: glossary-term-06-deliver-wp-glossary
description: >-
  After 05-eval passes (every criterion A or B), stage the polished Markdown manuscript tmp/{id}.md as a
  WordPress `glossary` custom post type draft (status=draft) on arize.com, fill the ACF Glossary Settings,
  set the canonical slug, and record the wp-admin edit URL in tmp/{id}-eval.md. No Google Doc.
"last run": 2026-06-07
---

# 06 - Deliver WordPress glossary draft

Step 0: Read [`../../../../../references/agent-runtime.md`](../../../../../references/agent-runtime.md).

## Goal

Take the finished glossary manuscript `tmp/{id}.md` (Markdown) and stage it as **exactly one** WordPress `glossary` custom post type **draft** on `https://arize.com`, with the ACF "Glossary Settings" populated. The Markdown manuscript is the canonical input; this step converts and stages it. The public URL pattern is `https://arize.com/glossary/{id}/`.

This step builds the WordPress glossary delivery directly (it does not hand off to the standalone glossary-builder skill). It relies on the base WordPress skill only for REST auth and request patterns: [`../../../../skills/operational/wordpress/SKILL.md`](../../../../skills/operational/wordpress/SKILL.md).

## Prerequisites

- [../05-eval/SKILL.md](../05-eval/SKILL.md) completed for this `{id}`.
- `tmp/{id}-eval.md` exists and **every** criterion in the summary table is **A** or **B**.
- `tmp/{id}.md` is the final polished manuscript (no pending 04→05 loop).

If any grade is **C** or below, **do not** stage. Fix in [../04-polish/SKILL.md](../04-polish/SKILL.md), re-run [../05-eval/SKILL.md](../05-eval/SKILL.md), then return here.

## Credentials

WordPress Application Password auth from repo-root `.env` (see the WordPress skill):

- `WORDPRESS_BASE_URL`
- `WORDPRESS_USERNAME`
- `WORDPRESS_APPLICATION_PASSWORD`

Default `status=draft`. Never publish unless the user explicitly asks.

## Chrome DevTools MCP requirement

The `glossary` CPT is exposed through REST at `/wp-json/wp/v2/glossary`, but its ACF "Glossary Settings" fields are **not** reliably writable through REST (`acf: []`). Filling them requires the wp-admin edit screen via the `user-chrome-devtools` MCP server, connected to a browser logged into `https://arize.com/wp-admin`.

Before staging:

1. Confirm `user-chrome-devtools` MCP is available; read the tool descriptors before calling (`list_pages`, `select_page`, `navigate_page`, `take_snapshot`, `evaluate_script`, `wait_for`).
2. If it is not available, stop and tell the user: this delivery needs Chrome DevTools MCP on a logged-in wp-admin session, otherwise only REST-visible metadata can be set and the ACF definition fields cannot be populated safely.

Do not work around missing Chrome MCP by creating a REST-only glossary post with empty ACF fields.

## Map manuscript → glossary fields

Parse `tmp/{id}.md`:

- The single `#` H1 (`# What is {term}?`) gives the **term** and the **heading**.
- Everything after the H1 is the **definition body**.

Field mapping:

| Glossary field | Value |
|---|---|
| Post title | the term (e.g. `Agent evals`) — H1 text with the leading `What is`/`What are` and trailing `?` stripped |
| Slug | `{id}` (lowercase, hyphenated) |
| ACF Heading | the H1 reworded as a grammatical Title Case question (see below) |
| ACF Term | the term |
| ACF Definition | the full definition body converted to clean WordPress-safe HTML |
| ACF Example | leave blank unless the manuscript contains a real worked example |
| Format taxonomy | `Glossary Definition` (`format` term id `421`) |
| Visible taxonomy | leave empty (do not set `Is Hidden`) unless the user asks |

### Heading construction

The ACF Heading must read as a grammatical English question in Title Case: `What {Is|Are} [Article ]{Title}?`

1. Verb: plural noun → `Are`; singular / acronym / noun phrase → `Is`.
2. Article: plural, acronym, or established proper-noun phrase → none; uncountable concept (metric/property) → none; singular count noun starting with a vowel sound → `An`; consonant sound → `A`.
3. Title-case the term and any parenthetical short form; leave acronyms uppercase.
4. End with `?`.

Examples: `Agent evals` → `What Are Agent Evals?`; `LLM-as-a-judge` → `What Is LLM-as-a-Judge?`; `Distributed tracing` → `What Is Distributed Tracing?`; `AI engineering` → `What Is AI Engineering?`. When unsure, prefer what a fluent speaker would say and flag it in the handoff.

### Markdown → definition HTML

Convert the definition body to clean WordPress-safe HTML:

- Blank-line-separated paragraphs → `<p>…</p>`.
- `##` / `###` → `<h2>` / `<h3>`.
- `- ` lists → `<ul><li>…</li></ul>`; numbered lists → `<ol>`.
- Markdown links with an anchor and URL -> `<a href="url">anchor</a>` (keep every Arize crosslink); `**bold**` -> `<strong>`; inline backticks -> `<code>`.
- Escape raw text before wrapping. Do not inject source paths, agent notes, or provenance banners into visible content.

## Preflight (REST)

1. Verify auth and that the endpoint responds: `GET /wp-json/wp/v2/glossary?per_page=1`.
2. Slug collision check: `GET /wp-json/wp/v2/glossary?slug={id}&status=any&_fields=id,slug,status,title,link`.
3. If the slug already exists, stop and ask whether to update that entry or pick a different slug.
4. Confirm Chrome MCP can navigate to `https://arize.com/wp-admin/post-new.php?post_type=glossary`.

## Stage the draft (wp-admin via Chrome MCP)

1. Navigate to `https://arize.com/wp-admin/post-new.php?post_type=glossary`; wait for `Add title`.
2. `evaluate_script` to set the fields. Observed selectors on the Arize `glossary` new/edit screen:
   - post title: `#title`
   - ACF Heading: `input[name="acf[field_6262b95bba322]"]`
   - ACF Term: `input[name="acf[field_6262b970ba324]"]`
   - ACF Definition: `textarea[name="acf[field_6262b974ba325]"]`
   - ACF Example: `textarea[name="acf[field_6262b982ba326]"]`
   - Format checkbox: `#in-format-421-2`
   - ACF changed flag: set `#_acf_changed` value to `"1"`
   - Save Draft: `#save-post`

   If any selector fails, take a fresh snapshot and inspect before proceeding; do not assume the draft saved correctly.
3. Click `#save-post`; wait for `Post draft updated`. Capture the post id from the edit URL.
4. Persist the canonical slug through REST (the editor permalink may differ): `POST /wp-json/wp/v2/glossary/{id_post}` with `{ "slug": "{id}" }`.
5. Verify: `GET /wp-json/wp/v2/glossary/{id_post}?context=edit&_fields=id,slug,status,title,format,visible,modified`.

Log: `[run-debug] agent=content/glossary-term | 06-deliver-wp-glossary | post_id=… slug={id} status=draft`

## Validate

- `status` is `draft`.
- `slug` matches `{id}`.
- post title matches the term.
- `format` includes `421`.
- ACF Heading, Term, and Definition are visibly populated on the edit screen; Heading reads as a grammatical Title Case question.
- No accidental `Is Hidden`.

## Record + handoff

Update `tmp/{id}-eval.md`: replace the `- **WordPress draft:**` line with the wp-admin edit URL `https://arize.com/wp-admin/post.php?post={id_post}&action=edit`.

Return to the user: term, slug, post id, edit URL, and any fields left blank for human review (Recommended Resources, taxonomies, featured image, excerpt, Yoast SEO). Tell the user the draft needs human review before publishing.

## Do not

- Stage before 01–05 are complete for this run.
- Edit `tmp/{id}.md` during delivery (fixes belong in 04 / 05 only).
- Publish (`status=publish`) without an explicit request.
- Create a REST-only post with empty ACF fields when Chrome MCP is unavailable.

## Next

After this batch, refresh the alphabetized glossary index page via [`../../../../skills/operational/wordpress/glossary/index-page-builder/SKILL.md`](../../../../skills/operational/wordpress/glossary/index-page-builder/SKILL.md). Human review in wp-admin precedes any publish.
