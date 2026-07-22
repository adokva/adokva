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
    12,
    6,
    17
  );

const CONTROL_POSITION =
  new THREE.Vector3(
    5.2,
    2.7,
    11
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

const INTRO_DURATION_MS =
  1750;

function easeOutCubic(
  value: number
) {
  return (
    1 -
    Math.pow(
      1 - value,
      3
    )
  );
}

export default function CameraIntro({
  active,
  onComplete,
}: Props) {
  const {
    camera,
  } = useThree();

  const startTime =
    useRef<number | null>(
      null
    );

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
    startTime.current = null;
    finished.current = false;

    camera.position.copy(
      START_POSITION
    );

    camera.lookAt(
      EARTH_TARGET
    );
  }, [
    active,
    camera,
  ]);

  useFrame(() => {
    if (
      !active ||
      finished.current
    ) {
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
      easeOutCubic(
        rawProgress
      );

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

    curvedPosition.current.y +=
      Math.sin(
        rawProgress *
          Math.PI
      ) *
      0.2;

    camera.position.copy(
      curvedPosition.current
    );

    lookTarget.current.set(
      0,
      Math.sin(
        rawProgress *
          Math.PI
      ) *
        0.05,
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

    onComplete();
  });

  return null;
}