"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  OrbitControls,
} from "@react-three/drei";

import {
  OrbitControls as OrbitControlsImpl,
} from "three-stdlib";

import * as THREE from "three";

type Props = {
  enabled: boolean;
  selected: boolean;
};

export default function FocusOrbitControls({
  enabled,
  selected,
}: Props) {
  const controls =
    useRef<OrbitControlsImpl>(null);

  const { camera } = useThree();

  const initialized =
    useRef(false);

  const previousSelected =
    useRef(selected);

  const animationActive =
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

  const [animating, setAnimating] =
    useState(false);

  useEffect(() => {
    if (!enabled) {
      initialized.current = false;
      animationActive.current = false;
      setAnimating(false);

      return;
    }

    if (!initialized.current) {
      initialized.current = true;

      previousSelected.current =
        selected;

      controls.current?.target.set(
        0,
        0,
        0
      );

      controls.current?.update();

      return;
    }

    if (
      previousSelected.current ===
      selected
    ) {
      return;
    }

    previousSelected.current =
      selected;

    startPosition.current.copy(
      camera.position
    );

    const direction =
      camera.position
        .clone()
        .normalize();

    const targetDistance =
      selected ? 5.75 : 8;

    endPosition.current.copy(
      direction.multiplyScalar(
        targetDistance
      )
    );

    elapsed.current = 0;
    animationActive.current = true;
    setAnimating(true);
  }, [
    camera,
    enabled,
    selected,
  ]);

  useFrame((_, delta) => {
    if (
      !enabled ||
      !animationActive.current
    ) {
      return;
    }

    elapsed.current += delta;

    const duration = 1.3;

    const progress =
      Math.min(
        elapsed.current / duration,
        1
      );

    /*
      Очень плавное начало
      и плавная остановка.
    */
    const eased =
      progress *
      progress *
      (3 - 2 * progress);

    camera.position.lerpVectors(
      startPosition.current,
      endPosition.current,
      eased
    );

    camera.lookAt(0, 0, 0);

    if (progress >= 1) {
      camera.position.copy(
        endPosition.current
      );

      camera.lookAt(0, 0, 0);

      animationActive.current =
        false;

      setAnimating(false);

      controls.current?.target.set(
        0,
        0,
        0
      );

      controls.current?.update();
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={
        enabled && !animating
      }
      enablePan={false}
      enableZoom
      enableRotate
      minDistance={4.4}
      maxDistance={12}
      rotateSpeed={0.45}
      zoomSpeed={0.72}
      enableDamping
      dampingFactor={0.055}
      autoRotate={
        enabled &&
        !selected &&
        !animating
      }
      autoRotateSpeed={0.24}
      touches={{
        ONE:
          THREE.TOUCH.ROTATE,

        TWO:
          THREE.TOUCH.DOLLY_PAN,
      }}
    />
  );
}