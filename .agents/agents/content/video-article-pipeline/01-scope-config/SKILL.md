---
name: arize-video-article-01-scope-config
description: >
  Arize video article step 1. Resolve the video input, credentials, model
  provider, Drive parent folder for the published Google Doc, and optional
  config defaults before transcript and context calls.
"last updated": 2026-05-30
"last run": 2026-05-30
---

Step 0: Read [../../../../../references/agent-runtime.md](../../../../../references/agent-runtime.md) for workflow standards (runtime HTTP, logging, ephemeral rules).

# Arize video-article pipeline — 01 Scope and config

Log line prefix: `[run-debug] workflow=arize/video-article-pipeline | <PHASE> | <facts>`

## Inputs required

- YouTube URL (or video id) and the desired article title.
- Optional user-provided transcript text.
- Optional gitignored `config.json` beside the workflow root (local runtime overrides).

## Credential resolution

1. Read the root `credentials.json`. Read the client-level `credentials.json` if it exists.
2. Merge defaults from local `config.json` when present.
3. Provider keys:
   - Anthropic: root `anthropic.api_key`.
   - Gemini: root `gemini.api_key`.
4. Model defaults:
   - Use `gemini.model_smart` from root `config.json` when calling Gemini.
   - When calling Anthropic, use the model id set in local `config.json` (`model`). Do not hardcode a model id in this skill.

## Drive parent folder (for the Google Doc in step 07)

Local `config.json` is the canonical source for `parents_folder_id` when present. Resolve the folder id (folder id only, not a full Drive URL) in this order. First match wins.

1. Local gitignored `config.json` at `google_drive.parents_folder_id`.
2. Client `credentials.json` at `workflow_specific.video_article_pipeline.google_drive_parents_folder_id` (fallback only).
3. Client `credentials.json` at `workflow_specific.linkedin_post_article_pipeline.google_drive_parents_folder_id` (fallback only; the same Arize editorial folder as the LinkedIn article pipeline).

If still missing after (1)-(3), stop and ask the user for the Arize Drive folder id. Suggest they add it to local `config.json` or a gitignored credentials file.

Log: `[run-debug] workflow=arize/video-article-pipeline | SCOPE | parents_folder_id=<set|missing>`

## Outputs for next steps

- `video_id`
- `youtube_url`
- `article_title`
- `provider` plus `model`
- whether the transcript is provided or must be fetched
- `parents_folder_id` (required for step 07)

Next: [../02-transcript/SKILL.md](../02-transcript/SKILL.md)
