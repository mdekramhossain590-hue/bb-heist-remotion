// scenes.ts — timing data for the BB heist Remotion remake.
// Built by tools/build-srt.py from the real narration chunk durations
// (ffprobe) + the rescaled SRT. All times in seconds; fps = 30.
import scenesJson from "./scenes.json";

export interface Caption {
  start: number;
  end: number;
  text: string;
}
export interface ImageSegment {
  image: string;
  start: number;
  dur: number;
}
export interface Chapter {
  start: number;
  title: string;
}

export const FPS = 30;
export const TOTAL_SEC: number = scenesJson.totalSec;
export const TOTAL_FRAMES = Math.round(TOTAL_SEC * FPS);
export const IMAGE_SEGMENTS: ImageSegment[] = scenesJson.imageSegments;
export const CHAPTERS: Chapter[] = scenesJson.chapters;
export const CAPTIONS: Caption[] = scenesJson.captions;
export const SHORTS = {
  short1: { durSec: 30.816, frames: 924, audio: "audio/shorts-1.mp3", image: "images/06.jpg" },
  short2: { durSec: 26.664, frames: 800, audio: "audio/shorts-2.mp3", image: "images/04.jpg" },
};
export const SHORTS_CAPTIONS: Record<string, Caption[]> = (
  scenesJson as unknown as { shortsCaptions: Record<string, Caption[]> }
).shortsCaptions;

export const secToFrame = (s: number) => Math.round(s * FPS);

/** Current caption text at a given absolute time (seconds). */
export function captionAt(t: number): string {
  for (const c of CAPTIONS) {
    if (t >= c.start && t < c.end) return c.text;
  }
  return "";
}

/** Chapter title active at a given absolute time. */
export function chapterAt(t: number): string {
  let cur = CHAPTERS[0].title;
  for (const c of CHAPTERS) {
    if (t >= c.start) cur = c.title;
  }
  return cur;
}
