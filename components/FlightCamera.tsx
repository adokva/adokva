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

import {
  clamp01,
  easeInOutCubic,
  easeInOutSine,
  easeOutCubic,
} from "./CameraEasing";

export type FlightTarget = {
  lat: number;
  lon: number;
} | null;

type Props = {
  target: FlightTarget;
  enabled: boolean;
  onFlightStart?: () => void;
  onFlightComplete?: () => void;
};

const EARTH_CENTER =
  new THREE.Vector3(0, 0, 0);

const WORLD_NORTH =
  new THREE.Vector3(0, 1, 0);

const FALLBACK_UP =
  new THREE.Vector3(0, 0, 1);

const SECOND_FALLBACK_UP =
  new THREE.Vector3(1, 0, 0);

const EARTH_RADIUS = 2;

const DEFAULT_CAMERA_DISTANCE = 8;

const FOCUSED_CAMERA_DISTANCE =
  6.25;

const MINIMUM_SAFE_DISTANCE =
  EARTH_RADIUS * 2.4;

const FLIGHT_DURATION = 3.25;

const MAX_ARC_HEIGHT = 2.15;

const DEG_TO_RAD =
  Math.PI / 180;

function latLonToVector3(
  lat: number,
  lon: number,
  radius: number
) {
  const phi =
    (90 - lat) * DEG_TO_RAD;

  const theta =
    (lon + 180) * DEG_TO_RAD;

  return new THREE.Vector3(
    -radius *
      Math.sin(phi) *
      Math.cos(theta),

    radius *
      Math.cos(phi),

    radius *
      Math.sin(phi) *
      Math.sin(theta)
  );
}

function isSameTarget(
  first: FlightTarget,
  second: FlightTarget
) {
  if (
    first === null ||
    second === null
  ) {
    return first === second;
  }

  return (
    Math.abs(
      first.lat - second.lat
    ) < 0.0001 &&
    Math.abs(
      first.lon - second.lon
    ) < 0.0001
  );
}

function slerpDirection(
  start: THREE.Vector3,
  end: THREE.Vector3,
  progress: number,
  result: THREE.Vector3
) {
  const clampedProgress =
    clamp01(progress);

  const dot =
    THREE.MathUtils.clamp(
      start.dot(end),
      -1,
      1
    );

  if (dot > 0.9995) {
    result
      .copy(start)
      .lerp(
        end,
        clampedProgress
      )
      .normalize();

    return result;
  }

  if (dot < -0.9995) {
    const fallbackAxis =
      Math.abs(start.y) < 0.9
        ? new THREE.Vector3(
            0,
            1,
            0
          )
        : new THREE.Vector3(
            1,
            0,
            0
          );

    const rotationAxis =
      fallbackAxis
        .cross(start)
        .normalize();

    result
      .copy(start)
      .applyAxisAngle(
        rotationAxis,
        Math.PI *
          clampedProgress
      )
      .normalize();

    return result;
  }

  const angle =
    Math.acos(dot);

  const sinAngle =
    Math.sin(angle);

  const startWeight =
    Math.sin(
      (1 - clampedProgress) *
        angle
    ) / sinAngle;

  const endWeight =
    Math.sin(
      clampedProgress *
        angle
    ) / sinAngle;

  result
    .copy(start)
    .multiplyScalar(
      startWeight
    )
    .addScaledVector(
      end,
      endWeight
    )
    .normalize();

  return result;
}

function stabilizeCameraOrientation(
  camera: THREE.Camera,
  viewDirection: THREE.Vector3,
  stableUp: THREE.Vector3
) {
  viewDirection
    .copy(EARTH_CENTER)
    .sub(camera.position);

  if (
    viewDirection.lengthSq() <
    0.000001
  ) {
    return;
  }

  viewDirection.normalize();

  stableUp
    .copy(WORLD_NORTH)
    .addScaledVector(
      viewDirection,
      -WORLD_NORTH.dot(
        viewDirection
      )
    );

  if (
    stableUp.lengthSq() <
    0.000001
  ) {
    stableUp
      .copy(FALLBACK_UP)
      .addScaledVector(
        viewDirection,
        -FALLBACK_UP.dot(
          viewDirection
        )
      );
  }

  if (
    stableUp.lengthSq() <
    0.000001
  ) {
    stableUp
      .copy(
        SECOND_FALLBACK_UP
      )
      .addScaledVector(
        viewDirection,
        -SECOND_FALLBACK_UP.dot(
          viewDirection
        )
      );
  }

  stableUp.normalize();

  camera.up.copy(stableUp);

  camera.lookAt(
    EARTH_CENTER
  );
}

export default function FlightCamera({
  target,
  enabled,
  onFlightStart,
  onFlightComplete,
}: Props) {
  const { camera } =
    useThree();

  const active =
    useRef(false);

  const elapsed =
    useRef(0);

  const previousTarget =
    useRef<FlightTarget>(null);

  const startPosition =
    useRef(
      new THREE.Vector3()
    );

  const endPosition =
    useRef(
      new THREE.Vector3()
    );

  const startDirection =
    useRef(
      new THREE.Vector3()
    );

  const endDirection =
    useRef(
      new THREE.Vector3()
    );

  const workingDirection =
    useRef(
      new THREE.Vector3()
    );

  const workingPosition =
    useRef(
      new THREE.Vector3()
    );

  const cameraViewDirection =
    useRef(
      new THREE.Vector3()
    );

  const cameraStableUp =
    useRef(
      new THREE.Vector3()
    );

  const startDistance =
    useRef(
      DEFAULT_CAMERA_DISTANCE
    );

  const endDistance =
    useRef(
      FOCUSED_CAMERA_DISTANCE
    );

  const angularDistance =
    useRef(0);

  const onFlightStartRef =
    useRef(onFlightStart);

  const onFlightCompleteRef =
    useRef(onFlightComplete);

  useEffect(() => {
    onFlightStartRef.current =
      onFlightStart;
  }, [onFlightStart]);

  useEffect(() => {
    onFlightCompleteRef.current =
      onFlightComplete;
  }, [onFlightComplete]);

  useEffect(() => {
    if (!enabled) {
      active.current = false;

      previousTarget.current =
        null;

      return;
    }

    if (
      isSameTarget(
        previousTarget.current,
        target
      )
    ) {
      return;
    }

    previousTarget.current =
      target;

    if (!target) {
      active.current = false;
      return;
    }

    startPosition.current.copy(
      camera.position
    );

    startDistance.current =
      Math.max(
        startPosition.current.distanceTo(
          EARTH_CENTER
        ),
        MINIMUM_SAFE_DISTANCE
      );

    startDirection.current
      .copy(
        startPosition.current
      )
      .sub(EARTH_CENTER);

    if (
      startDirection.current
        .lengthSq() < 0.0001
    ) {
      startDirection.current.set(
        0,
        0,
        1
      );
    }

    startDirection.current.normalize();

    endDirection.current
      .copy(
        latLonToVector3(
          target.lat,
          target.lon,
          1
        )
      )
      .normalize();

    angularDistance.current =
      Math.acos(
        THREE.MathUtils.clamp(
          startDirection.current.dot(
            endDirection.current
          ),
          -1,
          1
        )
      );

    endDistance.current =
      FOCUSED_CAMERA_DISTANCE;

    endPosition.current
      .copy(
        endDirection.current
      )
      .multiplyScalar(
        endDistance.current
      );

    elapsed.current = 0;

    active.current = true;

    onFlightStartRef.current?.();
  }, [
    camera,
    enabled,
    target,
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

    const progress =
      clamp01(
        elapsed.current /
          FLIGHT_DURATION
      );

    const rotationProgress =
      easeInOutCubic(progress);

    const distanceProgress =
      easeInOutSine(progress);

    slerpDirection(
      startDirection.current,
      endDirection.current,
      rotationProgress,
      workingDirection.current
    );

    const baseDistance =
      THREE.MathUtils.lerp(
        startDistance.current,
        endDistance.current,
        distanceProgress
      );

    const routeFactor =
      THREE.MathUtils.clamp(
        angularDistance.current /
          Math.PI,
        0.2,
        1
      );

    const arcEnvelope =
      Math.sin(
        progress * Math.PI
      );

    const launchBoost =
      easeOutCubic(
        Math.min(
          progress / 0.35,
          1
        )
      );

    const arrivalSoftening =
      1 -
      easeOutCubic(
        Math.max(
          (progress - 0.68) /
            0.32,
          0
        )
      );

    const arcHeight =
      arcEnvelope *
      launchBoost *
      arrivalSoftening *
      MAX_ARC_HEIGHT *
      routeFactor;

    const currentDistance =
      Math.max(
        baseDistance +
          arcHeight,
        MINIMUM_SAFE_DISTANCE
      );

    workingPosition.current
      .copy(
        workingDirection.current
      )
      .multiplyScalar(
        currentDistance
      );

    camera.position.copy(
      workingPosition.current
    );

    stabilizeCameraOrientation(
      camera,
      cameraViewDirection.current,
      cameraStableUp.current
    );

    if (progress < 1) {
      return;
    }

    camera.position.copy(
      endPosition.current
    );

    stabilizeCameraOrientation(
      camera,
      cameraViewDirection.current,
      cameraStableUp.current
    );

    active.current = false;

    onFlightCompleteRef.current?.();
  });

  return null;
}