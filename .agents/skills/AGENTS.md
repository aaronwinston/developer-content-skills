# Skill review guidelines

These instructions apply to every file under `.agents/skills/`. Review skill
changes against them even when automated validation passes. The detailed
authoring reference is
`.agents/skills/operational/skill-authoring/SKILL.md`.

## Discovery contract

- A skill is discovered from its `SKILL.md`; do not register it in the root
  `AGENTS.md` or maintain a second skill catalog.
- Frontmatter is the routing surface. It must contain exactly `name` and
  `description`.
- `name` must be a unique lowercase kebab-case invocation name. New skills
  should match the directory containing `SKILL.md`; flag an intentional alias
  unless the skill explains the compatibility reason.
- `description` must first state the capability and then include a concrete
  `Use when ...` clause. Keep it at or below 300 characters so the always-loaded
  catalog remains useful and inexpensive.

## Progressive disclosure

- Keep `SKILL.md` focused on the rules, decisions, workflow, and output needed
  whenever the skill is invoked. Keep it at or below 500 lines.
- Move detailed API documentation, long examples, templates, and specialized
  modes into skill-local `references/`, `assets/`, or other clearly named files.
- Put deterministic or order-sensitive procedures in `scripts/` and have the
  skill explain when to run them and how to validate the result.
- Link supporting material from `SKILL.md` with a short description of when it
  should be loaded. Do not require agents to read every reference up front.
- Keep workflow-specific context beside the owning skill. Promote material to
  the root `references/` directory only when independent workflows genuinely
  share it.

## Writing review

Request changes when a new or modified skill:

- narrates background instead of giving direct, actionable instructions;
- uses no-op guidance such as "be thorough" or "write high-quality code";
- prescribes brittle step-by-step choreography where outcomes, constraints, or
  a script would let the agent adapt safely;
- states a non-obvious constraint without enough reasoning to generalize it;
- duplicates large reference material in the main skill body;
- lacks clear inputs, expected output, validation, or failure behavior where
  those are necessary to perform the task reliably;
- permits live CRM, billing, CMS, messaging, event, or deployment writes without
  the confirmations and dry-run behavior appropriate to that system; or
- adds credentials, mutable operational state, generated scratch data, or local
  memory to git.

Do not block a change merely because its prose differs stylistically. Review
for observable effects on routing, behavior, safety, or context usage.

## Validation

Run the structural checks and tests from the repository root:

```bash
python3 scripts/lint_skills.py
python3 -m unittest discover -s scripts -p 'test_lint_skills.py' -v
```

To apply the ratcheted writing checks to skills changed from the base branch:

```bash
python3 scripts/lint_skills.py --changed-from origin/main
```

The pull-request workflow runs all three checks. Existing untouched writing
debt does not exempt new or modified skills from the current standard.
