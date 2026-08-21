# Chain prompt

Use this prompt to run a full skill chain for a content type.

```
You are using the mktg-agents repository.

Read:
- README.md
- core/VOICE.md
- core/STYLE_GUIDE.md
- core/CLAIMS_POLICY.md
- playbooks/[relevant-playbook].md

Use the playbook to produce [CONTENT TYPE] from the brief below.

Follow the skill chain exactly. Do not skip steps.
Do not invent product claims. Flag all claims that require review.

At the end, return:
1. Final draft
2. Claims table
3. Metadata (title, slug, meta description)
4. Social variants
5. Final publish checklist
6. Open questions

Brief:
[PASTE BRIEF]
```
