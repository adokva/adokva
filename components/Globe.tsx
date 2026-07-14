"use client";

import { useRef } from "react";
import { Mesh } from "three";
import { useFrame, useTexture } from "@react-three/fiber";

export default function Globe() {
  const globe = useRef<Mesh>(null);

  const earthTexture = useTexture("/textures/earth.jpg");

  useFrame(() => {
    if (globe.current) {
      globe.current.rotation.y += 0.002;
    }
  });

  return (
    <mesh ref={globe}>
      <sphereGeometry args={[1.5, 64, 64]} />

      <meshStandardMaterial
  map={earthTexture}
  roughness={0.8}
  metalness={0.1}
/>
    </mesh>
  );
}
