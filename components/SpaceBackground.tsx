"use client";

import { useEffect } from "react";

import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import {
  EquirectangularReflectionMapping,
  LinearFilter,
  SRGBColorSpace,
} from "three";

export default function SpaceBackground() {
  const { scene } = useThree();

  const spaceTexture = useTexture(
    "/textures/space-panorama.png"
  );

  useEffect(() => {
    const previousBackground =
      scene.background;

    spaceTexture.mapping =
      EquirectangularReflectionMapping;

    spaceTexture.colorSpace =
      SRGBColorSpace;

    spaceTexture.minFilter =
      LinearFilter;

    spaceTexture.magFilter =
      LinearFilter;

    spaceTexture.generateMipmaps =
      false;

    spaceTexture.needsUpdate =
      true;

    scene.background =
      spaceTexture;

    return () => {
      if (
        scene.background ===
        spaceTexture
      ) {
        scene.background =
          previousBackground;
      }
    };
  }, [scene, spaceTexture]);

  return null;
}