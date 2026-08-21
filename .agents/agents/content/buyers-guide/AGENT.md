---
name: buyers-guide-agent
description: Orchestrates a buyer's guide through research, draft, crosslink, polish, eval, and Google Doc delivery.
---

# Buyer's guide agent

Start every run at step 01 with a clean slate. That means you delete every file under `tmp/{id}*` before you research or draft, and you do not reuse artifacts from an earlier run with the same slug.

**Any touch restarts the full pipeline.** If a guide is edited, re-evaluated after a partial fix, or refreshed for delivery only, treat that as a new run: delete `tmp/{id}*`, then execute steps 01 through 06 in order for that `{id}`. Do not patch `tmp/{id}.md` and jump to eval or deliver. Do not reuse research, crosslinks, or manuscript prose from a prior run.

Manuscript H1: `# {Topic}: A buyer's guide` (sentence case on the topic). Prose rules: [04-polish/SKILL.md](04-polish/SKILL.md). Outputs in `tmp/`.

## Run order

1. [01-research/SKILL.md](01-research/SKILL.md)
2. [02-draft/SKILL.md](02-draft/SKILL.md)
3. [03-crosslink/SKILL.md](03-crosslink/SKILL.md)
4. [04-polish/SKILL.md](04-polish/SKILL.md)
5. [05-eval/SKILL.md](05-eval/SKILL.md)
6. [06-deliver-google-doc/SKILL.md](06-deliver-google-doc/SKILL.md)

Former founder-voice step (archived): [founder-voice-removed.md](founder-voice-removed.md).

Skip step 06 when any grade on step 05 is below B. When eval fails, delete `tmp/{id}*` and restart at step 01 (do not edit the manuscript in place and re-run only step 05). Deliver only when every criterion is A or B.

This agent uses the shared content references under the repo root (`references/content/`):

- [voice-and-tone.md](../../../../references/content/voice-and-tone.md)
- [brand-lexicon.md](../../../../references/content/brand-lexicon.md)
- [formatting.md](../../../../references/content/formatting.md)
- [evaluation.md](../../../../references/content/evaluation.md)
