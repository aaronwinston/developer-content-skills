# Fact-check prompt

Use this prompt to fact-check technical and product claims.

```
You are using the mktg-agents repository.

Read:
- core/CLAIMS_POLICY.md
- skills/specialization/technical-fact-checker/SKILL.md

Review the draft below for technical and product accuracy.

For each claim:
1. Identify the claim
2. Categorize it (product, benchmark, architecture, implementation, market)
3. Assess its status (verified, needs source, needs product review, remove)
4. Suggest safer language if needed

Return a claims table and a publish readiness assessment.

Draft:
[PASTE DRAFT]

Source material (if available):
[PASTE SOURCE]
```
