"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type CameraV2Target = {
  lat: number;
  lon: number;
} | null;

type Props = {
  target: CameraV2Target;
  enabled: boolean;
  onFlightStart?: () => void;
  onFlightComplete?: () => void;
};

const EARTH_CENTER = new THREE.Vector3(
  0,
  0,
  0
);

const WORLD_NORTH = new THREE.Vector3(
  0,
  1,
  0
);

const DEG_TO_RAD =
  Math.PI / 180;

function latLonToDirection(
  lat: number,
  lon: number
) {
  const phi =
    (90 - lat) * DEG_TO_RAD;

  const theta =
    (lon + 180) * DEG_TO_RAD;

  return new THREE.Vector3(
    -Math.sin(phi) *
      Math.cos(theta),

    Math.cos(phi),

    Math.sin(phi) *
      Math.sin(theta)
  ).normalize();
}

export default function CameraV2({
  target,
  enabled,
  onFlightStart,
  onFlightComplete,
}: Props) {
  const cameraRef =
    useRef<THREE.PerspectiveCamera>(
      null
    );

  const targetPosition =
    useMemo(
      () =>
        new THREE.Vector3(
          0,
          0,
          5
        ),
      []
    );

  const targetDirection =
    useRef(
      new THREE.Vector3(
        0,
        0,
        1
      )
    );

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
    if (!target) {
      return;
    }

    targetDirection.current.copy(
      latLonToDirection(
        target.lat,
        target.lon
      )
    );
  }, [target]);

  useFrame(() => {
    const camera =
      cameraRef.current;

    if (!camera || !enabled) {
      return;
    }

    camera.position.copy(
      targetPosition
    );

    camera.up.copy(
      WORLD_NORTH
    );

    camera.lookAt(
      EARTH_CENTER
    );
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault={false}
      position={[0, 0, 5]}
      fov={45}
    />
  );
}