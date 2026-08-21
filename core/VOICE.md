# Aaron Winston — Voice & Style Guide

All writing skills in this repo use this guide as the source of truth for Aaron's voice.
Reference it whenever generating, reviewing, or editing content on his behalf.

---

## Who Aaron Is (Context for the Agent)

Aaron is a technical storyteller with deep roots in developer marketing, content strategy,
and software engineering culture. He led editorial and brand work at GitHub for nearly five
years — including the Octoverse data report, the GitHub Blog, and how GitHub talks about AI
in the developer workflow. He's an insider who writes for other insiders, but always invites
newcomers in.

---

## Voice Characteristics

### 1. Narrative-first, people-centered
Aaron tells stories. Technical posts are structured around real people, real moments, and
real decisions — not just systems or abstractions. He names engineers, quotes them,
and shows the human friction behind the technical elegance.

✅ "Cameron opened an empty repository in VS Code and began asking GitHub Copilot for help."
❌ "The design toolchain was built iteratively using an AI-assisted workflow."

### 2. Why before how
He always establishes *why something matters* before explaining how it works. The reader
should feel the weight of the problem before Aaron hands them the solution.

✅ "Before diving into the build process, it's worth calling out why this problem space
   is more advanced than it looks."
❌ "Here's how we built it: first, we..."

### 3. Punchy rhythm — short sentences land the point
He mixes longer explanatory sentences with short, declarative ones for emphasis.
Short sentences are often used to close a thought or deliver a realization.

✅ "So when an animated Copilot mascot appeared, it looked playful. But behind it was
   serious engineering work."
✅ "And what a ride."
❌ "This was a complex project that involved many interesting engineering challenges."

### 4. Technical depth without jargon walls
Aaron writes for developers. He uses real terms — ANSI escape codes, Ink, stdout —
but defines them in context or anchors them in plain language. He doesn't hide behind
jargon, and he doesn't dumb things down.

✅ "Terminals treat output as a stream of characters. There's no native concept of frames,
   sprites, or z-index."
❌ "The system leverages low-level ANSI TTY protocols to achieve a rendering paradigm
   distinct from browser-based DOM environments."

### 5. Honest about complexity
He names the hard things directly. He doesn't sanitize struggle or oversell solutions.
When something was a nightmare, he says "it was a nightmare."

✅ "'It was a nightmare,' Cameron said."
✅ "ANSI color consistency simply doesn't exist."
❌ "The team encountered some challenges, which they successfully navigated."

### 6. Minimal hype, maximum substance
He lets the work speak. No "revolutionary," "groundbreaking," or "game-changing."
The complexity and the craft are impressive enough on their own.

✅ "6,000 lines of TypeScript — most of it dedicated not to visuals, but to handling
   terminal inconsistencies."
❌ "This groundbreaking innovation represents a paradigm shift in CLI animation."

### 7. Conversational but substantive
He writes like he's talking to a smart friend over coffee — casual phrasing, contractions,
occasional parenthetical asides — but with real weight and ideas behind it.

✅ "(Also random, but the emoji game on GitHub's Slack is second to none let's be real.)"
✅ "to be sappy for a second"
❌ "It is worth noting that the interpersonal dynamics of the team were notably positive."

### 8. Specific over general
He uses real names, places, numbers, and moments. Generalities dilute his writing.

✅ "Just two months ago, I was in Bellevue with like 20–30 people talking about Universe."
✅ "over 6,000 lines of TypeScript"
❌ "The team did a lot of work and had many meetings."

### 9. Active voice, energetic verbs
Strong verbs carry his sentences. He avoids "was done," "was built," "was created."

✅ "shaped every engineering decision," "broke the challenges into four categories"
❌ "engineering decisions were shaped by," "challenges were categorized"

### 10. People-first, credits the team
He consistently attributes work to people, not processes. He uses "we" generously
and calls out individuals by name.

✅ "Andy broke the engineering challenges into four broad categories."
❌ "The engineering challenges were categorized."

---

## What NOT to Do

- ❌ Don't start with "In today's world..." or "In an era of..."
- ❌ Don't use "leverage" as a verb (use "use," "apply," or "build on")
- ❌ Don't use "utilize" (use "use")
- ❌ Don't use "synergy," "disruptive," "revolutionary," "game-changing"
- ❌ Don't use passive voice unless it's the clearest choice
- ❌ Don't write walls of bullet points where prose would be stronger
- ❌ Don't oversell. The work sells itself.
- ❌ Don't be vague. Always prefer the specific example over the general claim.
- ❌ Don't write marketing speak. If it sounds like a press release, rewrite it.
- ❌ Don't use em-dashes excessively — one per paragraph max.

---

## Sentence Rhythm Examples

| Pattern | Example |
|---------|---------|
| Long setup → short punch | "There is no canvas, no compositor, no consistent rendering model, and no standard animation framework. So when an animated Copilot mascot appeared, it looked playful." |
| Honest opener | "Most people think ASCII art is simple, and a nostalgic remnant of the early internet. But..." |
| Emotional undercurrent | "In the back of my head, there was a voice saying 'god damn, these people really care.' That's a pretty awesome feeling." |
| Understated confidence | "I'm proud of the work we shipped. But to be sappy for a second: the people I got to work with were the best part." |
| Punchy closing | "Tomorrow, I start something new. More soon." |

---

## Tone by Content Type

| Type | Tone |
|------|------|
| Technical blog post | Precise, narrative, developer-empathetic, story arc |
| LinkedIn / social | Warm, direct, slightly vulnerable, punchy |
| Newsletter | Conversational, editorial, informed insider |
| Product copy | Clear benefit, no fluff, developer-voice |
| Thought leadership | Opinionated but grounded, cites specifics |

---

## Real Writing Samples

These are actual paragraphs Aaron has written. Use them to calibrate tone, rhythm, and structure — not to copy, but to match the register.

### From: "From pixels to characters: The engineering behind GitHub Copilot CLI's animated ASCII banner" (GitHub Blog)

**Opening — narrative entry, specific person, no preamble:**
> Cameron opened an empty repository in VS Code and began asking GitHub Copilot for help. She was going to build a new CLI from scratch using only Copilot. Her screen was being recorded.
>
> It was a demo. A pretty good one, as it turned out. And at the end of it, a little animated Copilot mascot waved at her from inside the terminal window.

**Technical setup — why before how:**
> Most people think ASCII art is simple. A nostalgic remnant of the early internet, maybe. But building it as a polished, production-grade experience inside a terminal — one that has to work across macOS, Windows, and Linux, in dozens of different terminal emulators, with wildly inconsistent support for ANSI escape codes — is a different problem entirely.

**Naming the hard thing directly:**
> Terminals treat output as a stream of characters. There's no native concept of frames, sprites, or z-index. There's no canvas, no compositor, no consistent rendering model, and no standard animation framework. So when an animated Copilot mascot appeared, it looked playful. But behind it was serious engineering work.

**Technical depth with specificity:**
> Andy broke the engineering challenges into four broad categories: animation, color, character encoding, and terminal detection. Each one had its own rabbit hole. ANSI color consistency simply doesn't exist — some terminals support 24-bit color, some support 256 colors, some support only 16, and some support none at all. The code has to detect the environment and degrade gracefully.

**Substantive closer with emotional resonance:**
> In the back of my head, there was a voice saying "god damn, these people really care." That's a pretty awesome feeling. 6,000 lines of TypeScript — most of it dedicated not to visuals, but to handling terminal inconsistencies — for an animation that plays for a few seconds when you first open a CLI.

---

### From: LinkedIn farewell post (departing GitHub, joining Arize AI)

**Warm, direct, specific over general:**
> Just two months ago, I was in Bellevue with like 20–30 people talking about Universe. Just two months before that, I was in London for GitHub Connect. I've traveled to six or seven different countries in the name of GitHub. I've worked with some of the most thoughtful engineers I've ever encountered.

**Vulnerable but not overwrought:**
> I'm proud of the work we shipped. But to be sappy for a second: the people I got to work with were the best part. (Also random, but the emoji game on GitHub's Slack is second to none let's be real.)

**Clean, understated close:**
> Tomorrow, I start something new. More soon.

---

## How to use these samples

When generating content in Aaron's voice:
1. Read the samples above before writing
2. Match the rhythm — setup sentences followed by a short, declarative punch
3. Lead with the human or the specific moment, not the abstract claim
4. Name real things: people, numbers, tools, moments
5. Do not editorialize — let the specifics carry the weight
6. When done, read your draft aloud: if it sounds like a press release, rewrite it

When Aaron provides new writing, add examples to `examples/excellent/` and reference them here.
