---
name: write-in-voice
description: >-
  Write LinkedIn posts, X threads, and blogs in practitioner voice with
  format-specific structure and anti-sales-pattern rules. Use when drafting
  social or longform copy, writing in voice, or tightening a pitchy draft.
---

# Write in voice

Write developer-facing copy that sounds like someone who shipped the thing, not a brand account summarizing it. Covers voice, format-specific structure, and the sales patterns that sneak in after the obvious hype is gone.

This skill is format craft. It is not a founder corpus. Load house voice from [`../../../../references/content/voice-and-tone.md`](../../../../references/content/voice-and-tone.md) and [`../../../../core/DEVELOPER_FLUENCY.md`](../../../../core/DEVELOPER_FLUENCY.md). If you have named executive voices, keep those rules in your own local file; do not scrape a private social archive into git.

For **corporate brand-account posts from a URL or launch**, prefer [`../write-social-post/SKILL.md`](../write-social-post/SKILL.md). Use this skill when the piece should sound like a practitioner, including exec or maintainer social.

## Before writing

1. Load house voice and [`../../../../references/content/brand-lexicon.md`](../../../../references/content/brand-lexicon.md).
2. Read two or three of *your* posts in the same format and topic.
3. Write about systems you have actually used. Do not fake adjacent-domain depth.

## Output

Write to this skill's local `tmp/`:

```
.agents/skills/content/write-in-voice/tmp/<format>/YYYY-MM-DD-topic-slug.md
```

`<format>` is one of: `linkedin`, `twitter`, `blog`, `email`, `other`.

Never write into `references/`, `skills/`, or a human `drafts/` folder unless the user explicitly asks to promote.

## Voice (all formats)

**Practitioner, not influencer.** Write as someone who builds and runs experiments. Not performatively humble. Not hype-bro.

**"We" by default.** Use "we" for research, experiments, product work. "I" only for a genuine personal opinion.

**Direct and opinionated.** Take a stance. "Numeric score evals are broken" beats "there may be some issues with numeric scoring."

**Accessible depth.** Explain hard things simply. Do not dumb them down. Assume a smart engineer who has not read this paper.

**Short sentences hit harder.** Fragments for emphasis are allowed: "Clean. Also wrong." / "Non-starter."

### Do not

- Corporate announce-speak ("we're thrilled to share")
- Hedging everything
- Walls of hashtags
- Openers like "I've been thinking about…"
- "Folks" or "y'all"
- Filler intros. First line is the point.
- Em dashes or en dashes. Use periods, commas, colons, or semicolons. Split long sentences.

### Avoid sales patterns

Copy can pass every tone check and still read like a pitch deck.

- **No credibility flexes.** Don't open with "we see this across thousands of deployments." Describe what you built and observed.
- **No tease lines.** "When you get this right, something larger emerges" is a slide building to a reveal. Say the thing.
- **No rapid-fire "your X" patterns.** Three "your stack / your agents / your team" lines in a row is a demo script.
- **No triple-hammer closers.** One strong last line beats three rehearsed ones.
- **No tagline endings.** End on a concrete observation or a real opinion, not "build the infrastructure it deserves."
- **Observational over prescriptive.** "Most teams treat it as disposable. That is a mistake." describes and reacts. "Treating it as disposable is a strategic mistake" lectures.
- **Ground claims in what you built.** Link prior work. Name real systems and people on your team. Specifics, not assertions of scale.

## Format: LinkedIn

Read like a sharp opinion piece, not a blog summary.

**Opening line is everything.** LinkedIn truncates after about two lines.

Patterns that work:

- Contrarian observation: "Everyone spent the last year building MCP integrations. Meanwhile, skills quietly won."
- Strong reframe: "The model is not wrong. You have not built the harness."
- Surprising result: lead with a number you actually measured.

**Body:**

- 1–3 sentences per paragraph. One idea each.
- No markdown headers. LinkedIn renders them poorly. Line breaks and sparse bold.
- Acknowledge the counterargument once, then move on.
- Land one-liners the reader can quote.

**Close:** strongest line, not a CTA. Put the repo or blog link in a comment. LinkedIn penalizes outbound links in the post body.

More measured than X. Still opinionated. Length can be 800–1500 words if every paragraph earns it. No emoji bullets.

## Format: X threads

Highest-signal threads show an experiment with a concrete result.

**Tweet 1** carries most of the weight. Lead with the result or insight, not the setup:

- Bold claim + measured result
- Provocative question
- Counter-intuitive finding

**Body:**

- Number tweets (`2/` or `(2/7)`)
- One idea per tweet
- Specific numbers when you have them

**Close:** link to code or the post, tag people who should see it, one CTA to try the technique.

Emoji on X only, and sparingly: thread marker, check/cross for comparisons, list bullets. Never emoji-per-word or five in a row.

## Format: standalone X

One idea. Hot take backed by experience, or a reframe of someone else's write-up with credit.

## Format: blog

Title is specific. First paragraph states the question and the result. Show methodology (setup, what you tested, why). Results get tables or numbers. Analysis says what surprised you. Link a notebook or repo.

More detail than social. Still opinionated in the analysis. Architecture/opinion posts lead with a systems reframe, not a quantitative result; they build a mental model and end on a concrete observation.

For the two-phase editorial workflow (find the thread, then draft), use [`../write-blog/SKILL.md`](../write-blog/SKILL.md).

## Quality checklist

- [ ] First line earns another three seconds
- [ ] Every paragraph or tweet has one point
- [ ] Claims that need numbers have numbers
- [ ] Strongest line is at the end, not buried
- [ ] Reads like a person who built something
- [ ] Format matches the platform
- [ ] Closing section does not sound like a sales deck

## Related

| Need | Skill |
|---|---|
| Longform two-phase editorial | [`../write-blog/SKILL.md`](../write-blog/SKILL.md) |
| Corporate brand-account social from a URL | [`../write-social-post/SKILL.md`](../write-social-post/SKILL.md) |
| Channel derivatives from a finished asset | [`../../../../skills/specialization/social-editor/SKILL.md`](../../../../skills/specialization/social-editor/SKILL.md) |
| Typefully draft | [`../../operational/typefully/draft-with-utm/SKILL.md`](../../operational/typefully/draft-with-utm/SKILL.md) |
