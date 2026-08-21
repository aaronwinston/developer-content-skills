---
name: slide-maker-with-ai
description: >-
  Use this skill when the user wants to turn rough concepts, repo context,
  research notes, or narrative goals into a slide deck. Start by building the
  outline, pressure-test it with a /grill-me pass, then choose the production
  path: Claude Design for small high-polish decks or LaTeX Beamer for larger
  deterministic decks.
---

# Slide Maker with AI

Use this skill for conceptual text translation into slides.

The job is not to jump straight into slide production. The job is to turn messy ideas into a strong deck narrative, then choose the right rendering path.

## Why this skill exists

Most bad decks fail before design.

They fail because the outline is weak, the narrative has gaps, the audience ask is fuzzy, or the production path does not match the deck size.

This skill exists to:

- build the outline first from all available repo context
- pressure-test the narrative before slide production
- choose a deck-making path that matches deck size and polish needs
- separate strategic deck work from rendering work

## Core workflow

1. Build the outline first using all useful repo context.
2. Run a `/grill-me` pass on the outline:
   - pressure-test the logic
   - expose missing evidence
   - sharpen the story
   - cut weak or redundant slides
3. Pick the production path based on deck size and polish requirements.
4. Generate the deck or the deck spec.

Do not skip step 2. A polished weak deck is still weak.

## Production paths

### Path A: small decks, high polish

Use Claude Design.

Why:

- visually strong output
- low iteration cost for short decks
- best when the slide count is small and design quality matters

Flow:

`outline + repo context -> Claude Design -> beautiful, high-polish slides`

Practical note:

- treat Claude Design as manual or semi-manual unless a documented public API exists
- use it when a human can review and export the result as PPTX, PDF, Canva, or HTML

### Path B: larger decks, enough polish

Use LaTeX or Beamer, likely via Codex or another code agent.

Why:

- clean and consistent visual system
- easy to generate programmatically
- more deterministic than design-chat tools
- scales better across many slides

Flow:

`outline + repo context -> LaTeX/Beamer via Codex -> clean, consistent, scalable deck`

## Current tool assumption: Claude Design API

Assume Claude Design does not currently have a documented public API unless the user provides newer evidence.

Working assumption in this repo:

- small decks: Claude Design manual or semi-manual workflow
- automated deck generation: use model output to create structured slide specs, copy, speaker notes, and design direction, then render with code
- large decks: prefer LaTeX or Beamer for predictable generation

## Use this skill for

- concept to deck outline
- repo context to presentation narrative
- pressure-testing a slide story before production
- deciding between high-polish and scalable deck paths
- generating slide specs, section plans, copy, or Beamer-ready structure

## Do not use this skill for

- pretending a design tool has a public API when it does not
- skipping outline quality checks
- using Claude Design for large automated decks by default
- using Beamer when bespoke visual polish is the dominant requirement for a short deck

## Default output shapes

Depending on the ask, produce one of these:

- outline only
- outline plus `/grill-me` critique
- slide-by-slide content spec
- Beamer-ready structure
- Claude Design handoff prompt with deck goals, tone, and slide plan

## Recommended output format

Include:

- audience
- presentation goal
- core thesis
- slide outline
- `/grill-me` findings
- recommended production path
- open questions or missing inputs
- next production artifact

## Pair with other skills when useful

- Use repo-native analytics or content skills first when the deck needs fresh evidence or metrics.
- Use `.agents/skills/operational/plotly/SKILL.md` when the deck needs charts exported from tabular data.
- Use `.agents/skills/operational/vercel/SKILL.md` when the deck evolves into a lightweight presentation site or hosted narrative.

## Local working files

- Store local historical slide material in `.agents/skills/design/artifacts/past-slides/` when useful.
- Treat that folder as non-source reference material unless the user explicitly asks to promote assets into the repo.

## Constraints

- outline quality comes before design polish
- keep observed facts separate from story framing
- do not overbuild visuals before the narrative survives the `/grill-me` pass
- choose deterministic generation for larger decks
