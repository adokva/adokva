"use client";

import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

export default function Globe() {
  const globe = useRef<Mesh>(null);

  useFrame(() => {
    if (globe.current) {
      globe.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={globe}>
      <sphereGeometry
        args={[1.5, 64, 64]}
      />

      <meshStandardMaterial
        color="#1d8cff"
        roughness={0.8}
      />
    </mesh>
  );
}
