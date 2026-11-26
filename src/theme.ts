// theme.ts — single source of truth for every Remotion project.
// NEVER inline colors, easings, or spring configs in components.
import { Easing } from "remotion";

export const theme = {
  colors: {
    // Documentary / Archival palette — warm, per skill design-rules
    bg: "#12100E",
    bgAlt: "#1C1917",
    primary: "#E8A33D", // THE hero / highlighter color — max one focal element per frame
    accent: "#DC2626", // Evidence / map path red
    text: "#F5F0E6",
    textDim: "#A8A29E",
    glow: "rgba(232, 163, 61, 0.38)",
  },
  fonts: {
    display: "'Noto Sans Bengali', sans-serif",
    body: "'Noto Sans Bengali', sans-serif",
    mono: "'Noto Sans Bengali', monospace",
  },
  // THE easing curves. Linear is forbidden.
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // easeOutExpo — entrances & highlighter sweeps
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // easeInOutQuint — camera moves & Ken Burns
    in: Easing.bezier(0.7, 0, 0.84, 0), // exits only
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 }, // UI pops, words
    smooth: { damping: 20, stiffness: 90, mass: 1 }, // big document cards
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 }, // playful accents, logos
  },
} as const;
