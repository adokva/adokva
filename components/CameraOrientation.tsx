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
};

const EARTH_CENTER =
  new THREE.Vector3(
    0,
    0,
    0
  );

const WORLD_NORTH =
  new THREE.Vector3(
    0,
    1,
    0
  );

const FALLBACK_UP =
  new THREE.Vector3(
    0,
    0,
    1
  );

export default function CameraOrientation({
  active,
}: Props) {
  const {
    camera,
  } = useThree();

  const cameraDirection =
    useRef(
      new THREE.Vector3()
    );

  const correctedUp =
    useRef(
      new THREE.Vector3()
    );

  useEffect(() => {
    if (!active) {
      return;
    }

    cameraDirection.current
      .copy(camera.position)
      .sub(EARTH_CENTER)
      .normalize();

    correctedUp.current
      .copy(WORLD_NORTH)
      .addScaledVector(
        cameraDirection.current,
        -WORLD_NORTH.dot(
          cameraDirection.current
        )
      );

    if (
      correctedUp.current
        .lengthSq() <
      0.0001
    ) {
      correctedUp.current
        .copy(FALLBACK_UP)
        .addScaledVector(
          cameraDirection.current,
          -FALLBACK_UP.dot(
            cameraDirection.current
          )
        );
    }

    correctedUp.current.normalize();

    camera.up.copy(
      correctedUp.current
    );

    camera.lookAt(
      EARTH_CENTER
    );
  }, [
    active,
    camera,
  ]);

  useFrame(() => {
    if (!active) {
      return;
    }

    cameraDirection.current
      .copy(camera.position)
      .sub(EARTH_CENTER)
      .normalize();

    correctedUp.current
      .copy(WORLD_NORTH)
      .addScaledVector(
        cameraDirection.current,
        -WORLD_NORTH.dot(
          cameraDirection.current
        )
      );

    if (
      correctedUp.current
        .lengthSq() <
      0.0001
    ) {
      correctedUp.current
        .copy(FALLBACK_UP)
        .addScaledVector(
          cameraDirection.current,
          -FALLBACK_UP.dot(
            cameraDirection.current
          )
        );
    }

    correctedUp.current.normalize();

    camera.up.copy(
      correctedUp.current
    );

    camera.lookAt(
      EARTH_CENTER
    );
  });

  return null;
}