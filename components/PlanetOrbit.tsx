"use client";

import {
  useMemo,
} from "react";

import {
  Line,
} from "@react-three/drei";

import * as THREE from "three";

import type {
  PlanetOrbitConfig,
} from "../data/planets";

type Props = {
  orbit: PlanetOrbitConfig;
};

export default function PlanetOrbit({
  orbit,
}: Props) {
  const orbitPoints =
    useMemo(() => {
      const points:
        THREE.Vector3[] = [];

      for (
        let index = 0;
        index <= orbit.segments;
        index += 1
      ) {
        const angle =
          (index /
            orbit.segments) *
          Math.PI *
          2;

        points.push(
          new THREE.Vector3(
            orbit.center[0] +
              Math.cos(angle) *
                orbit.radius,

            orbit.center[1] +
              orbit.height,

            orbit.center[2] +
              Math.sin(angle) *
                orbit.radius
          )
        );
      }

      return points;
    }, [
      orbit.center,
      orbit.height,
      orbit.radius,
      orbit.segments,
    ]);

  return (
    <Line
      points={orbitPoints}
      color={orbit.color}
      lineWidth={
        orbit.lineWidth
      }
      transparent
      opacity={orbit.opacity}
      toneMapped={false}
      depthWrite={false}
    />
  );
}