"use client";

import { useTexture } from "@react-three/fiber";

export default function NightLights() {
  const lightsTexture = useTexture("/textures/night.jpg");

  return (
    <mesh>
      <sphereGeometry args={[1.505, 64, 64]} />

      <meshBasicMaterial
        map={lightsTexture}
        transparent
        opacity={0.45}
      />
    </mesh>
  );
}
