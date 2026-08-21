---
name: typefully-draft-with-utm
description: Create Typefully drafts for X/Twitter or LinkedIn with an embedded devrel UTM link. Use when a user asks to prepare, create, save, or draft a social post in Typefully with tracking, attribution, a UTM link, or campaign parameters.
---

# Typefully Draft With UTM

Use this skill to create Typefully drafts that include a generated devrel UTM
link in the post text.

## Inputs

Ask for any missing required input:

- Article title (used as the default draft title).
- Post text.
- Platform: `x` or `linkedin`, if not clear.

Default the destination URL to `https://arize.com` unless the user specifies a
different URL. Do not ask for the URL only because it is missing.

Do not ask for the Typefully account unless the user explicitly wants a
non-default account. Default to `@arizeai` with social set id `265880`.

## UTM Convention

Follows the Arize UTM taxonomy: `utm_source` is the platform, `utm_medium` is
the channel type, and `utm_content` is the person sharing — not the article
title. Generate the link with:

| Parameter | Value |
| --- | --- |
| `utm_source` | The Typefully platform where it posts: `x` or `linkedin` |
| `utm_medium` | `social` (both x and linkedin are organic social) |
| `utm_campaign` | `devrel` |
| `utm_content` | The person sharing, as `first-last`, from `git config user.name`. Override with `--content`. |

The Typefully create-draft API accepts plain post `text`, so include the UTM
URL as a plain URL. If the post text contains `{utm_url}`, replace that
placeholder. Otherwise append the URL after a blank line.

## Script

Dry-run first to inspect the request body without calling Typefully:

```bash
python3 .agents/skills/operational/typefully/draft-with-utm/scripts/create_typefully_draft.py \
  --title "Example article title" \
  --platform linkedin \
  --text "Post copy goes here" \
  --dry-run
```

Create the draft:

```bash
python3 .agents/skills/operational/typefully/draft-with-utm/scripts/create_typefully_draft.py \
  --title "Example article title" \
  --platform x \
  --text "Post copy goes here"
```

The script reads `TYPEFULLY_API_KEY` from the repo-root `.env` or the current
environment. It posts to:

```text
POST https://api.typefully.com/v2/social-sets/{social_set_id}/drafts
```

Return the generated UTM URL, draft id, private URL, and share URL if present.
