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

const START_POSITION =
  new THREE.Vector3(
    14,
    7,
    20
  );

const CONTROL_POSITION =
  new THREE.Vector3(
    5.8,
    3.1,
    12.2
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

const INTRO_DURATION =
  2.55;

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
  const {
    camera,
  } = useThree();

  const elapsed =
    useRef(0);

  const finished =
    useRef(false);

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

  useEffect(() => {
    if (active) {
      return;
    }

    elapsed.current = 0;
    finished.current = false;

    camera.position.copy(
      START_POSITION
    );

    camera.lookAt(
      EARTH_TARGET
    );

    camera.updateProjectionMatrix();
  }, [
    active,
    camera,
  ]);

  useFrame((_, delta) => {
    if (
      !active ||
      finished.current
    ) {
      return;
    }

    elapsed.current +=
      Math.min(
        delta,
        0.05
      );

    const rawProgress =
      Math.min(
        elapsed.current /
          INTRO_DURATION,
        1
      );

    const progress =
      easeInOutCubic(
        rawProgress
      );

    /*
      Плавная кинематографическая
      дуга по кривой Безье.
    */

    firstPart.current
      .lerpVectors(
        START_POSITION,
        CONTROL_POSITION,
        progress
      );

    secondPart.current
      .lerpVectors(
        CONTROL_POSITION,
        END_POSITION,
        progress
      );

    curvedPosition.current
      .lerpVectors(
        firstPart.current,
        secondPart.current,
        progress
      );

    /*
      Небольшой дополнительный
      подъём камеры в середине пути.
    */

    curvedPosition.current.y +=
      Math.sin(
        rawProgress *
          Math.PI
      ) *
      0.28;

    camera.position.copy(
      curvedPosition.current
    );

    /*
      Камера всё время спокойно
      смотрит на Землю.

      Это убирает рывок взгляда
      в конце интро.
    */

    lookTarget.current.set(
      0,
      Math.sin(
        rawProgress *
          Math.PI
      ) *
        0.08,
      0
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

    camera.updateProjectionMatrix();

    onComplete();
  });

  return null;
}