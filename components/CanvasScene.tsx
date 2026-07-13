"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

import Globe from "./Globe";
import Clouds from "./Clouds";
import Atmosphere from "./Atmosphere";
import NightLights from "./NightLights";
export default function CanvasScene() {
  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
      }}
    >
      <ambientLight intensity={0.15} />

<directionalLight
  position={[5, 3, 5]}
  intensity={2}
/>

      <Globe></Globe>
      <NightLights />
      <Clouds />
<Atmosphere />
      <Stars
        radius={100}
        depth={50}
        count={5000}
      />

     <OrbitControls
  enableZoom={true}
  enablePan={false}
  autoRotate={true}
  autoRotateSpeed={0.4}
/>
    </Canvas>
  );
}
