---
name: competitive-alternatives-01-research
description: Delete tmp/{id}*, live-fetch matrix row, bootstrap crosslinks and research artifacts. Run before ../02-draft/SKILL.md.
---

# 01 - Sheet row and research

## Goal

This step grounds the article in live competitive matrix data and in web research that you verify, so step 02 can draft without inventing facts.

## Clean slate once per run

Read [../AGENT.md](../AGENT.md) for the run-level rule. Choose `{id}` as a kebab-case slug, for example `braintrust-alternatives-2026`, and delete every file that matches `tmp/{id}*` before you create new artifacts.

## Live matrix fetch

Use one canonical sheet only. Do not rely on a repo CSV, a cached export, or a row that someone pasted by hand.

Set `GOOGLE_SHEETS_COMPETITIVE_MATRIX_SPREADSHEET_ID` (and optional `GOOGLE_SHEETS_COMPETITIVE_MATRIX_GID`) in `.env`.

From the repo root, run:

```bash
node .agents/agents/content/competitive/scripts/competitive-fetch-matrix.mjs \
  --id {id} \
  --platform "{Competitor}"
```

The script writes `tmp/{id}-sheet-row.md`. If the command fails, stop and fix OAuth using [.agents/skills/operational/google-workspace/SKILL.md](../../../../skills/operational/google-workspace/SKILL.md). Do not fall back to a deleted CSV or to guessed row data.

## Steps after the fetch

Copy [../templates/crosslinks.md](../templates/crosslinks.md) to `tmp/{id}-crosslinks.md` and replace `{id}` in the file heading.

Fill `tmp/{id}-crosslinks.md` with at least seven distinct `https://arize.com` URLs and natural anchor phrases that you can use later in the article.

Create `tmp/{id}-competitive-research.md` from the scaffold below. Base the sheet facts section on the live fetch, then add external verification from vendor sites, pricing pages, and 2025–2026 documentation when you can find it.

Build a shortlist of four to seven credible alternatives, and pull positioning for matrix platforms from the Related rows section in the sheet snapshot.

## Artifact scaffolds

The file `tmp/{id}-sheet-row.md` is produced by `competitive-fetch-matrix.mjs`. Do not write it by hand unless a human explicitly overrides after an API failure, and document that override in the file.

Use this structure for `tmp/{id}-competitive-research.md`:

```md
# Competitive research — {id}

- Focal competitor: {Competitor}
- Sheet fetched (live):

## Executive summary



## Sheet facts



## Verified landscape



## Gaps / open questions


```

## Do not

Do not fabricate pricing, service level agreements, security certifications, or customer logos. Do not treat forum gossip as fact. Do not copy [../templates/article-outline.md](../templates/article-outline.md) in this step, because step 02 owns the outline. Do not put spreadsheet language into text that might flow verbatim into the article; reader-facing prose rules are enforced in [04-polish](../04-polish/SKILL.md).

## Next

Run [../02-draft/SKILL.md](../02-draft/SKILL.md).
