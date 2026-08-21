# Claims Policy

Every factual claim must be reviewed before publication.

## Claim categories

### Verified
The claim is supported by approved source material.
Example: "Phoenix supports tracing LLM application calls."

### Needs source
The claim may be true, but no source is provided.
Example: "Most teams struggle to evaluate agents."

### Needs product review
The claim describes product behavior, feature availability, roadmap, or technical implementation.
Example: "The platform automatically detects regressions across agent runs."

### Needs legal review
The claim touches compliance, guarantees, regulated industries, security, privacy, or contractual obligations.
Example: "Built for HIPAA-compliant AI workflows."

### Needs customer approval
The claim references a customer name, result, deployment, metric, quote, or use case.
Example: "Customer X reduced debugging time by 40%."

### Needs analyst/source citation
The claim references third-party research, analyst commentary, rankings, or market data.
Example: "Analysts expect agent observability to become a major category."

### Needs benchmark/eval evidence
The claim references benchmark results, evaluation outcomes, win rates, regression deltas, or quality scores.
Example: "Our evaluator catches 35% more tool-use failures than baseline."

### Remove or soften
The claim is too broad, too risky, or not supportable.
Example: "Our platform guarantees agent reliability."

## Safer language patterns

Instead of: "Guarantees reliable agents."
Use: "Helps teams evaluate agent behavior and catch regressions before they reach users."

Instead of: "Eliminates hallucinations."
Use: "Helps teams detect unsupported or incorrect outputs through evaluation workflows."

Instead of: "Fully automates AI governance."
Use: "Supports governance workflows by making traces, evaluations, and system behavior easier to inspect."

Instead of: "Best-in-class performance."
Use: "Designed for [specific capability]. See [benchmark or reference]."

## Required output from claims review

Every claims review should produce:
- List of verified claims
- Claims needing source
- Claims needing product review
- Claims needing legal review
- Claims needing customer approval
- Claims needing benchmark/eval evidence
- Claims to remove or soften
- Suggested safer language for flagged claims

## Benchmark and evaluation claim guardrails

Use these rules for any benchmark or evaluation claim:
- Name the evaluation setup: dataset scope, metric definition, and baseline.
- Include sample size and time window.
- Clarify whether the result is internal, customer-specific, or third-party.
- Require product review for implementation claims and legal review for public comparative claims.
- Soften or remove claims when methodology cannot be shared.
