---
title: Context Index
description: Documentation of ForgeOS context layers and knowledge structure
updated: 2024
---

# Context Index

The context system in ForgeOS organizes knowledge in layers, each serving a specific purpose in the content and decision-making pipeline. Agents reference these context layers to understand strategy, narrative, and execution details.

## Context Layers Overview

Context is organized into 8 layers, from foundational philosophy to specific research and intelligence:

```
Level  Layer              Purpose
──────────────────────────────────────────────────────────────
  0    Orchestration      System rules and agent coordination
  1    Philosophy         Core values and beliefs
  2    Narrative          Story frameworks and messaging
  3    Strategy           Business goals and positioning
  4    Execution          Campaign plans and runbooks
  5    Patterns           Proven patterns and templates
  6    Influence          Analyst and thought leadership strategy
  7    Research           Market intelligence and data
```

## Detailed Layer Descriptions

### Level 0: Orchestration

**Directory**: `context/00_orchestration/`

**Description**: Core system definitions and orchestration rules for ForgeOS

**Purpose**: Defines how agents coordinate, what information flows between them, and system-level decisions

**Files**:
- `forgeos-context-orchestrator.md`

### Level 1: Philosophy

**Directory**: `context/01_philosophy/`

**Description**: Foundational beliefs, values, and principles

**Purpose**: Establishes core worldview, brand values, and principles that guide all content and decisions

**Files**:
- `developer-marketing-manifesto.md`

### Level 2: Narrative

**Directory**: `context/02_narrative/`

**Description**: Core messaging, positioning, and story frameworks

**Purpose**: Provides the company's core story, key messages, and narrative angles for all content

**Files**:
- `campaign-messaging.md`
- `competitive-pov.md`
- `messaging-framework.md`
- `technical-messaging-case-study.md`

### Level 3: Strategy

**Directory**: `context/03_strategy/`

**Description**: Business goals, content strategy, and category positioning

**Purpose**: Aligns content with business objectives, defines category strategy, and positioning

**Files**:
- `ar-strategy.md`
- `content-strategy-framework.md`
- `content-strategy.md`
- `post-gtm-blueprint.md`
- `strategy-blueprint.md`

### Level 4: Execution

**Directory**: `context/04_execution/`

**Description**: Campaign briefs, blueprints, and runnable content plans

**Purpose**: Provides concrete execution templates for campaigns, launches, and content initiatives

**Files**:
- `campaign-blueprint.md`
- `campaign-brief.md`
- `gtm-operating-system.md`
- `post-launch-framework.md`

### Level 5: Patterns

**Directory**: `context/05_patterns/`

**Description**: Proven patterns, templates, and case studies from past campaigns

**Purpose**: Documents what has worked before - patterns, templates, and proven approaches

**Files**:
- `campaign-performance-readout.md`
- `developer-ads-case-study.md`
- `developer-ads.md`
- `developer-marketing-workflow-principles.md`
- `landing-pages.md`
- `workflow-narrative-case-study.md`
- `workflows.md`

### Level 6: Influence

**Directory**: `context/06_influence/`

**Description**: Analyst relations, thought leadership, and influencer strategy

**Purpose**: Guides relationships with analysts, thought leaders, and key influencers

**Files**:
- `analyst-relations-playbook.md`

### Level 7: Research

**Directory**: `context/07_research/`

**Description**: Market intelligence, competitive analysis, and research frameworks

**Purpose**: Provides market data, competitive intelligence, and research methodologies

**Files**:
- `intelligence-scoring-prompt.md`
- `market-research-playbook.md`



## Using Context in Workflows

### Blog Post Workflow

1. **Start with Strategy** (Level 3) - Check positioning and content strategy
2. **Review Narrative** (Level 2) - Align with core story and messaging
3. **Check Philosophy** (Level 1) - Ensure brand values are honored
4. **Reference Patterns** (Level 5) - Use proven approaches and templates
5. **Consult Research** (Level 7) - Incorporate market intelligence

### Product Launch Workflow

1. **Reference Strategy** (Level 3) - Understand product positioning
2. **Review Execution** (Level 4) - Use launch blueprint
3. **Check Narrative** (Level 2) - Align with launch messaging
4. **Review Influence** (Level 6) - Consider analyst and influencer strategy
5. **Apply Patterns** (Level 5) - Reference previous successful launches

### Competitive Response Workflow

1. **Review Research** (Level 7) - Understand competitive landscape
2. **Check Strategy** (Level 3) - Reference competitive POV
3. **Review Narrative** (Level 2) - Ensure messaging consistency
4. **Reference Patterns** (Level 5) - Apply proven competitive responses
5. **Consult Influence** (Level 6) - Consider analyst perspective

### Campaign Planning Workflow

1. **Start with Strategy** (Level 3) - Review campaign strategy framework
2. **Use Execution** (Level 4) - Follow campaign blueprint
3. **Reference Patterns** (Level 5) - Review past campaign patterns
4. **Check Narrative** (Level 2) - Ensure campaign messaging aligns
5. **Apply Research** (Level 7) - Incorporate campaign intelligence

## Context Selection Rules

### For Blog Posts

**Required**:
- Strategy (positioning)
- Narrative (messaging)
- Philosophy (brand values)

**Recommended**:
- Patterns (similar blog examples)
- Research (market context)

**Optional**:
- Influence (if thought leadership angle)
- Orchestration (if multi-agent workflow)

### For Ads and Campaigns

**Required**:
- Strategy (campaign positioning)
- Execution (campaign blueprint)
- Narrative (campaign messaging)

**Recommended**:
- Patterns (case studies)
- Research (audience data)

**Optional**:
- Influence (if includes influencer elements)

### For Campaign Strategy

**Required**:
- Strategy (content strategy framework)
- Narrative (messaging hierarchy)
- Philosophy (brand values)

**Recommended**:
- Research (market intelligence)
- Patterns (proven patterns)
- Orchestration (team coordination)

### For Product Launch

**Required**:
- Strategy (product positioning)
- Execution (launch blueprint)
- Narrative (launch messaging)

**Recommended**:
- Patterns (launch case studies)
- Influence (analyst strategy)

**Optional**:
- Research (competitive context)

### For Thought Leadership

**Required**:
- Philosophy (brand voice)
- Narrative (POV)
- Influence (thought leadership strategy)

**Recommended**:
- Strategy (positioning)
- Research (market insights)

**Optional**:
- Patterns (TL examples)

### For Competitive Analysis

**Required**:
- Research (intelligence)
- Strategy (competitive POV)
- Narrative (differentiation)

**Recommended**:
- Patterns (competitive response patterns)

**Optional**:
- Influence (analyst perspective)

## Context Layer Relationships

```
Philosophy (1)
    ↓
Narrative (2) & Strategy (3)
    ↓
Execution (4)
    ↓
Patterns (5) ← Research (7)
    ↓
Influence (6)
```

- **Philosophy** informs all higher layers
- **Narrative** and **Strategy** must be aligned
- **Execution** implements strategy and narrative
- **Patterns** are proven instances of execution
- **Research** feeds into strategy and narrative refinement
- **Influence** applies across all layers for relationship management
- **Orchestration** coordinates all layers and agents

## Adding Content to Context Layers

To add new context documents:

1. **Identify the layer** - Which level (0-7) is this content for?
2. **Create the file** - Add a `.md` file to the appropriate directory
3. **Use frontmatter** - Include metadata:
   ```yaml
   ---
   title: Document title
   purpose: What question does this answer?
   updated: YYYY-MM-DD
   ---
   ```
4. **Update this index** - Reference the new file in the appropriate section
5. **Link from agents** - Update agent SKILL.md files if they reference this context

## References

- [Agents Index](../agents/INDEX.md)
- [Agents Registry](../agents/registry.yaml)
- [Skills Directory](../skills/)
