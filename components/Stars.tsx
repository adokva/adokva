"use client";

import { Stars } from "@react-three/drei";

export default function SpaceStars() {
  return (
    <Stars
      radius={300}
      depth={80}
      count={8000}
      factor={6}
      saturation={0}
      fade
      speed={0.15}
    />
  );
}