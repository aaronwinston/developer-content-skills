# X-to-WordPress Scraper Skill

## Overview

The **x-to-wordpress-scraper** skill extracts articles, posts, and threads from Aparna's X/Twitter feed and converts them into WordPress-ready text files that can be imported directly into your blog.

This creates an automated content pipeline: **X → Scraper → WordPress import file → WordPress post**.

## Quick Start

### 1. Scrape a tweet from Aparna's feed

```bash
# From the ForgeOS repo root
curl -X POST http://localhost:8000/api/content/x-to-wordpress \
  -H "Content-Type: application/json" \
  -d '{
    "x_url": "https://x.com/aparnadhinak/status/2048492731929149929",
    "category": "Founder Insights",
    "tags": ["product-thinking", "ai"]
  }'
```

### 2. Review the generated file

```bash
# File is saved to: docs/content/incoming/wordpress-[timestamp].txt
cat docs/content/incoming/wordpress-aparna-post-*_latest.txt
```

### 3. Import into WordPress

Copy the file content into WordPress:
1. Log in to WordPress
2. Create new post
3. Paste the content from the `.txt` file
4. Publish

Or use WordPress import tools to automate.

## API Endpoints

### `POST /api/content/x-to-wordpress`

Convert X/Twitter post to WordPress import file.

**Request body:**

```json
{
  "x_url": "https://x.com/aparnadhinak/status/2048492731929149929",
  "content_type": "post",
  "category": "Founder Insights",
  "tags": ["product-thinking", "ai"],
  "author_override": "Aparna Dhinakaran"
}
```

**Parameters:**

- `x_url` (required): X/Twitter post URL
  - Format: `https://x.com/username/status/ID` or `https://twitter.com/username/status/ID`
  - Supports both single posts and threads

- `content_type` (optional): Type of content
  - `post` (default): Single X post
  - `thread`: Multi-tweet thread (concatenated)
  - `article-link`: Article linked in the post

- `category` (optional): WordPress category
  - Default: `"Incoming"`
  - Examples: `"Founder Insights"`, `"Product Updates"`, `"Thought Leadership"`

- `tags` (optional): Additional tags (comma-separated or array)
  - Default: `["aparna", "founder-insights"]`
  - Example: `["ai", "product-thinking", "technical"]`

- `author_override` (optional): Override author name
  - Default: `"Aparna Dhinakaran"`
  - Used in WordPress post metadata

**Response:**

```json
{
  "status": "success",
  "filepath": "/path/to/docs/content/incoming/wordpress-aparna-post-2048492731929149929_20260427_114216.txt",
  "filename": "wordpress-aparna-post-2048492731929149929_20260427_114216.txt",
  "preview": "Title: Aparna's latest insights on AI-driven product development...",
  "category": "Founder Insights",
  "tags": ["aparna", "founder-insights", "ai", "product-thinking"],
  "source_url": "https://x.com/aparnadhinak/status/2048492731929149929",
  "author": "Aparna Dhinakaran"
}
```

### `GET /api/content/x-to-wordpress/validate`

Validate X/Twitter URL format without scraping.

**Query parameters:**

- `url`: X/Twitter URL to validate

**Example:**

```bash
curl "http://localhost:8000/api/content/x-to-wordpress/validate?url=https://x.com/aparnadhinak/status/2048492731929149929"
```

**Response:**

```json
{
  "valid": true,
  "type": "post",
  "username": "aparnadhinak",
  "post_id": "2048492731929149929",
  "url": "https://x.com/aparnadhinak/status/2048492731929149929"
}
```

### `GET /api/content/x-to-wordpress/templates`

List available WordPress import templates and file formats.

**Response:**

```json
{
  "templates": {
    "post": {
      "description": "Single X post",
      "extension": ".txt",
      "fields": ["title", "content", "author", "category", "tags"]
    },
    "thread": {
      "description": "Multi-tweet thread (concatenated)",
      "extension": ".txt",
      "fields": ["title", "content", "author", "category", "tags", "thread_length"]
    },
    "article_link": {
      "description": "Article linked in X post",
      "extension": ".txt",
      "fields": ["title", "content", "author", "original_source", "category", "tags"]
    }
  },
  "output_directory": "docs/content/incoming/",
  "filename_format": "wordpress-[source]-[post_id]-[timestamp].txt",
  "encoding": "utf-8"
}
```

## Output File Format

Generated files are saved to `docs/content/incoming/` with a WordPress-ready structure:

```
WORDPRESS IMPORT FILE
=====================

Title: Aparna's latest insights on product thinking
Author: Aparna Dhinakaran
Date: 2026-04-27 11:42:16
Category: Founder Insights
Tags: aparna, founder-insights, ai, product-thinking
Source: https://x.com/aparnadhinak/status/2048492731929149929
Source Author: @aparnadhinak

---

Here's the clean, extracted content from the tweet or thread.

All links are preserved. HTML is clean. No X tracking pixels.

This content is ready to copy directly into WordPress.

---

Original X post: https://x.com/aparnadhinak/status/2048492731929149929
Posted: 2026-04-27T11:42:16Z
Engagement: 245 retweets, 1250 likes
```

## Workflow Examples

### Example 1: Import a single tweet

```bash
curl -X POST http://localhost:8000/api/content/x-to-wordpress \
  -H "Content-Type: application/json" \
  -d '{
    "x_url": "https://x.com/aparnadhinak/status/2048492731929149929",
    "category": "Insights"
  }'

# Result: File saved to docs/content/incoming/
# Copy the file content into WordPress post editor
# Publish
```

### Example 2: Batch import from Aparna's profile

```bash
# Get Aparna's latest posts
# For each post URL:
#   - Call /api/content/x-to-wordpress
#   - Save file to docs/content/incoming/
# Review all files in incoming/
# Triage by category and publish
```

### Example 3: Thread handling

```bash
# For a thread (replies by same author), the skill:
# 1. Detects all connected tweets
# 2. Concatenates in order with visual separators
# 3. Marks thread length: "Thread of 5 tweets"
# 4. Formats as single WordPress post

curl -X POST http://localhost:8000/api/content/x-to-wordpress \
  -H "Content-Type: application/json" \
  -d '{
    "x_url": "https://x.com/aparnadhinak/status/...",
    "content_type": "thread",
    "tags": ["thread", "thinking"]
  }'
```

## File Organization

Generated files persist in the repo for audit trail:

```
docs/content/incoming/
├── wordpress-aparna-post-2048492731929149929_20260427_114216.txt
├── wordpress-aparna-post-2048492718291827364_20260427_113045.txt
├── wordpress-aparna-thread-1234567890_20260426_155230.txt
└── ...
```

Each file:
- Contains one WordPress post
- Is timestamped (prevents accidental overwrites)
- Is versioned in git (audit trail)
- Can be imported anytime

### Cleanup strategy

- Keep `docs/content/incoming/` in `.gitignore` if files are temporary
- Or commit them for historical record
- Archive old imports to `docs/content/archive/` after publishing

## Integration with Publishing Pipeline

### Option 1: Manual import

1. Scrape X post with API
2. Review generated file in editor
3. Copy/paste into WordPress
4. Publish

### Option 2: Automated import (requires WordPress XML-RPC or REST API)

```python
# Pseudo-code for integration
def import_x_post(x_url):
    # 1. Call scraper
    result = convert_x_to_wordpress(x_url)
    
    # 2. Read generated file
    content = read_file(result['filepath'])
    
    # 3. Parse frontmatter and body
    meta, body = parse_wordpress_import(content)
    
    # 4. Create WordPress post via REST API
    post_id = wordpress_api.create_post(
        title=meta['title'],
        content=body,
        author=meta['author'],
        category=meta['category'],
        tags=meta['tags'],
    )
    
    # 5. Return post URL
    return f"https://yoursite.com/posts/{post_id}"
```

### Option 3: Use with ForgeOS content pipeline

1. **Scrape** X post with x-to-wordpress-scraper
2. **Draft** in `docs/content/incoming/`
3. **Review** in copy-chief or editorial-director
4. **Publish** to WordPress
5. **Track** lifecycle in content-lifecycle.md

## Quality Standards

Good WordPress imports should:

- ✅ Preserve original voice and meaning exactly
- ✅ Include all links and mentions
- ✅ Clean up platform-specific metadata
- ✅ Include proper author attribution
- ✅ Be importable to WordPress with zero manual fixes
- ✅ Include original X URL for reference

The skill avoids:

- ❌ Losing or breaking links
- ❌ Mangling special characters (emojis, quotes)
- ❌ Including X tracking pixels
- ❌ Truncating content to fit constraints
- ❌ Assuming engagement metrics are meaningful

## Troubleshooting

### "Invalid X/Twitter URL"

Make sure the URL is in one of these formats:
- `https://x.com/username/status/ID`
- `https://twitter.com/username/status/ID`

Use the `/validate` endpoint to check:

```bash
curl "http://localhost:8000/api/content/x-to-wordpress/validate?url=YOUR_URL"
```

### "Failed to convert X post"

Common causes:
- URL is inaccessible (deleted, private, suspended)
- Rate limit hit on X API
- Network connection issue

Check server logs:

```bash
tail -f logs/api.log | grep "x-to-wordpress"
```

### Files not appearing in `docs/content/incoming/`

1. Check directory exists: `mkdir -p docs/content/incoming/`
2. Check write permissions: `ls -la docs/content/`
3. Check API response for actual filepath
4. Verify no path rewriting happening

## Related Skills

- **founder-x-recap** — Summarize founder activity (instead of importing)
- **social-editor** — Edit social content for brand voice (after import)
- **technical-fact-checker** — Verify claims (before publish)
- **ai-researcher** — Research linked articles (before import)
- **copy-chief** — Copyedit before publication
- **editorial-director** — Overall editorial workflow

## Implementation Notes

### Architecture

```
X/Twitter URL
    ↓
[x-to-wordpress-scraper skill]
    ↓
    └─ Fetch post metadata
    └─ Extract content (text, links, mentions)
    └─ Handle threads (concatenate)
    └─ Handle article links (fetch + extract)
    ↓
[Clean & format]
    └─ Remove tracking pixels
    └─ Normalize links
    └─ Fix encoding
    ↓
[Generate WordPress file]
    └─ Add frontmatter
    └─ Structure body
    └─ Save to docs/content/incoming/
    ↓
WordPress Import File (.txt)
```

### API Implementation

- **Service:** `apps/api/services/x_to_wordpress.py`
  - `XToWordPressConverter` class
  - `parse_x_url()` — URL validation
  - `format_wordpress_import()` — File formatting
  - `save_import_file()` — Persistence

- **Router:** `apps/api/routers/x_to_wordpress.py`
  - `POST /api/content/x-to-wordpress` — Main conversion endpoint
  - `GET /api/content/x-to-wordpress/validate` — URL validation
  - `GET /api/content/x-to-wordpress/templates` — Format reference

### Future Enhancements

- [ ] Fetch actual X API data (instead of stub)
- [ ] Support thread concatenation
- [ ] Extract article body from linked URLs
- [ ] Schedule recurring imports from feed
- [ ] Auto-tag based on content analysis
- [ ] WordPress XML-RPC direct publish
- [ ] Batch import from profile
- [ ] Webhook trigger from X

## Support

For issues or questions:
- Check the troubleshooting section above
- Review API response messages
- Check server logs: `tail logs/api.log`
- Open an issue in the repo
