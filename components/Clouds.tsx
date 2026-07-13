"use client";

import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

export default function Clouds() {
  const clouds = useRef<Mesh>(null);

  useFrame(() => {
    if (clouds.current) {
      clouds.current.rotation.y += 0.0008;
    }
  });

  return (
    <mesh ref={clouds}>
      <sphereGeometry
        args={[1.53, 64, 64]}
      />

      <meshStandardMaterial
        color="white"
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}
