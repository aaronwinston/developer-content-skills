# context/

This directory holds the curated knowledge base that agents read before doing any work. The better this folder is, the less correcting you do after.

Add files by dropping your own content — docs, notes, frameworks, examples — into the right section. Agents read the relevant files before producing any output.

---

## Structure

```
context/
  00_orchestration/  # Routing rules — read this first before composing any output
  01_philosophy/     # Your beliefs and principles — the "why" behind decisions
  02_narrative/      # Messaging, competitive POV, campaign framing
  03_strategy/       # How you're approaching content, GTM, and AR right now
  04_execution/      # How work actually gets done — process and operating systems
  05_patterns/       # What works — repeatable patterns and case studies
  06_influence/      # Analyst relations and perception-shaping work
  07_research/       # Research-led authority systems and market intelligence
```

---

## Core rule

Never generate important work from a single context file. Compose layers in order:

1. `01_philosophy` — how to think
2. `02_narrative` — what story to tell
3. `03_strategy` — who it's for and why it matters
4. `04_execution` — what to produce and how
5. `05_patterns` — what great output looks like

Then add `06_influence` for analyst/AR work, or `07_research` for data-backed content.

See `00_orchestration/forgeos-context-orchestrator.md` for the full routing guide.

---

## 01_philosophy/

Your foundational beliefs. Agents use these to understand the reasoning behind your decisions and avoid recommending things that contradict your actual POV.

| File | What it holds |
|------|---------------|
| `developer-marketing-manifesto.md` | Your beliefs about what developer marketing is, why most of it fails, and what the alternative looks like |
| `analyst-relations-playbook.md` | Your philosophy on AR — what makes it effective vs. performative, how you approach briefings |
| `market-research-playbook.md` | How you gather and use market signal, what sources you trust, how research informs strategy |

---

## 02_narrative/

The messaging layer. Agents check this before writing anything that touches positioning, competitive framing, or campaign copy.

| File | What it holds |
|------|---------------|
| `messaging-framework.md` | Positioning statement, message house, approved taglines, what the messaging rules out |
| `campaign-messaging.md` | Active campaign narrative, hooks, approved CTAs, channel variations |
| `competitive-pov.md` | How Arize is differentiated, what competitors say, language to avoid, battle card notes |

---

## 03_strategy/

Current strategic context. Agents use this to calibrate recommendations against where things actually are.

| File | What it holds |
|------|---------------|
| `content-strategy.md` | Editorial priorities, content mix, audience targets, distribution, what we're not doing |
| `post-gtm-blueprint.md` | How you think about sustained growth after launch — what compounds, what spikes and decays |
| `ar-strategy.md` | Priority analysts, relationship status, narrative arc, upcoming briefings |

---

## 04_execution/

How work actually happens. Agents use this to produce plans that match operational reality.

| File | What it holds |
|------|---------------|
| `gtm-operating-system.md` | Launch process, cross-functional motions, decision gates, T-minus cadence |
| `campaign-brief.md` | The active or most recent campaign brief — updated each cycle |
| `post-launch-framework.md` | What happens after launch day — content cadence, performance signals, when to move on |

---

## 05_patterns/

What works. Repeatable patterns and case studies agents pull from when producing specific content types.

| File | What it holds |
|------|---------------|
| `developer-ads.md` | Ad copy patterns, targeting approaches, what resonates with developers |
| `landing-pages.md` | Page structure, headline formulas, CTA patterns, social proof for technical audiences |
| `workflows.md` | Repeatable execution workflows — social amplification, case study production, launch week checklist |
| `developer-ads-case-study.md` | Real example of developer ad execution with performance context |
| `workflow-narrative-case-study.md` | Real example of workflow-driven narrative content |
| `campaign-performance-readout.md` | Campaign performance analysis and patterns |

---

## 06_influence/

Analyst relations and perception-shaping work. Agents check this for any AR briefing, inquiry response, or analyst-facing content.

| File | What it holds |
|------|---------------|
| `analyst-relations-playbook.md` | Your philosophy on AR, what makes it effective, how you approach briefings and long-term analyst relationships |

---

## 07_research/

Research-led authority systems and market intelligence. Agents check this for data-backed content, research reports, and evidence-grounded narratives.

| File | What it holds |
|------|---------------|
| `market-research-playbook.md` | How you gather and use market signal, what sources you trust, how research informs strategy and content |

---

## How agents use this directory

**Always start with the orchestrator:**
```
Read context/00_orchestration/forgeos-context-orchestrator.md before generating any substantial output.
```

When starting any task, agents check the relevant files based on content type:

| Task type | Files to check |
|-----------|----------------|
| Any writing task | `02_narrative/messaging-framework.md` |
| Anything competitive | `02_narrative/competitive-pov.md` |
| Active campaign content | `02_narrative/campaign-messaging.md` |
| Launch or GTM content | `03_strategy/strategy-blueprint.md`, `04_execution/gtm-operating-system.md` |
| Analyst relations | `06_influence/analyst-relations-playbook.md`, `03_strategy/ar-strategy.md`, `02_narrative/competitive-pov.md` |
| Strategy or editorial direction | `01_philosophy/developer-marketing-manifesto.md`, `03_strategy/content-strategy-framework.md` |
| Paid or landing page copy | `05_patterns/developer-ads.md`, `05_patterns/developer-ads-case-study.md`, `05_patterns/landing-pages.md` |
| Post-launch content | `04_execution/post-launch-framework.md`, `05_patterns/campaign-performance-readout.md` |
| Research-backed content | `07_research/market-research-playbook.md` |

**Instruction to include in any task prompt:**
```
Read context/00_orchestration/forgeos-context-orchestrator.md first.
Then check the relevant context files for this task before drafting.
```

---

## Adding content

Drop your own docs, notes, decks, or frameworks directly into the right file. These don't need to be polished — rough notes with your real thinking beat empty templates every time.

Label content clearly at the top of each file so agents know what they're reading:
```
<!-- Source: Internal positioning doc | Updated: 2025-Q2 -->
```

Update files when strategy or messaging changes. Archive old versions by prefixing with `_archive-`.
