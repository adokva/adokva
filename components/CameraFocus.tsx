"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  enabled: boolean;
  selected: boolean;
};

const DEFAULT_CAMERA_POSITION =
  new THREE.Vector3(0, 0, 8);

const FOCUSED_CAMERA_POSITION =
  new THREE.Vector3(0, 0, 5.35);

const LOOK_TARGET =
  new THREE.Vector3(0, 0, 0);

export default function CameraFocus({
  enabled,
  selected,
}: Props) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!enabled) return;

    const targetPosition =
      selected
        ? FOCUSED_CAMERA_POSITION
        : DEFAULT_CAMERA_POSITION;

    const smoothness =
      1 - Math.exp(-delta * 2.8);

    camera.position.lerp(
      targetPosition,
      smoothness
    );

    camera.lookAt(LOOK_TARGET);
  });

  return null;
}