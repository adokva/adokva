"use client";

import Globe from "./Globe";
import Stars from "./Stars";
import Atmosphere from "./Atmosphere";

export default function Scene() {
  return (
    <div>
      <Stars />

      <Globe />

      <Atmosphere />

      <p>
        Adokva Space Engine
      </p>
    </div>
  );
}
