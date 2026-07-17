"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  active: boolean;
  onComplete: () => void;
};

const START_POSITION = new THREE.Vector3(
  14,
  7,
  20
);

const CONTROL_POSITION = new THREE.Vector3(
  8,
  4.5,
  12
);

const END_POSITION = new THREE.Vector3(
  0,
  0,
  8
);

const EARTH_TARGET = new THREE.Vector3(
  0,
  0,
  0
);

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

export default function CameraIntro({
  active,
  onComplete,
}: Props) {
  const { camera } = useThree();

  const elapsed = useRef(0);
  const finished = useRef(false);

  useEffect(() => {
    if (!active) {
      elapsed.current = 0;
      finished.current = false;

      camera.position.copy(
        START_POSITION
      );

      camera.lookAt(EARTH_TARGET);

      camera.updateProjectionMatrix();
    }
  }, [active, camera]);

  useFrame((_, delta) => {
    if (!active || finished.current) {
      return;
    }

    elapsed.current += delta;

    const duration = 3.6;

    const rawProgress = Math.min(
      elapsed.current / duration,
      1
    );

    const progress =
      easeOutCubic(rawProgress);

    const firstPart =
      START_POSITION
        .clone()
        .lerp(
          CONTROL_POSITION,
          progress
        );

    const secondPart =
      CONTROL_POSITION
        .clone()
        .lerp(
          END_POSITION,
          progress
        );

    const curvedPosition =
      firstPart.lerp(
        secondPart,
        progress
      );

    camera.position.copy(
      curvedPosition
    );

    const targetLift =
      Math.sin(progress * Math.PI) *
      0.35;

    camera.lookAt(
      EARTH_TARGET.x,
      EARTH_TARGET.y + targetLift,
      EARTH_TARGET.z
    );

    if (
      rawProgress >= 1 &&
      !finished.current
    ) {
      finished.current = true;

      camera.position.copy(
        END_POSITION
      );

      camera.lookAt(EARTH_TARGET);

      onComplete();
    }
  });

  return null;
}