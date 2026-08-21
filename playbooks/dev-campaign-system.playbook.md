# Developer Campaign System Playbook

## Purpose

Use this playbook to create a developer-facing campaign from product truth.

This playbook is optimized for ads, landing pages, short videos, and launch campaigns for technical products.

---

## Required inputs

- Product or feature
- Audience
- Source truth: docs, screenshots, demos, changelog, or approved messaging
- Primary conversion action
- Channel constraints
- Legal or claim constraints
- Product surface: CLI, IDE, web, API, dashboard, repo, PR, etc.

---

## Agent sequence

### 1. Workflow extraction

Invoke: `workflow-extractor`

Goal:

Turn the product feature into 3–5 concrete workflows.

Output:

- developer problem
- workflow sequence
- artifact produced
- trust boundary
- campaign angle

---

### 2. Editorial direction

Invoke: `editorial-director`

Goal:

Select the strongest campaign narrative.

Decision criteria:

- concrete workflow
- high developer pain
- obvious artifact
- product truth
- conversion relevance

---

### 3. Ad writing

Invoke: `dev-ad-writer`

Goal:

Create ad variants for each workflow.

Required output:

- static image headline
- paid headline
- intro text
- CTA
- alternates
- claim risks

---

### 4. Campaign review

Invoke: `dev-campaign-reviewer`

Goal:

Check copy against product truth and developer credibility.

Must verify:

- copy matches screenshots
- commands are accurate
- workflow order is correct
- claims are defensible
- CTA matches action
- ad and landing page align

---

### 5. Landing page alignment

Invoke: `landing-page-critic` if available; otherwise use `dev-campaign-reviewer`.

Goal:

Ensure the page preserves the ad promise.

Check:

- hero matches campaign spine
- workflow examples mirror ads
- CTA matches conversion goal
- no generic AI messaging
- no unsupported claims

---

### 6. Final copy chief pass

Invoke: `copy-chief`

Goal:

Tighten language without losing technical specificity.

---

## Campaign spine template

Use this formula:

> <Developer problem> → <product action> → <reviewable artifact>

Examples:

- Missing tests → coverage plan → PR
- Stack trace → root cause → passing tests
- TODO → delegate task → PR
- Migration → plan → reviewable diff
- Alert → trace → fix

---

## Ad structure

### Static image

Show:

- product UI
- one command or workflow action
- one concrete outcome

### Paid headline

Outcome-driven. Usually no command if the command appears in the creative.

### Intro text

Explain workflow in one sentence.

Formula:

> Use <command/product action> to <workflow>. <Product> <does specific work> and <produces artifact>.

### CTA

Match the action:

- Generate a plan
- Run fleet
- Delegate a task
- Review the PR
- Start debugging
- Try the workflow

---

## Landing page structure

1. Hero: campaign spine
2. Workflow cards: top 3 use cases
3. Product proof: UI screenshots or steps
4. Trust boundary: diff, PR, checks, controls
5. CTA
6. FAQ or setup

---

## Quality gate

Before publishing, answer yes to all:

- Can a developer tell what happens in the first 3 seconds?
- Is the product behavior accurate?
- Is the output artifact visible?
- Does the copy avoid hype?
- Does the CTA match the workflow?
- Does the landing page continue the story?
- Does the asset teach something?

If any answer is no, revise.
