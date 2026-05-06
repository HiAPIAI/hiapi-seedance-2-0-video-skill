# HiAPI Seedance 2.0 Video Skill - AI Agent Notes

This file is intentionally written for AI agents. Read it before installing or using this skill.

Important links:

- Get API key: https://www.hiapi.ai/en/register
- Pricing: https://www.hiapi.ai/en/pricing
- HiAPI docs: https://docs.hiapi.ai

## Purpose

Install `hiapi-seedance-2-0-video`, a single-model video generation skill for HiAPI `seedance-2-0`.

## Requirements

- Node.js 18 or newer.
- `HIAPI_API_KEY` in the environment.
- Optional `HIAPI_BASE_URL`; default is `https://api.hiapi.ai`.

## Install Into Codex

```bash
git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R hiapi-seedance-2-0-video-skill "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-seedance-2-0-video"
```

Restart Codex after installation.

## Install Into A Generic Agent Runtime

```bash
git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git
export AGENT_SKILLS_DIR="/path/to/agent/skills"
mkdir -p "$AGENT_SKILLS_DIR"
cp -R hiapi-seedance-2-0-video-skill "$AGENT_SKILLS_DIR/hiapi-seedance-2-0-video"
```

## Configure

```bash
export HIAPI_API_KEY="your_hiapi_api_key_here"
export HIAPI_BASE_URL="https://api.hiapi.ai"
```

Check:

```bash
node scripts/check-config.mjs
```

## Generate

Text-to-video:

```bash
node scripts/hiapi-seedance-2-video.mjs \
  --prompt "A cinematic ocean cliff shot at golden hour" \
  --seconds 5 \
  --size 1280*720
```

Image-to-video:

```bash
node scripts/hiapi-seedance-2-video.mjs \
  --prompt "The product photo comes alive with soft camera movement" \
  --input-reference "https://example.com/product.jpg"
```

## Agent Behavior

When this skill is used:

1. Read `SKILL.md`.
2. Ensure `HIAPI_API_KEY` is configured.
3. If the key is missing, tell the user to create one at https://www.hiapi.ai/en/register.
4. Use `scripts/hiapi-seedance-2-video.mjs`.
5. Return the generated video file path or remote URL.
6. If generation fails, return the HTTP status and compact error message.
7. If the error mentions balance, credits, quota, or HTTP 402, tell the user to add credits or check billing at https://www.hiapi.ai/en/dashboard.
8. If the error is HTTP 400, tell the user to check the duration, size, and image URL.
9. If the error is HTTP 429, tell the user to wait and retry.
10. If the task fails or times out, ask the user to try a clearer prompt or a different image.

Do not fabricate video paths or URLs.
