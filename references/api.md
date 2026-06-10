# HiAPI Seedance 2.0 Video API

## Endpoint

`seedance-2-0` uses HiAPI's unified async task API:

```text
POST https://api.hiapi.ai/v1/tasks
GET https://api.hiapi.ai/v1/tasks/{taskId}
```

Set `HIAPI_BASE_URL` to override the host.

## Authentication

Send the user's HiAPI key as a bearer token:

```http
Authorization: Bearer $HIAPI_API_KEY
Content-Type: application/json
```

Do not print API keys in logs or final answers.

If the user does not have a key, send them to:

```text
https://www.hiapi.ai/en/register
```

If generation fails because of balance, credits, quota, or payment status, send them to:

```text
https://www.hiapi.ai/en/dashboard
https://www.hiapi.ai/en/pricing
```

## Request Body

Text-to-video:

```json
{
  "model": "seedance-2-0",
  "input": {
    "prompt": "A cinematic ocean cliff shot at golden hour",
    "duration": 5,
    "resolution": "720p",
    "aspect_ratio": "16:9",
    "generate_audio": false
  }
}
```

Image-to-video:

```json
{
  "model": "seedance-2-0",
  "input": {
    "prompt": "The product photo comes alive with soft camera movement",
    "first_frame_url": "https://example.com/product.jpg",
    "duration": 5,
    "resolution": "720p",
    "aspect_ratio": "16:9",
    "generate_audio": false
  }
}
```

## Parameters

| Parameter | Required | Notes |
| --- | --- | --- |
| `model` | yes | Must be `seedance-2-0`. |
| `input.prompt` | yes | Text video instruction. Describe the subject, motion, camera movement, mood, and sound atmosphere. |
| `input.duration` | no | Integer seconds from `4` to `15`. Defaults to `5`. |
| `input.resolution` | no | `480p` or `720p`. Defaults to `720p`. |
| `input.aspect_ratio` | no | `16:9`, `9:16`, `1:1`, `4:3`, `3:4`, or `21:9`. Defaults to `16:9`. |
| `input.first_frame_url` | no | Public image URL or data URI for image-to-video. |
| `input.generate_audio` | no | Boolean. Defaults to `false`; set `true` only when generated audio is desired. |

Seedance 2.0 supports text-to-video without an image. When `input.first_frame_url` is provided, the image becomes the starting frame. The CLI accepts `--input-reference` and maps it to `input.first_frame_url`.
