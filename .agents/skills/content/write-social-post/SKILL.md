---
name: write-social-post
description: >-
  Draft corporate Arize social posts for X and LinkedIn from a blog URL, event,
  product launch, or other source material. Use when a user asks to write,
  draft, or create social copy, LinkedIn posts, tweets, X threads, or promo
  posts for the @arizeai account (corporate only — not founder voices).
---

# Write Social Post

Draft ready-to-review corporate social copy for **@arizeai** on X and LinkedIn.
Output is draft text only — do not create Typefully drafts, post to social, or
write in Aparna/Jason founder voice unless the user explicitly redirects.

**North star (from the Social Voice Playbook):** A rough, specific, true post
from a practitioner beats a polished brand post every time. Be useful, be
specific, be a person. The logo is the smallest thing in the post.

## Scope

| In scope | Out of scope |
|---|---|
| Corporate (@arizeai) X and LinkedIn posts | Founder / personal accounts (use founder voice refs instead) |
| Promotional and educational organic posts | Reply drafting for engagement scanning |
| Blog URLs, events, launches, briefs, notes | Publishing, scheduling, UTM/Typefully creation |

## Prerequisites

Before drafting, read in this order:

1. [`references/social-voice-playbook.md`](references/social-voice-playbook.md) — **required** voice, spice spectrum, do/don't, hit-post checklist, ping-the-team guardrails
2. [`references/channel-strategy.md`](references/channel-strategy.md) — **required** channel roles, content mix, and draft-shaping rules for X vs LinkedIn (from Social strategy 2026)
3. [`references/content/voice-and-tone.md`](../../../../references/content/voice-and-tone.md) — house voice; especially the Social (LinkedIn, X) tone row
4. [`references/content/brand-lexicon.md`](../../../../references/content/brand-lexicon.md) — always-use / never-use terms

If the playbook and house voice conflict on social craft, prefer the playbook.
If playbook voice and channel strategy conflict on *what to emphasize*, use
channel strategy for content mix / angle and the playbook for tone / spice.
Lexicon bans still always win for word choice.

Do not load founder-voice docs for corporate posts unless the user asks to write as Aparna or Jason.

## Inputs

Ask only for what is missing. Accept any combination of:

| Input | Notes |
|---|---|
| Source | Blog/docs URL, event page, launch brief, Notion/Doc link, pasted notes, or freeform topic |
| Platforms | Default: both X and LinkedIn. Narrow if the user names one. |
| Goal | Awareness, drive clicks, registrations, waitlist, hiring, etc. Infer from source when clear. |
| CTA / URL | Destination link if there is one. Do not invent URLs. |
| Constraints | Length, no-link, thread vs single post, must-mention partners, embargo timing |
| Spice level | Optional. If unset, use channel defaults below. |

If the source is a URL, fetch or open it and pull the specific claim, number, or hook before drafting. Do not draft from the title alone when the body is available.

## Account and channel defaults

- **Account:** corporate @arizeai only
- **Platforms:** X and LinkedIn unless the user specifies one
- **Publishing:** draft copy only — stop after presenting options for human review

### Safe-to-spicy (required)

Every draft must pick a zone and label it. Defaults for this skill:

| Channel | Default zone | Notes |
|---|---|---|
| **X (@arizeai)** | Sharp (optionally Spicy) | Safe posts disappear on X. Spicy OK for topical/fun; stay Safe if the topic touches customers or legal. |
| **LinkedIn** | Warm-to-Sharp | Buyers and leaders, still human — not press-release Safe unless it is literal company news. |

Zone definitions live in [`references/social-voice-playbook.md`](references/social-voice-playbook.md). Prefer teaching angles over announcement angles when both are possible.

## Voice guardrails (from the playbook)

Apply all five principles on every draft:

1. **Teach, don't announce** — Prefer a pattern, failure+fix, number, or tool. The best posts barely mention Arize.
2. **Sound like a person** — Colleague-at-the-next-desk; opinions OK; rewrite anything that reads committee-approved.
3. **Be specific to the point of narrow** — Name the model, number, failure, framework. No broad "improving agent performance" filler.
4. **React fast, in voice** — When the source is news-cycle or timely, favor a sharp timely cut over a generic evergreen promo.
5. **Celebrate other people** — Credit contributors, maintainers, guests, partners by name when the source supports it.

### Green light / red light

**Do:** lead with claim/number/tension; keep it rough and specific; use dry humor when earned; credit people; turn real debugging wins into posts.

**Don't:** open with "Excited to announce"; push product when you could teach a pattern; sand personality into generic brand paste; chase a broad audience; punch down; dunk on customers; subtweet competitors by name.

## Platform rules

### Shared (both platforms)

- Open with a claim, tension, number, or concrete failure mode — never "Excited to share," "Thrilled to announce," or "Proud to unveil"
- Practitioner voice: specific tools, outcomes, and names over vague benefit-speak
- Ban lexicon offenders: unlock, empower, leverage, supercharge, revolutionary, game-changing, AI-powered, solutions (as fluff), thought leadership
- Emojis: rare; zero by default; at most one if it earns its place
- Hashtags: sparingly (0–2). Prefer none unless the user requests campaign tags
- Include the destination URL only when the user provided one or it is clear from the source. On X, put the link in the final post or final thread tweet unless the user wants it earlier.

### X (@arizeai)

- Prefer a tight single post (≤280 characters) when the idea fits
- **Default to a native thread** for deep-dive blogs and interviews (channel strategy: threads often outperform the article); keep other sources as a single post unless sequencing helps
- No "🧵" thread bait as the lede; if threading, make post 1 self-contained and scroll-stopping
- Avoid hashtag stacks and engagement-bait questions ("Agree?", "Thoughts?")
- Aim Sharp-to-Spicy unless the topic is customer/legal-sensitive (then Safe)
- Prefer conversing / teaching / community celebration over pure broadcast announce
- Brand-level posts: launches, topical fun, milestones, amplification — not founder-voice impersonation

### LinkedIn (corporate page tone)

- Longer is fine: ~800–1,300 characters is a good default range; stop earlier if the point is made
- Short paragraphs (1–2 lines). White space matters more than clever lines
- One clear CTA near the end when there is a destination
- Do not open with "I'm excited…" / "We're excited…" even on LinkedIn
- Aim Warm-to-Sharp; use Safe only for straight milestone / ship notes
- Write for enterprise buyers / eng leaders: category narrative, milestones, customer stories, recruiting — **less code than X**, more "what this means and why it matters"

## Default workflow

1. **Intake** — Confirm platform(s) if ambiguous; gather source + goal + URL.
2. **Read playbook + channel strategy + house voice** — Required before drafting.
3. **Map source → channel role** — Using [`references/channel-strategy.md`](references/channel-strategy.md), pick the content shape (X thread vs single; LinkedIn meaning-led vs milestone).
4. **Extract the hook** — Pull 1–3 specific facts from the source (number, failure mode, product change, speaker/event detail). Drop generic AI marketing.
5. **Pick zone + angle** — One primary angle and one zone per variant. Prefer teach/converse over announce. Do not mix launch hype with teach mode in the same post.
6. **Scan for ping-the-team risks** (below) before writing.
7. **Draft** — Produce variants per the output format.
8. **Self-check** against both checklists, then present for human edit — do not publish.

## Ping-the-team guardrails

Speed is the default elsewhere; for corporate drafts produced here, **flag and hold** if any of these apply. Accuracy outranks speed.

Flag under **Notes for the human → Needs review** when the draft:

1. Names or characterizes a **specific customer**
2. Mentions **unreleased** features, roadmap, or non-public numbers
3. **Names a competitor critically**
4. Asserts a take that is **not clearly true** from the source

Do not soft-pedal these. Mark the option as not ready to ship until a human clears it.

## Output format

Present drafts in this structure (skip a platform section if not requested):

```markdown
## Source summary
- Hook: …
- Audience: …
- CTA / URL: … (or none)
- Channel role: … (e.g. X teach-thread / LinkedIn milestone-meaning)
- Playbook zone target: … (Safe / Warm / Sharp / Spicy)

## LinkedIn (corporate)
### Option A — [zone] — [angle label]
[post copy]

### Option B — [zone] — [angle label]
[post copy]

## X (corporate @arizeai)
### Option A — [zone] — single post | thread
[post copy]
Char count: N/280 (for single posts)

### Option B — [zone] — single post | thread
…

## Notes for the human
- Needs review: … (or "none")
- Other: missing URL, partner risk, screenshot/tile idea, etc.
```

Defaults:

- **2 options per requested platform** (A/B with different angles and/or zones)
- For deep-dive blogs and interviews on X, **at least one option should be a native thread**
- Add a third only if the user asks or the source supports a clearly distinct cut
- Label each option with zone + angle (e.g. "Sharp — failure-mode lede", "Warm — launch-fact")

## Pre-send checklist

Before returning drafts, confirm:

**Playbook (10-second)**

- [ ] A developer would learn something even if they never buy
- [ ] Specific — a real number, model, tool, or failure appears early
- [ ] Sounds like a person, not marketing
- [ ] Leads with the point — not "Excited to…"

**Skill / brand / channel**

- [ ] Zone labeled and appropriate for the channel
- [ ] Angle matches channel role (X: converse/teach/react; LinkedIn: meaning for buyers/leaders)
- [ ] Deep-dive blog or interview → X thread option included when drafting X
- [ ] LinkedIn is less code-dense than X when both are drafted
- [ ] No banned lexicon from brand-lexicon
- [ ] Corporate voice (we / Arize), not founder first-person as Aparna or Jason
- [ ] X single posts respect length; threads justified
- [ ] Links only when provided or explicit in the source
- [ ] Ping-the-team risks flagged or confirmed absent
- [ ] Draft only — no Typefully, Slack, or live post

## What's NOT here

- Founder-voice LinkedIn/X → [`references/content/write-in-voice.md`](../../../../references/content/write-in-voice.md)
- Engagement reply scanning → [`../../../agents/content/twitter-scan/AGENT.md`](../../../agents/content/twitter-scan/AGENT.md)
- Creating a Typefully draft with UTM → [`../../operational/typefully/draft-with-utm/SKILL.md`](../../operational/typefully/draft-with-utm/SKILL.md)
- UTM link generation alone → [`../../operational/generate-utm-link/SKILL.md`](../../operational/generate-utm-link/SKILL.md)

## Handoff

| Need | Skill / Doc |
|------|-------------|
| Social Voice Playbook (full) | [`references/social-voice-playbook.md`](references/social-voice-playbook.md) |
| Channel strategy 2026 (X / LinkedIn / YouTube roles) | [`references/channel-strategy.md`](references/channel-strategy.md) |
| House voice and tone | [`references/content/voice-and-tone.md`](../../../../references/content/voice-and-tone.md) |
| Approved / banned language | [`references/content/brand-lexicon.md`](../../../../references/content/brand-lexicon.md) |
| Save draft to Typefully with UTM | [`../../operational/typefully/draft-with-utm/SKILL.md`](../../operational/typefully/draft-with-utm/SKILL.md) |
| Founder (Aparna/Jason) social voice | [`references/content/write-in-voice.md`](../../../../references/content/write-in-voice.md) |
| Scan and draft engagement replies | [`../../../agents/content/twitter-scan/AGENT.md`](../../../agents/content/twitter-scan/AGENT.md) |
| Blog/social hero tile image | [`../../../agents/content/blog-tile/AGENT.md`](../../../agents/content/blog-tile/AGENT.md) |
