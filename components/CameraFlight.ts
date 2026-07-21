import * as THREE from "three";

import {
  CAMERA_DISTANCE,
  getCameraPosition,
} from "./camera/CameraMath";

export type CameraFlightData = {
  startDirection: THREE.Vector3;
  endDirection: THREE.Vector3;
  startDistance: number;
  endDistance: number;
  startedAt: number;
  duration: number;
};

export function createCameraFlight(
  currentPosition: THREE.Vector3,
  targetLat: number,
  targetLon: number,
  duration = 2600,
  targetDistance = CAMERA_DISTANCE
): CameraFlightData {
  const startDistance =
    currentPosition.length();

  const startDirection =
    currentPosition
      .clone()
      .normalize();

  const targetPosition =
    getCameraPosition(
      targetLat,
      targetLon,
      targetDistance
    );

  const endDirection =
    targetPosition
      .clone()
      .normalize();

  return {
    startDirection,
    endDirection,
    startDistance,
    endDistance: targetDistance,
    startedAt: performance.now(),
    duration,
  };
}

export function updateCameraFlight(
  flight: CameraFlightData,
  currentTime: number
) {
  const rawProgress =
    (currentTime - flight.startedAt) /
    flight.duration;

  const progress = THREE.MathUtils.clamp(
    rawProgress,
    0,
    1
  );

  const easedProgress =
    progress < 0.5
      ? 4 * progress * progress * progress
      : 1 -
        Math.pow(
          -2 * progress + 2,
          3
        ) /
          2;

  const startQuaternion =
    new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      flight.startDirection
    );

  const endQuaternion =
    new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      flight.endDirection
    );

  const currentQuaternion =
    startQuaternion.clone().slerp(
      endQuaternion,
      easedProgress
    );

  const direction =
    new THREE.Vector3(0, 0, 1)
      .applyQuaternion(currentQuaternion)
      .normalize();

  const distance =
    THREE.MathUtils.lerp(
      flight.startDistance,
      flight.endDistance,
      easedProgress
    );

  const arcHeight =
    Math.sin(progress * Math.PI) * 1.2;

  const position =
    direction.multiplyScalar(
      distance + arcHeight
    );

  return {
    position,
    progress,
    complete: progress >= 1,
  };
}