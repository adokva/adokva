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

type Props = {
  enabled: boolean;
};

const SOLAR_FLIGHT_DURATION = 3.9;

const SOLAR_SYSTEM_CENTER =
  new THREE.Vector3(0, 0, 0);

export default function SolarOrbitControls({
  enabled,
}: Props) {
  const controls =
    useRef<OrbitControlsImpl>(null);

  const { camera } = useThree();

  const [
    controlsReady,
    setControlsReady,
  ] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setControlsReady(false);

      return;
    }

    const timer = window.setTimeout(
      () => {
        setControlsReady(true);
      },
      SOLAR_FLIGHT_DURATION * 1000
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [enabled]);

  useEffect(() => {
    if (
      !enabled ||
      !controlsReady ||
      !controls.current
    ) {
      return;
    }

    controls.current.target.copy(
      SOLAR_SYSTEM_CENTER
    );

    camera.up.set(0, 1, 0);

    controls.current.update();
  }, [
    camera,
    controlsReady,
    enabled,
  ]);

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
      enabled
      target={[0, 0, 0]}
      enableRotate
      enableZoom
      enablePan={false}
      minDistance={12}
      maxDistance={100}
      rotateSpeed={0.48}
      zoomSpeed={0.75}
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