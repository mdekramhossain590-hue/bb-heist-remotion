// MainVideo.tsx — BB heist long documentary, 1920x1080, 30fps, ~9m39s.
// Five-layer stack per the skill: BgMesh -> Ken Burns archival images +
// graphics/type/highlighter -> Grade -> Grain + Vignette (topmost).
// Every scene is synced to the SRT/voiceover timestamps in scenes.ts.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "./theme";
import {
  AnimatedCounter,
  BgMesh,
  CaptionBar,
  CaseBadge,
  ChapterCard,
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
import {
  CAPTIONS,
  FPS,
  IMAGE_SEGMENTS,
  TOTAL_FRAMES,
  captionAt,
  secToFrame,
} from "./scenes";

const HERO: React.CSSProperties = {
  fontFamily: theme.fonts.display,
  fontWeight: 700,
  color: theme.colors.text,
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
  textShadow: "0 6px 30px rgba(0,0,0,0.65)",
};

const EVIDENCE_LINE: React.CSSProperties = {
  fontFamily: theme.fonts.body,
  fontWeight: 700,
  color: theme.colors.text,
  fontSize: 54,
  lineHeight: 1.3,
  textShadow: "0 4px 20px rgba(0,0,0,0.7)",
};

const lowerThird: React.CSSProperties = {
  position: "absolute",
  left: 96,
  right: 96,
  bottom: 150,
  pointerEvents: "none",
};

const statCard: React.CSSProperties = {
  background: "rgba(18,16,14,0.82)",
  border: "1px solid rgba(245,240,230,0.22)",
  borderRadius: 20,
  padding: "26px 30px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.55)",
  minWidth: 300,
  textAlign: "center" as const,
};

/** Per-segment on-screen graphics. Segment index = image segment index. */
const SegmentOverlay: React.FC<{ index: number }> = ({ index }) => {
  switch (index) {
    case 0:
      // HOOK — boldest visual + claim
      return (
        <>
          <CaseBadge delay={4} />
          <div style={lowerThird}>
            <Entrance delay={10}>
              <div style={{ ...HERO, fontSize: 104 }}>
                <WordReveal text="এক রাতে ৯৫১ মিলিয়ন ডলার গায়েব!" delay={12} per={4} />
              </div>
            </Entrance>
            <Entrance delay={34}>
              <div
                style={{
                  marginTop: 26,
                  fontFamily: theme.fonts.body,
                  fontSize: 44,
                  color: theme.colors.primary,
                  fontWeight: 700,
                }}
              >
                চেষ্টা <AnimatedCounter target={951} delay={40} suffix=" মিলিয়ন" /> → গায়েব{" "}
                <AnimatedCounter target={81} delay={52} suffix=" মিলিয়ন" />
              </div>
            </Entrance>
          </div>
        </>
      );
    case 1:
      return (
        <>
          <ChapterCard text="অধ্যায় ১ — এক বছরের প্রস্তুতি" />
          <div style={lowerThird}>
            <Entrance delay={26}>
              <div style={EVIDENCE_LINE}>
                সিভির ছদ্মবেশে <HighlighterMarker delay={34}>ম্যালওয়্যার</HighlighterMarker>
              </div>
            </Entrance>
          </div>
        </>
      );
    case 2:
      return (
        <div style={lowerThird}>
          <Entrance delay={14}>
            <div style={EVIDENCE_LINE}>
              <HighlighterMarker delay={20} color={theme.colors.accent}>
                জুপিটার স্ট্রিট
              </HighlighterMarker>
              , ম্যানিলা — ৪টি ভুয়া অ্যাকাউন্ট
            </div>
          </Entrance>
        </div>
      );
    case 3:
      return (
        <>
          <ChapterCard text="অধ্যায় ২ — সেই রাত" />
          <div style={lowerThird}>
            <Entrance delay={26}>
              <div style={{ ...HERO, fontSize: 92 }}>
                <AnimatedCounter target={35} delay={30} suffix="টি নির্দেশ" />
              </div>
            </Entrance>
            <Entrance delay={44}>
              <div style={{ marginTop: 14, fontSize: 46, color: theme.colors.primary, fontWeight: 700, fontFamily: theme.fonts.body }}>
                মাত্র <AnimatedCounter target={36} delay={48} suffix=" মিনিটে" />
              </div>
            </Entrance>
          </div>
        </>
      );
    case 4:
      return (
        <div style={lowerThird}>
          <Entrance delay={14}>
            <div style={EVIDENCE_LINE}>
              <HighlighterMarker delay={20} color={theme.colors.accent}>
                প্রিন্টার কাজ করছে না
              </HighlighterMarker>
            </div>
          </Entrance>
          <Entrance delay={40}>
            <div style={{ marginTop: 22, fontSize: 44, color: theme.colors.text, fontWeight: 700, fontFamily: theme.fonts.body }}>
              টানা <span style={{ color: theme.colors.primary }}>৫ দিনের ছুটি</span> — তিন দেশ
            </div>
          </Entrance>
        </div>
      );
    case 5:
      return (
        <>
          <ChapterCard text="অধ্যায় ৩ — দুই ভুল যা বাঁচাল" />
          <div style={lowerThird}>
            <Entrance delay={26}>
              <div style={EVIDENCE_LINE}>
                ১ম ভুল: <HighlighterMarker delay={32} color={theme.colors.accent}>জুপিটার</HighlighterMarker>
              </div>
            </Entrance>
            <Entrance delay={52}>
              <div style={{ ...EVIDENCE_LINE, marginTop: 18 }}>
                ২য় ভুল: <HighlighterMarker delay={58}>ফানডেশন</HighlighterMarker> — বানান ভুল
              </div>
            </Entrance>
          </div>
        </>
      );
    case 6: {
      const stats = [
        { name: "ভেরগারা", v: 19.9 },
        { name: "ক্রুজ", v: 6 },
        { name: "ভাসকেজ", v: 25 },
        { name: "লাগরোসাস", v: 30 },
      ];
      return (
        <>
          <ChapterCard text="অধ্যায় ৪ — টাকার পথ" />
          <div
            style={{
              position: "absolute",
              left: 96,
              right: 96,
              bottom: 170,
              display: "flex",
              gap: 24,
              justifyContent: "center",
            }}
          >
            {stats.map((s, i) => (
              <Entrance key={s.name} delay={24 + i * 5}>
                <div style={statCard}>
                  <div style={{ fontSize: 30, color: theme.colors.textDim, fontFamily: theme.fonts.body }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: 64, fontWeight: 700, color: theme.colors.primary, fontFamily: theme.fonts.display, marginTop: 6 }}>
                    <AnimatedCounter target={s.v} delay={30 + i * 5} decimals={s.v % 1 ? 1 : 0} />
                  </div>
                  <div style={{ fontSize: 26, color: theme.colors.textDim, fontFamily: theme.fonts.body }}>
                    মিলিয়ন ডলার
                  </div>
                </div>
              </Entrance>
            ))}
          </div>
        </>
      );
    }
    case 7: {
      const dests = [
        { name: "ইস্টার্ন হাওয়াই লেজার", v: 21 },
        { name: "সোলেয়ার ক্যাসিনো", v: 29 },
        { name: "ওয়েইকাং শু", v: 31 },
      ];
      return (
        <div
          style={{
            position: "absolute",
            left: 96,
            right: 96,
            bottom: 170,
            display: "flex",
            gap: 24,
            justifyContent: "center",
          }}
        >
          {dests.map((d, i) => (
            <Entrance key={d.name} delay={16 + i * 5}>
              <div style={statCard}>
                <div style={{ fontSize: 30, color: theme.colors.textDim, fontFamily: theme.fonts.body }}>
                  {d.name}
                </div>
                <div style={{ fontSize: 64, fontWeight: 700, color: theme.colors.accent, fontFamily: theme.fonts.display, marginTop: 6 }}>
                  <AnimatedCounter target={d.v} delay={22 + i * 5} />
                </div>
                <div style={{ fontSize: 26, color: theme.colors.textDim, fontFamily: theme.fonts.body }}>
                  মিলিয়ন ডলার
                </div>
              </div>
            </Entrance>
          ))}
        </div>
      );
    }
    case 8:
      return (
        <>
          <ChapterCard text="অধ্যায় ৫ — কে দায়ী?" />
          <div style={lowerThird}>
            <Entrance delay={26}>
              <div style={{ ...HERO, fontSize: 92 }}>
                খবর গোপন <AnimatedCounter target={24} delay={32} suffix=" দিন" />
              </div>
            </Entrance>
            <Entrance delay={50}>
              <div style={{ marginTop: 18, fontSize: 44, color: theme.colors.text, fontWeight: 700, fontFamily: theme.fonts.body }}>
                গভর্নর <span style={{ color: theme.colors.primary }}>আতিউর রহমান</span> পদত্যাগ
              </div>
            </Entrance>
          </div>
        </>
      );
    case 9:
      return (
        <div style={lowerThird}>
          <Entrance delay={14}>
            <div style={EVIDENCE_LINE}>
              <HighlighterMarker delay={20} color={theme.colors.accent}>
                মাইয়া দেগুইতো
              </HighlighterMarker>{" "}
              — ৮টি অভিযোগে দোষী
            </div>
          </Entrance>
          <Entrance delay={42}>
            <div style={{ marginTop: 20, fontSize: 44, color: theme.colors.text, fontWeight: 700, fontFamily: theme.fonts.body }}>
              জরিমানা <span style={{ color: theme.colors.primary }}>১০৯ মিলিয়ন ডলার</span>
            </div>
          </Entrance>
        </div>
      );
    case 10:
      return (
        <>
          <ChapterCard text="অধ্যায় ৬ — ৯ বছর পর" />
          <div style={lowerThird}>
            <Entrance delay={26}>
              <div style={{ ...HERO, fontSize: 96 }}>
                <AnimatedCounter target={66} delay={32} suffix=" মিলিয়ন" />
              </div>
            </Entrance>
            <Entrance delay={48}>
              <div style={{ marginTop: 16, fontSize: 46, color: theme.colors.primary, fontWeight: 700, fontFamily: theme.fonts.body }}>
                এখনো নিখোঁজ — ৩ জন মানুষও নিখোঁজ
              </div>
            </Entrance>
          </div>
        </>
      );
    case 11:
      // END CARD
      return (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(180deg, rgba(18,16,14,0.25), rgba(18,16,14,0.72))",
          }}
        >
          <Entrance delay={8}>
            <div
              style={{
                ...HERO,
                fontSize: 110,
                textAlign: "center",
                boxShadow: `0 0 60px ${theme.colors.glow}`,
              }}
            >
              সাবস্ক্রাইব করুন
            </div>
          </Entrance>
          <Entrance delay={24}>
            <div
              style={{
                marginTop: 28,
                fontSize: 46,
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
                fontWeight: 700,
              }}
            >
              পরের কেস ফাইলে দেখা হবে
            </div>
          </Entrance>
        </div>
      );
    default:
      return null;
  }
};

/** Bottom caption layer — current SRT cue, hidden on the end card. */
const CaptionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const segIndex = IMAGE_SEGMENTS.findIndex(
    (s) => t >= s.start && t < s.start + s.dur,
  );
  if (segIndex === 11) return null;
  const text = captionAt(t);
  return <CaptionBar text={text} width={1920} />;
};

/** SFX sequences: whoosh 3 frames before every image-segment cut,
 * bass-hit on chapter cards, marker on highlighter lines, shutter on stats. */
const SfxLayer: React.FC = () => {
  const chapterSegs = new Set([1, 3, 5, 6, 8, 10]);
  const markerSegs = new Set([1, 2, 4, 5, 9]);
  const shutterSegs = new Set([6, 7]);
  return (
    <>
      {IMAGE_SEGMENTS.map((seg, i) => {
        const from = Math.max(0, secToFrame(seg.start) - 3);
        return (
          <Sequence key={`w${i}`} from={from} durationInFrames={30}>
            <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
          </Sequence>
        );
      })}
      {IMAGE_SEGMENTS.map((seg, i) =>
        chapterSegs.has(i) ? (
          <Sequence key={`b${i}`} from={Math.max(0, secToFrame(seg.start) + 3)} durationInFrames={20}>
            <Audio src={staticFile("sfx/bass-hit.mp3")} volume={0.55} />
          </Sequence>
        ) : null,
      )}
      {IMAGE_SEGMENTS.map((seg, i) =>
        markerSegs.has(i) ? (
          <Sequence key={`m${i}`} from={Math.max(0, secToFrame(seg.start) + 17)} durationInFrames={10}>
            <Audio src={staticFile("sfx/marker.mp3")} volume={0.45} />
          </Sequence>
        ) : null,
      )}
      {IMAGE_SEGMENTS.map((seg, i) =>
        shutterSegs.has(i) ? (
          <Sequence key={`s${i}`} from={Math.max(0, secToFrame(seg.start) + 21)} durationInFrames={10}>
            <Audio src={staticFile("sfx/shutter.mp3")} volume={0.5} />
          </Sequence>
        ) : null,
      )}
    </>
  );
};

export const MainVideo: React.FC = () => {
  const { width } = useVideoConfig();
  void width;
  void CAPTIONS;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <BgMesh />
      {IMAGE_SEGMENTS.map((seg, i) => (
        <Sequence
          key={seg.image}
          from={secToFrame(seg.start)}
          durationInFrames={secToFrame(seg.dur)}
          name={`seg-${i}-${seg.image}`}
        >
          <ExitFade>
            <AbsoluteFill>
              <KenBurns
                src={`images/${seg.image}`}
                zoomFrom={1.0}
                zoomTo={1.08}
                panX={i % 2 === 0 ? -24 : 24}
                panY={i % 3 === 0 ? -10 : 10}
              />
            </AbsoluteFill>
            <AbsoluteFill>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.30), transparent 30%, transparent 55%, rgba(0,0,0,0.55))",
                }}
              />
            </AbsoluteFill>
            <SegmentOverlay index={i} />
          </ExitFade>
        </Sequence>
      ))}
      <CaptionLayer />
      <Grade />
      <Grain />
      <Vignette />
      <LogoWatermark />
      <Audio src={staticFile("audio/voiceover.mp3")} volume={1.0} />
      <Audio src={staticFile("sfx/suspense-drone.mp3")} volume={0.16} loop />
      <SfxLayer />
    </AbsoluteFill>
  );
};

export const MAIN_DURATION_FRAMES = TOTAL_FRAMES;
