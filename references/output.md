# Output Handling

HiAPI `seedance-2-0` video generation is asynchronous:

1. `POST /v1/videos` creates a task and returns `id`.
2. `GET /v1/videos/{id}` returns task status.
3. When status is `succeeded` or `completed`, the video URL is usually in `output.url`, `metadata.url`, `video_url`, or `url`.

The CLI downloads HTTP(S) video URLs to `outputs/` when possible.

The CLI prints JSON:

```json
{
  "model": "seedance-2-0",
  "taskId": "video_task_123",
  "seconds": "5",
  "size": "1280*720",
  "outputs": [
    {
      "kind": "file",
      "path": "/absolute/path/to/outputs/seedance-2-0-20260506-120000.mp4",
      "mimeType": "video/mp4",
      "sourceUrl": "https://cdn.example.com/video.mp4"
    }
  ]
}
```

If the video cannot be downloaded, return the remote URL instead.

## User-Facing Failure Copy

- Missing key: "Set `HIAPI_API_KEY` first. You can create a key at https://www.hiapi.ai/en/register."
- Invalid key: "HiAPI rejected the API key. Check or regenerate it at https://www.hiapi.ai/en/register."
- Insufficient balance: "Your HiAPI balance or credits may be insufficient. Add credits or check billing at https://www.hiapi.ai/en/dashboard."
- Invalid request: "Check the duration, size, and image URL. Seedance 2.0 supports 4, 5, 8, 10 seconds and 1280*720, 720*1280, 1280*1280 sizes."
- Rate limited: "The request was rate limited. Wait and retry, or reduce concurrent video requests."
- Task failed: "Try a clearer prompt or a different image."
- Timeout: "The video may still be running. Try again later or create a shorter video."
