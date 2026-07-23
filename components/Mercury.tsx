"use client";

import {
  useMemo,
  useRef,
} from "react";

import {
  Line,
  useTexture,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

import {
  MERCURY_CURRENT_POSITION,
  MERCURY_INITIAL_ANGLE,
  MERCURY_ORBIT_HEIGHT,
  MERCURY_ORBIT_RADIUS,
  MERCURY_ORBIT_SPEED,
  SUN_POSITION,
} from "../lib/space";

type Props = {
  onSelect?: () => void;
};

const MERCURY_RADIUS = 0.42;
const MERCURY_ROTATION_SPEED = 0.12;

const ORBIT_SEGMENTS = 256;

export default function Mercury({
  onSelect,
}: Props) {
  const mercuryRef =
    useRef<THREE.Mesh>(null);

  const orbitAngle =
    useRef(
      MERCURY_INITIAL_ANGLE
    );

  const mercuryTexture =
    useTexture(
      "/textures/mercury.jpg"
    );

  mercuryTexture.colorSpace =
    THREE.SRGBColorSpace;

  mercuryTexture.anisotropy = 16;

  const orbitPoints =
    useMemo(() => {
      const points:
        THREE.Vector3[] = [];

      for (
        let index = 0;
        index <= ORBIT_SEGMENTS;
        index += 1
      ) {
        const angle =
          (index /
            ORBIT_SEGMENTS) *
          Math.PI *
          2;

        points.push(
          new THREE.Vector3(
            SUN_POSITION[0] +
              Math.cos(angle) *
                MERCURY_ORBIT_RADIUS,

            SUN_POSITION[1] +
              MERCURY_ORBIT_HEIGHT,

            SUN_POSITION[2] +
              Math.sin(angle) *
                MERCURY_ORBIT_RADIUS
          )
        );
      }

      return points;
    }, []);

  useFrame((_, delta) => {
    const mercury =
      mercuryRef.current;

    if (!mercury) {
      return;
    }

    const safeDelta =
      Math.min(delta, 0.05);

    orbitAngle.current +=
      safeDelta *
      MERCURY_ORBIT_SPEED;

    const positionX =
      SUN_POSITION[0] +
      Math.cos(
        orbitAngle.current
      ) *
        MERCURY_ORBIT_RADIUS;

    const positionY =
      SUN_POSITION[1] +
      MERCURY_ORBIT_HEIGHT;

    const positionZ =
      SUN_POSITION[2] +
      Math.sin(
        orbitAngle.current
      ) *
        MERCURY_ORBIT_RADIUS;

    mercury.position.set(
      positionX,
      positionY,
      positionZ
    );

    MERCURY_CURRENT_POSITION.set(
      positionX,
      positionY,
      positionZ
    );

    mercury.rotation.y +=
      safeDelta *
      MERCURY_ROTATION_SPEED;
  }, -1);

  return (
    <>
      <Line
        points={orbitPoints}
        color="#ffb45f"
        lineWidth={0.75}
        transparent
        opacity={0.34}
        toneMapped={false}
        depthWrite={false}
      />

      <mesh
        ref={mercuryRef}
        position={
          MERCURY_CURRENT_POSITION
        }
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          onSelect?.();
        }}
        onPointerOver={(
          event
        ) => {
          event.stopPropagation();

          document.body.style.cursor =
            "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor =
            "default";
        }}
      >
        <sphereGeometry
          args={[
            MERCURY_RADIUS,
            128,
            128,
          ]}
        />

        <meshStandardMaterial
          map={mercuryTexture}
          bumpMap={
            mercuryTexture
          }
          bumpScale={0.025}
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>
    </>
  );
}