---
name: competitive-alternatives-agent
description: Alternatives guides from live competitive matrix research through polish, eval, and Google Doc delivery.
---

# Competitive alternatives agent

Start every run at step 01 with a clean slate. That means you delete every file under `tmp/{id}*` before you fetch research or draft, and you do not reuse artifacts from an earlier run with the same slug.

**Any touch restarts the full pipeline.** If a guide is edited, re-evaluated after a partial fix, or refreshed for delivery only, treat that as a new run: delete `tmp/{id}*`, then execute steps 01 through 06 in order for that `{id}`. Do not patch `tmp/{id}.md` and jump to eval or deliver. Do not reuse research, crosslinks, or manuscript prose from a prior run.

Manuscript prose rules: [04-polish/SKILL.md](04-polish/SKILL.md). Structure: [templates/article-outline.md](templates/article-outline.md). All generated outputs stay in agent-local `tmp/`.

## Run order

1. [01-sheet-and-research/SKILL.md](01-sheet-and-research/SKILL.md)
2. [02-draft/SKILL.md](02-draft/SKILL.md)
3. [03-crosslink/SKILL.md](03-crosslink/SKILL.md)
4. [04-polish/SKILL.md](04-polish/SKILL.md)
5. [05-eval/SKILL.md](05-eval/SKILL.md)
6. [06-deliver-google-doc/SKILL.md](06-deliver-google-doc/SKILL.md)

Skip step 06 when any grade on step 05 is below B. When eval fails, delete `tmp/{id}*` and restart at step 01 (do not edit the manuscript in place and re-run only step 05). Deliver only when every criterion is A or B.

Former founder-voice step (removed from pipeline): [founder-voice-removed.md](founder-voice-removed.md).
