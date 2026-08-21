---
name: external-backlinks
description: Use this skill when the user wants to improve off-site authority by getting backlinks from external docs or content sites through real PRs. Use it to maintain target docs-page lists, choose backlink-worthy destinations, and propose legitimate doc updates that include relevant hyperlinks back to Arize pages.
---

# External Backlinks

Use this skill for external backlink strategy through real docs or content changes on third-party sites.

This is not the internal-linking skill. This skill is about other websites linking to Arize pages.

## Why this skill exists

Strong external backlinks can improve a page's authority, trust, and ranking potential when the linking sites are relevant and credible.

This skill exists to help agents and humans:

- identify Arize pages that are worth linking to
- keep a list of external docs pages where a backlink could plausibly belong
- propose real documentation improvements, not link spam
- make backlink PRs look legitimate because they include meaningful content edits alongside the link

## Use this skill for

- maintaining target lists of external docs pages
- selecting Arize pages that deserve backlinks
- planning PR-based backlink opportunities
- proposing doc edits that naturally justify a backlink
- making sure backlink PRs contain real value for the external docs site

## Do not use this skill for

- internal links on Arize-owned pages
- drive-by link insertion with no real doc improvement
- making up partner sites, docs pages, publications, or relationships
- pretending a PR is valuable when the only change is the backlink

## Working model

This skill assumes the practical workflow is:

1. maintain a list of external docs pages on sites relevant to Arize AX or Phoenix
2. identify which Arize page should be linked from that external page
3. propose a real improvement to the external docs page
4. include the backlink inside that legitimate change
5. open a PR that reviewers can accept on editorial merit, not just relationship or SEO pressure

The backlink should be associated with a real docs improvement. The PR should still make sense if a human reviewer ignores the SEO goal and judges only whether the docs got better.

## Target lists

This skill should keep or use lists of:

- external docs pages relevant to Arize AX
- external docs pages relevant to Arize Phoenix
- the Arize destination pages those docs pages could reasonably cite

These lists can start as simple checked-in notes, CSVs, or markdown tables. They do not need to be overengineered at first.

## Seed inventory from Arize integration indexes

Starting inventory based on:

- `https://arize.com/docs/phoenix/integrations`
- `https://arize.com/docs/ax/integrations`

This is a deduped partner or project list for backlink research. It is not yet a page-level PR queue. The next step after this inventory is to choose specific external docs pages inside these ecosystems where a real improvement plus backlink could make sense.

Important rules:

- only keep partners that have an actual Arize integration page
- use web search for every entry before adding it here
- only record partner-side docs pages and GitHub file locations that were actually verified
- if the docs page exists but the editable GitHub source could not be verified, do not guess the file path

## Verified inventory

These are the strongest current targets because both a live partner docs page and a concrete public GitHub source location were verified.

| Partner / project | Verified partner docs page | Verified GitHub source | Notes |
|---|---|---|---|
| LangChain | `https://docs.langchain.com/oss/python/integrations/providers/arize` | `https://github.com/langchain-ai/docs/edit/main/src/oss/python/integrations/providers/arize.mdx` | Clear Arize integration page and direct editable docs file |
| Flowise | `https://docs.flowiseai.com/using-flowise/analytics/arize` | `https://github.com/FlowiseAI/FlowiseDocs/blob/main/en/using-flowise/analytics/arize.md` | Arize page |
| Flowise | `https://docs.flowiseai.com/using-flowise/analytics/phoenix` | `https://github.com/FlowiseAI/FlowiseDocs/blob/main/en/using-flowise/analytics/phoenix.md` | Phoenix page |
| Agno | `https://docs.agno.com/observability/arize` | `https://github.com/agno-agi/docs/edit/main/observability/arize.mdx` | Phoenix-focused observability page with direct docs edit path |
| Haystack | `https://docs.haystack.deepset.ai/docs/external-integrations-connectors` | `https://github.com/deepset-ai/haystack/tree/main/docs-website/versioned_docs/version-2.28/pipeline-components/connectors/external-integrations-connectors.mdx` | External integrations page explicitly lists both Arize AI and Arize Phoenix |
| Portkey | `https://portkey.ai/docs/integrations/tracing-providers/arize` | `https://github.com/portkey-ai/docs-core/edit/main/integrations/tracing-providers/arize.mdx` | Direct Phoenix integration page with verified editable docs file |

## Checked but not inventory-ready

These were checked with web search, but I did not verify a concrete public GitHub docs file yet. Keep them out of the active PR inventory until that source path is confirmed.

| Partner / project | Verified partner docs page | Status |
|---|---|---|
| CrewAI | `https://docs.crewai.com/observability/arize-phoenix` | Partner page exists, but no exact editable docs file was verified |
| Dify | `https://docs.dify.ai/en/use-dify/monitor/integrations/integrate-arize` | Partner page exists, but no exact editable docs file was verified |
| Dify | `https://docs.dify.ai/en/guides/monitoring/integrate-external-ops-tools/integrate-phoenix` | Partner page exists, but no exact editable docs file was verified |
| Langflow | `https://docs.langflow.org/next/integrations-arize` | Partner page exists, but no exact editable docs file was verified |
| MLflow | `https://mlflow.org/docs/latest/genai/tracing/integrations/listing/arize/` | Partner page exists, but no exact editable docs file was verified |
| Weaviate | `https://docs.weaviate.io/integrations/operations/arize` | Partner page exists, but I only verified a linked recipe file, not the docs page source file |

## Checked and excluded

These were removed from the active inventory because I did not verify a real partner-side Arize or Phoenix docs page that we could target.

- Amazon Bedrock
- Amazon Bedrock Agents
- Bedrock AgentCore
- Anthropic
- AutoGen
- BeeAI
- Cleanlab
- Couchbase
- DSPy
- Envoy AI Gateway
- Google ADK
- Google GenAI / Gemini
- Groq
- Guardrails AI
- Instructor
- LangGraph
- LiteLLM
- LlamaIndex
- Mastra
- Microsoft Agent Framework
- Microsoft Foundry Evaluators
- Mistral AI
- MongoDB
- Ollama
- OpenAI
- OpenAI Agents SDK
- OpenAI Node SDK
- OpenRouter
- Pinecone
- Pydantic AI
- Qdrant
- Ragas
- Semantic Kernel
- smolagents
- Spring AI
- Strands Agents SDK
- Together AI
- UQLM
- Vercel AI SDK
- Vertex AI
- Zilliz / Milvus

## What makes a good backlink PR

A strong backlink PR usually includes one or more of these:

- clearer explanation
- missing implementation step
- better example
- corrected terminology
- additional comparison or caveat
- relevant reference link to an Arize page that genuinely helps the reader

The link should feel editorially justified.

## Default workflow

1. Confirm the Arize page that should earn backlinks.
2. Load or build the list of target external docs pages.
3. Pick the best target docs pages based on topic fit and editorial plausibility.
4. For each target page, identify a real improvement that would strengthen the external doc.
5. Place the backlink only where it helps the reader and supports that improvement.
6. Draft the PR plan:
   - target repo or site
   - target page
   - proposed real doc changes
   - backlink destination
   - why the link is justified
7. Prefer fewer high-quality PRs over many weak backlink-only edits.

## Output format

Include:

- Arize destination page
- target external docs page
- why the target page is a fit
- proposed real documentation improvement
- proposed backlink placement
- PR rationale
- risks or reviewer objections
- missing inputs

## Pair with other skills when useful

- Use `.agents/skills/content/internal-backlinking/SKILL.md` for internal site links.
- Use `.agents/skills/content/keywords-to-content/SKILL.md` when the target page itself still needs to be improved before promotion.
- Use `.agents/skills/content/refresh-and-decay/SKILL.md` when a page needs evidence-backed updates before external promotion.

## Constraints

- Prefer relevance over raw authority.
- Do not assume a site will accept a PR just because it has high authority.
- Do not recommend backlinks that are not supported by real content changes.
- Favor editorial legitimacy over backlink volume.
