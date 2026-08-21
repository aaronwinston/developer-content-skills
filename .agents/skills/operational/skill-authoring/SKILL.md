---
name: skill-authoring
description: Conventions for writing, structuring, and discovering skills in this repo. Use when creating, moving, splitting, or reviewing a skill, or deciding where a capability belongs.
---

# Skill Authoring Conventions

Use this skill before adding or restructuring any `SKILL.md`. The filesystem is
the source of truth: agent runtimes discover skills from `SKILL.md` frontmatter.
The root [`AGENTS.md`](../../../../AGENTS.md) defines stable repository rules,
and [`.agents/skills/AGENTS.md`](../../AGENTS.md) defines the scoped review
standard. Neither file is a catalog of individual skills.

## What belongs in a skill (vs. agent / app / reference)

Pick the right artifact before writing anything:

| If the work is… | Put it in | Marker file |
|---|---|---|
| Reusable instructions for doing one kind of work | a **skill** | `SKILL.md` |
| A repeatable multi-step pipeline that combines skills/scripts | an **agent** | `AGENT.md` |
| Something a user runs (dashboard, tool) | an **app** | app `README.md` |
| Durable human-maintained context used across multiple workflows or the whole repo | a **global reference** | files under `references/` |

A skill explains *how to do reusable work*. If it has staged steps,
orchestration, or its own scheduled run, it is probably an agent.

## Where references go

Use both global and local references, with a high bar for global scope:

- Global `references/` is for durable context used by multiple independent
  skills/agents or by the whole repo. Examples: brand voice, formatting rules,
  approved language, repo runtime conventions, and cross-team definitions.
- Skill/agent-local `references/` is for context owned by one workflow. Keep
  specialized prompts, examples, source notes, and workflow-specific templates
  beside the skill or agent that owns them.
- Start local by default. Promote a local reference to global only after real
  reuse exists or when it defines repo-wide behavior.
- Do not use global `references/` as a generic shared dump. If ownership is
  unclear, keep the file local until the owner and consumers are clear.

## Where the skill goes

All skills live under `.agents/skills/` in exactly one category:

- `.agents/skills/operational/` — live systems, analytics, automation, demand-gen.
- `.agents/skills/content/` — content strategy, editorial, production.
- `.agents/skills/design/` — design and visual production.
- `.agents/skills/growth/` — product-led growth, signups, activation, conversion, usage, reporting.
- `.agents/skills/product/` — product and open-source ecosystem health, product-area metrics.

Do not invent new top-level categories. A skill that is a specialization of
another skill becomes a **sub-skill** nested inside the parent folder
(see "Sub-skills" below), e.g. `luma/approve-guest/`, `hubspot/dead-links/`,
`typefully/draft-with-utm/`.

## Required: frontmatter

Every `SKILL.md` opens with YAML frontmatter holding exactly two keys:

```yaml
---
name: kebab-case-name
description: State what the skill does. Use when the user asks for concrete
  tasks or phrases that should trigger it.
---
```

Rules:

- `name` is **kebab-case** and globally unique. New public skills must match the
  folder containing `SKILL.md` so discovery works consistently across agent
  runtimes. An established alias may remain when changing it would break an
  invocation contract; document that compatibility reason in the skill body.
- `description` is the always-loaded routing signal. Lead with the capability,
  then add a concrete `Use when ...` clause with representative tasks or
  phrases. Keep the complete description at or below 300 characters.
- Do not put implementation details, IDs, setup steps, examples, or broad
  background in frontmatter. Move those into the body or a local reference.
- Exception: private stage files inside an `AGENT.md` pipeline may use a
  globally unique `name` prefixed with the agent name, while the folder keeps its
  ordered stage label such as `01-research/` or `04-assemble/`. These stage
  skills are invoked through the parent agent, not directly from `AGENTS.md`.

## Body structure

After the frontmatter, start with an `# H1 Title` (human-readable) and a
one-line statement of what the skill is for. Then use `## H2` sections. There is
no rigid template, but reuse the established section names so skills read
consistently. Common, in rough order of use:

- **Prerequisites** — auth, env vars, CLIs, MCP servers needed.
- **Inputs** / **Action triggers** — what to ask the user for; what to do.
- **Default workflow** / **How to run** — the steps or the command(s).
- **Output format** — the shape of what the skill returns.
- **Constraints** / **Practical rules** / **What's NOT here** — scope limits.
- **Handoff** (or **Related**) — a table pointing to adjacent skills. This is
  the most common closing section in the repo; include it.

Keep the source of truth in the owning directory. Do not restate detailed
workflows in `AGENTS.md`, `README.md`, or a manually maintained catalog.

## Skill quality rubric

Use this rubric when writing or reviewing a skill. The linter handles objective
limits; reviewers assess whether the instructions will materially improve agent
behavior.

- Treat `description` as the trigger. It should say what the skill does and
  when to use it. For broad surfaces, include when **not** to use it.
- Write instructions, not essays. Prefer direct rules, short examples, and the
  reason behind non-obvious constraints.
- Remove no-ops. Delete generic advice such as "be thorough" or "write clean
  code" when it does not change the expected behavior or output.
- Keep frontmatter tight. Move implementation detail, IDs, examples, and edge
  cases into the body or a local reference file.
- Give the agent constraints and expected outcomes, not fragile step-by-step
  choreography. If exact ordering is required for correctness, put it in a
  script or helper.
- Keep `SKILL.md` at or below 500 lines. Split detailed documentation, examples,
  templates, and specialized modes into local files that are loaded only when
  needed.
- Split local references by topic when a skill spans multiple systems or modes;
  the agent should load only the extra context needed for the current task.
- Test both positive and negative trigger prompts before treating a skill as
  reusable. A good test set includes normal asks, should-not-trigger asks, and
  edge cases with clear success criteria.
- Revisit capability skills periodically. If current models can pass the evals
  without the skill, retire or shrink it. Preference skills stay useful as long
  as they reflect the team's actual workflow.

### Handoff table format

End with a table that routes agents to neighbouring skills using **relative
links**:

```markdown
## Handoff

| Need | Skill |
|------|-------|
| Related capability X | [`../other-skill/SKILL.md`](../other-skill/SKILL.md) |
| A sub-capability       | [`sub-skill/SKILL.md`](sub-skill/SKILL.md) |
```

## Skill-local files

Inside a skill folder, use these conventional subdirectories:

- `scripts/` — helper scripts. Reference them from `SKILL.md` by their **full
  path from the repo root** (e.g.
  `python3 .agents/skills/operational/<skill>/scripts/foo.py`), not a relative
  path, so the command is copy-pasteable from anywhere.
- `set-up/` — one-time setup / auth notes (used by `stripe`, `vercel`, `luma`,
  `pendo`, `fivetran`, etc.).
- `reports/` — committed historical snapshots a skill produces on a schedule.
- `references/` — skill-local durable context used only by this skill. If the
  same context is needed by multiple independent workflows, promote it to the
  top-level `references/` folder.
- `agents/openai.yaml` — **optional** interface metadata (only ~5 skills have
  it). Add only if the skill is exposed as a standalone agent surface:

  ```yaml
  interface:
    display_name: "Human Readable Name"
    short_description: "One line."
    default_prompt: "Use $skill-name to …"
  ```

### Credentials and secrets

Scripts read credentials from the repo-root `.env` (or the environment), never
hard-coded. Document the required keys under **Prerequisites** and keep
`.env.example` in sync when a skill needs a new key.

### Generated / mutable state

- Generated scratch files go in a skill-local `tmp/` folder. `tmp/` is not
  committed.
- **Do not use git as a database** for mutable operational state, recurring
  generated outputs, credentials, or local memory stores. Committed `reports/`
  snapshots are the deliberate exception — periodic, human-browsable artifacts.

## Sub-skills

When a skill grows a distinct, separately-invokable capability, nest it as a
folder with its own `SKILL.md` rather than creating a sibling top-level skill:

```
parent-skill/
  SKILL.md            # parent; add a Handoff row linking to the sub-skill
  sub-capability/
    SKILL.md          # sub-skill; links back via ../SKILL.md
    scripts/
```

When moving an existing skill under a parent, use `git mv` (preserves history),
update every relative link and full script path in the moved `SKILL.md`, and add
a Handoff row in the parent. See the
`reo`/`reo-dev` → `reo/mcp/` and `typefully-draft-with-utm` → `typefully/draft-with-utm/`
consolidations for the exact pattern. The `name:` field may stay unchanged on a
structure-only move when preserving the existing invocation alias is more useful
than strict folder-name parity.

## Discovery and related documentation

Adding or moving a valid `SKILL.md` is enough for runtime discovery; do not add
it to the root `AGENTS.md`. Update a domain overview such as
`.agents/skills/operational/demand-gen/OVERVIEW.md` only when humans use that
document to understand the domain. Update the root `README.md` only when the
change affects top-level repository semantics.

## Authoring checklist

- [ ] Right artifact? (skill vs agent vs app vs reference)
- [ ] Correct category folder; sub-skill nested if it's a specialization.
- [ ] Frontmatter `name` is unique kebab-case; new public skills match the containing folder.
- [ ] `description` is at most 300 characters and states the capability before concrete `Use when` triggers.
- [ ] Main `SKILL.md` is at most 500 lines; supporting detail is loaded progressively.
- [ ] Instructions are directives without filler or no-ops; exact procedures live in scripts.
- [ ] Body uses conventional `## H2` sections; closes with a Handoff/Related table.
- [ ] Script references use full repo-root paths; secrets come from `.env`.
- [ ] No mutable state committed to git; scratch in local `tmp/`.
- [ ] Domain `README.md` / `OVERVIEW.md` updated only if its human-facing semantics changed.
- [ ] Run `python3 scripts/lint_skills.py` from the repo root and fix any mechanical failures.
- [ ] Run `python3 scripts/lint_skills.py --changed-from origin/main` before opening a PR.

## Handoff

| Need | Skill / Doc |
|------|-------------|
| Repository-wide rules | [`AGENTS.md`](../../../../AGENTS.md) |
| Skill review rules | [`../../AGENTS.md`](../../AGENTS.md) |
| Top-level repo semantics | [`README.md`](../../../../README.md) |
| Authoring a multi-step pipeline instead | [`../../../agents/scheduled/AGENT.md`](../../../agents/scheduled/AGENT.md) |
| Example of a clean sub-skill split | [`../typefully/SKILL.md`](../typefully/SKILL.md) |
