"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  OrbitControls,
} from "@react-three/drei";

import {
  useThree,
} from "@react-three/fiber";

import {
  OrbitControls as OrbitControlsImpl,
} from "three-stdlib";

import * as THREE from "three";

import {
  getWorldPosition,
} from "../lib/worldRegistry";

import type {
  SelectedWorld,
} from "../types/world";

type Props = {
  enabled: boolean;
  selectedWorld: SelectedWorld;
};

const PLANET_FLIGHT_DURATION = 3.5;

export default function PlanetOrbitControls({
  enabled,
  selectedWorld,
}: Props) {
  const controls =
    useRef<OrbitControlsImpl>(null);

  const { camera } = useThree();

  const [
    controlsReady,
    setControlsReady,
  ] = useState(false);

  const target =
    useRef(
      new THREE.Vector3()
    );

  useEffect(() => {
    if (
      !enabled ||
      !selectedWorld
    ) {
      setControlsReady(false);

      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setControlsReady(true);
        },
        PLANET_FLIGHT_DURATION *
          1000
      );

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    enabled,
    selectedWorld,
  ]);

  useEffect(() => {
    if (
      !enabled ||
      !controlsReady ||
      !controls.current ||
      !selectedWorld
    ) {
      return;
    }

    const worldPosition =
      getWorldPosition(
        selectedWorld,
        target.current
      );

    if (!worldPosition) {
      return;
    }

    controls.current.target.copy(
      worldPosition
    );

    camera.up.set(0, 1, 0);

    controls.current.update();
  }, [
    camera,
    controlsReady,
    enabled,
    selectedWorld,
  ]);

  if (
    !enabled ||
    !controlsReady ||
    !selectedWorld
  ) {
    return null;
  }

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled
      enableRotate
      enableZoom
      enablePan={false}
      minDistance={1.3}
      maxDistance={18}
      rotateSpeed={0.48}
      zoomSpeed={0.72}
      enableDamping
      dampingFactor={0.065}
      autoRotate={false}
      touches={{
        ONE:
          THREE.TOUCH.ROTATE,

        TWO:
          THREE.TOUCH.DOLLY_PAN,
      }}
    />
  );
}