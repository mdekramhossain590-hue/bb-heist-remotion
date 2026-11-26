// Shorts.tsx — 2 vertical Shorts, 1080x1920, 30fps.
// Each is its own mini case with its own hook, evidence highlight and CTA.
// Five-layer stack: BgMesh -> Ken Burns image -> graphics -> Grade -> Grain + Vignette.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "./theme";
import {
  BgMesh,
  CaptionBar,
  Entrance,
  ExitFade,
  Grade,
  Grain,
  HighlighterMarker,
  KenBurns,
  LogoWatermark,
  Vignette,
  WordReveal,
} from "./patterns";
import { FPS, SHORTS, SHORTS_CAPTIONS } from "./scenes";

interface ShortProps {
  shortKey: "short1" | "short2";
  hookLines: string[];
  evidence: React.ReactNode;
  hookDelay?: number;
}

const captionAtShort = (key: "short1" | "short2", t: number): string => {
  const cues = SHORTS_CAPTIONS[key] || [];
  for (const c of cues) {
    if (t >= c.start && t < c.end) return c.text;
  }
  return "";
};

const ShortBase: React.FC<ShortProps> = ({ shortKey, hookLines, evidence, hookDelay = 8 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const ctaIn = interpolate(frame, [durationInFrames - 130, durationInFrames - 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [durationInFrames - 130, durationInFrames - 100], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const meta = SHORTS[shortKey];
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <BgMesh />
      <AbsoluteFill>
        <KenBurns src={meta.image} zoomFrom={1.0} zoomTo={1.1} panX={0} panY={-30} />
      </AbsoluteFill>
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.45), transparent 25%, transparent 55%, rgba(0,0,0,0.72))",
          }}
        />
      </AbsoluteFill>

      {/* Case badge */}
      <div style={{ position: "absolute", top: 90, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Entrance delay={4}>
          <div
            style={{
              background: theme.colors.accent,
              color: theme.colors.text,
              fontFamily: theme.fonts.body,
              fontWeight: 700,
              fontSize: 44,
              padding: "14px 34px",
              borderRadius: 14,
            }}
          >
            কেস ফাইল #০৪
          </div>
        </Entrance>
      </div>

      {/* Hook — word reveal */}
      <div style={{ position: "absolute", top: 260, left: 70, right: 70 }}>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 700,
            fontSize: 108,
            lineHeight: 1.18,
            color: theme.colors.text,
            textShadow: "0 8px 30px rgba(0,0,0,0.7)",
          }}
        >
          {hookLines.map((line, li) => (
            <div key={li} style={{ marginBottom: 10 }}>
              <WordReveal text={line} delay={hookDelay + li * 14} per={4} />
            </div>
          ))}
        </div>
      </div>

      {/* Evidence line */}
      <div style={{ position: "absolute", top: 900, left: 70, right: 70 }}>
        <Entrance delay={hookDelay + 60}>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontWeight: 700,
              fontSize: 62,
              lineHeight: 1.35,
              color: theme.colors.text,
              textShadow: "0 4px 20px rgba(0,0,0,0.75)",
            }}
          >
            {evidence}
          </div>
        </Entrance>
      </div>

      {/* CTA — last ~4s */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: ctaIn,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        <div
          style={{
            background: theme.colors.primary,
            color: "#12100E",
            fontFamily: theme.fonts.body,
            fontWeight: 700,
            fontSize: 52,
            padding: "20px 44px",
            borderRadius: 999,
            boxShadow: `0 0 60px ${theme.colors.glow}`,
          }}
        >
          পুরো গল্প দেখুন লং ভিডিওতে
        </div>
        <div style={{ marginTop: 22, fontSize: 40, color: theme.colors.text, fontFamily: theme.fonts.body, fontWeight: 700 }}>
          The Inside File সাবস্ক্রাইব করুন
        </div>
      </div>

      <CaptionBar text={captionAtShort(shortKey, t)} width={1080} />
      <Grade />
      <Grain />
      <Vignette />
      <LogoWatermark size={110} />
      <Audio src={staticFile(meta.audio)} volume={1.0} />
      <Audio src={staticFile("sfx/suspense-drone.mp3")} volume={0.16} loop />
      <Sequence from={0} durationInFrames={20}>
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={Math.max(0, hookDelay + 57)} durationInFrames={10}>
        <Audio src={staticFile("sfx/marker.mp3")} volume={0.45} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const Short1: React.FC = () => (
  <ExitFade>
    <ShortBase
      shortKey="short1"
      hookLines={["একটা বানান ভুল", "৮৫০ মিলিয়ন ডলার বাঁচাল"]}
      evidence={
        <>
          প্রাপকের নাম <HighlighterMarker delay={70}>ফানডেশন</HighlighterMarker> — আসল নাম ফাউন্ডেশন
        </>
      }
    />
  </ExitFade>
);

export const Short2: React.FC = () => (
  <ExitFade>
    <ShortBase
      shortKey="short2"
      hookLines={["প্রিন্টারটাই ছিল", "প্রথম সূত্র"]}
      evidence={
        <>
          নিরাপদ কক্ষের <HighlighterMarker delay={70} color={theme.colors.accent}>প্রিন্টার</HighlighterMarker> কাজ করছে না
        </>
      }
    />
  </ExitFade>
);
