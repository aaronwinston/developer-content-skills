---
name: youtube-transcription
description: >-
  Run the YouTube to Whisper transcript helper for local transcripts when
  captions APIs or timedtext are unavailable. Use when the user asks for
  yt-dlp, Whisper transcription, or a local transcript file from a YouTube URL.
---

# YouTube transcription (`yt.py`)

Local utility in this repository:
`.agents/skills/content/youtube-transcription/scripts/yt.py`.

Many workflows should prefer HTTP caption sources first. This skill is separate:
it runs Python on the machine, downloads audio with yt-dlp, and transcribes with
OpenAI Whisper. Use it only when that local stack is appropriate (developer
machine, batch jobs, or when the user explicitly wants Whisper output).

## When to use

- User asks to transcribe a YouTube URL with the repo script or `yt.py`.
- HTTP caption fetches return empty or blocked and the user agrees to a local fallback.
- You need a plain-text transcript file on disk for downstream editing (not for skills that forbid local runners—check the active workflow).

## Prerequisites

A skill-local venv lives at
`.agents/skills/content/youtube-transcription/scripts/.venv` when configured
locally. Use it for every run; do not `pip install --user` against Homebrew
Python (PEP 668 will block it).

If the venv is missing, recreate it once:

```bash
cd .agents/skills/content/youtube-transcription/scripts
python3.13 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install yt-dlp openai-whisper
```

FFmpeg must be on `PATH` (yt-dlp uses it for audio extract; install with `brew install ffmpeg`). Whisper downloads model weights on first use (`WHISPER_MODEL` defaults to `base` in the script; edit `yt.py` to change).

## How to run

From the script directory (recommended so `downloads/` and `youtube_transcripts/` land next to the script unless you change paths in code), using the local venv:

```bash
cd .agents/skills/content/youtube-transcription/scripts
.venv/bin/python yt.py "https://www.youtube.com/watch?v=VIDEO_ID"
```

Multiple URLs in one invocation:

```bash
.venv/bin/python yt.py "https://youtu.be/AAAA" "https://youtu.be/BBBB"
```

From repo root without `cd` (still uses the venv interpreter, but outputs land in the current working directory — prefer `cd` for predictable paths):

```bash
.agents/skills/content/youtube-transcription/scripts/.venv/bin/python .agents/skills/content/youtube-transcription/scripts/yt.py "https://www.youtube.com/watch?v=VIDEO_ID"
```

## Outputs

- `youtube_transcripts/<safe_title>_transcript.txt` — title line, separator, full transcript text.
- Temporary `downloads/` MP3s are removed after a successful run per video.

## Operational notes

- First run can take 30–60+ seconds loading Whisper; transcription time scales with audio length and model size.
- Respect copyright and site terms; use for internal / licensed content as appropriate.
- If installs fail, print the error and fix the environment (missing FFmpeg, CUDA drivers, etc.) before retrying.

## Related

- [Agent runtime conventions](../../../../references/agent-runtime.md)
- Script source: [`scripts/yt.py`](scripts/yt.py)
