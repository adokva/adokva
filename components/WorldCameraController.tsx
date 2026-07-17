"use client";

import {
  useEffect,
  useMemo,
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
};

const EARTH_POSITION =
  new THREE.Vector3(0, 0, 0);

const EARTH_CAMERA_POSITION =
  new THREE.Vector3(0, 0, 8);

/*
  Приблизительный визуальный радиус объектов.

  Значения используются только для расчёта
  безопасной дистанции камеры.
*/
const MOON_VISUAL_RADIUS = 0.72;
const SUN_VISUAL_RADIUS = 1.2;

/*
  Объект занимает не весь экран,
  поэтому оставляем свободное пространство
  вокруг него.
*/
const MOON_FRAME_PADDING = 1.55;
const SUN_FRAME_PADDING = 1.5;

const EARTH_FLIGHT_DURATION = 2.15;
const WORLD_FLIGHT_DURATION = 2.75;

const clamp01 = (
  value: number
) =>
  Math.min(
    Math.max(value, 0),
    1
  );

const easeInOutCubic = (
  value: number
) => {
  const progress =
    clamp01(value);

  if (progress < 0.5) {
    return (
      4 *
      progress *
      progress *
      progress
    );
  }

  return (
    1 -
    Math.pow(
      -2 * progress + 2,
      3
    ) /
      2
  );
};

function calculateCameraDistance(
  camera: THREE.Camera,
  radius: number,
  padding: number
) {
  if (
    !(
      camera instanceof
      THREE.PerspectiveCamera
    )
  ) {
    return radius * 4;
  }

  const verticalFov =
    THREE.MathUtils.degToRad(
      camera.fov
    );

  const horizontalFov =
    2 *
    Math.atan(
      Math.tan(
        verticalFov / 2
      ) * camera.aspect
    );

  /*
    На узком мобильном экране
    горизонтальный угол меньше вертикального.

    Используем меньший угол,
    чтобы объект всегда помещался целиком.
  */
  const limitingFov =
    Math.min(
      verticalFov,
      horizontalFov
    );

  const framedRadius =
    radius * padding;

  const distance =
    framedRadius /
    Math.sin(
      limitingFov / 2
    );

  return Math.max(
    distance,
    radius * 2.35
  );
}

export default function WorldCameraController({
  selectedWorld,
  moonPosition,
  enabled,
}: Props) {
  const {
    camera,
    size,
  } = useThree();

  const active =
    useRef(false);

  const elapsed =
    useRef(0);

  const startPosition =
    useRef(
      new THREE.Vector3()
    );

  const endPosition =
    useRef(
      new THREE.Vector3()
    );

  const startLookTarget =
    useRef(
      new THREE.Vector3()
    );

  const endLookTarget =
    useRef(
      new THREE.Vector3()
    );

  const currentLookTarget =
    useRef(
      new THREE.Vector3(
        0,
        0,
        0
      )
    );

  const previousWorld =
    useRef<SelectedWorld>(
      null
    );

  const selectedWorldRef =
    useRef<SelectedWorld>(
      selectedWorld
    );

  const flightDirection =
    useRef(
      new THREE.Vector3(
        0,
        0,
        1
      )
    );

  const arcUp =
    useRef(
      new THREE.Vector3(
        0,
        1,
        0
      )
    );

  const arcSide =
    useRef(
      new THREE.Vector3(
        1,
        0,
        0
      )
    );

  const workingPosition =
    useRef(
      new THREE.Vector3()
    );

  const sunPosition =
    useMemo(
      () =>
        new THREE.Vector3(
          SUN_POSITION[0],
          SUN_POSITION[1],
          SUN_POSITION[2]
        ),
      []
    );

  useEffect(() => {
    if (!enabled) {
      active.current = false;
      previousWorld.current = null;

      return;
    }

    if (
      previousWorld.current ===
      selectedWorld
    ) {
      return;
    }

    previousWorld.current =
      selectedWorld;

    selectedWorldRef.current =
      selectedWorld;

    startPosition.current.copy(
      camera.position
    );

    startLookTarget.current.copy(
      currentLookTarget.current
    );

    const worldPosition =
      new THREE.Vector3();

    let worldRadius = 0;
    let framePadding = 1;

    if (selectedWorld === "sun") {
      worldPosition.copy(
        sunPosition
      );

      worldRadius =
        SUN_VISUAL_RADIUS;

      framePadding =
        SUN_FRAME_PADDING;
    } else if (
      selectedWorld === "moon"
    ) {
      worldPosition.set(
        moonPosition[0],
        moonPosition[1],
        moonPosition[2]
      );

      worldRadius =
        MOON_VISUAL_RADIUS;

      framePadding =
        MOON_FRAME_PADDING;
    } else {
      endLookTarget.current.copy(
        EARTH_POSITION
      );

      endPosition.current.copy(
        EARTH_CAMERA_POSITION
      );

      flightDirection.current
        .copy(
          endPosition.current
        )
        .sub(
          startPosition.current
        )
        .normalize();

      arcUp.current.set(
        0,
        1,
        0
      );

      arcSide.current
        .crossVectors(
          flightDirection.current,
          arcUp.current
        )
        .normalize();

      if (
        arcSide.current
          .lengthSq() <
        0.0001
      ) {
        arcSide.current.set(
          1,
          0,
          0
        );
      }

      elapsed.current = 0;
      active.current = true;

      return;
    }

    endLookTarget.current.copy(
      worldPosition
    );

    /*
      Камера подходит к объекту
      по направлению от объекта к Земле.

      Благодаря этому Луна и Солнце
      остаются обращены к камере
      предсказуемой стороной.
    */
    const approachDirection =
      EARTH_POSITION
        .clone()
        .sub(
          worldPosition
        );

    if (
      approachDirection
        .lengthSq() <
      0.0001
    ) {
      approachDirection.set(
        0,
        0,
        1
      );
    }

    approachDirection.normalize();

    const cameraDistance =
      calculateCameraDistance(
        camera,
        worldRadius,
        framePadding
      );

    endPosition.current
      .copy(
        worldPosition
      )
      .addScaledVector(
        approachDirection,
        cameraDistance
      );

    /*
      Конечная позиция не получает
      никаких дополнительных смещений.

      Поэтому центр экрана совпадает
      с центром Луны или Солнца.
    */
    flightDirection.current
      .copy(
        endPosition.current
      )
      .sub(
        startPosition.current
      );

    if (
      flightDirection.current
        .lengthSq() >
      0.0001
    ) {
      flightDirection.current
        .normalize();
    } else {
      flightDirection.current.set(
        0,
        0,
        1
      );
    }

    /*
      Векторы кинематографической дуги
      перпендикулярны направлению полёта.

      Дуга действует только в середине
      анимации и полностью исчезает
      в конечной точке.
    */
    arcSide.current
      .crossVectors(
        flightDirection.current,
        new THREE.Vector3(
          0,
          1,
          0
        )
      );

    if (
      arcSide.current
        .lengthSq() <
      0.0001
    ) {
      arcSide.current.set(
        1,
        0,
        0
      );
    } else {
      arcSide.current.normalize();
    }

    arcUp.current
      .crossVectors(
        arcSide.current,
        flightDirection.current
      )
      .normalize();

    if (
      arcUp.current.y < 0
    ) {
      arcUp.current
        .multiplyScalar(-1);
    }

    elapsed.current = 0;
    active.current = true;
  }, [
    camera,
    enabled,
    moonPosition,
    selectedWorld,
    size.height,
    size.width,
    sunPosition,
  ]);

  useFrame((_, delta) => {
    if (
      !enabled ||
      !active.current
    ) {
      return;
    }

    elapsed.current +=
      Math.min(delta, 0.05);

    const currentWorld =
      selectedWorldRef.current;

    const duration =
      currentWorld === "earth"
        ? EARTH_FLIGHT_DURATION
        : WORLD_FLIGHT_DURATION;

    const progress =
      clamp01(
        elapsed.current /
          duration
      );

    const eased =
      easeInOutCubic(
        progress
      );

    workingPosition.current
      .lerpVectors(
        startPosition.current,
        endPosition.current,
        eased
      );

    const arcStrength =
      Math.sin(
        progress *
          Math.PI
      );

    /*
      Полёт к объектам получает
      более заметную дугу.

      Возвращение к Земле остаётся
      спокойным и плавным.
    */
    const verticalArc =
      currentWorld === "earth"
        ? 0.45
        : 0.8;

    const sideArc =
      currentWorld === "earth"
        ? 0.12
        : 0.24;

    workingPosition.current
      .addScaledVector(
        arcUp.current,
        arcStrength *
          verticalArc
      )
      .addScaledVector(
        arcSide.current,
        arcStrength *
          sideArc
      );

    camera.position.copy(
      workingPosition.current
    );

    currentLookTarget.current
      .lerpVectors(
        startLookTarget.current,
        endLookTarget.current,
        eased
      );

    camera.lookAt(
      currentLookTarget.current
    );

    if (progress >= 1) {
      camera.position.copy(
        endPosition.current
      );

      currentLookTarget.current.copy(
        endLookTarget.current
      );

      camera.lookAt(
        endLookTarget.current
      );

      active.current = false;
    }
  });

  return null;
}