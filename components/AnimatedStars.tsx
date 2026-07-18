"use client";

import {
  Stars,
} from "@react-three/drei";

export default function AnimatedStars() {
  return (
    <Stars
      radius={130}
      depth={75}
      count={5000}
      factor={5}
      saturation={0}
      fade
      speed={0.25}
    />
  );
}