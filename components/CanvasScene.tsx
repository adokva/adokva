"use client";

import {
  Canvas,
} from "@react-three/fiber";

import {
  Bloom,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";

import {
  BlendFunction,
} from "postprocessing";

import AnimatedStars from "./AnimatedStars";
import CameraIntro from "./CameraIntro";
import FocusOrbitControls from "./FocusOrbitControls";
import Globe from "./Globe";

import Moon, {
  getMoonPosition,
} from "./Moon";

import Sun from "./Sun";
import WorldCameraController from "./WorldCameraController";

import type {
  SelectedWorld,
} from "../types/world";

type Props = {
  introStarted: boolean;
  introComplete: boolean;

  selectedLocation: {
    lat: number;
    lon: number;
  } | null;

  selectedWorld: SelectedWorld;

  onSelectWorld: (
    world: SelectedWorld
  ) => void;

  onIntroComplete: () => void;
};

const MOON_POSITION =
  getMoonPosition();

export default function CanvasScene({
  introStarted,
  introComplete,
  selectedLocation,
  selectedWorld,
  onSelectWorld,
  onIntroComplete,
}: Props) {
  const exploringWorld =
    selectedWorld === "sun" ||
    selectedWorld === "moon";

  return (
    <Canvas
      camera={{
        position: [14, 7, 20],
        fov: 35,
        near: 0.05,
        far: 300,
      }}
      gl={{
        antialias: true,
        powerPreference:
          "high-performance",
      }}
      dpr={[1, 1.5]}
      onPointerMissed={() => {
        document.body.style.cursor =
          "default";
      }}
    >
      <color
        attach="background"
        args={["#000000"]}
      />

      <ambientLight
        intensity={0.035}
      />

      <AnimatedStars />

      <Globe
        target={
          exploringWorld
            ? null
            : selectedLocation
        }
      />

      <Sun
        onSelect={() => {
          onSelectWorld("sun");
        }}
      />

      <Moon
        onSelect={() => {
          onSelectWorld("moon");
        }}
      />

      <CameraIntro
        active={introStarted}
        onComplete={
          onIntroComplete
        }
      />

      <WorldCameraController
        selectedWorld={
          selectedWorld
        }
        moonPosition={
          MOON_POSITION
        }
        enabled={
          introComplete
        }
      />

      <FocusOrbitControls
        enabled={
          introComplete &&
          !exploringWorld
        }
        selected={Boolean(
          selectedLocation
        )}
      />

      <EffectComposer>
        <Bloom
          intensity={0.58}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.16}
          mipmapBlur
        />

        <Vignette
          eskil={false}
          offset={0.3}
          darkness={0.26}
          blendFunction={
            BlendFunction.NORMAL
          }
        />
      </EffectComposer>
    </Canvas>
  );
}