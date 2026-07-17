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

import type {
  SelectedWorld,
} from "../types/world";

import {
  SUN_POSITION,
} from "../lib/space";

type Props = {
  selectedWorld: SelectedWorld;

  moonPosition: [
    number,
    number,
    number,
  ];

  enabled: boolean;

  onFlightChange?: (
    flying: boolean
  ) => void;
};

const EARTH_CAMERA_POSITION =
  new THREE.Vector3(
    0,
    0,
    8
  );

export default function WorldCameraController({
  selectedWorld,
  moonPosition,
  enabled,
  onFlightChange,
}: Props) {
  const { camera } = useThree();

  const startPosition =
    useRef(
      new THREE.Vector3()
    );

  const endPosition =
    useRef(
      new THREE.Vector3()
    );

  const lookTarget =
    useRef(
      new THREE.Vector3()
    );

  const startTarget =
    useRef(
      new THREE.Vector3()
    );

  const currentTarget =
    useRef(
      new THREE.Vector3()
    );

  const elapsed =
    useRef(0);

  const flying =
    useRef(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    startPosition.current.copy(
      camera.position
    );

    startTarget.current.copy(
      currentTarget.current
    );

    if (
      selectedWorld === "sun"
    ) {
      const sun =
        new THREE.Vector3(
          SUN_POSITION[0],
          SUN_POSITION[1],
          SUN_POSITION[2]
        );

      lookTarget.current.copy(sun);

      /*
        Камера останавливается
        перед Солнцем.

        Она никогда не входит
        внутрь солнечной сферы
        и её огромных спрайтов.
      */

      const direction =
        camera.position
          .clone()
          .sub(sun)
          .normalize();

      endPosition.current.copy(
        sun
          .clone()
          .add(
            direction.multiplyScalar(
              3.2
            )
          )
      );
    } else if (
      selectedWorld === "moon"
    ) {
      const moon =
        new THREE.Vector3(
          moonPosition[0],
          moonPosition[1],
          moonPosition[2]
        );

      lookTarget.current.copy(moon);

      const direction =
        camera.position
          .clone()
          .sub(moon)
          .normalize();

      endPosition.current.copy(
        moon
          .clone()
          .add(
            direction.multiplyScalar(
              2.2
            )
          )
      );
    } else {
      /*
        Возвращение домой.
      */

      lookTarget.current.set(
        0,
        0,
        0
      );

      endPosition.current.copy(
        EARTH_CAMERA_POSITION
      );
    }

    elapsed.current = 0;

    flying.current = true;

    onFlightChange?.(true);
  }, [
    camera,
    enabled,
    moonPosition,
    onFlightChange,
    selectedWorld,
  ]);

  useFrame((_, delta) => {
    if (
      !enabled ||
      !flying.current
    ) {
      return;
    }

    elapsed.current += delta;

    const duration = 2.4;

    const progress =
      Math.min(
        elapsed.current /
          duration,
        1
      );

    /*
      Плавная кинематографическая
      кривая движения.
    */

    const eased =
      progress < 0.5
        ? 4 *
          progress *
          progress *
          progress
        : 1 -
          Math.pow(
            -2 * progress + 2,
            3
          ) /
            2;

    const basePosition =
      new THREE.Vector3()
        .lerpVectors(
          startPosition.current,
          endPosition.current,
          eased
        );

    /*
      Небольшая дуга полёта.

      Камера не летит к объекту
      по скучной прямой линии.
    */

    const arc =
      Math.sin(
        progress * Math.PI
      ) * 1.15;

    basePosition.y += arc;

    camera.position.copy(
      basePosition
    );

    currentTarget.current
      .lerpVectors(
        startTarget.current,
        lookTarget.current,
        eased
      );

    camera.lookAt(
      currentTarget.current
    );

    if (progress >= 1) {
      camera.position.copy(
        endPosition.current
      );

      currentTarget.current.copy(
        lookTarget.current
      );

      camera.lookAt(
        lookTarget.current
      );

      flying.current = false;

      onFlightChange?.(false);
    }
  });

  return null;
}