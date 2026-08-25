# Dynamic Text Commentary Video

一个面向中文观点解说短视频的 Codex Skill。输入一个包含中文文案和一张主题图的文件夹，它会自动准备 TTS、生成字幕与场景计划，并用 Remotion 渲染 1080x1920 竖屏视频。成片具有滚动解说、当前句高亮、标题动效和动画素材舞台。

## 功能

- 从项目文件夹自动发现文案、主题图、已有配音和可选 SRT 字幕。
- 没有现成配音时，调用 MiMo TTS；API Key 只从环境变量读取。
- 生成 `video-plan.json`、`captions.json`、关键帧预览、`final.mp4` 和轻量 `preview.mp4`。
- 使用数据驱动的 Remotion 模板；调整单条视频语义时只修改输出计划，不改模板源码。
- 内置风格配置、布局规则、动画选择规则和素材目录，便于复用统一视觉语言。

## 目录约定

```text
my-video/
├── script.txt          # 必需；.txt 或 .md 中文解说稿
├── theme.png           # 必需；PNG/JPEG/WebP 主题图
├── title.txt           # 可选；固定标题，不会作为旁白朗读
├── subtitles.srt       # 可选；提供时优先用于精确对齐
└── voiceover.wav       # 可选；已有配音可跳过 TTS
```

所有生成内容只写入 `my-video/.output/`，源媒体不会被改写。

## 快速开始

1. 安装依赖：

   ```bash
   # macOS
   brew install ffmpeg
   ```

   还需要 Node.js 20 或更新版本、npm，以及可选的 Google Chrome。脚本在 macOS 上会自动探测 Chrome 并将其作为 Remotion 浏览器。

2. 配置 TTS：

   ```bash
   export MIMO_API_KEY="..."
   ```

   如果项目内已经有配音文件，或上次生成的配音仍然匹配同一份文案，则不需要该变量。

3. 渲染：

   ```bash
   node scripts/run-video.mjs /absolute/path/to/my-video
   ```

4. 检查结果：

   ```text
   my-video/.output/final.mp4
   my-video/.output/preview.mp4
   my-video/.output/video-plan.json
   my-video/.output/captions.json
   my-video/.output/frames/
   my-video/.output/quality-report.json
   ```

交付前应检查 `video-plan.json` 的标题和场景划分，并查看关键帧与最终视频。

## 安装为 Codex Skill

```bash
git clone https://github.com/zyk1172/dynamic-text-commentary-video.git \
  ~/.codex/skills/dynamic-text-commentary-video
```

如果目录已存在，进入该目录后执行 `git pull` 更新。

## 仓库结构

```text
SKILL.md                              # Codex Skill 入口说明
scripts/run-video.mjs                 # 发现、TTS、计划生成与渲染流水线
assets/remotion-template/             # 数据驱动 Remotion 模板
assets/animation-library/             # 动画素材与选择目录
config/style-profile.json             # 全局视觉、排版与版式配置
config/tts-adapters.json              # TTS 服务适配配置
references/                           # 布局、动画与计划校验规则
```

## 隐私与安全

- 不要把 API Key 写进项目文件或提交到 Git。
- `.output/` 和 Remotion 依赖不会被纳入版本控制。
- TTS 只在缺少可用配音时被调用；React 组件不会直接请求网络服务。

## License

本项目使用 [MIT License](LICENSE)。

`assets/animation-library/fluent/` 中的图形来自 [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji)，基于 MIT License 发布。详见 [NOTICE](NOTICE)。
