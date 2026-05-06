# HiAPI Seedance 2.0 Video API

## Endpoint

`seedance-2-0` uses HiAPI's video endpoint:

```text
POST https://api.hiapi.ai/v1/videos
GET https://api.hiapi.ai/v1/videos/{id}
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
  "prompt": "A cinematic ocean cliff shot at golden hour",
  "seconds": "5",
  "resolution": "720p",
  "ratio": "16:9"
}
```

Image-to-video:

```json
{
  "model": "seedance-2-0",
  "prompt": "The product photo comes alive with soft camera movement",
  "input_reference": "https://example.com/product.jpg",
  "seconds": "5",
  "resolution": "720p",
  "ratio": "16:9"
}
```

## Parameters

| Parameter | Required | Notes |
| --- | --- | --- |
| `prompt` | yes | Text video instruction. Describe the subject, motion, camera movement, mood, and sound atmosphere. |
| `seconds` | no | `4`, `5`, `8`, or `10`. Defaults to `5`. |
| `resolution` | no | `480p` or `720p`. Defaults to `720p`. |
| `ratio` | no | `16:9`, `9:16`, `1:1`, `4:3`, `3:4`, or `21:9`. Defaults to `16:9`. |
| `input_reference` | no | Public image URL or data URI for image-to-video. |

Seedance 2.0 supports text-to-video without an image. When `input_reference` is provided, the image becomes the starting frame.
