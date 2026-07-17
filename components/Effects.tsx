"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function Effects() {
  return (
    <EffectComposer>

      <Bloom
        intensity={1.2}
        luminanceThreshold={0.25}
        luminanceSmoothing={0.9}
        mipmapBlur
      />

    </EffectComposer>
  );
}