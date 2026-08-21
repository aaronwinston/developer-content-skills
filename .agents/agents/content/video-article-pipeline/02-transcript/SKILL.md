---
name: arize-video-article-02-transcript
description: >
  Arize video article step 2. Obtain the video transcript, either from
  user-supplied text or by running the shared YouTube transcription utility.
"last updated": 2026-05-30
"last run": 2026-05-30
---

Step 0: Read [../../../../../references/agent-runtime.md](../../../../../references/agent-runtime.md) for workflow standards (runtime HTTP, logging, ephemeral rules).

# Arize video-article pipeline — 02 Transcript

Log line prefix: `[run-debug] workflow=arize/video-article-pipeline | TRANSCRIPT | <facts>`

## Steps

1. If step 01 captured user-supplied transcript text, use it directly. Skip to the next step.
2. Otherwise run the content skill at [../../../../skills/content/youtube-transcription/SKILL.md](../../../../skills/content/youtube-transcription/SKILL.md) (yt-dlp + Whisper) against the `youtube_url` from step 01.
3. Hand the transcript text forward as `transcript_text` for the next step. Do not save a copy under the workflow folder.

Log: `[run-debug] workflow=arize/video-article-pipeline | TRANSCRIPT | source=<user|yt> chars=<n>`

Next: [../03-context/SKILL.md](../03-context/SKILL.md)
