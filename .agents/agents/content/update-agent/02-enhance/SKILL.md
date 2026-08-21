---
name: update-02-enhance
description: >-
  Update agent step 2: build the runtime crosslinks list (crosslinks.json + optional SerpAPI top 10),
  infer the target keyword, compute the current year, call Anthropic to enhance the article (no prose
  changes; only crosslinks + FAQ in the body, sentence-case the title and every body heading, plus
  outdated-year tokens in the title and meta description bumped to the current year), verify link
  preservation, run a second Anthropic call for the change summary, and require a human gate before any
  Drive write.
---

# Update agent — 02 Enhance

Log line prefix: `[run-debug] workflow=content/update-agent | 02-enhance | <facts>`

## Prerequisites

From step 01:

- `source_url`, `source_title`, `source_description`, `content_html`, `client_config`.
- Optional `wp_post` and `cms_publish_eligible` for Path B inputs.

## 0. Compute the current year

Set `current_year` to the UTC year of `now` (e.g. `2026`). This is used by the year-update rule in §3 below and by the change-summary call in §5.

Log `current_year=<n>`.

## 1. Infer target keyword

Pick the 2 or 3 words that best describe the article. Choose in this order:

1. The first substantive `<h1>` text inside `content_html` (strip site name suffixes like `" | Arize"`).
2. `og:title` if available in the original HTML.
3. `<title>` if available.
4. `source_title`.

Squeeze it down: lowercase; remove brand names that match the host (`arize`, `phoenix`); remove stop words (`the`, `a`, `an`, `to`, `for`, `of`, `and`, `or`, `with`, `on`, `in`, `is`, `what`, `how`, `your`, `you`); keep the **2 or 3** most informative remaining words in their original order. If only 1 word remains, that is fine — log `target_keyword_words=1` and continue.

Log `target_keyword=<value> source=h1|og|title|source_title`.

## 2. Build runtime crosslinks

### 2a. Base list from `crosslinks.json`

Read [`../crosslinks.json`](../crosslinks.json). Treat each entry `{ url, anchors[], note? }` as a `client_file` source. Drop entries whose host equals the host of `source_url` only when `url === source_url` (otherwise same-host internal crosslinks are exactly what we want).

If `crosslinks.json` is missing or empty, log `crosslinks_base=0` and continue. The agent will still produce a Doc — the model will simply skip the crosslink instruction when the allowlist is empty.

### 2b. SerpAPI augmentation (optional)

When `SERPAPI_API_KEY` is set in `.env` **and** `client_config.crosslinks.serpapi.enabled !== false`:

`GET https://serpapi.com/search` with:

- `engine=google`
- `q={target_keyword}`
- `num=10`
- `api_key={SERPAPI_API_KEY}`

Use the first 10 organic results that have a usable `link` and a `title`. Drop:

- Results whose host equals the host of `source_url` (no self-link augmentation; the base list already covers Arize internal links).
- Results whose `link` equals `source_url` exactly.

**Freshness filter (≤ 1 year old):** for each candidate, determine `published_at`:

1. SerpAPI result `date` field, if parseable.
2. Else `GET` the URL (60s timeout, browser-like UA), parse HTML, read the first available of: `<meta property="article:published_time">`, `<meta property="og:updated_time">`, `<meta property="article:modified_time">`, first `<time datetime="…">`.
3. If none, treat `published_at` as **unknown**.

Drop results older than 365 days (UTC) **and** drop results with unknown `published_at`. Cap kept results at 10. Log `serp_kept=N serp_dropped_age=X serp_dropped_unknown=Y`.

### 2c. Merge and render

Build the runtime `crosslinks` array:

- Each `crosslinks.json` entry → `{ url, anchors, source: "client_file" }`.
- Each kept SerpAPI result → `{ url, anchors: [result.title, target_keyword], source: "serp" }`.

Deduplicate by URL (case-insensitive host + path); `client_file` entries win when both sources have the same URL.

Render `crosslinks_text` as one entry per line:

```
- {url} — anchors: {a1}; {a2}; {a3}
```

This is the value substituted for `{crosslinks}` in the enhance prompt.

Log: `[run-debug] workflow=content/update-agent | 02-enhance | crosslinks | target_keyword=<...> base=<n> serp_kept=<n> total=<n>`.

## 3. Enhancement call

Read [`../prompts/enhance_article.txt`](../prompts/enhance_article.txt). Replace literals **in order**:

1. `{title}` ← `source_title`
2. `{meta_description}` ← `source_description` (may be the empty string)
3. `{current_year}` ← `current_year` from §0
4. `{article_content}` ← `content_html`
5. `{crosslinks}` ← `crosslinks_text` (the runtime list — **not** `crosslinks.txt`)
6. `{target_keyword}` ← `target_keyword`

The prompt's year-update rule covers two fields only — the article **title** and the **meta description**. The **sentence-case rule** covers the article **title** and every **body heading** (`<h1>`–`<h6>`). Otherwise the article body still gets only crosslinks + FAQ (no prose changes, no year edits in the body).

The model receives this explicit contract:

- Replace any year token between 2000 and `current_year - 1` that reads as a **current-year claim** ("Top 5 ... of 2025", "Best ... in 2025", "Guide for 2025", "2025 buyer's guide", etc.) with `current_year`.
- **Never** change fixed historical dates: publication dates, event dates, version/release years (e.g. "published November 7, 2025", "released in 2024", "since 2022"). When unsure, leave it alone.
- If no year update applies, return the original title / description verbatim (before sentence-casing the title).
- Convert the **title** and every **body heading** to sentence case — a capitalization-only edit that preserves proper nouns, brand/product names, and acronyms (Arize, Arize AX, Phoenix, Alyx, ADB, LLM, AI, API, etc.) and never adds, removes, or reorders words. See [references/content/formatting.md](../../../../../references/content/formatting.md).

Send as a single user message to Anthropic Messages API:

- `POST https://api.anthropic.com/v1/messages`
- Headers: `content-type: application/json`, `x-api-key: {ANTHROPIC_API_KEY}`, `anthropic-version: 2023-06-01`
- Body: `model` (from merged config; default `claude-sonnet-4-6`), `max_tokens` (16384 or higher; raise toward the model's ceiling if the response truncates), `temperature: 0.7`, `messages: [{ "role": "user", "content": "<prompt string>" }]`.

Parse the response: concatenate `content[]` entries with `type === "text"`. Strip Markdown code fences if present. Parse JSON; expect exactly these three keys:

- **`"content_rendered"`** (string): full enhanced body HTML (crosslinks, appended FAQ, and sentence-cased headings). Result is `enhanced_html`.
- **`"title_rendered"`** (string): the title to use — reflects both the year update (when applicable) and the sentence-case conversion. May differ from `source_title` even when no year update applies (e.g. casing-only change).
- **`"meta_description_rendered"`** (string): the meta description to use. Equals `source_description` unchanged when no year update applies; may be empty when the input description was empty. The sentence-case rule does **not** apply to the meta description.

If the model emits any other top-level key, or omits any of the three, log it and retry once with a sterner instruction; if it still doesn't comply, stop and surface the first ~500 chars of the response.

After parsing, compute and log:

- `title_changed = (title_rendered !== source_title)` → boolean. Covers both the year update and the sentence-case recasing.
- `title_year_updated` → boolean; true only when a year token actually changed (compare the title with digits-only normalized — i.e. the change is not purely casing). When `title_changed` is true but the digit sequence is unchanged, the edit was sentence-case only.
- `description_year_updated = (meta_description_rendered !== source_description)` → boolean.

These flags drive the metadata block and change-summary call below.

## 4. Link preservation check

For every distinct `https?://…` href present in the original `content_html` (after resolving relative URLs against the page origin), verify it appears at least once in `enhanced_html`.

If any are missing:

- Log the missing hrefs.
- Re-run the enhancement once with a sterner "do NOT drop existing links" instruction prepended to the prompt.
- If they are still missing on the retry, stop and ask the operator.

Compute and log:

- `links_added = max(0, count_of_href_in(enhanced_html) - count_of_href_in(content_html))`
- `faq_added = REGEXP_MATCH(enhanced_html, /frequently\s+asked\s+questions/i)` → boolean.

## 5. Change summary (second Anthropic call)

Read [`../prompts/diff_summary.txt`](../prompts/diff_summary.txt). Replace literals (do **not** use `.format`-style interpolation across raw HTML):

- `<<<ORIGINAL_TITLE>>>` ← `source_title`
- `<<<UPDATED_TITLE>>>` ← `title_rendered`
- `<<<ORIGINAL_DESCRIPTION>>>` ← `source_description`
- `<<<UPDATED_DESCRIPTION>>>` ← `meta_description_rendered`
- `<<<ORIGINAL_HTML>>>` ← `content_html`
- `<<<ENHANCED_HTML>>>` ← `enhanced_html`

If both bodies are very large, truncate each to a shared prefix for this call only and log the truncation. The Doc body in step 03 still uses the **full** `enhanced_html`.

Second Messages request:

- `temperature: 0.3`
- `max_tokens: 2000`

Save the assistant text as `change_summary_markdown`. It must be a Markdown bullet list (`- …`) where every bullet is **agent-readable on a re-run** — each crosslink that was added should cite the URL and the anchor text, each new FAQ question should cite the question wording, any year update in the title or description should cite the before/after string verbatim, and any title or heading recased to sentence case should cite the before/after string verbatim.

Present the summary to the human reviewer as **Proposed changes**.

## 6. Human gate

Require explicit **`y`** or **`yes`** from the operator before continuing. On any other input, stop the run without uploading.

## Carry forward

- `enhanced_html`, `change_summary_markdown`
- `target_keyword`, `links_added`, `faq_added`
- `current_year`, `title_rendered`, `meta_description_rendered`, `title_changed`, `title_year_updated`, `description_year_updated`
- `source_url`, `source_title`, `source_description`, `content_html`
- `wp_post`, `post_id`, `post_type`, `rest_route`, `cms_publish_eligible` (when set)
- `client_config`, `drive_folder_id`

## Next

[../03-doc-handoff/SKILL.md](../03-doc-handoff/SKILL.md)
