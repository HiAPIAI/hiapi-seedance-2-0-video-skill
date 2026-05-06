import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

export const MODEL = "seedance-2-0";
export const DEFAULT_BASE_URL = "https://api.hiapi.ai";
export const DEFAULT_SECONDS = "5";
export const DEFAULT_RESOLUTION = "720p";
export const DEFAULT_RATIO = "16:9";
export const DEFAULT_OUTPUT_DIR = "outputs";
export const POLL_INTERVAL_MS = 5000;
export const POLL_TIMEOUT_MS = 180000;
export const HIAPI_API_KEYS_URL = "https://www.hiapi.ai/en/register";
export const HIAPI_DASHBOARD_URL = "https://www.hiapi.ai/en/dashboard";
export const HIAPI_PRICING_URL = "https://www.hiapi.ai/en/pricing";

export const SUPPORTED_SECONDS = new Set(["4", "5", "8", "10"]);
export const SUPPORTED_RESOLUTIONS = new Set(["480p", "720p"]);
export const SUPPORTED_RATIOS = new Set(["16:9", "9:16", "1:1", "4:3", "3:4", "21:9"]);

export function resolveConfig(env = process.env) {
  const apiKey = env.HIAPI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      `HIAPI_API_KEY is required. Get one at ${HIAPI_API_KEYS_URL}, then run: export HIAPI_API_KEY="your_hiapi_api_key_here"`,
    );
  }

  return {
    apiKey,
    baseUrl: (env.HIAPI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, ""),
  };
}

export function normalizeSeconds(value = DEFAULT_SECONDS) {
  const seconds = String(value).trim();
  if (!SUPPORTED_SECONDS.has(seconds)) {
    throw new Error(`Unsupported duration "${seconds}". Use one of: ${Array.from(SUPPORTED_SECONDS).join(", ")}.`);
  }
  return seconds;
}

export function normalizeResolution(value = DEFAULT_RESOLUTION) {
  const resolution = String(value).trim().toLowerCase();
  if (!SUPPORTED_RESOLUTIONS.has(resolution)) {
    throw new Error(`Unsupported resolution "${resolution}". Use one of: ${Array.from(SUPPORTED_RESOLUTIONS).join(", ")}.`);
  }
  return resolution;
}

export function normalizeRatio(value = DEFAULT_RATIO) {
  const ratio = String(value).trim();
  if (!SUPPORTED_RATIOS.has(ratio)) {
    throw new Error(`Unsupported ratio "${ratio}". Use one of: ${Array.from(SUPPORTED_RATIOS).join(", ")}.`);
  }
  return ratio;
}

export function buildVideoPayload({ prompt, seconds, resolution, ratio, inputReference } = {}) {
  const cleanPrompt = String(prompt || "").trim();
  if (!cleanPrompt) {
    throw new Error("A prompt is required.");
  }

  const payload = {
    model: MODEL,
    prompt: cleanPrompt,
    seconds: normalizeSeconds(seconds),
    resolution: normalizeResolution(resolution),
    ratio: normalizeRatio(ratio),
  };

  const reference = String(inputReference || "").trim();
  if (reference) payload.input_reference = reference;
  return payload;
}

export function extractTaskId(response) {
  return response?.id || response?.task_id || response?.data?.id || response?.data?.task_id || "";
}

export function extractVideoUrl(response) {
  return (
    response?.output?.url ||
    response?.metadata?.url ||
    response?.data?.output?.url ||
    response?.data?.metadata?.url ||
    response?.video_url ||
    response?.url ||
    response?.data?.video_url ||
    response?.data?.url ||
    ""
  );
}

export function getTaskStatus(response) {
  const status = response?.status || response?.data?.status || "";
  return String(status).toLowerCase();
}

export function buildHttpErrorMessage(status, body) {
  const summary = summarizeErrorBody(body);
  const lowerSummary = summary.toLowerCase();
  const prefix = `HTTP ${status}: ${summary}`;

  if (status === 402 || lowerSummary.includes("balance") || lowerSummary.includes("credit") || lowerSummary.includes("quota")) {
    return `${prefix}\nYour HiAPI balance or credits may be insufficient. Add credits or check billing in the HiAPI dashboard: ${HIAPI_DASHBOARD_URL}. Pricing: ${HIAPI_PRICING_URL}`;
  }

  if (status === 401 || status === 403 || lowerSummary.includes("api key")) {
    return `${prefix}\nCheck your HiAPI API key or create a new one: ${HIAPI_API_KEYS_URL}`;
  }

  if (status === 400 || lowerSummary.includes("input_reference") || lowerSummary.includes("invalid")) {
    return `${prefix}\nCheck the duration, resolution, ratio, and image URL. Seedance 2.0 supports durations 4, 5, 8, 10; resolutions 480p, 720p; and ratios 16:9, 9:16, 1:1, 4:3, 3:4, 21:9.`;
  }

  if (status === 429 || lowerSummary.includes("rate limit") || lowerSummary.includes("too many")) {
    return `${prefix}\nThe request was rate limited. Wait and retry, or reduce concurrent video generations.`;
  }

  if (status >= 500 || lowerSummary.includes("failed")) {
    return `${prefix}\nVideo generation failed. Try a clearer prompt or a different image, then run the skill again.`;
  }

  return `${prefix}\nIf this keeps happening, verify your HiAPI key, account status, and model access in the HiAPI dashboard: ${HIAPI_DASHBOARD_URL}`;
}

export async function createVideoTask(payload, config = resolveConfig()) {
  return requestJson(`${config.baseUrl}/v1/videos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function getVideoTask(taskId, config = resolveConfig()) {
  return requestJson(`${config.baseUrl}/v1/videos/${encodeURIComponent(taskId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
    },
  });
}

export async function waitForVideo(taskId, config = resolveConfig(), options = {}) {
  const pollIntervalMs = Number(options.pollIntervalMs ?? POLL_INTERVAL_MS);
  const timeoutMs = Number(options.timeoutMs ?? POLL_TIMEOUT_MS);
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    await sleep(pollIntervalMs);
    const response = await getVideoTask(taskId, config);
    const status = getTaskStatus(response);

    if (status === "succeeded" || status === "completed") {
      const videoUrl = extractVideoUrl(response);
      if (!videoUrl) throw new Error("Video succeeded but no URL was returned.");
      return { response, videoUrl };
    }

    if (status === "failed") {
      throw new Error(`Video generation failed: ${summarizeErrorBody(response.error || response.message || response)}`);
    }
  }

  throw new Error("Video generation timed out after 3 minutes. The task may still be running; try again later.");
}

export async function generateVideo(options, config = resolveConfig()) {
  const payload = buildVideoPayload(options);
  const created = await createVideoTask(payload, config);
  const taskId = extractTaskId(created);
  if (!taskId) {
    throw new Error(`No video task id returned: ${JSON.stringify(created)}`);
  }

  if (options.wait === false) {
    return { model: MODEL, taskId, status: "created", outputs: [] };
  }

  const { response, videoUrl } = await waitForVideo(taskId, config, options);
  const output = { kind: "url", value: videoUrl };

  if (options.save !== false) {
    const saved = await saveVideoOutput(videoUrl, options.outputDir || DEFAULT_OUTPUT_DIR);
    if (saved) {
      output.kind = "file";
      output.value = saved.path;
      output.path = saved.path;
      output.mimeType = saved.mimeType;
      output.sourceUrl = videoUrl;
    }
  }

  return {
    model: MODEL,
    taskId,
    seconds: payload.seconds,
    resolution: payload.resolution,
    ratio: payload.ratio,
    outputs: [output],
    rawStatus: response,
  };
}

export async function saveVideoOutput(videoUrl, outputDir = DEFAULT_OUTPUT_DIR) {
  if (!/^https?:\/\//i.test(videoUrl)) return null;

  let response;
  try {
    response = await fetch(videoUrl);
  } catch {
    return null;
  }

  if (!response.ok) return null;

  const contentType = response.headers.get("content-type") || "video/mp4";
  const bytes = Buffer.from(await response.arrayBuffer());
  const absoluteOutputDir = resolve(outputDir);
  await mkdir(absoluteOutputDir, { recursive: true });

  const fileName = `${MODEL}-${timestamp()}.mp4`;
  const path = join(absoluteOutputDir, fileName);
  await writeFile(path, bytes);
  return { path, mimeType: contentType };
}

export async function requestJson(url, init) {
  const response = await fetch(url, init);
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { message: text };
  }

  if (!response.ok) {
    throw new Error(buildHttpErrorMessage(response.status, body));
  }

  return body;
}

export function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--prompt") {
      options.prompt = next;
      index += 1;
    } else if (arg === "--seconds") {
      options.seconds = next;
      index += 1;
    } else if (arg === "--resolution") {
      options.resolution = next;
      index += 1;
    } else if (arg === "--ratio") {
      options.ratio = next;
      index += 1;
    } else if (arg === "--input-reference" || arg === "--image-url") {
      options.inputReference = next;
      index += 1;
    } else if (arg === "--output-dir") {
      options.outputDir = next;
      index += 1;
    } else if (arg === "--no-save") {
      options.save = false;
    } else if (arg === "--no-wait") {
      options.wait = false;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

export function usage() {
  return `Usage:
  node scripts/hiapi-seedance-2-video.mjs --prompt "A cinematic ocean cliff shot" [--seconds 5] [--resolution 720p] [--ratio 16:9]

Options:
  --prompt <text>              Required video description
  --seconds <4|5|8|10>         Default: 5
  --resolution <480p|720p>    Default: 720p
  --ratio <16:9|9:16|1:1|4:3|3:4|21:9>
                              Default: 16:9
  --input-reference <url>      Optional image URL or data URI for image-to-video
  --output-dir <path>          Default: outputs
  --no-save                    Return the remote video URL without downloading
  --no-wait                    Create the task and return the task id
`;
}

function summarizeErrorBody(body) {
  if (!body) return "Unknown error";
  if (typeof body === "string") return body;
  return (
    body.error?.message ||
    body.message ||
    body.error ||
    body.detail ||
    JSON.stringify(body)
  );
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
