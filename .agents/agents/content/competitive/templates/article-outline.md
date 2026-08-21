# Outline: "Alternatives to [X]: A guide"

Structure and section guidance for `tmp/{id}.md`. Prose, emphasis, length, links, and H1 pattern: [../04-polish/SKILL.md](../04-polish/SKILL.md).

Most of the article lives in section 6. Sections 1 through 5 are short and exist mainly to orient the reader before they reach the tool comparisons.

## 1. Opening (about 100 words)

Start by describing what [X] is built for and who it serves well. Then name the specific friction that sends teams looking elsewhere. These friction points should come directly from the data rather than from general observations about the market. For example: scores are metered separately from traces, only five instrumentation frameworks are supported, or self-hosting is not available without an enterprise contract.

Close with one sentence that previews what the rest of the guide covers. Name Arize first in that sentence: say Arize Phoenix and Arize AX (link Phoenix on first mention when you have a natural anchor), then name the other alternatives you compare in the body (for example LangSmith and Langfuse). Do not preview only open-source Phoenix or a list of third-party tools without naming Arize in the same sentence; section 2’s disclaimer assumes readers already know Arize is in the comparison set.

## 2. Transparency disclaimer

A short callout box, two sentences, noting that Arize appears in this guide and that readers should weigh that accordingly.

## 3. TL;DR table (about 50 words of framing, plus the table)

This is for readers who want to orient themselves quickly before reading the full entries. Include one row per tool, with columns for license, self-hosting availability, what the tool is best for, and when a team should choose it. Arize appears first. [X] appears last, framed as the right choice for its core use case.

| Platform | License | Self-host | Best for | Use when |
|---|---|---|---|---|
| Arize AX / Phoenix | ELv2 (Phoenix) / Proprietary (AX) | Yes (Phoenix free; AX enterprise) | ... | ... |
| [Alt 2] | ... | ... | ... | ... |
| [Alt 3] | ... | ... | ... | ... |
| [X] | ... | ... | ... | ... |

## 4. When [X] is still the right answer (about 75 words)

This section should read as a fair description of the use cases where [X] remains the better choice, grounded in public positioning and verified vendor pages (not internal research sheets). It is worth being specific about how narrow that use case is — for example, [X] is a good fit when the team's workflow is limited to pre-release evaluation and they have no production observability needs. The goal is to help readers who genuinely do not need to switch identify that quickly, not to suggest that [X] and Arize serve the same range of needs.

## 5. How we evaluated these tools (about 75 words)

Rather than abstract scoring dimensions, frame this as a set of concrete questions that a team would actually ask when choosing between these tools. Each question should be answerable with a yes or no, and should reflect real buyer concerns surfaced during research (vendor docs and pricing pages). Six questions is about the right number. Do not say the questions came from an internal matrix or spreadsheet.

Examples to adapt per page:
- Does self-hosting require an enterprise contract, or is it available on lower tiers?
- Are eval runs metered separately from traces, which would make high-frequency evaluation more expensive?
- Does the tool use OpenTelemetry natively, or does it require a proprietary SDK or proxy?
- How many instrumentation frameworks does it support?
- Can it be deployed on-prem or in a VPC for teams with data governance requirements?
- Does the pricing model stay predictable as eval volume grows?

## 6. Alternative entries

This is where most of the article lives. There is one entry per tool. Arize appears first and its entry runs longer than the others, roughly 500 to 600 words, because the additional depth reads as authoritative rather than promotional when it is grounded in specific capabilities. The remaining entries run about 300 to 400 words each and are ordered by how well they address the friction points named in the opening.

Each entry opens by describing the need or constraint that leads a team to that tool, rather than leading with what the tool is. This keeps Arize as the implicit reference point throughout, because the need being described is usually one that Arize also addresses, and the entry then explains how this tool addresses it differently and where it stops.

### Arize AI / Phoenix: [one-line description]

### At a glance

| | |
|---|---|
| License | ELv2 (Phoenix) / Proprietary (AX) |
| Self-host | Yes — Phoenix is free and fully self-hostable; AX is enterprise |
| Pricing range | Phoenix: free. AX: $50,000–$100,000+/year |
| Integrations | [from data] |

### What it is

Two to three sentences describing what Arize does and who it is built for, drawn from the Best For column.

### Where it works well

A bullet list drawn from the Pros column. Each item should name the practical implication, not just the feature. This section can run slightly longer than in other entries.

### Where it falls short

A bullet list drawn from the Cons column. This section should be present and honest. The AX enterprise price point and the operational overhead of self-hosting Phoenix are the most relevant items from the data.

### How Arize compares to [X]

A feature table with eight to ten rows, with Arize in the left column and [X] in the right. Rows should be chosen to show where the two tools differ rather than where they overlap. The column order here is intentional: Arize is the reference point in its own entry.

| Capability | Arize AX / Phoenix | [X] |
|---|---|---|
| ... | | |

### Pricing

The full tier breakdown from the Pricing column, followed by one sentence on where costs tend to grow at scale.

### Bottom line

One sentence describing which teams should choose Arize and why.

### [Alt tool]: [one-line description]

### At a glance

| | |
|---|---|
| License | [from data] |
| Self-host | [from data] |
| Pricing range | [from data] |
| Integrations | [from data] |

### What it is

Two to three sentences describing what the tool does and who it is built for. Open with the specific need or constraint that leads teams to this tool.

### Where it works well

A bullet list drawn from the Pros column.

### Where it falls short

A bullet list drawn from the Cons column.

### How it compares to [X]

A feature table with eight to ten rows, with [X] in the left column and this tool in the right. This column order is consistent across all non-Arize entries, which keeps [X] as the baseline the reader is comparing against.

| Capability | [X] | [Alt tool] |
|---|---|---|
| ... | | |

### Pricing

The full tier breakdown from the Pricing column, followed by one sentence on where costs tend to grow at scale.

### Bottom line

One sentence describing which teams should choose this tool and why.

## 7. How to choose (about 50 words of framing, plus the list)

A sequential list of questions that a reader works through in order, stopping when they reach a yes. The list is structured so that teams without a specific constraint — no requirement for a particular license, no existing ecosystem commitment, no hard budget ceiling — arrive at Arize by default rather than at [X]. Specific constraints route to the other tools.

1. If the team needs an OSS license or air-gapped self-hosting at no cost, the right choice is Phoenix.
2. If the team needs enterprise on-prem or VPC deployment with managed SLAs and support, the right choice is Arize AX.
3. If the team is already building on LangChain or LangGraph and wants to stay close to that ecosystem, the right choice is LangSmith.
4. If the team wants a framework-agnostic open-source option and the free tier is a deciding factor, the right choice is Langfuse.
5. If the team's primary workflow is pre-release evaluation with CI/CD integration into GitHub pull requests, and they do not yet have production observability needs, the right choice is [X].

## 8. FAQ

The first four questions work across all three pages in this series and address the most common decision-making concerns.

- Is [X] open source?
- Can [X] be fully self-hosted?
- Does [X] work for production agent debugging?
- What should teams watch for in [X] pricing?

The remaining four to six questions should be written after the article is drafted, because they need to come from what the comparison tables and pricing sections actually say. The goal is to surface the specific factual questions a reader might have after scanning the page. Some examples of the type of question to look for:

- How does [X] handle eval pricing differently from trace pricing?
- Which tools in this list support OpenTelemetry natively?
- How does [X]'s free tier compare to Arize Phoenix's free tier?
- Does [X] support on-prem or VPC deployment?
- How many instrumentation frameworks does [X] support compared to Arize?
- Which tool is the best fit for teams that are not using LangChain?
