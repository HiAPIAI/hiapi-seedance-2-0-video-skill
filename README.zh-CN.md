# Seedance 2.0 视频生成技能

把 Seedance 2.0 视频生成接入你的 AI Agent。

**Seedance 2.0 • 安装 • API Key • [HiAPI](https://www.hiapi.ai/zh)**

[免费获取 API Key](https://www.hiapi.ai/zh/register) · [查看价格](https://www.hiapi.ai/zh/pricing) · [HiAPI 文档](https://docs.hiapi.ai)

Languages: [English](README.md) | [简体中文](README.zh-CN.md)

---

> AI Agent? 跳过 README，直接看 [llms-install.md](llms-install.md)，里面有专为 Agent 准备的安装步骤和错误处理规则。

---

## 这是什么？

一个适用于 OpenClaw / Claude Code / OpenCode / Codex 类 Agent 的 AI 视频生成技能。安装后，你的 AI Agent 可以通过 HiAPI 使用 Seedance 2.0，根据文字生成视频，也可以让图片动起来。

HiAPI 是为开发者打造的 AI API 平台：一个 API，所有 AI 模型。图像、视频、音乐和文本，一个密钥全搞定。

| 技能 | 描述 | 模型 |
| --- | --- | --- |
| HiAPI Seedance 2.0 Video | 文生视频、图生视频 | Seedance 2.0 |

---

## 安装

### 快速安装（OpenClaw）

```bash
openclaw skills add https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill
```

### 安装到 Codex

```bash
git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git
cd hiapi-seedance-2-0-video-skill
npm test

mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R . "${CODEX_HOME:-$HOME/.codex}/skills/hiapi-seedance-2-0-video"
```

复制后重启 Codex。

### 手动安装到任意 Agent

```bash
git clone https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill.git
export AGENT_SKILLS_DIR="/path/to/your/agent/skills"
mkdir -p "$AGENT_SKILLS_DIR"
cp -R hiapi-seedance-2-0-video-skill "$AGENT_SKILLS_DIR/hiapi-seedance-2-0-video"
```

将 `AGENT_SKILLS_DIR` 替换为你的 Agent 技能目录。

### Agent 自动安装（复制给你的 Agent）

```text
安装 HiAPI Seedance 2.0 视频生成技能：

1. 克隆 https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill
2. 把仓库复制到你的技能目录，目录名使用 hiapi-seedance-2-0-video
3. 设置环境变量 HIAPI_API_KEY
4. 读取 SKILL.md 了解使用方法
```

---

## 获取 API Key

1. 打开 [免费获取 API Key](https://www.hiapi.ai/zh/register)
2. 登录或注册 HiAPI 账号
3. 创建新的 API Key
4. 在运行 Agent 的终端设置环境变量：

```bash
export HIAPI_API_KEY="your_hiapi_api_key_here"
export HIAPI_BASE_URL="https://api.hiapi.ai"
```

检查配置：

```bash
node scripts/check-config.mjs
```

联网检查：

```bash
node scripts/check-config.mjs --live
```

---

## Seedance 2.0 视频生成

通过自然语言让你的 AI Agent 生成视频。如果你提供图片，Seedance 2.0 可以把它作为首帧，让画面动起来。

### 功能

- 文生视频：描述场景、镜头运动、氛围和声音感，生成视频
- 图生视频：提供图片 URL 或 data URI，描述你希望图片如何动起来
- 视频时长：`4`、`5`、`8`、`10` 秒
- 视频尺寸：`1280*720`、`720*1280`、`1280*1280`
- 本地输出：可下载的视频会保存到 `outputs/`
- URL 输出：如果视频无法下载，Agent 会返回远程视频 URL
- 错误提示：未配置 Key、Key 无效、余额不足、图片不可访问、任务超时、任务失败都有明确下一步

### 使用示例

直接和你的 AI Agent 对话：

> 使用 `$hiapi-seedance-2-0-video` 生成一段 5 秒的电影感海边悬崖视频。

> 用 HiAPI Seedance 2.0 创建一段竖版产品宣传短片。

> 让这张产品图动起来，加入柔和镜头运动和棚拍灯光。

### 命令行脚本

文生视频：

```bash
node scripts/hiapi-seedance-2-video.mjs \
  --prompt "A cinematic shot of ocean waves crashing against cliffs at golden hour" \
  --seconds 5 \
  --size 1280*720
```

图生视频：

```bash
node scripts/hiapi-seedance-2-video.mjs \
  --prompt "The product photo comes alive with soft camera movement and studio lighting" \
  --input-reference "https://example.com/product.jpg" \
  --seconds 5
```

---

## 文件结构

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

## 常见问题

| 问题 | 解决方案 |
| --- | --- |
| `HIAPI_API_KEY is required` | 去 [免费获取 API Key](https://www.hiapi.ai/zh/register) 创建 Key，然后设置 `HIAPI_API_KEY`。 |
| `401 Unauthorized` | 检查 API Key 是否正确，或重新生成 Key。 |
| `402 Payment Required` / 余额不足 | 进入 [HiAPI Dashboard](https://www.hiapi.ai/zh/dashboard) 检查账号状态。 |
| `400 Bad Request` | 检查视频时长、尺寸和图片 URL。 |
| `429 Too Many Requests` | 稍后重试，或减少并发生成请求。 |
| 任务超时 | 视频可能还在生成中，稍后重试，或生成更短的视频。 |
| 任务失败 | 换一个更清晰的提示词，或换一张图片。 |
| 没有视频输出 | 检查任务返回内容；该 skill 期望任务成功后返回视频 URL。 |

---

## 兼容性

| Agent | 安装方式 |
| --- | --- |
| OpenClaw | `openclaw skills add https://github.com/HiAPIAI/hiapi-seedance-2-0-video-skill` |
| Codex | 复制到 `${CODEX_HOME:-$HOME/.codex}/skills/hiapi-seedance-2-0-video` |
| Claude Code | 复制到 `~/.claude/skills/hiapi-seedance-2-0-video` |
| OpenCode | 复制到 `~/.opencode/skills/hiapi-seedance-2-0-video` |
| Cursor / 其他 Agent | 复制到对应技能目录 |

---

## 许可证

MIT

---

[HiAPI](https://www.hiapi.ai/zh) — 一个 API，所有 AI 模型
