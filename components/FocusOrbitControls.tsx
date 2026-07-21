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

const WORLD_RETURN_DURATION =
  2.3;

const EARTH_CENTER =
  new THREE.Vector3(0, 0, 0);

const WORLD_NORTH =
  new THREE.Vector3(0, 1, 0);

const FALLBACK_UP =
  new THREE.Vector3(0, 0, 1);

const SECOND_FALLBACK_UP =
  new THREE.Vector3(1, 0, 0);

const DEFAULT_DISTANCE = 8;

const SELECTED_DISTANCE =
  5.75;

const DISTANCE_ANIMATION_DURATION =
  1.3;

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

export default function FocusOrbitControls({
  enabled,
  selected,
}: Props) {
  const controls =
    useRef<OrbitControlsImpl>(null);

  const { camera } =
    useThree();

  const initialized =
    useRef(false);

  const hasBeenEnabled =
    useRef(false);

  const previousEnabled =
    useRef(enabled);

  const previousSelected =
    useRef(selected);

  const selectedRef =
    useRef(selected);

  const animationActive =
    useRef(false);

  const elapsed =
    useRef(0);

  const returnDelayElapsed =
    useRef(0);

  const waitingForWorldReturn =
    useRef(false);

  const startPosition =
    useRef(
      new THREE.Vector3()
    );

  const endPosition =
    useRef(
      new THREE.Vector3()
    );

  const workingDirection =
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

  const [
    animating,
    setAnimating,
  ] = useState(false);

  const [
    controlsReady,
    setControlsReady,
  ] = useState(enabled);

  useEffect(() => {
    selectedRef.current =
      selected;
  }, [selected]);

  useEffect(() => {
    const wasEnabled =
      previousEnabled.current;

    previousEnabled.current =
      enabled;

    if (!enabled) {
      initialized.current =
        false;

      animationActive.current =
        false;

      waitingForWorldReturn.current =
        false;

      returnDelayElapsed.current =
        0;

      setAnimating(false);
      setControlsReady(false);

      return;
    }

    if (!hasBeenEnabled.current) {
      hasBeenEnabled.current =
        true;

      setControlsReady(true);

      return;
    }

    if (!wasEnabled && enabled) {
      initialized.current =
        false;

      animationActive.current =
        false;

      setAnimating(false);
      setControlsReady(false);

      returnDelayElapsed.current =
        0;

      waitingForWorldReturn.current =
        true;
    }
  }, [enabled]);

  useFrame((_, delta) => {
    if (
      !enabled ||
      !waitingForWorldReturn.current
    ) {
      return;
    }

    returnDelayElapsed.current +=
      Math.min(delta, 0.05);

    if (
      returnDelayElapsed.current <
      WORLD_RETURN_DURATION
    ) {
      return;
    }

    waitingForWorldReturn.current =
      false;

    returnDelayElapsed.current =
      0;

    setControlsReady(true);
  });

  useEffect(() => {
    if (
      !enabled ||
      !controlsReady
    ) {
      return;
    }

    initialized.current =
      true;

    previousSelected.current =
      selectedRef.current;

    animationActive.current =
      false;

    setAnimating(false);

    stabilizeCameraOrientation(
      camera,
      cameraViewDirection.current,
      cameraStableUp.current
    );

    if (controls.current) {
      controls.current.target.copy(
        EARTH_CENTER
      );

      controls.current.update();
    }

    stabilizeCameraOrientation(
      camera,
      cameraViewDirection.current,
      cameraStableUp.current
    );
  }, [
    camera,
    controlsReady,
    enabled,
  ]);

  useEffect(() => {
    if (
      !enabled ||
      !controlsReady ||
      !initialized.current
    ) {
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

    workingDirection.current
      .copy(camera.position)
      .sub(EARTH_CENTER);

    if (
      workingDirection.current
        .lengthSq() < 0.0001
    ) {
      workingDirection.current.set(
        0,
        0,
        1
      );
    }

    workingDirection.current.normalize();

    const targetDistance =
      selected
        ? SELECTED_DISTANCE
        : DEFAULT_DISTANCE;

    endPosition.current
      .copy(
        workingDirection.current
      )
      .multiplyScalar(
        targetDistance
      );

    elapsed.current = 0;

    animationActive.current =
      true;

    setAnimating(true);
  }, [
    camera,
    controlsReady,
    enabled,
    selected,
  ]);

  useFrame((_, delta) => {
    if (
      !enabled ||
      !controlsReady ||
      !animationActive.current
    ) {
      return;
    }

    elapsed.current +=
      Math.min(delta, 0.05);

    const progress =
      Math.min(
        elapsed.current /
          DISTANCE_ANIMATION_DURATION,
        1
      );

    const eased =
      progress *
      progress *
      (3 - 2 * progress);

    camera.position.lerpVectors(
      startPosition.current,
      endPosition.current,
      eased
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

    animationActive.current =
      false;

    setAnimating(false);

    if (controls.current) {
      controls.current.target.copy(
        EARTH_CENTER
      );

      controls.current.update();
    }

    stabilizeCameraOrientation(
      camera,
      cameraViewDirection.current,
      cameraStableUp.current
    );
  });

  /*
    Выполняется после OrbitControls.

    Камера всегда смотрит на центр
    Земли, а её верх выравнивается
    относительно мирового севера.
  */

  useFrame(() => {
    if (
      !enabled ||
      !controlsReady
    ) {
      return;
    }

    stabilizeCameraOrientation(
      camera,
      cameraViewDirection.current,
      cameraStableUp.current
    );
  }, 1);

  if (
    !enabled ||
    !controlsReady
  ) {
    return null;
  }

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={!animating}
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