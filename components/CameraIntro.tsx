"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import * as THREE from "three";

type Props = {
  active: boolean;
  onComplete: () => void;
};

const WELCOME_POSITION =
  new THREE.Vector3(
    1.8,
    0.8,
    9.3
  );

const INTRO_CONTROL_POSITION =
  new THREE.Vector3(
    0.9,
    0.65,
    8.55
  );

const END_POSITION =
  new THREE.Vector3(
    0,
    0,
    8
  );

const EARTH_TARGET =
  new THREE.Vector3(
    0,
    0,
    0
  );

const WELCOME_LOOK_TARGET =
  new THREE.Vector3(
    -0.65,
    0,
    0
  );

const INTRO_DURATION_MS =
  1700;

/*
  Движение специально немного
  усиливаем, чтобы сначала его
  можно было увидеть и проверить.
*/
const IDLE_POSITION_X =
  0.075;

const IDLE_POSITION_Y =
  0.045;

const IDLE_TARGET_X =
  0.06;

const IDLE_TARGET_Y =
  0.032;

const IDLE_SPEED =
  0.3;

function easeInOutCubic(
  value: number
) {
  if (value < 0.5) {
    return (
      4 *
      value *
      value *
      value
    );
  }

  return (
    1 -
    Math.pow(
      -2 * value + 2,
      3
    ) /
      2
  );
}

export default function CameraIntro({
  active,
  onComplete,
}: Props) {
  const { camera } =
    useThree();

  const startTime =
    useRef<number | null>(
      null
    );

  const finished =
    useRef(false);

  const introStartPosition =
    useRef(
      new THREE.Vector3()
    );

  const firstPart =
    useRef(
      new THREE.Vector3()
    );

  const secondPart =
    useRef(
      new THREE.Vector3()
    );

  const curvedPosition =
    useRef(
      new THREE.Vector3()
    );

  const lookTarget =
    useRef(
      new THREE.Vector3()
    );

  const idlePosition =
    useRef(
      new THREE.Vector3()
    );

  const idleTarget =
    useRef(
      new THREE.Vector3()
    );

  useEffect(() => {
    startTime.current = null;
    finished.current = false;

    if (!active) {
      camera.position.copy(
        WELCOME_POSITION
      );

      camera.lookAt(
        WELCOME_LOOK_TARGET
      );

      return;
    }

    introStartPosition.current.copy(
      camera.position
    );
  }, [
    active,
    camera,
  ]);

  useFrame((state) => {
    /*
      Пока кнопка не нажата,
      камера медленно живёт.
    */
    if (!active) {
      const time =
        state.clock.elapsedTime *
        IDLE_SPEED;

      idlePosition.current.copy(
        WELCOME_POSITION
      );

      idlePosition.current.x +=
        Math.sin(time) *
        IDLE_POSITION_X;

      idlePosition.current.y +=
        Math.sin(
          time * 0.71 + 1.1
        ) * IDLE_POSITION_Y;

      idleTarget.current.copy(
        WELCOME_LOOK_TARGET
      );

      idleTarget.current.x +=
        Math.sin(
          time * 0.63 + 0.4
        ) * IDLE_TARGET_X;

      idleTarget.current.y +=
        Math.sin(
          time * 0.49 + 1.8
        ) * IDLE_TARGET_Y;

      camera.position.copy(
        idlePosition.current
      );

      camera.lookAt(
        idleTarget.current
      );

      return;
    }

    if (finished.current) {
      return;
    }

    const currentTime =
      performance.now();

    if (
      startTime.current ===
      null
    ) {
      startTime.current =
        currentTime;

      /*
        Полёт начинается точно
        из текущего живого кадра.
        Никакого скачка камеры.
      */
      introStartPosition.current.copy(
        camera.position
      );
    }

    const elapsedTime =
      currentTime -
      startTime.current;

    const rawProgress =
      Math.min(
        elapsedTime /
          INTRO_DURATION_MS,
        1
      );

    const progress =
      easeInOutCubic(
        rawProgress
      );

    firstPart.current.lerpVectors(
      introStartPosition.current,
      INTRO_CONTROL_POSITION,
      progress
    );

    secondPart.current.lerpVectors(
      INTRO_CONTROL_POSITION,
      END_POSITION,
      progress
    );

    curvedPosition.current.lerpVectors(
      firstPart.current,
      secondPart.current,
      progress
    );

    curvedPosition.current.y +=
      Math.sin(
        rawProgress *
          Math.PI
      ) * 0.12;

    camera.position.copy(
      curvedPosition.current
    );

    lookTarget.current.lerpVectors(
      idleTarget.current,
      EARTH_TARGET,
      progress
    );

    camera.lookAt(
      lookTarget.current
    );

    if (rawProgress < 1) {
      return;
    }

    finished.current = true;

    camera.position.copy(
      END_POSITION
    );

    camera.lookAt(
      EARTH_TARGET
    );

    onComplete();
  });

  return null;
}