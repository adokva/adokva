"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Canvas,
  useFrame,
  useThree,
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

type SceneDiagnosticsProps = {
  introStarted: boolean;
  introComplete: boolean;
};

const MOON_POSITION =
  getMoonPosition();

const DIAGNOSTIC_DURATION =
  4000;

function SceneDiagnostics({
  introStarted,
  introComplete,
}: SceneDiagnosticsProps) {
  const {
    gl,
    scene,
    camera,
  } = useThree();

  const firstFrameLogged =
    useRef(false);

  const introStartedAt =
    useRef<number | null>(
      null
    );

  const measuring =
    useRef(false);

  const measurementStart =
    useRef(0);

  const frameCount =
    useRef(0);

  const totalFrameTime =
    useRef(0);

  const maximumFrameTime =
    useRef(0);

  const slowFrames =
    useRef(0);

  const verySlowFrames =
    useRef(0);

  const reportPrinted =
    useRef(false);

  useEffect(() => {
    console.log(
      "[ADOKVA] Диагностика сцены подключена"
    );

    console.log(
      "[ADOKVA] WebGL renderer:",
      gl.info
    );

    return () => {
      console.log(
        "[ADOKVA] Диагностика сцены отключена"
      );
    };
  }, [gl]);

  useEffect(() => {
    if (!introStarted) {
      return;
    }

    const now =
      performance.now();

    introStartedAt.current =
      now;

    measuring.current =
      true;

    measurementStart.current =
      now;

    frameCount.current =
      0;

    totalFrameTime.current =
      0;

    maximumFrameTime.current =
      0;

    slowFrames.current =
      0;

    verySlowFrames.current =
      0;

    reportPrinted.current =
      false;

    console.log(
      "[ADOKVA] Нажата кнопка «Начать путешествие»"
    );

    console.log(
      "[ADOKVA] Начинаю измерять первые 4 секунды"
    );
  }, [introStarted]);

  useEffect(() => {
    if (!introComplete) {
      return;
    }

    if (
      introStartedAt.current ===
      null
    ) {
      return;
    }

    const introDuration =
      performance.now() -
      introStartedAt.current;

    console.log(
      `[ADOKVA] Интро завершено через ${introDuration.toFixed(
        1
      )} мс`
    );
  }, [introComplete]);

  useFrame((_, delta) => {
    const now =
      performance.now();

    if (
      !firstFrameLogged.current
    ) {
      firstFrameLogged.current =
        true;

      console.log(
        "[ADOKVA] Первый WebGL-кадр показан"
      );

      console.log(
        "[ADOKVA] Начальные данные:",
        {
          calls:
            gl.info.render.calls,

          triangles:
            gl.info.render
              .triangles,

          points:
            gl.info.render.points,

          geometries:
            gl.info.memory
              .geometries,

          textures:
            gl.info.memory
              .textures,

          programs:
            gl.info.programs
              ?.length ?? 0,

          sceneChildren:
            scene.children.length,

          cameraPosition: {
            x:
              camera.position.x,

            y:
              camera.position.y,

            z:
              camera.position.z,
          },
        }
      );
    }

    if (
      !measuring.current ||
      reportPrinted.current
    ) {
      return;
    }

    const frameTime =
      delta * 1000;

    frameCount.current += 1;

    totalFrameTime.current +=
      frameTime;

    maximumFrameTime.current =
      Math.max(
        maximumFrameTime.current,
        frameTime
      );

    if (frameTime > 33.4) {
      slowFrames.current += 1;
    }

    if (frameTime > 80) {
      verySlowFrames.current +=
        1;
    }

    if (
      introStartedAt.current !==
        null &&
      frameCount.current === 1
    ) {
      const firstIntroFrame =
        now -
        introStartedAt.current;

      console.log(
        `[ADOKVA] Первый кадр после нажатия появился через ${firstIntroFrame.toFixed(
          1
        )} мс`
      );
    }

    const elapsed =
      now -
      measurementStart.current;

    if (
      elapsed <
      DIAGNOSTIC_DURATION
    ) {
      return;
    }

    reportPrinted.current =
      true;

    measuring.current =
      false;

    const seconds =
      elapsed / 1000;

    const averageFps =
      frameCount.current /
      seconds;

    const averageFrameTime =
      frameCount.current > 0
        ? totalFrameTime.current /
          frameCount.current
        : 0;

    console.group(
      "[ADOKVA] Результат диагностики"
    );

    console.log(
      "Период измерения:",
      `${elapsed.toFixed(
        1
      )} мс`
    );

    console.log(
      "Количество кадров:",
      frameCount.current
    );

    console.log(
      "Средний FPS:",
      averageFps.toFixed(1)
    );

    console.log(
      "Среднее время кадра:",
      `${averageFrameTime.toFixed(
        2
      )} мс`
    );

    console.log(
      "Самый тяжёлый кадр:",
      `${maximumFrameTime.current.toFixed(
        2
      )} мс`
    );

    console.log(
      "Кадров дольше 33 мс:",
      slowFrames.current
    );

    console.log(
      "Кадров дольше 80 мс:",
      verySlowFrames.current
    );

    console.log(
      "WebGL:",
      {
        calls:
          gl.info.render.calls,

        triangles:
          gl.info.render
            .triangles,

        points:
          gl.info.render.points,

        lines:
          gl.info.render.lines,

        geometries:
          gl.info.memory
            .geometries,

        textures:
          gl.info.memory
            .textures,

        programs:
          gl.info.programs
            ?.length ?? 0,
      }
    );

    console.log(
      "Камера:",
      {
        x:
          camera.position.x,

        y:
          camera.position.y,

        z:
          camera.position.z,
      }
    );

    console.groupEnd();
  });

  return null;
}

export default function CanvasScene({
  introStarted,
  introComplete,
  selectedLocation,
  selectedWorld,
  onSelectWorld,
  onIntroComplete,
}: Props) {
  const componentStartedAt =
    useRef(
      typeof performance !==
        "undefined"
        ? performance.now()
        : 0
    );

  const [
    cityFlightActive,
    setCityFlightActive,
  ] = useState(false);

  const exploringWorld =
    selectedWorld === "sun" ||
    selectedWorld === "moon";

  useEffect(() => {
    if (
      selectedLocation &&
      !exploringWorld
    ) {
      return;
    }

    setCityFlightActive(
      false
    );
  }, [
    exploringWorld,
    selectedLocation,
  ]);

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
      onCreated={() => {
        const creationTime =
          performance.now() -
          componentStartedAt.current;

        console.log(
          `[ADOKVA] Canvas создан через ${creationTime.toFixed(
            1
          )} мс`
        );
      }}
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

      <SceneDiagnostics
        introStarted={
          introStarted
        }
        introComplete={
          introComplete
        }
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
          onSelectWorld(
            "sun"
          );
        }}
      />

      <Moon
        onSelect={() => {
          onSelectWorld(
            "moon"
          );
        }}
      />

      <CameraIntro
        active={
          introStarted
        }
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