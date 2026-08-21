# DevRel Editorial Review: Quick Start Guide

## What Is This?

A quality control system for content using **3 agent skills** that review content before publication:

1. **Technical Review** — Is it accurate? Does code work?
2. **Voice + Tone Review** — Does it sound like us? Is it compelling?
3. **SEO Review** — Will people find it? Does it rank?

---

## How It Works (30 Second Version)

```
You write article
    ↓
Submit for review
    ↓
Technical Agent reviews (2-4 hrs)
    ↓
Voice+Tone Agent reviews (1-2 hrs)
    ↓
SEO Agent reviews (1-2 hrs)
    ↓
Get feedback (PASS / REVISE / FAIL)
    ↓
If REVISE: Fix and resubmit (24-48 hrs)
If PASS: Publish!
```

**Total time:** 5-8 hours (no revisions), 2-3 days (with revisions)

---

## Where Are The Skills?

**Location:** `/skills/specialization/editorial-review-agents/`

**Files:**
- `EDITORIAL-REVIEW-PROCESS.md` — Main process overview
- `technical-review-SKILL.md` — Technical accuracy review
- `voice-tone-review-SKILL.md` — Brand voice & tone review
- `seo-review-SKILL.md` — Search optimization review

---

## How to Use (Step by Step)

### Step 1: Write Your Draft
- Finish your article
- Save as markdown or Google Docs
- Note your **primary SEO keyword** (e.g., "agent harness")

### Step 2: Submit for Review
Send this info to your manager:

```
Article: [TITLE]
Target Keyword: [PRIMARY KEYWORD]
Content Type: [Blog Post / Tutorial / Case Study / etc.]
Target Audience: [Developers / ML Engineers / etc.]
Draft Link: [Google Docs link or file path]
```

### Step 3: Wait for Reviews
- Technical Agent reviews first (2-4 hours)
- Voice+Tone Agent reviews (1-2 hours)
- SEO Agent reviews (1-2 hours)

You'll receive feedback from each agent.

### Step 4: Read Feedback
Each agent gives you:
- **Status:** PASS / REVISE / FAIL
- **Score:** 1-10
- **Specific feedback:** What to fix
- **Estimated fix time:** How long it should take

### Step 5: Fix (If Needed)
- If **PASS:** Your article is approved! Publishing scheduled.
- If **REVISE:** Make the changes listed (24-48 hour deadline)
- If **FAIL:** Schedule a call with manager to discuss approach

### Step 6: Resubmit (If Needed)
After making revisions:
- Update your draft
- Reply: "Ready for re-review"
- Only the agent(s) with feedback will re-review
- Should take 2-4 hours total

### Step 7: Publish
Once you get PASS from all 3 agents:
- Article is approved!
- Manager schedules publication
- You're done!

---

## What Each Agent Looks For

### Technical Agent Checks:
✅ Code examples work (tested)
✅ Claims are accurate (fact-checked)
✅ Links don't 404 (verified)
✅ Terminology is correct
✅ Nothing outdated

### Voice+Tone Agent Checks:
✅ Sounds like Arize (not generic marketing)
✅ Developer-fluent (not over-explaining)
✅ Compelling headline
✅ Good flow (ideas connect logically)
✅ Consistent tone throughout

### SEO Agent Checks:
✅ Keyword in title
✅ Keyword density right (0.8-1.2%)
✅ Good heading structure (H1 > H2 > H3)
✅ 3-5 internal links
✅ 3-5 external links to authority sources

---

## Understanding Feedback

### Feedback Template (Each Agent Sends This)

```
REPORT TITLE
============
Status: [PASS / REVISE / FAIL]
Score: [X/10]

CRITICAL ISSUES (MUST FIX):
[Only if REVISE or FAIL]
1. Issue: [What's wrong] → Fix: [How to fix it]

NICE-TO-HAVE IMPROVEMENTS:
[Only if REVISE]
1. Suggestion: [Optional improvement]

ESTIMATED FIX TIME: [How long to address issues]

RECOMMENDATION: [PASS / REVISE / FAIL]
```

### PASS Means:
✅ Your article is approved by this agent
✅ Meets all criteria for this review type
✅ Ready to move to next agent (or publish if final)

### REVISE Means:
⚠️ Some issues found (1-2 hours to fix)
⚠️ Make the changes listed
⚠️ Resubmit by deadline
⚠️ Agent will re-review (should pass then)

### FAIL Means:
❌ Major issues requiring significant rework (2+ hours)
❌ Can't just "quick fix" — needs rethinking
❌ Schedule a call with manager
❌ Get guidance before rewriting
❌ Resubmit timeline: 1+ week

---

## Example: A Real Review

### Article Submitted:
- Title: "Building Agent Harnesses for Production"
- Keyword: "agent harness"
- Type: Blog Post
- Audience: ML Engineers

### Reviews Come Back:

**TECHNICAL REVIEW:** PASS ✅
- Code examples tested: Yes
- Claims verified: Yes
- Links working: Yes
- Score: 9/10

**VOICE+TONE REVIEW:** REVISE ⚠️
- Sounds like Arize: Yes
- Dev-fluent: Mostly (Section 3 too academic)
- Compelling headline: Yes
- Issues found:
  - Section 3 sounds like a textbook. Suggest rewriting with examples instead of theory.
  - Meta description could be punchier.
- Score: 7/10
- Fix time: 30 minutes

**SEO REVIEW:** REVISE ⚠️
- Keyword in title: Yes
- Keyword density: 0.9% (good)
- Headings: Good structure
- Issues found:
  - Only 2 internal links. Add 1-2 more.
  - Missing external links to architecture research.
- Score: 7/10
- Fix time: 15 minutes

### Author Action:
1. Rewrite Section 3 with examples (30 min)
2. Add 3 internal links (5 min)
3. Add 2 external links to architecture patterns (10 min)
4. Polish meta description (5 min)
5. Resubmit for voice+tone and SEO re-review
6. Get PASS from both agents
7. Publish!

**Total turnaround:** ~2 days (accounting for review times)

---

## Tips for Smooth Reviews

### Before You Submit:
- [ ] Spell check (use Grammarly)
- [ ] Test all code examples yourself
- [ ] Verify all external links work
- [ ] Get the main keyword right (most important!)
- [ ] Headline is compelling (would you click it?)

### During Reviews:
- [ ] Read feedback carefully (agents are specific for a reason)
- [ ] Don't argue feedback — just fix it
- [ ] Ask questions if unclear (reply in review thread)

### When Making Revisions:
- [ ] Address ALL critical issues (not optional)
- [ ] Nice-to-have suggestions are... nice-to-have
- [ ] Keep track of what you changed
- [ ] Note changes in resubmission message

### Common Feedback & How to Address It:

| Feedback | What It Means | How to Fix |
|----------|---------------|-----------|
| "Section X is too academic" | Using jargon, not relatable | Rewrite with examples, simpler language |
| "Code example doesn't run" | Technical error | Test it, fix the issue |
| "Keyword not in title" | SEO issue | Update headline to include keyword |
| "No internal links" | SEO issue | Add 3-5 links to related articles |
| "Opening isn't compelling" | Writing issue | Hook reader with story or question |
| "Missing alt text" | Accessibility + SEO issue | Write descriptions for all images |

---

## Questions?

Refer to:
- **About technical review:** `technical-review-SKILL.md`
- **About voice/tone:** `voice-tone-review-SKILL.md`
- **About SEO:** `seo-review-SKILL.md`
- **About the overall process:** `EDITORIAL-REVIEW-PROCESS.md`

Or reach out to your manager: [Manager contact]

---

## Success Metrics

Your article is successful if:
- ✅ **Technical:** All code works, claims accurate
- ✅ **Voice+Tone:** Developers find it relatable and well-written
- ✅ **SEO:** Ranks in Google top 10 for your target keyword

After publication, we track:
- Organic traffic
- Time on page
- Shares/engagement
- Keyword rankings

---

**Ready to write? Let's go! 🚀**

