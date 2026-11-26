# BB Heist — Remotion Remake

Bangladesh Bank $81M heist documentary for **The Inside File** (কেস ফাইল #০৪),
rebuilt with [Remotion](https://www.remotion.dev/) (React-based video) following
the `remotion-motion-graphics` skill: SRT-synced scenes, Ken Burns archival
stills, highlighter evidence sweeps, animated counters, film grain + vignette,
voiceover + suspense drone + transition SFX.

## Compositions

| ID | Size | Duration | Audio |
|----|------|----------|-------|
| `MainVideo` | 1920×1080 | ~9m39s (17,366 frames @30fps) | `audio/voiceover.mp3` (slow narration, voice skill) |
| `Short1` | 1080×1920 | 30.8s (924 frames) | `audio/shorts-1.mp3` |
| `Short2` | 1080×1920 | 26.7s (800 frames) | `audio/shorts-2.mp3` |

## Assets

Binary assets (images, audio, fonts) are **not** in this repo — they are
downloaded by the workflow from an assets tarball (see `ASSETS_URL` in
`.github/workflows/render-remotion.yml`). To render locally, place them in
`public/` (`images/`, `audio/`, `fonts/`, `sfx/`).

## Local QA (stills only — never render the full 9-minute video locally)

```bash
npm install
npx remotion browser ensure
npx remotion still src/index.ts MainVideo out/check.png --frame 1100 --overwrite
```

## Cloud render

Push to `main` (or run the **Render Remotion Video** workflow manually).
The workflow renders all three compositions on GitHub Actions and attaches
the MP4s to a GitHub Release.
