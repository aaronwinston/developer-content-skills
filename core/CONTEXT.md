# Arize AI — Company & Product Context

All agents in this repo must reference this file before writing about Arize AI. Do not guess at product names, features, or positioning. Use this file as ground truth.

---

## Company overview

**Arize AI** builds an AI engineering platform for development, observability, and evaluation of AI applications and agents. Founded by Jason Lopatecki and Aparna Dhinakaran. Headquartered in Oakland, CA.

The company's core belief: AI teams need the same rigor in production that software teams have had for decades — observability, testing, iteration cycles grounded in real data.

Scale signal (as of 2025):
- 1 trillion spans processed
- 50 million evals per month
- 5 million downloads per month

---

## Products

### Arize AX (enterprise platform)

**Arize AX** is the enterprise AI engineering platform. It includes:

- **Tracing** — Visibility into every step of an AI application run. Captures model calls, retrieval, tool use, and custom logic. Built on OpenTelemetry.
- **Experiments** — Structured comparison of application versions across the same inputs. Includes dataset curation, evaluator attachment, and CI/CD gating.
- **Evaluation** — Online evals that run continuously against production data. Includes LLM-as-judge, code-based checks, human annotation via labeling queues.
- **Prompts** — Prompt management, versioning, A/B testing, and AI-powered optimization. Includes Prompt Playground and Prompt Hub.
- **Alyx** — AI layer inside AX. Includes: AI Search (natural language trace exploration), Trace Slideover (create evals, analyze spans in chat), Dashboard Generator, prompt optimization.

AX is designed for enterprise teams that need to manage and improve AI at scale, with custom dashboards, alerts, guardrails, and organizational controls.

### Phoenix (open source)

**Arize Phoenix** is the open-source AI observability and evaluation tool. It is built by Arize AI and the open-source community.

Phoenix workflow:
1. **Traces** — Send detailed logging from your app. See exactly what happened during a run, step by step.
2. **Evaluations** — Score outputs using LLM evaluators, code checks, or human labels. Identify failures and regressions.
3. **Prompt iteration** — Use real production examples to iterate on prompts. Version, test, and replay.
4. **Experiments** — Compare changes on the same inputs. Move from inspecting runs to improving quality with evidence.

Phoenix is built on:
- **OpenTelemetry** — Industry-standard tracing protocol.
- **OpenInference** — Arize's open conventions for LLM observability, built on top of OpenTelemetry.

Phoenix integrations: LlamaIndex, LangChain, DSPy, Mastra, Vercel AI SDK, OpenAI, Bedrock, Anthropic. Supports Python, TypeScript, Java.

Phoenix is free and self-hosted. Enterprise teams use Phoenix alongside AX.

---

## Key terminology

Use these terms precisely. Do not paraphrase or invent synonyms.

| Term | Definition |
|------|------------|
| **Trace** | A complete record of one run through an AI application — every step, model call, tool use, and retrieval. |
| **Span** | A single unit of work within a trace. A trace is composed of spans. |
| **Eval / Evaluation** | A scored assessment of AI output quality. Can be LLM-based, code-based, or human-labeled. |
| **LLM-as-judge** | Using an LLM to evaluate the quality of another LLM's output. |
| **Eval harness** | Infrastructure for running evaluations systematically across many traces or experiments. |
| **Experiment** | A structured run comparing different versions of an application on the same dataset. |
| **Dataset** | A curated collection of traces or inputs used for experiments and regression testing. |
| **Online evals** | Evaluations that run continuously against production data in real time. |
| **Prompt hub** | Arize's system for managing, versioning, and deploying prompts. |
| **Prompt playground** | Arize's UI for comparing prompts and models side by side. |
| **OpenInference** | Arize's open semantic conventions for LLM observability, layered on OpenTelemetry. |
| **Guardrails** | Arize AX feature that prevents poor-quality outputs from reaching users. |
| **Alyx** | The AI layer in Arize AX — AI Search, Trace Slideover, Dashboard Generator. |
| **Labeling queues** | AX feature for running evals and annotating spans in one place using human reviewers. |
| **Annotation** | Human or AI label attached to a trace or span to indicate quality, errors, or ground truth. |

---

## Positioning

### What Arize believes
- AI teams deserve the same production visibility and rigor that engineering teams have had for decades.
- Observability and evaluation are engineering disciplines, not afterthoughts.
- Open source and open standards matter. No proprietary frameworks, no black-box eval models, no data lock-in.
- The iteration loop between production and development must close — real data from production should drive better development.

### What Arize is not
- Not a model provider. Arize observes and evaluates — it doesn't build foundation models.
- Not a prompt engineering tool alone. Prompts are one part of a larger eval and observability workflow.
- Not just for RAG or chatbots. Arize supports any LLM application: agents, pipelines, structured outputs, voice, etc.
- Not a black box. All evals, frameworks, and data formats are open.

### Against competitors
Do not make direct competitive comparisons in content without review from Aaron and legal. Use `core/CLAIMS_POLICY.md` for guidance.

---

## Audiences

### Primary: AI engineers and ML engineers
Developers building LLM-powered applications, agents, and pipelines. They care about debugging, reliability, reproducibility, and eval rigor. They are skeptical of hype. They want to understand exactly how a tool works and why it's different from rolling their own.

### Secondary: AI product managers
People who own AI product roadmaps and need to track quality over time. They care about metrics, dashboards, regression prevention, and tying evals to product decisions.

### Enterprise stakeholders
Engineering leads and CTOs at companies scaling AI in production. They care about governance, security, observability at scale, and organizational tooling.

---

## Tone rules specific to Arize content

- **Specificity over vague claims.** "Phoenix processes traces over OpenTelemetry and scores outputs using LLM-as-judge evaluators" is better than "Phoenix helps you understand your AI."
- **Workflows over features.** Show how a developer actually uses the product, step by step.
- **Honest about complexity.** Building reliable AI in production is hard. Arize doesn't pretend otherwise.
- **Developer empathy.** Acknowledge the pain points. Don't oversell the ease.
- **Cite numbers carefully.** The 1T spans, 50M evals, 5M downloads stats are validated. Others require sourcing.

---

## Key people (public-facing)

- **Jason Lopatecki** — Co-founder and CEO
- **Aparna Dhinakaran** — Co-founder and CPO
- **Aaron Winston** — Head of content, comms, AR, and developer marketing

---

## Open source assets

- Phoenix GitHub: `https://github.com/Arize-ai/phoenix`
- OpenInference GitHub: `https://github.com/Arize-ai/openinference`
- Evals library: `https://arize.com/docs/phoenix/evaluation/how-to-evals`

---

## When to update this file

Update `CONTEXT.md` when:
- A new product or major feature ships
- Positioning changes
- Key terminology evolves
- Validated stats change
- New key people join in public-facing roles
