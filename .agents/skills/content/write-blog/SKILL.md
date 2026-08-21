---
name: write-blog
description: >-
  Write long-form blog posts through a two-phase editorial workflow. Phase 1
  finds the thread and asks targeted questions. Phase 2 drafts in practitioner
  voice. Use when the user wants to write, draft, or iterate on a blog post.
---

# Write Blog

Write long-form developer posts in two phases. Phase 1 is editorial: read the material, find the thread, ask questions. Phase 2 is writing. Do not draft until the writer approves the thread.

## Before starting

1. Load [`../write-in-voice/SKILL.md`](../write-in-voice/SKILL.md) for format and anti-sales-pattern rules.
2. Load [`../../../../references/content/voice-and-tone.md`](../../../../references/content/voice-and-tone.md), [`../../../../core/DEVELOPER_FLUENCY.md`](../../../../core/DEVELOPER_FLUENCY.md), and [`../../../../references/content/evaluation.md`](../../../../references/content/evaluation.md).
3. Read two or three of *your* published posts closest to this topic. Do not invent a corpus.

## Output

Write the draft to this skill's local `tmp/`:

```
.agents/skills/content/write-blog/tmp/YYYY-MM-DD-topic-slug.md
```

Never write into `skills/`, `references/`, or a human `drafts/` folder unless the user explicitly asks to promote.

## Company worldview

Load *your* narrative from `core/` and `context/`. It informs what topics matter and where a piece can lead. Do not state that worldview as a prediction or a pitch.

- Show, don't declare. Hint, don't sell.
- "We built X and observed Y" beats "We believe the future will be Z."
- Never claim uniqueness ("the only platform that…"). Describe the mechanism and let the reader connect it to the product.
- When the material touches a core theme, let evidence make that conclusion feel inevitable. Do not bolt a slogan onto the closer.

---

## Phase 1: Find the thread

The writer will give you an outline, bullets, a doc, a draft, or a topic. Read all of it before writing anything.

### What you're looking for

Every strong post has one **thread**. Not a topic. Not a list of things to cover. A thread is the single argument or insight that every section advances.

Examples of the *shape* (replace with the writer's actual claim):

- A small primitive is actually the whole architecture.
- Reliability comes from the surrounding system, not a stronger model.
- Telemetry is a durable asset, not debugging exhaust.
- Tighter constraints beat a bigger model.
- Treating this data as disposable is a mistake.

The thread is what the reader walks away believing. If you cannot state it in one sentence, the post does not have one yet.

### Analyze the source material

**What's there:**

- Claims or insights already present
- Evidence (data, evals, comparisons, internal experience, external references)
- The strongest single line. The thread is often buried in the middle.
- Sections that go deep vs. sections that stay surface-level

**What's missing:**

- Is there a thread, or a pile of related topics?
- Where is the material shallow?
- Are claims evidenced or asserted?
- Does the conclusion land, or trail off?
- Does the opener earn attention in the first sentence?

### "Other Ideas" / "Additional Ideas"

If the writer includes a grab-bag section, do not fold it in silently. During questions, handle each item:

- Strengthens the thread? Ask whether to weave it in and where.
- Suggests a better thread? Surface it.
- Adds depth to a thin section? Propose a concrete example.
- Pulls a different direction? Say so and offer to save it for another post.

### Ask questions

Ask 5–10 questions specific to *this* material. Not a generic intake form.

**Find the thread:**

- "Your material covers [A, B, C]. What's the one insight you want someone to take away?"
- "The strongest line is [exact quote]. What if that's the thesis?"
- "This reads as a [topic] overview. What's the opinion?"

**Go deeper:**

- "You say [claim]. What did you actually observe? A moment, experiment, or customer conversation?"
- "This section stays high-level. What does it look like in practice in *your* product or a real workflow?"
- "How does [tool] compare to the alternatives? What did you try first that failed?"
- "Is there data: before/after, benchmark, eval, trace?"
- "Who on the team disagrees? Is that worth surfacing?"

**Test the thread:**

- "If I read only the first and last paragraphs, do they tell the same story? Opener says [X]; closer says [Y]."
- "Does section [N] advance the thread, or is it a detour? What happens if we cut it?"
- "The thread seems to be [your read]. Is that what you intended?"

**New angles:**

- "There's a tension between [X] and [Y]. Is that the piece?"
- "Have you considered opening with [specific line/result] instead?"
- "What's the historical or cross-domain analogy?"

If the conclusion is weak, offer 2–3 closers: one that ties back to the opener, one forward-looking, one that is the strongest opinion moved to the end.

### Present your read

After answers, summarize and wait for approval before Phase 2:

- **Thread:** one sentence
- **Opener:** how the first paragraph earns the read
- **Sections:** what each section accomplishes and how it advances the thread
- **Closer:** the landing line or paragraph
- **Why someone would share this:** one sentence

---

## Phase 2: Write

**Every section goes deeper than the last.** Do not list topics side by side. Opener establishes terrain; later sections add analogy, evidence, comparison, mechanism, implication.

**Mix evidence types.** Practitioner experience, cross-domain analogy, comparison table, original eval, external reference, product-specific detail, forward-looking question. No post needs all of them. One type only is a flat read.

**Revisit the thread; don't repeat it.** The opener states the insight at one level. The closer states the same insight after the evidence.

**Length follows the material.** A tight argument can be ~500 words. A systems piece can be ~2000. Do not pad. Do not compress a deep argument to fit a template.

**Sections earn their place.** If a section does not change what the reader understands, cut it or fold it in.

Apply [`../write-in-voice/SKILL.md`](../write-in-voice/SKILL.md). For blogs specifically:

- First sentence earns the read
- No em dashes or en dashes
- No sales patterns (credibility flexes, tease lines, tagline endings, triple-hammer closers)
- Take a stance
- "We" by default; "I" only for a genuine personal opinion
- Name real systems, people, and tools you actually used

### After writing

Tell the writer:

- Where you went deeper than the source and what you added
- Where sections are still thin
- Which lines feel forced
- Whether the thread holds from opener to closer

## Related

| Need | Skill |
|---|---|
| Format, social, anti-sales patterns | [`../write-in-voice/SKILL.md`](../write-in-voice/SKILL.md) |
| House voice | [`../../../../references/content/voice-and-tone.md`](../../../../references/content/voice-and-tone.md) |
| Diagrams for the post | [`../../design/local-excalidraw/SKILL.md`](../../design/local-excalidraw/SKILL.md) |
| Google Doc handoff | [`../markdown-to-google-doc/SKILL.md`](../markdown-to-google-doc/SKILL.md) |
| Stage a CMS draft | [`../../operational/wordpress/SKILL.md`](../../operational/wordpress/SKILL.md) |
| Source is a video | [`../../../agents/content/video-article-pipeline/AGENT.md`](../../../agents/content/video-article-pipeline/AGENT.md) |
