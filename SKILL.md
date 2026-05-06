---
name: hiapi-seedance-2-0-video
description: Generate videos with HiAPI's seedance-2-0 model via the HiAPI video endpoint. Use when a user asks to create a video with Seedance 2.0, HiAPI Seedance 2.0, or this specific skill.
metadata:
  short-description: Generate Seedance 2.0 videos through HiAPI
---

# HiAPI Seedance 2.0 Video

Use this skill when the user wants video generation through HiAPI's `seedance-2-0` model.

## Requirements

- Node.js 18 or newer.
- `HIAPI_API_KEY` must be set in the environment.
- `HIAPI_BASE_URL` is optional and defaults to `https://api.hiapi.ai`.

Important links:

- Get API key: https://www.hiapi.ai/en/register
- Pricing: https://www.hiapi.ai/en/pricing
- Docs: https://docs.hiapi.ai

Never invent a video result. If the API call fails, report the status code, compact error message, and the next action from the Error Guidance section.

## Generate A Video

Run:

```bash
node scripts/hiapi-seedance-2-video.mjs --prompt "A cinematic ocean cliff shot at golden hour" --seconds 5 --size 1280*720
```

For image-to-video, pass a public image URL or data URI:

```bash
node scripts/hiapi-seedance-2-video.mjs --prompt "The product photo comes alive with soft camera movement" --input-reference "https://example.com/product.jpg"
```

Supported durations:

- `4`
- `5`
- `8`
- `10`

Supported sizes:

- `1280*720`
- `720*1280`
- `1280*1280`

The script creates a video task, polls until it finishes, downloads the video to `outputs/` when possible, and prints JSON with the saved file path or remote URL.

## API Contract

This skill calls:

```text
POST /v1/videos
GET /v1/videos/{id}
```

with:

```json
{
  "model": "seedance-2-0",
  "prompt": "...",
  "seconds": "5",
  "size": "1280*720",
  "input_reference": "https://example.com/photo.jpg"
}
```

`input_reference` is optional. If present, Seedance 2.0 uses it as the starting image for image-to-video.

For details, read `references/api.md` and `references/output.md`.

## Check Configuration

Run:

```bash
node scripts/check-config.mjs
```

Use `--live` only when you want to verify that the configured key can reach the HiAPI pricing endpoint.

## Error Guidance

- Missing `HIAPI_API_KEY`: tell the user to create or copy a key from https://www.hiapi.ai/en/register and export it.
- HTTP `401` or `403`: tell the user to verify the HiAPI API key.
- HTTP `402`, insufficient balance, credits, quota, or payment errors: tell the user to add credits or check billing at https://www.hiapi.ai/en/dashboard and review pricing at https://www.hiapi.ai/en/pricing.
- HTTP `400`: tell the user to check the duration, size, and image URL.
- HTTP `429`: tell the user to wait and retry or reduce concurrent video generations.
- Task failure: ask the user to try a clearer prompt or a different image.
- Timeout: explain that video generation may still be running and the user can retry later.
