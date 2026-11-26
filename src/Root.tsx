import React from "react";
import { Composition } from "remotion";
import { MainVideo, MAIN_DURATION_FRAMES } from "./MainVideo";
import { Short1, Short2 } from "./Shorts";
import { SHORTS } from "./scenes";
import "./fonts.css";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={MAIN_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Short1"
        component={Short1}
        durationInFrames={SHORTS.short1.frames}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Short2"
        component={Short2}
        durationInFrames={SHORTS.short2.frames}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
