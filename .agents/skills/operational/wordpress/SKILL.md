---
name: wordpress
description: Work with a live WordPress site over the REST API using a WordPress username plus Application Password. Use when the user wants to create, update, fetch, or manage WordPress content or media that the API and the authenticated user allow. The primary use case in this repo is staging blog drafts from source files for human review before publishing.
---

# WordPress

Use this skill for WordPress API work.

The main use case in this repo is taking source content and creating or updating WordPress blog drafts while preserving the source document's structure and style as closely as practical.

Agents should keep this broader context in mind:

- if the WordPress REST API exposes an operation
- and the authenticated WordPress user has permission
- this skill can generally be used for that task

Examples beyond blog staging:

- read posts, pages, media, categories, and tags
- update existing posts or pages
- upload and attach media
- set taxonomy fields and featured media
- manage draft, scheduled, private, or published status when explicitly requested
- update specialized WordPress surfaces through sub-skills, such as the About us
  team grid in [`about-team/SKILL.md`](about-team/SKILL.md)

In this repo, blog drafting is the first and most important workflow, but it is not the only supported one.

## Scope

This skill is intentionally narrow:

- stage blog posts as `draft`
- update existing blog drafts
- upload media needed for those blog drafts
- return the admin edit URL for human review

This skill is not for autonomous publishing.

Default rule:

- agents stage blog content
- humans review in WordPress
- humans decide whether to publish

Do not publish a blog post directly unless the user explicitly asks for that final step.

## What to use

Prefer the WordPress REST API for remote blog staging:

- posts
- media uploads
- categories
- tags

Use WP-CLI only when the task explicitly includes shell access to the WordPress host. WP-CLI is useful, but it is not a general remote API.

For most hosted WordPress sites, the practical path is:

1. get source content from a local file, Notion, Google Doc export, Markdown, or HTML
2. preserve the source structure and styling as clean HTML
3. upload media if needed
4. create or update a WordPress post as `draft`
5. return the WordPress edit URL and API object ID for human review

## Auth model

WordPress REST API auth for this skill uses:

- site base URL like `https://YOUR-SITE.example`
- WordPress username
- WordPress Application Password

Authentication is HTTP Basic Auth:

- username = WordPress username
- password = Application Password

Use HTTPS only.

Read [set-up/wordpress-api.md](set-up/wordpress-api.md) before first use or when auth fails.

## Default environment variables

Store credentials in `.env`:

```bash
WORDPRESS_BASE_URL=https://YOUR-SITE.example
WORDPRESS_USERNAME=your_username
WORDPRESS_APPLICATION_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"
```

Important:

- WordPress Application Passwords usually contain spaces
- if you load `.env` with `source .env`, quote the password value
- unquoted values with spaces will break shell parsing and make auth look broken
- if the `.env` was ever saved on Windows or pasted via a CRLF-capable editor, every value silently ends in a `\r`. `curl` rejects the URL as `Malformed input to a URL function`, and the Basic Auth header is corrupted so requests that do reach WordPress come back as `401`. If you see either symptom, run `grep WORDPRESS_BASE_URL .env | xxd` to check for `0d 0a` at end of line. Strip CR (`sed -i '' $'s/\\r$//' .env`) or load the file from Python with `.strip()` per value instead of `source .env`.

When using the API from shell, construct the auth pair as:

```bash
-u "$WORDPRESS_USERNAME:$WORDPRESS_APPLICATION_PASSWORD"
```

## Quick auth check

Prefer a lightweight read first:

```bash
set -a; source .env; set +a
curl -fsS \
  -u "$WORDPRESS_USERNAME:$WORDPRESS_APPLICATION_PASSWORD" \
  "$WORDPRESS_BASE_URL/wp-json/wp/v2/posts?per_page=1"
```

If that returns JSON, the credential is working.

Do not use `/wp-json/wp/v2/users/me` for the check — on hardened WordPress installs (including `arize.com`) a security plugin returns `403` on that endpoint even with valid Application Password credentials. A working credential can still pass `/posts`, `/categories`, `/tags`, and `/media` while failing `/users/me`, so a `403` on `/users/me` alone is not proof that auth is broken.

## Python recipe

Shell `curl` is fine for one-off probes, but most staging work converts a DOCX or HTML source and uploads several images, so a Python script ends up shorter and more reliable than long shell pipelines. It also sidesteps the CRLF issue in `.env` by parsing the file directly.

```python
import urllib.request, base64, json, os

env = {}
with open('.env', 'rb') as f:
    for line in f.read().decode('utf-8').splitlines():
        line = line.strip()                          # strips trailing \r from CRLF .env files
        if not line or line.startswith('#') or '=' not in line:
            continue
        k, v = line.split('=', 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

BASE = env['WORDPRESS_BASE_URL'].rstrip('/')
AUTH = base64.b64encode(
    f"{env['WORDPRESS_USERNAME']}:{env['WORDPRESS_APPLICATION_PASSWORD']}".encode()
).decode()
HEADERS = {'Authorization': f'Basic {AUTH}', 'User-Agent': 'curl/8.0'}

def wp(method, path, *, json_body=None, raw=None, extra_headers=None):
    headers = dict(HEADERS)
    if json_body is not None:
        headers['Content-Type'] = 'application/json'
        data = json.dumps(json_body).encode()
    else:
        data = raw
    if extra_headers:
        headers.update(extra_headers)
    req = urllib.request.Request(BASE + path, data=data, method=method, headers=headers)
    with urllib.request.urlopen(req) as r:
        body = r.read()
    return json.loads(body) if body and body[:1] in b'[{' else body

def upload_image(path, alt):
    fname = os.path.basename(path)
    with open(path, 'rb') as f:
        data = f.read()
    media = wp('POST', '/wp-json/wp/v2/media', raw=data, extra_headers={
        'Content-Type': 'image/png',
        'Content-Disposition': f'attachment; filename={fname}',
    })
    wp('POST', f"/wp-json/wp/v2/media/{media['id']}", json_body={'alt_text': alt, 'caption': alt})
    return media['id'], media['source_url']

def create_draft(title, html_body, *, featured_media, categories, tags, excerpt='', slug=None):
    payload = {
        'title': title, 'content': html_body, 'excerpt': excerpt,
        'status': 'draft', 'featured_media': featured_media,
        'categories': categories, 'tags': tags,
        'comment_status': 'closed', 'ping_status': 'closed',
    }
    if slug:
        payload['slug'] = slug
    return wp('POST', '/wp-json/wp/v2/posts', json_body=payload)
```

Notes:

- Set an explicit `User-Agent`. The default Python user-agent (`Python-urllib/...`) is sometimes blocked by WordPress security plugins; `curl/8.0` reliably gets through on the Arize install.
- For updates, `POST` to `/wp-json/wp/v2/posts/<id>` with only the fields you want to change. The REST API treats `POST` as upsert on update endpoints; you do not need `PUT` or `PATCH`.
- The final edit URL is `BASE + f"/wp-admin/post.php?post={post_id}&action=edit"`. Always print it on success.

## Looking up taxonomy and reference posts

When staging to an established blog, look up category and tag IDs from the live site instead of guessing. A few patterns that pay for themselves quickly:

- `GET /wp-json/wp/v2/categories?per_page=100&page=<n>` — paginate until a short page or `400`. Most Arize-scale sites fit in one or two pages.
- `GET /wp-json/wp/v2/tags?search=<keyword>` — much faster than paginating all tags. Search several keywords in a loop and dedupe by `id`.
- `GET /wp-json/wp/v2/posts?per_page=5&_fields=id,date,slug,title,categories,tags,status,link` — quick survey of recent posts; the `categories`/`tags` arrays are the canonical way to pick a topical match.
- `GET /wp-json/wp/v2/posts/<id>?context=edit` — returns `content.raw` (Gutenberg-source HTML) and full metadata for a chosen reference post. Use it to learn the site's actual block conventions (figure wrappers, `<h2><b>…</b></h2>` vs `<h2>…</h2>`, whether comments are closed by default, what `featured_media` looks like) before staging a new draft.

The recurring move is: pick one or two recently-published posts on the same topic, fetch them with `context=edit`, and mirror their `categories`, `tags`, `comment_status`, `ping_status`, and figure-wrapper conventions in the new draft.

## Core API patterns

Create a draft post:

```bash
curl -fsS -X POST \
  -u "$WORDPRESS_USERNAME:$WORDPRESS_APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  "$WORDPRESS_BASE_URL/wp-json/wp/v2/posts" \
  -d '{
    "title": "Test draft",
    "content": "<p>Hello</p>",
    "status": "draft"
  }'
```

Update an existing post:

```bash
curl -fsS -X POST \
  -u "$WORDPRESS_USERNAME:$WORDPRESS_APPLICATION_PASSWORD" \
  -H "Content-Type: application/json" \
  "$WORDPRESS_BASE_URL/wp-json/wp/v2/posts/<post_id>" \
  -d '{
    "title": "Updated title",
    "content": "<p>Updated body</p>"
  }'
```

Upload media:

```bash
curl -fsS -X POST \
  -u "$WORDPRESS_USERNAME:$WORDPRESS_APPLICATION_PASSWORD" \
  -H "Content-Disposition: attachment; filename=image.png" \
  -H "Content-Type: image/png" \
  --data-binary "@image.png" \
  "$WORDPRESS_BASE_URL/wp-json/wp/v2/media"
```

Useful fields:

- `title`
- `content`
- `excerpt`
- `slug`
- `status`
- `date`
- `categories`
- `tags`
- `featured_media`

Common statuses:

- `draft`
- `future`
- `publish`
- `private`

In this repo, default to `draft`.

## Programmatic staging from local files, Notion, or Google Docs

Yes, an agent can stage blog posts programmatically.

The cleanest mental model is:

- source system provides content
- agent converts it into WordPress-safe HTML
- WordPress stores the draft

For the most reliable workflow in this repo:

1. download the source document locally
2. give the agent the absolute file path
3. let the agent convert that local file into a WordPress draft

Examples of good inputs:

- `/Users/datngo/Downloads/post.docx`
- `/Users/datngo/Downloads/post.html`
- `/Users/datngo/Downloads/post.pdf`
- `/Users/datngo/Downloads/post.txt`
- `/Users/datngo/Downloads/post.md`

This is usually better than pasting large document bodies into chat.

Typical flows:

1. local DOCX / HTML / Markdown file -> rich conversion -> WordPress draft
2. local PDF file -> layout-aware extraction and cleanup -> WordPress draft
3. Notion page -> Notion API -> Markdown/HTML -> WordPress draft
4. Google Doc export -> HTML/Markdown/DOCX -> WordPress draft
5. raw Markdown in repo or scratch file -> WordPress draft

## Source priority

When multiple source formats are available for the same blog post, prefer the one that preserves structure best:

1. `docx`
2. `html`
3. `md`
4. `pdf`
5. `txt`

If both `docx` and `pdf` are available, use the `docx` as the primary source and use the `pdf` only as a visual cross-check.

If `html` and `pdf` are both available, use the `html` as the primary source and the `pdf` as the visual QA reference.

## Prescribed conversion strategy

Do not use one universal parser for every file type. Use the converter that matches the source format.

Preferred tools by source type:

1. `docx`
   - primary: `mammoth`
   - optional structural inspection: `python-docx`
   - reason: `docx` is an authoring format and `mammoth` preserves document structure much better than plain text extraction
   - known `mammoth` pitfalls — handle these in a post-processing pass before staging:
     - embedded images come out as `<img src="data:image/png;base64,…">`. Do not paste those into WordPress. Strip the data URLs and upload the original raster assets through `/wp-json/wp/v2/media`, then re-insert them as `<figure class="wp-block-image size-large"><img class="alignnone size-full wp-image-{id}" src="…" alt="…" /><figcaption>…</figcaption></figure>` to match the site's existing block wrapper.
     - every heading is preceded by an empty docx anchor like `<a id="_63vrd0jqvx0y"></a>`. Strip them with `re.sub(r'<a id="_[a-z0-9]+"></a>', '', html)`. They are harmless but pollute the editor view.
     - markdown-style nested blockquote headings (`> ### CONSTRAINTS`) flatten to a top-level `<h3>` *outside* the `<blockquote>`. That pulls a "CONSTRAINTS"-style fragment into the theme's H2/H3 table of contents. Detect and fold the H3 + following list back inside the blockquote, downgrading the H3 to `<p><strong>…</strong></p>` if it is example content rather than a real article section.
     - tables come out with every row inside `<thead>` and every cell as `<th>`. Re-split into a single `<thead>` row plus `<tbody>` with `<td>` cells before saving, otherwise the front end renders the whole table as a header band.
     - drop the source `<h1>` title from the body; the post title goes in the `title` field, not the content.
2. `html`
   - preserve and sanitize lightly
   - do not flatten into plain text first
   - if the file is a bundled offline export, inspect the rendered article DOM or bundled template instead of assuming the top-level file is already usable article markup
3. `md`
   - convert Markdown to HTML with a deterministic Markdown parser
4. `pdf`
   - fallback only: `pypdf`
   - use layout-aware extraction when possible
   - reason: `pdf` is a presentation format, not a semantic authoring format
5. `txt`
   - last-resort fallback
   - reconstruct paragraphs conservatively

Rules:

- if `docx` exists, do not use `pdf` as the primary source
- if `html` exists and contains the authored article structure, do not use `pdf` as the primary source
- if the chosen converter loses too much structure, stop and ask for a better source file instead of staging a poor draft
- when staging succeeds, always print the WordPress admin edit URL
- print a preview or permalink URL too when WordPress returns one

If the source is a local PDF, the agent should:

- extract text and heading structure from the PDF
- rebuild the post into clean WordPress-safe HTML
- avoid pasting PDF line breaks, page headers, or footer noise directly into the draft
- flag any tables, images, or formatting that may need human cleanup after staging

## Standalone HTML workflow

Standalone HTML is a strong input format for this skill when it already represents the authored article.

This includes:

- simple static HTML exports
- design-heavy article pages with inline CSS
- self-contained offline exports that bundle assets into the file
- JavaScript-driven offline bundles that render the article into a root node at runtime

Example:

- `/Users/datngo/Downloads/Prompt Templates as Configs _offline_.html`

When the HTML is a bundled offline export, the agent should first determine which of these cases applies:

1. the article markup already exists directly in the HTML
2. the article markup lives inside a serialized template string or embedded asset bundle
3. the article markup is produced only after JavaScript renders a component tree

For cases 2 and 3, do not stage the outer wrapper as-is. In particular, do not paste the export shell into WordPress if it contains:

- bundler bootstrapping scripts
- React or Babel runtime scripts
- synthetic loading states
- site navigation that is not part of the post body
- sticky table of contents chrome that should be recreated more simply in WordPress
- footer chrome that belongs to the export, not the article

Instead, extract the article content and rebuild it into WordPress-safe HTML.

For standalone HTML, preserve when practical:

- title
- dek or subhead
- byline
- section headings
- paragraphs
- lists
- pull quotes
- callouts
- code blocks
- inline code
- figure captions

For standalone HTML, simplify when needed:

- sticky navigation
- interactive table of contents behavior
- custom scroll observers
- app-shell layout grids
- exact font loading behavior
- exact pixel-level spacing from the export

If the standalone HTML contains embedded images or data-URL assets, prefer extracting or uploading reusable media assets separately when WordPress media handling will be cleaner than inlining them into post content.

If the standalone HTML depends on local blob URLs, runtime asset unpacking, or JavaScript hydration, use the HTML as the structural source and the PDF as the visual cross-check before staging.

For HTML and PDF sources, assume images, diagrams, and complex figures are a high-risk part of the transfer. Even when the text converts cleanly, visuals may shift, truncate, map to the wrong asset, or degrade when moved into WordPress.

The target output is not "the original HTML page inside WordPress." The target output is:

- a clean draft post body
- compatible with the WordPress editor and front end
- visually faithful enough for review
- free of export-only scripts and shell markup

If the source is a local DOCX, the agent should:

- prefer a rich DOCX-to-HTML conversion path over plain text extraction
- preserve heading hierarchy, paragraph breaks, bold, italics, links, lists, block quotes, and code blocks when possible
- preserve image placement and captions when practical, or flag any missing media explicitly
- avoid flattening the document into plain paragraphs when the source already contains good structure

If the source is a Google Doc link, the missing piece is usually export access. The doc must be:

- readable by the account/tool in use, or
- exported manually to Markdown / HTML / DOCX first

If the source is a Notion page, use the Notion API to fetch blocks, then transform them into HTML.

## Content handling rules

When staging posts:

- preserve the source document's section structure and reading flow
- preserve headings and links
- preserve emphasis such as bold and italics where possible
- convert lists and code blocks cleanly
- preserve block quotes, tables, and callouts when feasible; otherwise flag what was lost
- avoid dumping raw editor-specific markup into WordPress
- upload referenced images separately instead of leaving local file paths
- default to `draft`
- treat publishing as a separate human-review step unless the user explicitly overrides that
- do not inject internal workflow metadata into the visible blog body, including source file paths, “staged automatically” notes, or agent provenance banners

## Arize blog layout defaults

For posts being staged to the Arize blog, distinguish carefully between:

- post-body content stored in WordPress for the article itself
- site-level blog chrome rendered by the Arize theme or template around that content

Do not assume those are authored in the same layer.

### Right-rail table of contents

Use a desktop right-side table of contents pattern similar to the live Arize blog article:

- `https://arize.com/blog/what-is-an-agent-harness/`

The TOC should:

- appear on the right on desktop widths
- be driven by the article `h2` section headings
- use anchor links into the article body
- remain simpler than the source export if needed, but preserve the same navigational function
- be allowed to collapse, hide, or move below the article on smaller screens

When rebuilding a post from DOCX, HTML, Markdown, or PDF, the agent should generate stable section IDs so the TOC can link correctly.

Do not omit the TOC just because the source file did not provide one directly. If the article has enough sections to benefit from navigation, build it from the heading structure.

Important:

- first determine whether the right-rail TOC is generated by the Arize theme/template rather than stored directly in post content
- if it is theme-level chrome, do not inject a custom fake TOC block into the post body just to force the feature
- instead, make sure the post body exposes the heading structure and anchor IDs the theme needs

### Bottom blog module

For Arize blog staging, identify whether the standard bottom-of-post module is theme-rendered or content-authored before adding anything.

Use the live Arize blog article above as the reference pattern. As of April 24, 2026, that page includes:

- an author block near the end of the article
- a newsletter callout for `The Evaluator`
- a multi-column footer-style menu with sections such as `Platform`, `Learn`, `Topics`, and `Company`
- bottom CTA / utility links such as `Get started`, `Book a Demo`, `Sign In`, `Contact`, `AX Platform Status`, `Privacy Policy`, and social links
- a subscribe module for `The Evaluator`

For the skill, the important rule is not pixel-perfect duplication. The rule is:

- do not hand off a draft that ends abruptly after the last paragraph if Arize blog posts normally include the bottom module
- preserve or recreate the expected newsletter and navigation module in a WordPress-compatible way when that module is actually part of post content
- prefer existing site-native blocks, reusable patterns, or server-rendered HTML already used by Arize over inventing a one-off footer fragment

If the bottom module is theme-level chrome rather than post-body content:

- do not paste a synthetic footer/newsletter/navigation block into the article body
- instead, ensure the article body is complete and let the site template render the standard module

If the exact reusable WordPress block or shortcode is unknown, the agent should:

- inspect a recent live Arize blog post for the expected structure
- stage a structurally similar bottom module
- clearly note in the handoff if the draft still needs the site-native reusable block substituted by a human

### Practical staging rule

For Arize blog posts, the staged result should preserve whichever split the live site actually uses between:

- article content stored in the post body
- blog chrome rendered by the theme

Do not treat missing theme chrome inside the raw post content as proof that the draft is incomplete.

## Arize reference-post workflow

When staging to the Arize blog, prefer using a recent live Arize blog post as the structural reference instead of inventing wrapper HTML from scratch.

Primary example reference:

- `https://arize.com/blog/what-is-an-agent-harness/`

The workflow should be:

1. fetch the live post through WordPress or the public rendered page
2. inspect the rendered WordPress HTML structure that surrounds the article
3. identify which pieces are site-native blog chrome versus article-specific content
4. reuse the site-native structure, classes, blocks, or patterns where practical
5. only then inject or transform the new article content

This matters because Arize blog drafts should match the actual WordPress-rendered site patterns, not a one-off approximation assembled by the agent.

For Arize specifically:

- prefer real WordPress-rendered HTML over guessed layout wrappers
- prefer existing reusable blocks, patterns, or modules already present in live posts
- prefer copying the structural pattern of the TOC and bottom blog module from a real post instead of recreating them from memory
- determine which parts of the page are outside `post.content.rendered` before modifying the draft body

For example, if a live reference post shows author cards, share UI, TOC, newsletter modules, or footer navigation in the public page HTML, but those elements do not exist in the WordPress post body's rendered content, treat them as theme-level chrome by default.

If a live reference post exists and is easy to inspect, do not skip that step.

## Completeness validation

Before saving a staged draft, validate that the transformed draft is complete relative to the source.

Minimum checks:

- heading count matches the authored article structure closely enough
- the draft reaches the true end of the source article
- all major sections are present in order
- all expected figures or visual blocks are accounted for
- captions, callouts, and end-of-article summaries are not silently dropped

For HTML or React-driven offline sources, do not assume the first successful render is complete. Verify the output against the source file and any companion PDF.

Practical validation methods include:

- compare section counts between source and staged HTML
- compare figure counts between source and staged HTML
- inspect the last several paragraphs of the source and the staged draft to ensure the article was not truncated
- cross-check embedded images against the source bundle and the PDF visual reference
- compare the transformed draft body against the live site's expected content layer so you do not accidentally remove or duplicate theme-level chrome
- inspect the staged preview specifically for broken figures, missing arrows, label overlap, truncated diagrams, and incorrect image-to-caption mapping

## Theme-integrity checks

For Arize blog posts, do a final pass on theme-dependent post metadata before handoff.

Do not assume a correct post body guarantees a correct preview. The live theme may depend on post metadata such as:

- `featured_media`
- template selection
- author assignment
- excerpt
- taxonomy or other theme-consumed fields

Minimum checks before handoff:

- inspect `featured_media`
- compare it with a recent live reference post when the theme renders a hero or header image
- verify the preview is not showing a broken image, empty media slot, or placeholder above the title
- verify the post body is not duplicating theme-rendered title, author, or hero chrome

If a live Arize reference post renders a header image next to or above the title, and the draft's `featured_media` is empty or invalid, treat that as an incomplete staging state.

The skill should prefer:

1. a valid featured image set explicitly
2. a deliberate decision to leave featured image blank when the theme supports that cleanly
3. never leaving the draft in a state where the theme renders a broken image placeholder

If the draft is missing sections, has the wrong images, or ends early, do not hand it off as complete.

## Image fidelity rule

For staged blog posts, image correctness is part of correctness, not a cosmetic afterthought.

Agents should verify:

- each source image is mapped to the intended figure
- alt text and captions stay attached to the correct image
- images that exist as raster assets in the source are not accidentally replaced by the wrong asset
- diagrams rendered inline from source HTML or JSX survive the transformation without semantic breakage

If the source includes both inline-rendered diagrams and uploaded raster images:

- preserve inline diagrams when WordPress can safely render them
- upload raster assets separately
- verify that the final order of images and diagrams matches the source article

## Inline SVG safety rule

Inline SVG inside blog-body HTML is not automatically safe for WordPress previews or theme rendering.

Treat these SVG features as high risk:

- `foreignObject`
- embedded HTML inside SVG
- complex marker / filter / pattern combinations
- any SVG that depends on browser-specific HTML-in-SVG rendering behavior

If a diagram uses those features, do not assume it will preview correctly in WordPress even if the raw post content saves successfully.

Preferred fallback order:

1. rebuild the diagram as plain HTML/CSS
2. use a rasterized image asset
3. use a simpler SVG that avoids `foreignObject` and embedded HTML

When a preview appears to cut off immediately after an SVG-heavy figure, suspect malformed or unsupported inline SVG first.

Do not accept a low-fidelity conversion if a higher-fidelity source format is available.

If the conversion path collapses formatting badly, stop and use a better source file instead of staging a low-quality draft.

Before creating the draft, confirm:

- title
- slug if needed
- publish status, default `draft`
- canonical CTA or destination link
- whether categories/tags should be assigned now or later

## Review rule

Every staged post should be reviewed by a human in WordPress before publishing.

The expected handoff is:

1. agent creates or updates the draft
2. agent returns the edit URL
3. agent explicitly tells the human that images and figures can transfer imperfectly from HTML or PDF and asks for a visual review in WordPress preview
4. human reviews formatting, document structure, links, images, figures, CTA, category/tag choices, and SEO fields
5. human publishes
6. optional: run content calendar review — [`../notion/sync-content-calendar/SKILL.md`](../notion/sync-content-calendar/SKILL.md) on demand; scans WordPress publishes from the last 30 days, offers matching Notion updates, applies only after human confirms

## Edit URL handoff

When you create or update a post, return:

- post ID
- rendered permalink if available
- admin edit URL
- a note that the draft should be reviewed by a human before publishing
- an explicit request for the human to inspect images, figures, and any complex visual layouts in preview

The final handoff should explicitly print the WordPress edit link so a human can open the staged draft immediately.

Typical edit URL pattern:

`https://<site>/wp-admin/post.php?post=<post_id>&action=edit`

## Failure modes

Common issues:

- `401` or `403`: bad credentials, missing Application Password, non-HTTPS site, or security plugin blocking Basic Auth. On `arize.com` specifically, `/wp-json/wp/v2/users/me` returns `403` even with valid credentials — use `/posts?per_page=1` as the auth probe instead.
- `curl: (3) URL rejected: Malformed input to a URL function`: `.env` has CRLF line endings and `WORDPRESS_BASE_URL` ended up with a trailing `\r`. Convert the file to LF or load it through Python with per-line `.strip()`.
- `.env: command not found` while sourcing: the Application Password was pasted with spaces and not wrapped in quotes
- HTTP requests from Python silently `403` while equivalent `curl` succeeds: the WordPress security plugin is blocking the default `Python-urllib/…` user agent. Set `User-Agent: curl/8.0` (or similar) explicitly on every request.
- HTML looks bad in WordPress: source doc conversion was too literal
- media upload fails: wrong MIME type or insufficient user permissions
- category/tag assignment fails: IDs do not exist yet

If auth fails, check [set-up/wordpress-api.md](set-up/wordpress-api.md).
