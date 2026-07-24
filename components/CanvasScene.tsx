"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

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
import FlightCamera from "./FlightCamera";
import FocusOrbitControls from "./FocusOrbitControls";
import Globe from "./Globe";
import Mars from "./Mars";
import Mercury from "./Mercury";
import Moon, {
  getMoonPosition,
} from "./Moon";
import SatelliteManager from "./SatelliteManager";
import SpaceBackground from "./SpaceBackground";
import Sun from "./Sun";
import WorldCameraController from "./WorldCameraController";

import {
  SUN_POSITION,
} from "../lib/space";

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

function SecondarySpaceObjects({
  onSelectWorld,
}: {
  onSelectWorld: (
    world: SelectedWorld
  ) => void;
}) {
  return (
    <>
      <SatelliteManager />

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

      <Mercury
        onSelect={() => {
          onSelectWorld(
            "mercury"
          );
        }}
      />

      <Mars
        onSelect={() => {
          onSelectWorld("mars");
        }}
      />
    </>
  );
}

export default function CanvasScene({
  introStarted,
  introComplete,
  selectedLocation,
  selectedWorld,
  onSelectWorld,
  onIntroComplete,
}: Props) {
  const [
    cityFlightActive,
    setCityFlightActive,
  ] = useState(false);

  const [
    secondaryObjectsReady,
    setSecondaryObjectsReady,
  ] = useState(false);

  const exploringWorld =
    selectedWorld === "sun" ||
    selectedWorld === "moon" ||
    selectedWorld ===
      "mercury" ||
    selectedWorld === "mars";

  useEffect(() => {
    if (
      selectedLocation &&
      !exploringWorld
    ) {
      return;
    }

    setCityFlightActive(false);
  }, [
    exploringWorld,
    selectedLocation,
  ]);

  useEffect(() => {
    if (!introComplete) {
      setSecondaryObjectsReady(
        false
      );

      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setSecondaryObjectsReady(
            true
          );
        },
        350
      );

    return () => {
      window.clearTimeout(timer);
    };
  }, [introComplete]);

  return (
    <Canvas
      camera={{
        position: [
          1.8,
          0.8,
          9.3,
        ],

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

      <pointLight
        position={[
          ...SUN_POSITION,
        ]}
        intensity={180}
        distance={80}
        decay={2}
        color="#fff7e6"
      />

      {/*
        Основная стартовая сцена.

        Все её элементы могут
        загружаться независимо,
        но постобработка теперь
        работает с первого кадра.
      */}

      <Suspense fallback={null}>
        <SpaceBackground />
      </Suspense>

      <Suspense fallback={null}>
        <AnimatedStars />
      </Suspense>

      <Suspense fallback={null}>
        <Globe
          target={
            exploringWorld
              ? null
              : selectedLocation
          }
        />
      </Suspense>

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
          introComplete &&
          !cityFlightActive
        }
      />

      <FlightCamera
        target={
          exploringWorld
            ? null
            : selectedLocation
        }
        enabled={
          introComplete &&
          !exploringWorld
        }
        onFlightStart={() => {
          setCityFlightActive(
            true
          );
        }}
        onFlightComplete={() => {
          setCityFlightActive(
            false
          );
        }}
      />

      <FocusOrbitControls
        enabled={
          introComplete &&
          !exploringWorld &&
          !cityFlightActive
        }
        selected={Boolean(
          selectedLocation
        )}
      />

      {/*
        Планеты и спутники всё ещё
        создаются после интро.

        Они не влияют на первый
        показ Земли.
      */}

      {secondaryObjectsReady && (
        <Suspense fallback={null}>
          <SecondarySpaceObjects
            onSelectWorld={
              onSelectWorld
            }
          />
        </Suspense>
      )}

      {/*
        ВАЖНО:

        Постобработка больше не
        включается через 350 мс.

        Она существует с самого
        первого кадра, поэтому
        яркость Земли не должна
        внезапно переключаться.
      */}

      <EffectComposer>
        <Bloom
          intensity={0.58}
          luminanceThreshold={
            0.9
          }
          luminanceSmoothing={
            0.16
          }
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