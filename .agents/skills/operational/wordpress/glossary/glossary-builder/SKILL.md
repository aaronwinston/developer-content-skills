---
name: glossary-builder
description: Create and update Arize WordPress Glossary drafts from structured glossary data, including ACF-backed Glossary Settings. Use when staging `glossary` custom post type entries from `apps/internal/evals-glossary/src/data/glossary.json` or similar sources. Requires WordPress REST credentials and Chrome DevTools MCP for ACF field entry through wp-admin.
---

# Glossary Builder

Use this skill to stage Arize WordPress `glossary` custom post type entries from structured glossary data.

This skill depends on the broader WordPress skill for API auth and REST patterns:

- `skills/operational/wordpress/SKILL.md`

Read that skill first if WordPress auth, REST updates, or `.env` handling are unfamiliar.

## Hard Requirement: Chrome DevTools MCP

The Arize `glossary` CPT is exposed through REST, but its ACF "Glossary Settings" fields are not reliably exposed through REST (`acf: []`). Creating a useful glossary entry requires filling those ACF fields through the wp-admin edit screen.

Before attempting to create or edit glossary entries:

1. Confirm the `user-chrome-devtools` MCP server is available.
2. Read the relevant Chrome DevTools MCP tool descriptors before calling tools, especially:
   - `list_pages`
   - `select_page`
   - `navigate_page`
   - `take_snapshot`
   - `evaluate_script`
   - `wait_for`
3. If Chrome DevTools MCP is not available, stop and tell the user:
   - this workflow requires Chrome DevTools MCP connected to a browser logged into `https://arize.com/wp-admin`
   - without it, the agent can only inspect REST-visible metadata and cannot safely populate the ACF definition fields

Do not try to work around missing Chrome MCP by publishing incomplete REST-only glossary posts.

## WordPress Model

There are two related WordPress content types:

- `glossary`: exposed through REST at `/wp-json/wp/v2/glossary`; public URL pattern `https://arize.com/glossary/<slug>/`; admin list `wp-admin/edit.php?post_type=glossary`.
- `term`: visible in wp-admin but not exposed through REST in the observed Arize install; public URL pattern `https://arize.com/blog/term/<slug>/`.

This skill creates and edits `glossary` entries only.

Always default to `draft`. Do not publish unless the user explicitly asks.

## Source Data

The common source is:

`apps/internal/evals-glossary/src/data/glossary.json`

Each term usually has:

- `slug`
- `title`
- `definition`
- optional `related`
- optional `featured`

Map fields as:

- WordPress post title: JSON `title`
- WordPress slug: JSON `slug`
- ACF Heading: see "Heading construction" below — do **not** use a naive `What is {title}?`
- ACF Term: JSON `title`
- ACF Definition: JSON `definition` converted to clean HTML
- ACF Example: leave blank unless the source provides a real example
- Format taxonomy: `Glossary Definition` (`format` term ID `421`)
- Visible taxonomy: leave empty by default; use `Is Hidden` only for test drafts or when requested

## Heading construction

The ACF Heading must read as a grammatical English question in Title Case. The format is:

`What {Is|Are} [Article ]{Title}?`

Construct it like this, in order:

1. Pick the verb:
   - plural noun (usually ends in `s`, e.g. `Evaluations`, `Embeddings`, `Agents`) → `Are`
   - singular noun, acronym, or noun phrase → `Is`
2. Pick the article:
   - plural noun → no article
   - acronym, all-caps token, or established proper-noun phrase (e.g. `RAG`, `Agentic RAG`, `LLM-as-a-Judge`) → no article
   - uncountable / mass noun naming a metric, property, or abstract concept (e.g. `Accuracy`, `Bias`, `Latency`, `Inference`, `Drift`) → no article
   - singular count noun starting with a vowel sound (`a`, `e`, `i`, `o`, and most `u`) → `An`
   - singular count noun starting with a consonant sound → `A`
3. Title-case the JSON title and any parenthetical short form. Capitalize every word, including articles, conjunctions, and prepositions, to match the rest of the heading style. Leave acronyms uppercase as-is.
4. Combine. Always finish with `?`.

Worked examples:

| JSON title | Heading |
|---|---|
| `Evaluations (evals)` | `What Are Evaluations (Evals)?` |
| `Agent` | `What Is An Agent?` |
| `Agentic RAG` | `What Is Agentic RAG?` |
| `Trace` | `What Is A Trace?` |
| `Embeddings` | `What Are Embeddings?` |
| `LLM-as-a-Judge` | `What Is LLM-as-a-Judge?` |
| `Hallucination` | `What Is A Hallucination?` |
| `Hour` | `What Is An Hour?` (vowel sound, silent `h`) |
| `Accuracy` | `What Is Accuracy?` (uncountable metric, no article) |
| `Bias` | `What Is Bias?` (uncountable abstract concept) |

Heuristics will not catch every edge case (silent `h`, `u` that sounds like `you`, acronyms whose first letter sounds like a vowel even though it is a consonant, etc.). When in doubt, prefer the wording a fluent speaker would say out loud and flag the heading in the handoff so the human reviewer can confirm.

The heading is part of the visible glossary page and is the most common place this skill produces ungrammatical output. Always check it against the rules above before saving.

## Preflight

Before creating drafts:

1. Verify WordPress REST auth with the `.env` credentials:
   - `WORDPRESS_BASE_URL`
   - `WORDPRESS_USERNAME`
   - `WORDPRESS_APPLICATION_PASSWORD`
2. Confirm the `glossary` endpoint responds:
   - `GET /wp-json/wp/v2/glossary?per_page=1`
3. Check for slug collisions:
   - `GET /wp-json/wp/v2/glossary?slug=<slug>&status=any&_fields=id,slug,status,title,link`
4. If a slug already exists, stop and ask whether to update that entry or choose different terms.
5. Confirm Chrome DevTools MCP can navigate to:
   - `https://arize.com/wp-admin/post-new.php?post_type=glossary`

## Markdown to HTML

Convert the JSON `definition` to clean WordPress-safe HTML:

- Split blank-line-separated paragraphs into `<p>...</p>`.
- Preserve headings if present (`##` -> `<h2>`).
- Preserve unordered lists if present.
- Escape raw text before wrapping it in HTML.
- Do not inject source paths, agent notes, or provenance banners into visible content.

The current evals glossary definitions are mostly paragraph text, so simple paragraph conversion is usually enough.

## wp-admin Form Fields

Observed selectors on the Arize `glossary` new/edit screen:

- post title: `#title`
- ACF Heading: `input[name="acf[field_6262b95bba322]"]`
- ACF Term: `input[name="acf[field_6262b970ba324]"]`
- ACF Definition: `textarea[name="acf[field_6262b974ba325]"]`
- ACF Example: `textarea[name="acf[field_6262b982ba326]"]`
- Format: Glossary Definition checkbox `#in-format-421-2`
- Visible: Is Hidden checkbox `#in-visible-475-2`
- Save Draft button: `#save-post`
- ACF changed flag: `#_acf_changed`

These selectors are implementation details. If a selector fails, take a fresh snapshot and inspect the page before proceeding.

## Browser Creation Workflow

For each term:

1. Navigate with Chrome MCP to:
   - `https://arize.com/wp-admin/post-new.php?post_type=glossary`
2. Wait for `Add title`.
3. Use `evaluate_script` to set:
   - `#title`
   - ACF Heading
   - ACF Term
   - ACF Definition
   - optional ACF Example
   - Format checkbox `#in-format-421-2`
   - `_acf_changed = "1"`
4. Click `#save-post`.
5. Wait for `Post draft updated`.
6. Capture the post ID from the resulting edit URL.
7. Patch the canonical slug through REST:
   - `POST /wp-json/wp/v2/glossary/<id>` with `{"slug": "<json-slug>"}`
8. Verify with REST:
   - `GET /wp-json/wp/v2/glossary/<id>?context=edit&_fields=id,slug,status,title,format,visible,modified`

Important: WordPress may show a permalink in the editor before the draft's REST `slug` is persisted. Always set the slug explicitly through REST after saving the draft.

## JavaScript Pattern

Use this pattern inside `evaluate_script`, adapting the `data` object:

```javascript
() => {
  const data = {
    title: 'Agentic RAG',
    heading: 'What Is Agentic RAG?',
    term: 'Agentic RAG',
    definitionHtml: '<p>Agentic RAG is ...</p>',
    example: '',
  };

  const setValue = (selector, value) => {
    const el = document.querySelector(selector);
    if (!el) return false;
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  };

  const setChecked = (selector, checked) => {
    const el = document.querySelector(selector);
    if (!el) return false;
    el.checked = checked;
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  };

  const result = {
    title: setValue('#title', data.title),
    heading: setValue('input[name="acf[field_6262b95bba322]"]', data.heading),
    term: setValue('input[name="acf[field_6262b970ba324]"]', data.term),
    definition: setValue('textarea[name="acf[field_6262b974ba325]"]', data.definitionHtml),
    example: data.example
      ? setValue('textarea[name="acf[field_6262b982ba326]"]', data.example)
      : true,
    format: setChecked('#in-format-421-2', true),
  };

  const changed = document.querySelector('#_acf_changed');
  if (changed) changed.value = '1';

  document.querySelector('#save-post').click();
  return result;
}
```

If any returned value is `false`, do not assume the draft is correct. Inspect the page and fix the selector or workflow.

## Validation

After staging, verify:

- `status` is `draft`
- `slug` matches source `slug`
- post title matches source `title`
- `format` includes `421`
- ACF fields visibly populated on the edit screen
- ACF Heading reads as a grammatical English question in Title Case (apply the rules in "Heading construction"; do not skip this check)
- no accidental `Is Hidden` unless requested

Return:

- title
- slug
- post ID
- admin edit URL
- preview URL if useful
- notes about fields intentionally left blank

## Handoff

Tell the user these drafts need human review before publishing. Call out any fields left unset, especially:

- Recommended Resources
- Topics / Use Cases / Integration / Using Arize taxonomies
- Featured image
- Excerpt
- Popular
- Yoast SEO fields

For related terms from JSON, do not populate Recommended Resources unless you have mapped related slugs to real WordPress post IDs and confirmed the field structure.
