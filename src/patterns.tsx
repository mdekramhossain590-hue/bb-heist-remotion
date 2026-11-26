// patterns.tsx — component library from the remotion-motion-graphics skill.
// All entrances use spring() (never linear); every interpolate() has an
// easing curve + left/right clamp.
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "./theme";

/* 1. Premium entrance: fade + rise + scale (2-3 properties together) */
export const Entrance: React.FC<{ delay?: number; children: React.ReactNode }> = ({
  delay = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [36, 0])}px) scale(${interpolate(
          p,
          [0, 1],
          [0.94, 1],
        )})`,
      }}
    >
      {children}
    </div>
  );
};

/* 3. Word-by-word text reveal (staggered 3 frames per word) */
export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, per = 3, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 18, ...style }}>
      {text.split(" ").map((word, i) => {
        const p = spring({
          frame: frame - delay - i * per,
          fps,
          config: theme.spring.snappy,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [28, 0])}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

/* 4. Background mesh — never a flat background */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 50;
  const d2 = Math.cos(frame / 70) * 40;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          top: -450,
          left: -300 + d1,
          filter: "blur(60px)",
          background: `radial-gradient(circle, ${theme.colors.primary}2E, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          bottom: -400,
          right: -250 - d2,
          filter: "blur(75px)",
          background: `radial-gradient(circle, ${theme.colors.accent}1F, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* 5. Color grade overlay (above content, below grain) */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.primary,
        mixBlendMode: "soft-light",
        opacity: 0.16,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.14), transparent 28%, transparent 72%, rgba(0,0,0,0.26))",
      }}
    />
  </AbsoluteFill>
);

/* 6. Procedural film grain (zero asset files) */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.06,
        mixBlendMode: "overlay",
      }}
    />
  );
};

/* 7. Vignette (topmost layer) */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at center, transparent 54%, rgba(0,0,0,0.34) 100%)",
    }}
  />
);

/* 8. Ken Burns for archival stills */
export const KenBurns: React.FC<{
  src: string;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
}> = ({ src, zoomFrom = 1.0, zoomTo = 1.09, panX = -24, panY = -10 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tx = interpolate(frame, [0, durationInFrames], [0, panX], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ty = interpolate(frame, [0, durationInFrames], [0, panY], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Img
      src={staticFile(src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
      }}
    />
  );
};

/* 9. Highlighter marker sweep (documentary evidence highlight) */
export const HighlighterMarker: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  color?: string;
}> = ({ children, delay = 10, duration = 16, color = theme.colors.primary }) => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [delay, delay + duration], [0, 100], {
    easing: theme.ease.out,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span style={{ position: "relative", display: "inline-block", padding: "0 8px" }}>
      <span
        style={{
          position: "absolute",
          inset: "8% 0",
          backgroundColor: color,
          opacity: 0.42,
          borderRadius: 6,
          clipPath: `inset(0 ${100 - sweep}% 0 0)`,
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
};

/* 10. Archival document / newspaper card */
export const DocumentCard: React.FC<{
  src: string;
  caption?: string;
  delay?: number;
  tiltDeg?: number;
}> = ({ src, caption, delay = 0, tiltDeg = -1.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  const floatY = Math.sin((frame - delay) / 32) * 4;
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [50, 0]) + floatY}px) scale(${interpolate(
          p,
          [0, 1],
          [0.92, 1],
        )}) rotate(${tiltDeg}deg)`,
        borderRadius: 20,
        overflow: "hidden",
        background: "#1C1917",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 35px 70px -15px rgba(0,0,0,0.75)",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <KenBurns src={src} zoomFrom={1.02} zoomTo={1.08} panX={-14} panY={-8} />
      {caption && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px 24px",
            background: "linear-gradient(transparent, rgba(0,0,0,0.88))",
            color: theme.colors.text,
            fontFamily: theme.fonts.mono,
            fontSize: 22,
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

/* 12. Animated counter — renders Bengali digits to match on-screen typography */
const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (s: string) => s.replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);

export const AnimatedCounter: React.FC<{
  target: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}> = ({ target, delay = 0, prefix = "", suffix = "", decimals = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const value = interpolate(
    spring({ frame: frame - delay, fps, config: { damping: 30, stiffness: 60 } }),
    [0, 1],
    [0, target],
  );
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {toBn(value.toFixed(decimals))}
      {suffix}
    </span>
  );
};

/* Exit wrapper: fades + rises out in the last 10 frames, faster than entrances.
   MUST be an AbsoluteFill (not a plain div): Remotion's Sequence renders
   children inside a flex AbsoluteFill, and a plain div flex-item would
   shrink to its (absolutely-positioned) content width ~ 0. */
export const ExitFade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const exitY = interpolate(frame, [durationInFrames - 12, durationInFrames - 2], [0, -40], {
    easing: theme.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitO = interpolate(frame, [durationInFrames - 12, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: exitO, transform: `translateY(${exitY}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

/* Chapter card — small white pill top-centre, per the Inside File style */
export const ChapterCard: React.FC<{ text: string; delay?: number }> = ({ text, delay = 6 }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 44,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <Entrance delay={delay}>
        <div
          style={{
            background: "rgba(245,240,230,0.94)",
            color: "#12100E",
            fontFamily: theme.fonts.body,
            fontWeight: 700,
            fontSize: 34,
            padding: "12px 30px",
            borderRadius: 999,
            boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
          }}
        >
          {text}
        </div>
      </Entrance>
    </div>
  );
};

/* Case-file badge — top-left */
export const CaseBadge: React.FC<{ delay?: number }> = ({ delay = 4 }) => {
  return (
    <div style={{ position: "absolute", top: 44, left: 48, pointerEvents: "none" }}>
      <Entrance delay={delay}>
        <div
          style={{
            background: theme.colors.accent,
            color: theme.colors.text,
            fontFamily: theme.fonts.body,
            fontWeight: 700,
            fontSize: 32,
            padding: "10px 24px",
            borderRadius: 12,
            boxShadow: `0 0 60px ${theme.colors.glow}`,
          }}
        >
          কেস ফাইল #০৪
        </div>
      </Entrance>
    </div>
  );
};

/* Logo watermark — bottom-right */
export const LogoWatermark: React.FC<{ size?: number }> = ({ size = 92 }) => {
  return (
    <div
      style={{
        position: "absolute",
        right: 36,
        bottom: 36,
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid rgba(245,240,230,0.5)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
        opacity: 0.92,
        pointerEvents: "none",
      }}
    >
      <Img
        src={staticFile("images/logo.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

/* Bottom caption bar — current SRT cue text */
export const CaptionBar: React.FC<{ text: string; width: number }> = ({ text, width }) => {
  if (!text) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: width * 0.86,
          background: "rgba(0,0,0,0.72)",
          color: theme.colors.text,
          fontFamily: theme.fonts.body,
          fontSize: width >= 1920 ? 34 : 40,
          fontWeight: 400,
          lineHeight: 1.45,
          padding: "14px 28px",
          borderRadius: 14,
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </div>
  );
};
