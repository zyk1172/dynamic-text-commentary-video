---
name: dynamic-text-commentary-video
description: Create a reusable Remotion Chinese dynamic-text commentary video from a project folder containing a Chinese script and one theme image. Use when asked for Remotion dynamic text videos, scrolling narration synchronized to voiceover, purple active-sentence highlighting, animation-library cat/duck/symbol assets, or opinion, commentary, knowledge, social-observation, and news-analysis short videos.
---

# Dynamic Text Commentary Video

Run `scripts/run-video.mjs <project-dir>`. Treat `<project-dir>` as the only input; do not ask for filenames when it contains one credible script and image. An optional `title.txt` or `title.md` sets a fixed headline and is never used as narration. The script writes only `<project-dir>/.output` and never edits source media.

1. Run `node scripts/run-video.mjs <project-dir>` and report errors verbatim if discovery, TTS, alignment, or rendering fails.
2. For semantic quality, read the script and review `.output/video-plan.json`. Adjust only the data plan if a headline changes meaning; never alter `assets/remotion-template/src/Video.tsx` for a video.
3. Rerun the command after data changes. Review the generated keyframes before handing off `.output/final.mp4`.
4. Read `references/layout-rules.md` for visual changes, `references/animation-selection.md` when assigning animation assets, and `references/video-plan-schema.json` when validating plans.

Use `config/style-profile.json` for global colors, footer copy, typography and layout tokens. Use `config/tts-adapters.json` for one-time TTS setup; adapters return audio only and are never called by React components. The bundled template is data-driven and reads only copied media, captions, plan, animation catalog, and style profile.
