"use client";

import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function Clouds() {
  const mesh = useRef<THREE.Mesh>(null!);

  const clouds = useLoader(
    THREE.TextureLoader,
    "/textures/clouds.jpg"
  );

  clouds.colorSpace = THREE.SRGBColorSpace;
  clouds.anisotropy = 16;

  useFrame((_, delta) => {
    mesh.current.rotation.y += delta * 0.008;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[2.018, 256, 256]} />

      <meshPhongMaterial
        map={clouds}
        transparent
        opacity={0.35}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}