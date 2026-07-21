"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  useFrame,
  useLoader,
} from "@react-three/fiber";

import * as THREE from "three";

const MARS_RADIUS = 10.5;

export function getMarsPosition(): [
  number,
  number,
  number,
] {
  return [
    MARS_RADIUS,
    0.9,
    -4.2,
  ];
}

type Props = {
  onSelect: () => void;
};

export default function Mars({
  onSelect,
}: Props) {
  const mars =
    useRef<THREE.Mesh>(null);

  const position =
    useMemo(
      () => getMarsPosition(),
      []
    );

  const marsTexture =
    useLoader(
      THREE.TextureLoader,
      "/textures/Mars.jpg"
    );

  useEffect(() => {
    marsTexture.colorSpace =
      THREE.SRGBColorSpace;

    marsTexture.wrapS =
      THREE.RepeatWrapping;

    marsTexture.wrapT =
      THREE.ClampToEdgeWrapping;

    marsTexture.anisotropy = 16;

    marsTexture.needsUpdate =
      true;
  }, [marsTexture]);

  useEffect(() => {
    return () => {
      document.body.style.cursor =
        "default";
    };
  }, []);

  useFrame((_, delta) => {
    if (!mars.current) {
      return;
    }

    mars.current.rotation.y +=
      delta * 0.01;
  });

  return (
    <group position={position}>
      <mesh
        ref={mars}
        rotation={[
          0,
          Math.PI,
          0,
        ]}
        raycast={() => null}
      >
        <sphereGeometry
          args={[
            0.34,
            192,
            192,
          ]}
        />

        <meshStandardMaterial
          map={marsTexture}
          bumpMap={marsTexture}
          bumpScale={0.004}
          color="#ffffff"
          roughness={1}
          metalness={0}
        />
      </mesh>

      <mesh
        scale={1.01}
        raycast={() => null}
      >
        <sphereGeometry
          args={[
            0.34,
            96,
            96,
          ]}
        />

        <meshBasicMaterial
          color="#ffb18a"
          transparent
          opacity={0.015}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh
        onPointerDown={(
          event
        ) => {
          event.stopPropagation();

          onSelect();
        }}
        onPointerOver={(
          event
        ) => {
          event.stopPropagation();

          document.body.style.cursor =
            "pointer";
        }}
        onPointerOut={(
          event
        ) => {
          event.stopPropagation();

          document.body.style.cursor =
            "default";
        }}
      >
        <sphereGeometry
          args={[
            0.65,
            32,
            32,
          ]}
        />

        <meshBasicMaterial
          transparent
          opacity={0.001}
          depthWrite={false}
          colorWrite={false}
        />
      </mesh>
    </group>
  );
}