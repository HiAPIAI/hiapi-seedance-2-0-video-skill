# Seedance 2.0 Video Generation Skill

Add Seedance 2.0 video generation to your AI Agent.

**Seedance 2.0 • Install • API Key • [HiAPI](https://www.hiapi.ai)**

[Get API Key](https://www.hiapi.ai/en/register) · [Pricing](https://www.hiapi.ai/en/pricing) · [HiAPI Docs](https://docs.hiapi.ai)

Languages: [English](README.md) | [简体中文](README.zh-CN.md)

---

> AI Agent? Skip the README and read [llms-install.md](llms-install.md). It contains installation steps and error-handling rules written for agents.

---

## What Is This?

An AI video generation skill for OpenClaw / Claude Code / OpenCode / Codex-style agents. After installation, your AI Agent can use Seedance 2.0 through HiAPI to generate videos from text or animate an image.

HiAPI is an AI API platform built for developers: one API, all AI models. Images, video, music, and text with one key.

| Skill | Description | Model |
| --- | --- | --- |
| HiAPI Seedance 2.0 Video | Text-to-video and image-to-video | Seedance 2.0 |

---

## Install

### Quick Install (OpenClaw)

```bash
openclaw skills add https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill
```

### Install Into Codex

```bash
git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git
cd hiapi-seedance-2-0-video-skill
npm test

mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R . "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-seedance-2-0-video"
```

Restart Codex after copying the skill.

### Manual Install For Any Agent

```bash
git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git
export AGENT_SKILLS_DIR="/path/to/your/agent/skills"
mkdir -p "$AGENT_SKILLS_DIR"
cp -R hiapi-seedance-2-0-video-skill "$AGENT_SKILLS_DIR/hiapi-seedance-2-0-video"
```

Replace `AGENT_SKILLS_DIR` with your agent's skill directory.

### Agent Auto-Install Prompt

```text
Install the HiAPI Seedance 2.0 video generation skill:

1. Clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill
2. Copy the repository into your skill directory as hiapi-seedance-2-0-video
3. Set the HIAPI_API_KEY environment variable
4. Read SKILL.md for usage
```

---

## Get API Key

1. Open [Get API Key](https://www.hiapi.ai/en/register)
2. Sign in or create a HiAPI account
3. Create a new API Key
4. Set the environment variable in the terminal that runs your agent:

```bash
export HIAPI_API_KEY="your_hiapi_api_key_here"
export HIAPI_BASE_URL="https://api.hiapi.ai"
```

Check configuration:

```bash
node scripts/check-config.mjs
```

Live check:

```bash
node scripts/check-config.mjs --live
```

---

## Seedance 2.0 Video Generation

Ask your AI Agent to generate a video with natural language. If you provide an image, Seedance 2.0 can use it as the starting frame and turn it into motion.

### Features

- Text-to-video: describe a scene, camera movement, mood, and sound atmosphere
- Image-to-video: provide a public image URL or data URI and describe how it should move
- Durations: `4`, `5`, `8`, `10` seconds
- Sizes: `1280*720`, `720*1280`, `1280*1280`
- Local output: videos are saved to `outputs/` when the result can be downloaded
- URL output: if the video cannot be downloaded, the Agent returns the remote video URL
- Clear errors: missing Key, invalid Key, insufficient balance, invalid image URL, task timeout, and task failure all include a next step

### Examples

Talk directly to your AI Agent:

> Use `$hiapi-seedance-2-0-video` to generate a 5-second cinematic ocean cliff video.

> Use HiAPI Seedance 2.0 to create a vertical product teaser video, 9:16 style.

> Animate this product photo with soft camera movement and studio lighting.

### CLI Script

Text-to-video:

```bash
node scripts/hiapi-seedance-2-video.mjs \
  --prompt "A cinematic shot of ocean waves crashing against cliffs at golden hour" \
  --seconds 5 \
  --size 1280*720
```

Image-to-video:

```bash
node scripts/hiapi-seedance-2-video.mjs \
  --prompt "The product photo comes alive with soft camera movement and studio lighting" \
  --input-reference "https://example.com/product.jpg" \
  --seconds 5
```

---

## File Structure

```text
.
├── README.md
├── README.zh-CN.md
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
│   ├── api.md
│   └── output.md
├── scripts/
│   ├── check-config.mjs
│   ├── hiapi-seedance-2-video.mjs
│   └── lib/
│       └── seedance-2-video.mjs
├── tests/
│   └── seedance-2-video.test.mjs
└── llms-install.md
```

---

## FAQ

| Problem | Solution |
| --- | --- |
| `HIAPI_API_KEY is required` | Create a Key at [Get API Key](https://www.hiapi.ai/en/register), then set `HIAPI_API_KEY`. |
| `401 Unauthorized` | Check whether the API Key is correct, or generate a new Key. |
| `402 Payment Required` / insufficient balance | Open the [HiAPI Dashboard](https://www.hiapi.ai/en/dashboard) and check your account status. |
| `400 Bad Request` | Check the duration, size, and image URL. |
| `429 Too Many Requests` | Wait and retry, or reduce concurrent generation requests. |
| Task timed out | The video may still be running. Try again later or create a shorter video. |
| Task failed | Try a clearer prompt or a different image. |
| No video output | Check the task response; this skill expects a video URL after the task succeeds. |

---

## Compatibility

| Agent | Install Method |
| --- | --- |
| OpenClaw | `openclaw skills add https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill` |
| Codex | Copy to `${CODEX_HOME:-$HOME/.codex}/skills/hiapi-seedance-2-0-video` |
| Claude Code | Copy to `~/.claude/skills/hiapi-seedance-2-0-video` |
| OpenCode | Copy to `~/.opencode/skills/hiapi-seedance-2-0-video` |
| Cursor / other agents | Copy to the corresponding skill directory |

---

## License

MIT

---

[HiAPI](https://www.hiapi.ai) — One API, all AI models
