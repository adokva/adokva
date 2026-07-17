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

const SYNODIC_MONTH =
  29.53058867;

const SUN_ANGLE =
  Math.atan2(
    2.5,
    -8.5
  );

function getMoonPhase() {
  const knownNewMoon =
    Date.UTC(
      2000,
      0,
      6,
      18,
      14,
      0
    );

  const daysSinceNewMoon =
    (Date.now() -
      knownNewMoon) /
    86400000;

  const moonAge =
    ((daysSinceNewMoon %
      SYNODIC_MONTH) +
      SYNODIC_MONTH) %
    SYNODIC_MONTH;

  return (
    moonAge /
    SYNODIC_MONTH
  );
}

export function getMoonPosition(): [
  number,
  number,
  number,
] {
  const phase =
    getMoonPhase();

  const angle =
    SUN_ANGLE +
    phase *
      Math.PI *
      2;

  const radius = 6.6;

  return [
    Math.cos(angle) *
      radius,

    1.1 +
      Math.sin(
        angle * 0.65
      ) *
        0.75,

    Math.sin(angle) *
      radius,
  ];
}

type Props = {
  onSelect: () => void;
};

export default function Moon({
  onSelect,
}: Props) {
  const moon =
    useRef<THREE.Mesh>(null);

  const position =
    useMemo(
      () =>
        getMoonPosition(),
      []
    );

  /*
    Настоящая текстура Луны.

    Файл должен находиться здесь:

    public/textures/moon.jpg
  */

  const moonTexture =
    useLoader(
      THREE.TextureLoader,
      "/textures/moon.jpg"
    );

  useEffect(() => {
    moonTexture.colorSpace =
      THREE.SRGBColorSpace;

    moonTexture.wrapS =
      THREE.RepeatWrapping;

    moonTexture.wrapT =
      THREE.ClampToEdgeWrapping;

    moonTexture.anisotropy = 16;

    moonTexture.needsUpdate =
      true;
  }, [moonTexture]);

  useFrame((_, delta) => {
    if (!moon.current) {
      return;
    }

    /*
      Спокойное вращение Луны.

      Вращение медленное,
      чтобы поверхность можно
      было внимательно рассмотреть.
    */

    moon.current.rotation.y +=
      delta * 0.018;
  });

  return (
    <group
      position={position}
    >
      {/*
        =================================
        НАСТОЯЩАЯ ПОВЕРХНОСТЬ ЛУНЫ
        =================================
      */}

      <mesh
        ref={moon}
        rotation={[
          0,
          Math.PI,
          0,
        ]}
        raycast={() => null}
      >
        <sphereGeometry
          args={[
            0.4,
            192,
            192,
          ]}
        />

        <meshStandardMaterial
          map={moonTexture}
          bumpMap={moonTexture}
          bumpScale={0.006}
          color="#e2dfd5"
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/*
        =================================
        ТОНКИЙ ОТРАЖЁННЫЙ КРАЙ
        =================================

        Очень слабый слой,
        чтобы Луна не выглядела
        окружённой серым обручем.
      */}

      <mesh
        scale={1.004}
        raycast={() => null}
      >
        <sphereGeometry
          args={[
            0.4,
            96,
            96,
          ]}
        />

        <meshBasicMaterial
          color="#e9e7df"
          transparent
          opacity={0.012}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/*
        =================================
        НЕВИДИМАЯ ЗОНА НАЖАТИЯ
        =================================

        Она немного больше Луны,
        поэтому по ней удобно нажимать
        мышью и пальцем.
      */}

      <mesh
        onPointerDown={(
          event
        ) => {
          event.stopPropagation();

          onSelect();
        }}
        onClick={(event) => {
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
        onPointerOut={() => {
          document.body.style.cursor =
            "default";
        }}
      >
        <sphereGeometry
          args={[
            0.72,
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