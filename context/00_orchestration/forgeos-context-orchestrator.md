---
title: ForgeOS Context Orchestrator
slug: forgeos-context-orchestrator
layer: orchestration
type: routing_instructions
use_for:
  - deciding which context files to load
  - composing high-quality outputs from multiple sources
  - preventing single-source generation
avoid:
  - treating any one context file as sufficient
---

# ForgeOS Context Orchestrator

## Purpose

ForgeOS should never generate important work from a single context file.

Every useful output should compose multiple layers:

1. **Philosophy** — how to think
2. **Narrative** — what story to tell
3. **Strategy** — who it is for and why it matters
4. **Execution** — what to produce and how to distribute it
5. **Patterns** — what great output looks like
6. **Influence / research** — how to shape perception and authority over time

## Default Composition Rule

When generating any substantial asset, load context in this order:

1. `01_philosophy`
2. `02_narrative`
3. `03_strategy`
4. `04_execution`
5. `05_patterns`

Then apply any specialized file from:

- `06_influence` for analyst relations or perception-shaping work
- `07_research` for research-led narratives, reports, or data-backed content

## Generation Guardrails

Always:

- Start from a real user, developer, buyer, analyst, or operator problem.
- Map the output to a workflow, lifecycle stage, or influence objective.
- Show proof, not adjectives.
- Prefer concrete examples, commands, demos, diffs, PRs, metrics, screenshots, or artifacts.
- Treat messaging as a constraint system, not decoration.

Never:

- Generate from strategy alone.
- Treat examples as current product truth.
- Reuse outdated claims without verification.
- Write generic AI hype.
- Lead with features when a workflow can explain the value.

## Output Quality Standard

A strong ForgeOS output should answer:

1. Who is this for?
2. What workflow, decision, or perception are we trying to change?
3. What core narrative governs the output?
4. What proof makes it credible?
5. What asset or action should come next?
