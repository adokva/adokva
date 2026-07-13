"use client";

import * as THREE from "three";

export default function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry
        args={[1.58, 64, 64]}
      />

      <meshBasicMaterial
        color="#4da6ff"
        transparent
        opacity={0.18}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
