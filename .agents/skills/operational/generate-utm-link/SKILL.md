---
name: generate-utm-link
description: "Generate UTM-tagged links and apply the Arize canonical UTM taxonomy. Use when a user asks to create a UTM link, tracking link, campaign link, share URL, event/program UTM, or to look up historical UTM values. For devrel links, source is the platform where the link lives, medium is the channel type, campaign defaults to devrel, and content is the person sharing it."
---

# Generate UTM Link

Use this skill to create UTM links and keep campaign tracking consistent. This
skill is the source of truth for the Arize UTM taxonomy and link-generation
workflow. In short: `utm_source` names *where the link lives*, `utm_medium` is
the *channel type*, `utm_campaign` is the canonical program, and `utm_content`
identifies the variant, person, or placement.

## Inputs

Ask for any missing required input:

- Destination URL.
- Source: the specific platform, tool, publication, partner, or event surface
  where the link will be posted, such as `linkedin`, `x`, `hs_email`, `luma`,
  `chatgpt`, `cursor`, or `mlops-community`. Always use the canonical slug
  (e.g. `x`, never `twitter`); common aliases (`twitter`, `X`, `x.com`, `li`,
  `yt`, `gh`) are auto-normalized to the canonical value. For a source not
  known to the script, pass it lowercase-hyphenated and also pass `--medium`.
  The script will still emit it but prints a warning, so double-check it is not
  an alias of an existing source.

For devrel/social sharing, do not ask for `utm_medium`, `utm_campaign`, or
`utm_content`. The script derives the medium from the platform, defaults
`utm_campaign` to `devrel`, and derives `utm_content` (the person, as
`first-last`) from `git config user.name`.

For events, partner programs, webinars, paid campaigns, or other non-devrel
programs, use the same script but pass a canonical `--campaign` slug. If the
source is not one of the known devrel platforms, also pass the correct
`--medium`.

## Convention

The generated URL must use these canonical rules:

| Parameter | Value |
| --- | --- |
| `utm_source` | The specific place where the link lives — `linkedin`, `x`, `youtube`, `newsletter`, `partner-site`, `luma`, etc. **Not** a category like `social`. Canonical slug only: aliases like `twitter`/`X`/`x.com` are normalized to `x`; unknown sources are allowed but warned. |
| `utm_medium` | The channel type. Use one of the stable mediums in the script: `cpc`, `email`, `social`, `partner`, `webinar`, `event`, `earned`, `referral`, `community`, or `video`. Do not invent new mediums. |
| `utm_campaign` | The canonical program slug. For devrel/social sharing this defaults to `devrel`; for events and programs use a durable slug such as `ai-engineer-worlds-fair-2026` or `arize-observe-2026`. |
| `utm_content` | The variant, person, or placement, e.g. `dat-nguyen`, `speaker-post`, `partner-email-1`, `header-cta`. Names and variants go here — never in `utm_source`. |
| `utm_term` | Paid search keyword only, populated automatically by Google Ads via `gclid`. Do not create or preserve manual `utm_term` values for non-paid links. |

Keep `utm_campaign` stable across channels for the same program. For example,
do not split one event across `aiewf2026`, `worlds-fair-2026`, and
`ai-engineer-worlds-fair`; pick one canonical slug and reuse it.

For events and programs, choose the canonical `utm_campaign` from the CRM or
event system when possible:

- Salesforce Campaign name or slug.
- HubSpot Marketing Campaign name or slug.
- Luma event name or existing event slug.

If those systems disagree, choose one readable lowercase-hyphenated campaign
slug, report the mapping, and recommend cleaning up future links to that value.
Do not create a separate git-tracked ledger for every individual URL.

If the destination URL already has query parameters, preserve non-UTM
parameters. Replace existing `utm_source`, `utm_medium`, `utm_campaign`,
`utm_content`, and `utm_term` values. This prevents stale manual `utm_term`
values from corrupting keyword reporting.

Do not add UTMs to navigation links (header, footer, menus) — only to
trackable touchpoints like blog-post CTAs, shared links, and calendar invites.

## Capture Notes

UTM parameters help connect marketing activity to signups, demo requests, and
pipeline in GA4, HubSpot, and Salesforce. If someone outside Arize is clicking
a link to an Arize property and we want to measure the impact, use a UTM link.

HubSpot and Salesforce track UTMs at two points in the contact lifecycle:

- **First touch (`ft_utm_*`)** is captured once and should not be overwritten.
  It is set the first time we see a contact through the workflow that copies
  last-touch UTM values to first-touch fields on initial form submission.
- **Last touch (`lt_utm_*`)** is updated on every form submission. These are
  the existing `utm_*` fields; API names are unchanged even when display labels
  are updated.
- Active forms should pass UTM parameters from the URL through on submit.
- UTM values are also passed to the Salesforce campaign member record on each
  form submission, mirroring `lt_utm_*`.

HubSpot email UTMs are automatic only if the workflow is tied to a Marketing
Campaign. Unattached workflows will not be tracked. For bulk or manual link
creation, the UTM Generator sheet can be used, but this skill remains the
canonical taxonomy.

## Historical UTM Lookup

When asked what UTMs were used in the past, do not reconstruct them from
memory or create a git-tracked ledger of every historical link. Query systems
that observed the traffic:

- **GA4 / BigQuery** for landed sessions and observed `utm_*` parameters.
- **HubSpot** for contact-level first-touch / last-touch UTM fields such as
  `ft_utm_*` when those are available.

Use historical lookups to discover actual values already seen in the wild,
then recommend a canonical slug if the values are fragmented. For events,
tie the canonical `utm_campaign` back to the Salesforce Campaign, HubSpot
Marketing Campaign, and Luma event where possible; do not treat old UTM
variants as a source of truth over the CRM campaign records.

## Script

Run:

```bash
python3 .agents/skills/operational/generate-utm-link/scripts/generate_utm_link.py \
  "https://arize.com/blog/example" \
  --source linkedin
```

The medium is derived (`linkedin` → `social`) and the person comes from git.
Override either when needed:

```bash
python3 .agents/skills/operational/generate-utm-link/scripts/generate_utm_link.py \
  "https://arize.com/blog/example" \
  --source mlops-community \
  --medium community \
  --content laurie-voss
```

For an event or program link, pass the canonical campaign slug:

```bash
python3 .agents/skills/operational/generate-utm-link/scripts/generate_utm_link.py \
  "https://arize.com/events/ai-engineer-worlds-fair" \
  --source partner-site \
  --medium partner \
  --campaign ai-engineer-worlds-fair-2026 \
  --content sponsor-page
```

For machine-readable output, add `--json`.

Return the generated URL to the user and briefly name the UTM pieces if useful.

## Handoff

| Need | Skill |
|------|-------|
| Historical GA4 traffic and observed UTM values | [`../google-analytics-4/SKILL.md`](../google-analytics-4/SKILL.md) |
| Contact-level UTM fields and campaign attribution in HubSpot | [`../hubspot/SKILL.md`](../hubspot/SKILL.md) |
| Full event CRM setup across Salesforce, HubSpot, Luma, and Notion | [`../event-setup-agent/SKILL.md`](../event-setup-agent/SKILL.md) |
| Social drafts that embed UTM links | [`../typefully/draft-with-utm/SKILL.md`](../typefully/draft-with-utm/SKILL.md) |
