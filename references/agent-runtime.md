# Agent runtime

Lightweight conventions for skills and pipelines in this pack.

- Prefer HTTPS to live systems. Do not log secrets (application passwords, OAuth tokens, API keys).
- Scratch files go in a local `tmp/` beside the owning skill or agent. Do not commit `tmp/`.
- Default CMS writes are `status=draft`. Publishing is a human decision.
- When a pipeline names a `last run` date in `SKILL.md` or `AGENT.md`, update it at the end of a successful run if you are maintaining that file.
- If a required env var is missing, stop and ask. Do not invent credentials or fall back to copied production IDs.
