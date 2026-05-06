import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildHttpErrorMessage,
  buildVideoPayload,
  extractTaskId,
  extractVideoUrl,
  normalizeSeconds,
  normalizeSize,
  resolveConfig,
} from "../scripts/lib/seedance-2-video.mjs";

test("builds the HiAPI video payload for Seedance 2.0 text-to-video", () => {
  assert.deepEqual(
    buildVideoPayload({
      prompt: "A cinematic ocean cliff shot at golden hour",
      seconds: "5",
      size: "1280*720",
    }),
    {
      model: "seedance-2-0",
      prompt: "A cinematic ocean cliff shot at golden hour",
      seconds: "5",
      size: "1280*720",
    },
  );
});

test("adds input_reference only when an image is provided", () => {
  const payload = buildVideoPayload({
    prompt: "Make this product photo move with soft studio lighting",
    inputReference: "https://example.com/product.png",
  });

  assert.equal(payload.model, "seedance-2-0");
  assert.equal(payload.seconds, "5");
  assert.equal(payload.size, "1280*720");
  assert.equal(payload.input_reference, "https://example.com/product.png");
});

test("validates duration and size before sending a request", () => {
  assert.equal(normalizeSeconds("4"), "4");
  assert.equal(normalizeSeconds(10), "10");
  assert.throws(() => normalizeSeconds("12"), /Unsupported duration/);

  assert.equal(normalizeSize("720*1280"), "720*1280");
  assert.throws(() => normalizeSize("1920x1080"), /Unsupported size/);
});

test("extracts task ids and video URLs from common HiAPI response shapes", () => {
  assert.equal(extractTaskId({ id: "video_task_123" }), "video_task_123");
  assert.equal(extractTaskId({ task_id: "task_456" }), "task_456");

  assert.equal(
    extractVideoUrl({ output: { url: "https://cdn.example.com/out.mp4" } }),
    "https://cdn.example.com/out.mp4",
  );
  assert.equal(
    extractVideoUrl({ metadata: { url: "https://cdn.example.com/meta.mp4" } }),
    "https://cdn.example.com/meta.mp4",
  );
});

test("resolveConfig requires HIAPI_API_KEY and normalizes base URL", () => {
  assert.throws(
    () => resolveConfig({}),
    /Get one at https:\/\/www\.hiapi\.ai\/en\/register/,
  );

  assert.deepEqual(
    resolveConfig({
      HIAPI_API_KEY: "test-key",
      HIAPI_BASE_URL: "https://api.hiapi.ai/",
    }),
    {
      apiKey: "test-key",
      baseUrl: "https://api.hiapi.ai",
    },
  );
});

test("buildHttpErrorMessage gives next actions for key, balance, image, rate, and task failures", () => {
  assert.match(
    buildHttpErrorMessage(401, { error: { message: "Invalid API key" } }),
    /create a new one: https:\/\/www\.hiapi\.ai\/en\/register/,
  );
  assert.match(
    buildHttpErrorMessage(402, { error: { message: "insufficient balance" } }),
    /balance or credits may be insufficient/i,
  );
  assert.match(
    buildHttpErrorMessage(400, { error: { message: "input_reference is invalid" } }),
    /duration, size, and image URL/i,
  );
  assert.match(
    buildHttpErrorMessage(429, { error: { message: "Too many requests" } }),
    /wait and retry/i,
  );
  assert.match(
    buildHttpErrorMessage(500, { error: { message: "task failed" } }),
    /try a clearer prompt or a different image/i,
  );
});
