---
name: index-page-builder
description: Compile every WordPress `glossary` CPT entry into a single alphabetized index page (H2 per term, one-sentence linked blurb) and push the assembled HTML to a target WordPress page over the REST API. Pass the target page ID for your glossary index. Reads the glossary list and writes the page through REST; pulls per-term blurbs from the rendered public glossary URLs because ACF Definition is not exposed through REST.
---

# Glossary Index Page Builder

Use this skill to compile every WordPress `glossary` custom post type entry into a single alphabetized index page and push the assembled HTML to a WordPress page over the REST API.

Pass a **target page ID** for your glossary index. The page must be a WordPress `page` (or another type that exposes `content` through REST).

This skill is a sibling to:

- `skills/operational/wordpress/glossary/glossary-builder/SKILL.md` (creates individual `glossary` entries)
- `skills/operational/wordpress/SKILL.md` (general WordPress REST auth and update patterns — read first if unfamiliar)

## What this skill does and does not do

This skill:

- Reads every published `glossary` CPT entry through REST.
- Sorts entries alphabetically by title (case-insensitive).
- Produces one-sentence linked blurbs starting with `A {Term} is …` / `An {Term} is …` / `{Plural Term} are …`, where the term itself is a hyperlink to the glossary entry's public URL.
- Assembles a single HTML body of `<h2>` + `<p>` blocks (one pair per term).
- Patches the target page's `content` through REST.
- Leaves the target page in `draft` status. The skill never publishes a page.

This skill does not:

- Create new `glossary` entries (use `glossary-builder` instead).
- Edit per-entry ACF fields (Heading, Definition, Example, etc.).
- Generate or upload images, banners, or featured media.
- Promote the index page to `publish`. Treat publishing as a human decision.

## REST feasibility (verified)

- `GET /wp-json/wp/v2/glossary?per_page=100&status=publish&orderby=title&order=asc&_fields=id,slug,title,link` — returns id, slug, title, link reliably; honors `X-WP-Total` and `X-WP-TotalPages` for pagination.
- `GET /wp-json/wp/v2/glossary?...&_fields=...,content,excerpt,acf` — does NOT return useful body text. `content.rendered`, `excerpt.rendered`, and `acf` come back empty for `glossary` entries because the definition lives in an ACF field group that is not exposed to REST. Do not rely on these.
- `GET /wp-json/wp/v2/pages/{GLOSSARY_INDEX_PAGE_ID}?context=edit` — returns the target glossary index page. `acf` may be empty. Leave `meta._links_to` (Page Links To plugin) untouched if present.
- `POST /wp-json/wp/v2/pages/{GLOSSARY_INDEX_PAGE_ID}` with `{ "content": "..." }` — writes the page body.

So: list and push are REST. Per-term body text comes from the public glossary URL.

## Source of blurb text

For each entry, fetch the public glossary URL (`link` field from REST). Parse the HTML and extract the first prose paragraph that comes after the body `<h1>` and is at least ~60 characters of real text. Skip anything that is navigation, newsletter copy, social CTAs, cookie banners, or sidebar promo blocks.

Concretely:

1. Skip everything before the first `<body>` tag.
2. Find the first `<h1>...</h1>` in the body. The body H1 is the ACF "Heading" value, e.g. `What is LLM Multi-Turn Degradation`. The page `<title>` is in `<head>` — ignore it.
3. From immediately after that `</h1>`, scan `<p>` elements in document order.
4. For each `<p>`, strip tags, unescape HTML entities, and trim.
5. Take the first paragraph whose text is at least 60 characters and does not match obvious chrome (`cookie`, `sign in`, `sign up`, `subscribe`, `newsletter`, `bi-weekly`, `download`, `watch video`, etc.).

That paragraph is the raw definition source for the blurb.

## Blurb format (the one the user wants)

Each blurb is exactly one sentence. The term itself is a hyperlink to the entry's `link` URL. The sentence opens with the right form of "is/are" plus the right article:

- Singular count noun starting with a consonant sound: `A [Term](https://arize.com/ai-glossary/example-term/) is …`
- Singular count noun starting with a vowel sound: `An [Term](https://arize.com/ai-glossary/example-term/) is …`
- Acronym, all-caps token, or established proper-noun phrase (e.g. `RAG`, `Agentic RAG`, `LLM-as-a-Judge`, `AdaptThink`, `Agent Workflow Memory (AWM)`): `[Term](https://arize.com/ai-glossary/example-term/) is …` (no article)
- Uncountable / mass noun naming a metric, property, or abstract concept (e.g. `Accuracy`, `Bias`, `Latency`, `Drift`): `[Term](https://arize.com/ai-glossary/example-term/) is …` (no article)
- Plural noun: `[Plural Term](https://arize.com/ai-glossary/example-term/) are …`

When in doubt about countability, look at how the term is used in its own definition paragraph. If the source paragraph itself uses no article (`Accuracy is …`, `Bias is …`), follow that signal.

Notes on the link:

- Link target is the glossary entry's public URL (REST `link` field, e.g. `https://arize.com/glossary/agent/`).
- Link text is the term itself, with original casing preserved (e.g. `Agentic RAG`, not `agentic rag`).
- The leading article (`A` / `An`) is NOT inside the link.
- The sentence ends with a single period.
- Never bold, italicize, or underline inside the blurb.

These rules align with the article/plural rules used by `glossary-builder`. When in doubt, prefer the wording a fluent speaker would say out loud.

## Sentence rewriting (the tricky part)

The first paragraph from the public page rarely starts with `A {Term} is …` already. The agent must produce a single grammatical sentence in the right form, drawing from the source paragraph.

Recommended approach per term:

1. If the source first sentence already opens with `{Term} is …`, `An? {Term} is …`, or `{Plural Term} are …`, just rewrap the term span as a Markdown link, fix the leading article and capitalization, and trim to one sentence.
2. Otherwise, write one new sentence in the required form that paraphrases the source paragraph's first idea. Keep it concise (~25–45 words). Do not invent facts beyond what the source paragraph supports.
3. Lowercase the word immediately after `is` or `are` unless it is a proper noun, so the sentence flows.
4. Preserve technical terms (model names, framework names, acronyms) exactly as they appear in the source.
5. Do not add hedging like "in the context of AI" unless the source paragraph itself disambiguates that way.

Bad example (verbatim source, no link, wrong opener):

> It has been observed that many LLMs "get lost" in extended conversations, showing a significant performance drop as the number of dialogue turns increases.

Good example (rewritten, linked, correct opener):

> [Multi Turn LLM: Conversation Degradation](https://arize.com/glossary/multi-turn-llm-conversation-degradation/) is the observed performance drop in many LLMs over the course of extended dialogues, where responses become less accurate or contradictory as turns accumulate.

If the source paragraph is genuinely useless (sales chrome, missing, or an error page), skip the entry and report it in the handoff rather than fabricating a definition.

## Page assembly

Sort entries alphabetically by title using a case-insensitive sort key (`title.rendered.lower()` is fine; do not strip leading articles like "A " or "The " — the WordPress titles do not need that level of normalization).

For each entry, emit exactly:

```html
<h2>{title}</h2>
<p>{blurb}</p>
```

where `{title}` is the WordPress post title as returned by REST (do NOT recase it; preserve `Tool-N1`, `AM-Thinking-v1`, `LLM-as-a-Judge`, etc. exactly), and `{blurb}` is the formatted sentence with the embedded `<a>` link.

Do not add:

- A page-level `<h1>` (the page already has its WordPress title).
- A table of contents or A–Z index (out of scope for this skill).
- Extra wrappers, divs, classes, or shortcodes.
- Source attributions or "compiled from …" banners.

The final body is the concatenation of all `<h2>` + `<p>` blocks separated by single newlines.

## Preflight

Before assembling and pushing:

1. Verify WordPress REST auth with the `.env` credentials (same pattern as `skills/operational/wordpress`).
2. Confirm the target page is reachable and is a `page`:
   - `GET /wp-json/wp/v2/pages/{target_id}?context=edit&_fields=id,type,status,title,link,content,meta`
3. Read and remember the current `content.raw` of the target page so the run is reversible if something goes wrong. Stash it in agent-local `tmp/` before patching.
4. Confirm `status` is `draft`. If it is `publish`, stop and ask the user before continuing — this skill does not republish a live page silently.
5. List total glossary count to set expectations:
   - `GET /wp-json/wp/v2/glossary?per_page=1` and read `X-WP-Total`.

## Build

1. Paginate through `GET /wp-json/wp/v2/glossary?per_page=100&status=publish&orderby=title&order=asc&_fields=id,slug,title,link` until all entries are collected. The endpoint reports `X-WP-TotalPages`; loop with `&page=N`.
2. Sort the collected list by `title.rendered.lower()`.
3. For each entry:
   - Fetch `link` over plain HTTPS with a normal browser user agent.
   - Extract the first qualifying paragraph as described in "Source of blurb text".
   - Build the blurb sentence per "Blurb format" + "Sentence rewriting".
   - Append `<h2>{title.rendered}</h2>\n<p>{blurb}</p>`.
4. Cache fetched HTML and extracted blurbs under agent-local `tmp/` for the duration of the run, so reruns within the same session are cheap and the data is auditable.

A serial run for ~120 entries takes a couple of minutes. Concurrency is fine but keep it modest (2–4 in flight) and respect the site.

## Push

1. `POST /wp-json/wp/v2/pages/{target_id}` with `{ "content": <assembled_html>, "status": "draft" }`. Do not pass `meta`, `template`, `slug`, `title`, or any other field. Just `content` (and explicitly `status: draft` as a guardrail against accidental publishes).
2. Read back `GET /wp-json/wp/v2/pages/{target_id}?context=edit&_fields=id,status,modified,content` and confirm:
   - `status` is `draft`.
   - `content.raw` matches the assembled HTML byte for byte.
3. Surface the wp-admin edit URL (`/wp-admin/post.php?post={target_id}&action=edit`) and the public preview URL.

## Validation

Before reporting success:

- Number of `<h2>` blocks in the new body equals the number of glossary entries collected from REST.
- Every blurb starts with one of:
  - `A <a` — singular count noun, consonant sound
  - `An <a` — singular count noun, vowel sound
  - `<a` — acronym, proper-noun phrase, uncountable noun, or plural
- Every blurb contains exactly one `<a href="...">` whose href starts with `https://arize.com/glossary/`.
- Every entry's title from REST is present in the assembled body.
- No leftover sentinel comments or debug strings.

If validation fails, do not push. Report what failed and stop.

## Proofread (always run after assembly, before push)

The blurbs are produced from a programmatic rewrite of source paragraphs, so a small fraction always come out ungrammatical or infelicitous. Always run a proofread pass on the assembled body before pushing, and a second pass after pushing as a safety net. Treat this as part of the skill, not as an optional cleanup.

The proofread pass must:

1. Re-read the assembled body and walk every `<h2>...</h2><p>...</p>` pair.
2. Mechanically flag each blurb that hits any of the following (these are the patterns that actually showed up in production runs and that the assembler tends to produce):
   - **Doubled subject**: matches `^(?:An?\s+)?(.+?)\s+(is|are)\s+(.+?)\s+(is|are|refers|describes|means|measures|stands)\b`, where the second clause restarts with the same head noun. Example: `Bias (AI evaluation) is bias in AI evaluation refers to systematic differences …`.
   - **Multi-sentence blurb**: more than one terminal `.`/`!`/`?` followed by a capital letter (or by a closing quote and a capital). Blurbs must be exactly one sentence. `i.e.` and `e.g.` do not count.
   - **Doubled verb**: `\bis\s+is\b` or `\bare\s+are\b`. Anchor on word boundaries — `analysis is the` is fine, even though it contains the substring `is is`.
   - **Case glitch after `is`**: `is\s+[a-z][A-Z]` — catches `is aI evaluation`, `is rAGEN`, `is sHAP`, etc., where the assembler lowercased the first letter of a re-stated subject.
   - **Article + plural**: blurbs starting with `A ` or `An ` followed by a token ending in `s` and then `is` / `are`.
   - **Wrong article**: `A` immediately before a vowel sound, or `An` immediately before a consonant sound. Acronyms count by sound (`an LLM`, `an MRR`, `a RAG`, `a UMAP`).
   - **Plural title with singular verb**: title ends in `s` (and is not an obvious singular-looking acronym, gerund, or `analysis`/`gloss`/`-ness` form) but the blurb starts with `<a …>{Plural Term}</a> is`.
   - **No terminal punctuation**: blurb does not end with `.`/`!`/`?`.
   - **Repeated articles or words**: `\b(the the|a a|an an)\b`.
   - **Redundant parenthetical**: title contains `(X)` and the blurb tacks on `, also called X,` or `, or X,` immediately after the link. Drop the redundancy.
3. For each flagged blurb, rewrite it as a single grammatical English sentence that still:
   - Begins with the linked term (preserving original casing inside the link).
   - Uses the correct article per "Blurb format".
   - Stays faithful to the source paragraph — do not invent claims that are not in the source.
   - Ends with a single period.
4. Replace the blurb in place. Keep the existing `<a href="…">` exactly — do not re-derive the URL.
5. Re-run the same scans on the updated body until zero issues remain. Two passes are normal; if you are still flagging issues after three passes, stop and surface them.

After the proofread pass passes cleanly, push to the target page (`status: draft`). After push, fetch `content.raw` from the target page and run the same scans one more time as a regression check; if anything regressed, fix and re-push.

Save each pre- and post-proofread snapshot under `tmp/page-{target_id}-before-proofread-{ts}.html` and `tmp/page-{target_id}-after-proofread-pass{N}-{ts}.html` so the run is auditable.

The most common rewrite is the doubled-subject pattern, which usually appears because the source paragraph already opens with the term. The fix is simply to drop the synthetic `Term is` prefix and keep the source's own opener, after rewrapping the term as a link. Example:

Bad (assembler output):

> Retrieval-augmented generation (RAG) is retrieval-augmented generation, or RAG, is an architecture where a system retrieves external context and provides it to a model before generation.

Good (after proofread):

> [Retrieval-augmented generation (RAG)](https://arize.com/ai-glossary/retrieval-augmented-generation-rag/) is an architecture where a system retrieves external context and provides it to a model before generation.

## Handoff

After a successful push, tell the user:

- Number of entries written.
- Number of blurbs corrected by the proofread pass, and a one-line summary of the most common correction pattern.
- Any entries that were skipped because the source paragraph was unusable (with their slug and reason).
- wp-admin edit URL: `https://arize.com/wp-admin/post.php?post={target_id}&action=edit`.
- Preview URL from REST.
- Reminder that the page is still a `draft` and needs human review before publishing.

## Reference snippet

This is a sketch, not a script — the agent should adapt at runtime, especially the per-term sentence rewrite, which is not deterministic.

```python
import urllib.request, urllib.error, base64, json, re, html

env = {}
with open('.env','rb') as f:
    for line in f.read().decode('utf-8').splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line: continue
        k, v = line.split('=', 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

BASE = env['WORDPRESS_BASE_URL'].rstrip('/')
AUTH = base64.b64encode(
    f"{env['WORDPRESS_USERNAME']}:{env['WORDPRESS_APPLICATION_PASSWORD']}".encode()
).decode()
H = {'Authorization': f'Basic {AUTH}', 'User-Agent': 'curl/8.0'}

def wp(method, path, *, body=None):
    headers = dict(H)
    data = None
    if body is not None:
        headers['Content-Type'] = 'application/json'
        data = json.dumps(body).encode()
    req = urllib.request.Request(BASE + path, headers=headers, method=method, data=data)
    with urllib.request.urlopen(req) as r:
        return r.status, r.read().decode('utf-8', 'replace'), r.headers

def list_glossary():
    items, page = [], 1
    while True:
        status, body, headers = wp('GET',
            f'/wp-json/wp/v2/glossary?per_page=100&status=publish&orderby=title&order=asc'
            f'&_fields=id,slug,title,link&page={page}')
        items.extend(json.loads(body))
        total_pages = int(headers.get('X-WP-TotalPages') or '1')
        if page >= total_pages: break
        page += 1
    return items

def fetch_first_paragraph(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=20) as r:
        htm = r.read().decode('utf-8', 'replace')
    m = re.search(r'<body[^>]*>(.*)$', htm, re.S | re.I)
    body = m.group(1) if m else htm
    m = re.search(r'<h1[^>]*>(.*?)</h1>', body, re.S | re.I)
    if not m: return None
    after = body[m.end():]
    for p in re.findall(r'<p[^>]*>(.*?)</p>', after, re.S | re.I):
        text = html.unescape(re.sub(r'<[^>]+>', '', p)).strip()
        if len(text) >= 60 and not any(s in text.lower() for s in (
                'cookie', 'sign in', 'sign up', 'newsletter', 'subscribe',
                'bi-weekly', 'download', 'watch video')):
            return text
    return None
```

The blurb construction (article + linked term + rewrite) is left to the agent at runtime so that grammar and faithfulness to the source can actually be checked.

## Reference snippet — proofread scan

This is the scan the proofread pass should run repeatedly until it returns an empty list. Each pass: scan, rewrite flagged blurbs, push, re-scan.

```python
import re, html as _html

def proofread_scan(content: str):
    pairs = re.findall(r'<h2>(.*?)</h2>\s*<p>(.*?)</p>', content, re.S)
    def text(s): return _html.unescape(re.sub(r'<[^>]+>', '', s))
    issues = []
    for i, (t_html, b_html) in enumerate(pairs):
        t = text(t_html).strip()
        b = text(b_html).strip()
        flags = []
        m = re.match(r'^(?:An?\s+)?(.+?)\s+(is|are)\s+(.+?)\s+(is|are|refers|describes|means|measures|stands)\s+', b, re.I)
        if m:
            head = m.group(1).split(' (')[0].lower()
            rest = m.group(3).lower()
            if rest.startswith(head[:max(4, len(head) // 2)]):
                flags.append('doubled-subject')
        inner = b[:-1] if b.endswith(('.', '!', '?')) else b
        if re.search(r'[.!?][\u200B\s]["\u201D\u2019]?[A-Z]', inner) or re.search(r'[.!?]["\u201D\u2019]\s+[A-Z]', inner):
            flags.append('multi-sentence')
        if re.search(r'\bis\s+is\b', b) or re.search(r'\bare\s+are\b', b):
            flags.append('double-verb')
        if re.search(r'\bis\s+[a-z][A-Z]', b):
            flags.append('case-glitch')
        if re.match(r'^(A|An)\s+[A-Za-z][\w\-/]*s\s+(is|are)\b', b):
            flags.append('article+plural')
        if not b.endswith(('.', '!', '?')):
            flags.append('no-terminator')
        if re.search(r'\b(the the|a a|an an)\b', b, re.I):
            flags.append('repeated-word')
        if flags:
            issues.append({'i': i, 'title': t, 'flags': flags, 'blurb': b[:240]})
    return issues
```

To rewrite a blurb in place while preserving its existing `<a>` link:

```python
import re

def rewrite_blurb(content: str, title: str, sentence_template: str) -> str:
    """sentence_template uses {a} for the existing anchor (do not change href)."""
    pattern = re.compile(r'(<h2>)(.*?)(</h2>)\s*(<p>)(.*?)(</p>)', re.S)

    def repl(m):
        if title not in m.group(2):
            return m.group(0)
        anchor_match = re.search(r'<a [^>]+>[^<]+</a>', m.group(5))
        if not anchor_match:
            return m.group(0)
        new_p = sentence_template.format(a=anchor_match.group(0))
        return f"{m.group(1)}{m.group(2)}{m.group(3)}\n{m.group(4)}{new_p}{m.group(6)}"

    return pattern.sub(repl, content)
```
