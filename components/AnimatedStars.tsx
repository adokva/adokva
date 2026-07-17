"use client";

import { Stars } from "@react-three/drei";

export default function AnimatedStars() {
  return (
    <Stars
      radius={140}
      depth={90}
      count={10000}
      factor={6}
      saturation={0}
      fade
      speed={0.35}
    />
  );
}