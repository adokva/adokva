"use client";

import * as THREE from "three";

import type {
  PlanetConfig,
} from "../data/planets";

type Props = {
  radius: number;

  glow: NonNullable<
    PlanetConfig["glow"]
  >;
};

export default function PlanetGlow({
  radius,
  glow,
}: Props) {
  return (
    <mesh
      scale={glow.scale}
      raycast={() => null}
    >
      <sphereGeometry
        args={[
          radius,
          glow.geometrySegments,
          glow.geometrySegments,
        ]}
      />

      <meshBasicMaterial
        color={glow.color}
        transparent
        opacity={glow.opacity}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
}