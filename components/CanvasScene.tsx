"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

import Globe from "./Globe";

export default function CanvasScene() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
      }}
    >
      <ambientLight intensity={1} />

      <Globe />

      <Stars
        radius={100}
        depth={50}
        count={5000}
      />

      <OrbitControls />
    </Canvas>
  );
}
