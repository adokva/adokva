"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Ocean() {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.004;
    }
  });

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0a4f86"),

        transparent: true,

        opacity: 0.16,

        roughness: 0.08,

        metalness: 0,

        clearcoat: 1,

        clearcoatRoughness: 0.02,

        reflectivity: 1,

        ior: 1.333,

        transmission: 0.18,

        envMapIntensity: 1.8,

        depthWrite: false,
      }),
    []
  );

  return (
    <mesh ref={mesh}>
      <sphereGeometry
        args={[2.004, 320, 320]}
      />

      <primitive object={material} />
    </mesh>
  );
}