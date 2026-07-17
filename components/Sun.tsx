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

import {
  SUN_POSITION,
} from "../lib/space";

function createCoronaTexture() {
  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 1024;
  canvas.height = 1024;

  const context =
    canvas.getContext("2d");

  if (!context) {
    return new THREE.Texture();
  }

  const center =
    canvas.width / 2;

  const gradient =
    context.createRadialGradient(
      center,
      center,
      0,
      center,
      center,
      center
    );

  gradient.addColorStop(
    0,
    "rgba(255,255,225,1)"
  );

  gradient.addColorStop(
    0.12,
    "rgba(255,224,110,.98)"
  );

  gradient.addColorStop(
    0.25,
    "rgba(255,146,20,.72)"
  );

  gradient.addColorStop(
    0.48,
    "rgba(255,75,5,.28)"
  );

  gradient.addColorStop(
    0.75,
    "rgba(255,35,0,.07)"
  );

  gradient.addColorStop(
    1,
    "rgba(255,20,0,0)"
  );

  context.fillStyle =
    gradient;

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.needsUpdate = true;

  return texture;
}

function pseudoRandom(
  value: number
) {
  const result =
    Math.sin(
      value * 91.731
    ) *
    43758.5453;

  return (
    result -
    Math.floor(result)
  );
}

function createRayTexture() {
  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 1024;
  canvas.height = 1024;

  const context =
    canvas.getContext("2d");

  if (!context) {
    return new THREE.Texture();
  }

  const center =
    canvas.width / 2;

  context.translate(
    center,
    center
  );

  /*
    Лучи разной длины и яркости.

    Они специально сделаны тоньше,
    чтобы Солнце не выглядело
    мультяшным.
  */

  for (
    let index = 0;
    index < 320;
    index += 1
  ) {
    const angle =
      (index / 320) *
      Math.PI *
      2;

    const random =
      pseudoRandom(index);

    const secondRandom =
      pseudoRandom(
        index + 720
      );

    const length =
      120 +
      Math.pow(
        random,
        1.7
      ) *
        360;

    const width =
      0.18 +
      secondRandom *
        1.05;

    const alpha =
      0.012 +
      random *
        0.055;

    context.save();

    context.rotate(angle);

    const gradient =
      context.createLinearGradient(
        62,
        0,
        length,
        0
      );

    gradient.addColorStop(
      0,
      `rgba(255,235,150,${alpha})`
    );

    gradient.addColorStop(
      0.25,
      `rgba(255,155,45,${
        alpha * 0.7
      })`
    );

    gradient.addColorStop(
      1,
      "rgba(255,65,0,0)"
    );

    context.fillStyle =
      gradient;

    context.fillRect(
      62,
      -width / 2,
      length,
      width
    );

    context.restore();
  }

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.needsUpdate = true;

  return texture;
}

function createProminenceTexture() {
  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 1024;
  canvas.height = 1024;

  const context =
    canvas.getContext("2d");

  if (!context) {
    return new THREE.Texture();
  }

  const center =
    canvas.width / 2;

  context.translate(
    center,
    center
  );

  /*
    Неровные выбросы плазмы
    по краю солнечного диска.
  */

  for (
    let index = 0;
    index < 22;
    index += 1
  ) {
    const random =
      pseudoRandom(
        index + 1400
      );

    const secondRandom =
      pseudoRandom(
        index + 2200
      );

    const angle =
      random *
      Math.PI *
      2;

    const startRadius =
      205 +
      secondRandom * 15;

    const height =
      20 +
      pseudoRandom(
        index + 3100
      ) *
        85;

    const sideways =
      -30 +
      pseudoRandom(
        index + 4100
      ) *
        60;

    context.save();

    context.rotate(angle);

    const gradient =
      context.createLinearGradient(
        startRadius,
        0,
        startRadius + height,
        0
      );

    gradient.addColorStop(
      0,
      "rgba(255,225,100,.72)"
    );

    gradient.addColorStop(
      0.38,
      "rgba(255,115,20,.52)"
    );

    gradient.addColorStop(
      1,
      "rgba(255,45,0,0)"
    );

    context.strokeStyle =
      gradient;

    context.lineWidth =
      1.5 +
      secondRandom * 3;

    context.beginPath();

    context.moveTo(
      startRadius,
      0
    );

    context.bezierCurveTo(
      startRadius +
        height * 0.25,
      sideways,

      startRadius +
        height * 0.72,
      sideways * 1.2,

      startRadius + height,
      0
    );

    context.stroke();

    context.restore();
  }

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.needsUpdate = true;

  return texture;
}

type Props = {
  onSelect: () => void;
};

export default function Sun({
  onSelect,
}: Props) {
  const sunPhoto =
    useRef<THREE.Sprite>(null);

  const innerGlow =
    useRef<THREE.Sprite>(null);

  const corona =
    useRef<THREE.Sprite>(null);

  const rays =
    useRef<THREE.Sprite>(null);

  const prominences =
    useRef<THREE.Sprite>(null);

  const distantGlow =
    useRef<THREE.Sprite>(null);

  /*
    Настоящее изображение NASA.

    Файл должен лежать здесь:

    public/textures/sun.jpg
  */

  const sunTexture =
    useLoader(
      THREE.TextureLoader,
      "/textures/sun.jpg"
    );

  const coronaTexture =
    useMemo(
      () =>
        createCoronaTexture(),
      []
    );

  const rayTexture =
    useMemo(
      () =>
        createRayTexture(),
      []
    );

  const prominenceTexture =
    useMemo(
      () =>
        createProminenceTexture(),
      []
    );

  useEffect(() => {
    sunTexture.colorSpace =
      THREE.SRGBColorSpace;

    sunTexture.wrapS =
      THREE.ClampToEdgeWrapping;

    sunTexture.wrapT =
      THREE.ClampToEdgeWrapping;

    sunTexture.minFilter =
      THREE.LinearFilter;

    sunTexture.magFilter =
      THREE.LinearFilter;

    sunTexture.anisotropy = 16;

    sunTexture.needsUpdate =
      true;
  }, [sunTexture]);

  useEffect(() => {
    return () => {
      coronaTexture.dispose();
      rayTexture.dispose();
      prominenceTexture.dispose();
    };
  }, [
    coronaTexture,
    rayTexture,
    prominenceTexture,
  ]);

  useFrame((state, delta) => {
    const time =
      state.clock.elapsedTime;

    /*
      Настоящая фотография очень
      медленно поворачивается.

      Положение самого Солнца
      остаётся неподвижным.
    */

    if (sunPhoto.current) {
      sunPhoto.current.material.rotation +=
        delta * 0.003;

      const size =
        0.92 +
        Math.sin(
          time * 0.55
        ) *
          0.004;

      sunPhoto.current.scale.set(
        size,
        size,
        1
      );
    }

    if (innerGlow.current) {
      const size =
        1.05 +
        Math.sin(
          time * 0.8
        ) *
          0.012;

      innerGlow.current.scale.set(
        size,
        size,
        1
      );
    }

    if (corona.current) {
      const size =
        2.15 +
        Math.sin(
          time * 0.48
        ) *
          0.035;

      corona.current.scale.set(
        size,
        size,
        1
      );
    }

    if (prominences.current) {
      prominences.current
        .material.rotation +=
        delta * 0.0015;

      const size =
        1.55 +
        Math.sin(
          time * 0.36
        ) *
          0.025;

      prominences.current.scale.set(
        size,
        size,
        1
      );
    }

    if (rays.current) {
      rays.current
        .material.rotation -=
        delta * 0.0008;

      const size =
        4.25 +
        Math.sin(
          time * 0.24
        ) *
          0.05;

      rays.current.scale.set(
        size,
        size,
        1
      );
    }

    if (distantGlow.current) {
      const size =
        6.4 +
        Math.sin(
          time * 0.17
        ) *
          0.08;

      distantGlow.current.scale.set(
        size,
        size,
        1
      );
    }
  });

  return (
    <group
      position={[
        SUN_POSITION[0],
        SUN_POSITION[1],
        SUN_POSITION[2],
      ]}
    >
      {/*
        Солнце является настоящим
        источником освещения Земли.
      */}

      <pointLight
        color="#fff0c2"
        intensity={40}
        distance={45}
        decay={2}
      />

      {/*
        Дальнее красно-оранжевое
        сияние.
      */}

      <sprite
        ref={distantGlow}
        scale={[
          6.4,
          6.4,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={coronaTexture}
          color="#ff3f0a"
          transparent
          opacity={0.08}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </sprite>

      {/*
        Очень тонкие дальние лучи.
      */}

      <sprite
        ref={rays}
        scale={[
          4.25,
          4.25,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={rayTexture}
          color="#ff9a32"
          transparent
          opacity={0.52}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </sprite>

      {/*
        Неровная солнечная корона.
      */}

      <sprite
        ref={corona}
        scale={[
          2.15,
          2.15,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={coronaTexture}
          color="#ff9f32"
          transparent
          opacity={0.68}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </sprite>

      {/*
        Выбросы плазмы по краям.
      */}

      <sprite
        ref={prominences}
        scale={[
          1.55,
          1.55,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={
            prominenceTexture
          }
          color="#ff711c"
          transparent
          opacity={0.82}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </sprite>

      {/*
        Мягкое внутреннее свечение
        под фотографией.
      */}

      <sprite
        ref={innerGlow}
        scale={[
          1.05,
          1.05,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={coronaTexture}
          color="#ffb347"
          transparent
          opacity={0.28}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </sprite>

      {/*
        =================================
        НАСТОЯЩАЯ ФОТОГРАФИЯ СОЛНЦА NASA
        =================================

        Чёрный фон фотографии исчезает
        благодаря AdditiveBlending.
      */}

      <sprite
        ref={sunPhoto}
        scale={[
          0.92,
          0.92,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={sunTexture}
          color="#ffffff"
          transparent
          opacity={1}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </sprite>

      {/*
        Невидимая область нажатия.

        Она остаётся отдельной,
        поэтому фотография, корона
        и лучи не мешают клику.
      */}

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