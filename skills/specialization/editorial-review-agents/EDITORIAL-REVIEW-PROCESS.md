# DevRel Editorial Review Process
## Three-Agent Quality Gate System

---

## OVERVIEW

This process ensures all DevRel content meets three critical standards before publication:
1. **Technical Accuracy** (Technical Review Agent)
2. **Brand Voice & Tone** (Voice + Tone Review Agent)
3. **SEO Optimization** (SEO Review Agent)

**Status:** Each agent produces a pass/fail/revise recommendation with specific feedback.

---

## WORKFLOW

```
Content Draft
    ↓
[Agent 1: Technical Review]
    ↓ (Pass → Continue | Revise → Send to author)
[Agent 2: Voice + Tone Review]
    ↓ (Pass → Continue | Revise → Send to author)
[Agent 3: SEO Review]
    ↓ (Pass → APPROVED FOR PUBLICATION)
    ↓ (Revise → Send to author with feedback)
Ready for Publication
```

**Exit Criteria:** All 3 agents must approve OR author must address all revisions and re-submit.

---

## PROCESS INPUTS & OUTPUTS

### INPUT (For Each Agent)
- **Draft Content:** Full article (markdown or Google Docs)
- **Content Type:** Blog post, Tutorial, Case Study, Whitepaper
- **Target Audience:** Developers, Data Engineers, ML Engineers, etc.
- **Primary Keywords:** SEO targets
- **Publication Channel:** Blog, Dev.to, LinkedIn, etc.

### OUTPUT (From Each Agent)
- **Status:** PASS / REVISE / FAIL
- **Score:** 1-10 (how well content meets criteria)
- **Specific Feedback:** Line-by-line comments + general notes
- **Actionable Recommendations:** Exact changes to make
- **Time to Fix:** Estimated effort to address feedback

---

## AGENT 1: TECHNICAL REVIEW

**Purpose:** Ensure technical accuracy, completeness, and developer usefulness

**Evaluates:**
- Code examples are correct and tested
- Technical claims are accurate
- Terminology is correct
- Architecture/flow diagrams are accurate
- External references/links are valid
- Performance metrics are realistic
- Edge cases are covered (where applicable)
- No outdated information

**Output Format:**
```
TECHNICAL REVIEW REPORT
=======================
Status: [PASS / REVISE / FAIL]
Overall Score: [X/10]

Critical Issues (MUST FIX):
- [Issue 1]: [Why it matters] → [Fix]
- [Issue 2]: [Why it matters] → [Fix]

Minor Issues (SHOULD FIX):
- [Issue 3]: [Improvement] → [Suggested fix]

Code Review:
- All code examples tested: [Yes/No]
- External APIs referenced correctly: [Yes/No]
- Version numbers accurate: [Yes/No]

Recommendation: [PASS / REVISE / FAIL]
Estimated Fix Time: [30 min / 1 hr / 2+ hrs]
```

---

## AGENT 2: VOICE + TONE REVIEW

**Purpose:** Ensure content aligns with brand voice and resonates with audience

**Evaluates:**
- Consistency with brand voice (dev-fluent, low-hype, product-true)
- Tone matches audience (not too academic, not too casual)
- Headline/subheader quality (compelling, scannable)
- Flow and readability (clear progression, good transitions)
- Call-to-action clarity
- No contradictions in messaging
- Storytelling (if applicable)
- Empathy for reader experience

**Output Format:**
```
VOICE + TONE REVIEW REPORT
===========================
Status: [PASS / REVISE / FAIL]
Overall Score: [X/10]

Brand Voice Assessment:
- Feels true to Arize/DevRel brand: [Yes/Partial/No]
- Dev-fluent (not over-explained): [Yes/Partial/No]
- Low-hype (substance over buzzwords): [Yes/Partial/No]
- Product-true (grounded in reality): [Yes/Partial/No]

Tone Issues:
- Section [X]: [Current tone] → [Recommended tone]
- Headline: [Feedback on impact]
- Conclusion: [Feedback on CTA]

Readability:
- Paragraph length: [Good/Long/Short]
- Sentence structure: [Varied/Monotonous]
- Key phrases: [Clear/Buried]

Recommendation: [PASS / REVISE / FAIL]
Estimated Fix Time: [15 min / 30 min / 1+ hrs]
```

---

## AGENT 3: SEO REVIEW

**Purpose:** Maximize discoverability and search ranking potential

**Evaluates:**
- Target keyword present in title
- Keyword density (0.8-1.2% for primary keyword)
- Heading hierarchy (H1 > H2 > H3)
- Meta description quality
- Internal linking opportunities
- External links to authority sources
- Image alt text
- Read time (estimated)
- Mobile readability
- Schema markup (if applicable)

**Output Format:**
```
SEO REVIEW REPORT
=================
Status: [PASS / REVISE / FAIL]
Overall Score: [X/10]

Keyword Strategy:
- Primary keyword: "[KEYWORD]"
- Primary keyword present in title: [Yes/No]
- Keyword density: [X%] (Target: 0.8-1.2%)
- Secondary keywords: [list]
- Keyword placement:
  - H1: [Yes/No]
  - First 100 words: [Yes/No]
  - Conclusion: [Yes/No]

Technical SEO:
- Meta description: [X characters] (Target: 155-160)
- Title tag: [X characters] (Target: 50-60)
- H2/H3 hierarchy: [Good/Needs work]
- Internal links: [X] (Target: 3-5)
- External links: [X] (Target: 3-5 authority sources)

Content Optimization:
- Images with alt text: [X/Y]
- Mobile-friendly headings: [Yes/No]
- Estimated read time: [X minutes]

Recommendations:
- [Optimization 1]: [Why it matters] → [How to fix]
- [Optimization 2]: [Why it matters] → [How to fix]

Recommendation: [PASS / REVISE / FAIL]
Estimated Fix Time: [15 min / 30 min / 1+ hrs]
```

---

## QUALITY GATES

### PASS Criteria

**Technical:** No critical errors, code tested, facts accurate, references valid

**Voice+Tone:** Sounds like Arize/brand, clear for audience, compelling headline, smooth flow

**SEO:** Primary keyword in title + early in content, good heading hierarchy, 3+ internal links, 3+ external links

### REVISE Criteria

**Any agent:** Issues found that are fixable (≤1-2 hours work)

Author receives:
- Specific list of changes needed
- Why each change matters
- Suggested revisions
- Deadline for resubmission (24-48 hrs)

### FAIL Criteria

**Any agent:** Fundamental issues that require significant rework (2+ hours)

Article is **rejected** and sent back with:
- Root cause analysis
- Recommended approach for rewrite
- Timeline for resubmission (1+ week)
- Offer to help author before resubmission

---

## PROCESS TIMELINE

| Stage | Owner | Duration | Next |
|-------|-------|----------|------|
| Draft Submission | Author | - | Tech Review |
| Technical Review | Agent 1 | 2-4 hours | Voice+Tone Review |
| Voice+Tone Review | Agent 2 | 1-2 hours | SEO Review |
| SEO Review | Agent 3 | 1-2 hours | Decision |
| Revision Request (if REVISE) | Author | 24-48 hrs | Re-review (1 agent only) |
| Approval & Scheduling | Manager | 1 hour | Publication |
| **Total Fast Track** | - | **5-8 hours** | - |
| **With 1 Revision Round** | - | **2-3 days** | - |

---

## ROLES & RESPONSIBILITIES

| Role | Responsibility |
|------|-----------------|
| **Content Author** | Submit draft, address feedback, resubmit if needed |
| **Tech Review Agent** | Run all 3 reviews sequentially, block on FAIL only |
| **Voice+Tone Review Agent** | Provide editorial feedback aligned with brand voice |
| **SEO Review Agent** | Optimize for discoverability and search rankings |
| **DevRel Manager** | Approve final output, schedule publication, track metrics |

---

## ESCALATION

If author disagrees with feedback:
1. **Within 24 hrs:** Author can request "second opinion" from any agent
2. **Agent Review:** Agents provide updated assessment
3. **Manager Decision:** DevRel manager makes final call (can override agent feedback)

---

## FEEDBACK TEMPLATE (For Authors)

```
EDITORIAL REVIEW SUMMARY
========================

Status: [PASS / REVISE / FAIL]
Agents Completed: [1/3] [2/3] [3/3]

CRITICAL FIXES NEEDED:
[List only if REVISE or FAIL]

NICE-TO-HAVE IMPROVEMENTS:
[Optional suggestions]

NEXT STEPS:
- [If PASS]: Article approved! Publishing scheduled for [DATE]
- [If REVISE]: Please address items above and resubmit by [DATE]
- [If FAIL]: Let's schedule a call to discuss approach

Questions? Reply in this thread or reach out to @[manager]
```

---

## INTEGRATION WITH EXISTING WORKFLOWS

This process should integrate with:
- **ForgeOS Editorial Workflows** (execution plans, calendars)
- **Content Calendar** (publication scheduling)
- **Analytics Dashboard** (post-publication tracking)
- **DevRel Playbooks** (best practices, style guides)

---

## SUCCESS METRICS

Track per agent:
- **Avg Review Time:** Target 2-4 hours per content piece
- **Revision Rate:** % of content needing revisions (target: 30-40%)
- **Author Satisfaction:** Feedback on usefulness of agent comments
- **Post-Publication Performance:** Traffic, engagement, rankings for PASS content

---

## ITERATION & IMPROVEMENT

**Monthly Review:**
- [ ] Which agent feedback is most valuable?
- [ ] Which feedback do authors ignore most?
- [ ] Any patterns in revision requests?
- [ ] Should we adjust criteria?

**Quarterly Calibration:**
- [ ] Update agents with new brand guidelines
- [ ] Refine rubrics based on highest-performing content
- [ ] Share learnings with DevRel team

