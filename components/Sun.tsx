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

function createSoftGlowTexture() {
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
    "rgba(255,255,240,1)"
  );

  gradient.addColorStop(
    0.12,
    "rgba(255,236,160,0.94)"
  );

  gradient.addColorStop(
    0.28,
    "rgba(255,178,75,0.46)"
  );

  gradient.addColorStop(
    0.48,
    "rgba(255,118,35,0.14)"
  );

  gradient.addColorStop(
    0.72,
    "rgba(255,80,20,0.03)"
  );

  gradient.addColorStop(
    1,
    "rgba(255,60,0,0)"
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

function createCoronaTexture(
  seedOffset: number,
  strandCount: number
) {
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
    Внутреннее мягкое сияние
    вокруг солнечного диска.
  */

  const innerGlow =
    context.createRadialGradient(
      0,
      0,
      175,
      0,
      0,
      330
    );

  innerGlow.addColorStop(
    0,
    "rgba(255,245,195,0.28)"
  );

  innerGlow.addColorStop(
    0.22,
    "rgba(255,192,95,0.16)"
  );

  innerGlow.addColorStop(
    0.58,
    "rgba(255,115,40,0.045)"
  );

  innerGlow.addColorStop(
    1,
    "rgba(255,70,15,0)"
  );

  context.fillStyle =
    innerGlow;

  context.beginPath();

  context.arc(
    0,
    0,
    350,
    0,
    Math.PI * 2
  );

  context.fill();

  /*
    Неровные плазменные волокна.

    Они рисуются кривыми,
    а не прямыми лучами.
  */

  for (
    let index = 0;
    index < strandCount;
    index += 1
  ) {
    const randomA =
      pseudoRandom(
        index +
          seedOffset
      );

    const randomB =
      pseudoRandom(
        index +
          seedOffset +
          1100
      );

    const randomC =
      pseudoRandom(
        index +
          seedOffset +
          2300
      );

    const randomD =
      pseudoRandom(
        index +
          seedOffset +
          3700
      );

    const angle =
      (index /
        strandCount) *
        Math.PI *
        2 +
      (randomA - 0.5) *
        0.085;

    const startRadius =
      188 +
      randomB * 18;

    const length =
      34 +
      Math.pow(
        randomC,
        2.15
      ) *
        245;

    const bend =
      -32 +
      randomD * 64;

    const width =
      0.28 +
      randomB * 1.55;

    const alpha =
      0.012 +
      randomA * 0.052;

    context.save();

    context.rotate(angle);

    const gradient =
      context.createLinearGradient(
        startRadius,
        0,
        startRadius +
          length,
        0
      );

    gradient.addColorStop(
      0,
      `rgba(255,244,185,${
        alpha * 1.8
      })`
    );

    gradient.addColorStop(
      0.28,
      `rgba(255,190,90,${
        alpha * 1.2
      })`
    );

    gradient.addColorStop(
      0.65,
      `rgba(255,115,40,${
        alpha * 0.45
      })`
    );

    gradient.addColorStop(
      1,
      "rgba(255,70,20,0)"
    );

    context.strokeStyle =
      gradient;

    context.lineWidth =
      width;

    context.beginPath();

    context.moveTo(
      startRadius,
      0
    );

    context.bezierCurveTo(
      startRadius +
        length * 0.23,
      bend * 0.35,

      startRadius +
        length * 0.7,
      bend,

      startRadius +
        length,
      bend * 0.3
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

  for (
    let index = 0;
    index < 20;
    index += 1
  ) {
    const randomA =
      pseudoRandom(
        index + 2500
      );

    const randomB =
      pseudoRandom(
        index + 3500
      );

    const randomC =
      pseudoRandom(
        index + 4500
      );

    const randomD =
      pseudoRandom(
        index + 5500
      );

    const angle =
      randomA *
      Math.PI *
      2;

    const startRadius =
      202 +
      randomB * 12;

    const height =
      22 +
      Math.pow(
        randomC,
        1.4
      ) *
        88;

    const sideways =
      -38 +
      randomD * 76;

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
      "rgba(255,245,180,0.68)"
    );

    gradient.addColorStop(
      0.38,
      "rgba(255,160,65,0.48)"
    );

    gradient.addColorStop(
      0.72,
      "rgba(255,95,25,0.2)"
    );

    gradient.addColorStop(
      1,
      "rgba(255,60,15,0)"
    );

    context.strokeStyle =
      gradient;

    context.lineWidth =
      0.9 +
      randomB * 2.4;

    context.beginPath();

    context.moveTo(
      startRadius,
      0
    );

    context.bezierCurveTo(
      startRadius +
        height * 0.28,
      sideways,

      startRadius +
        height * 0.72,
      sideways * 1.15,

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

function createCleanSunTexture(
  sourceTexture: THREE.Texture
) {
  const sourceImage =
    sourceTexture.image as
      | HTMLImageElement
      | HTMLCanvasElement
      | ImageBitmap;

  const sourceWidth =
    "naturalWidth" in sourceImage
      ? sourceImage.naturalWidth
      : sourceImage.width;

  const sourceHeight =
    "naturalHeight" in sourceImage
      ? sourceImage.naturalHeight
      : sourceImage.height;

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 1024;
  canvas.height = 1024;

  const context =
    canvas.getContext("2d");

  if (
    !context ||
    !sourceWidth ||
    !sourceHeight
  ) {
    return sourceTexture.clone();
  }

  const shortestSide =
    Math.min(
      sourceWidth,
      sourceHeight
    );

  /*
    Увеличенный центральный crop.

    Он скрывает надписи NASA
    и служебные края исходника.
  */

  const cropSize =
    shortestSide * 0.82;

  const sourceX =
    (sourceWidth -
      cropSize) /
    2;

  const sourceY =
    (sourceHeight -
      cropSize) /
      2 -
    cropSize * 0.015;

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.drawImage(
    sourceImage,
    sourceX,
    sourceY,
    cropSize,
    cropSize,
    0,
    0,
    canvas.width,
    canvas.height
  );

  /*
    Круглая маска убирает
    прямоугольную фотографию
    и чёрный фон.
  */

  context.globalCompositeOperation =
    "destination-in";

  const center =
    canvas.width / 2;

  const mask =
    context.createRadialGradient(
      center,
      center,
      center * 0.82,
      center,
      center,
      center * 0.99
    );

  mask.addColorStop(
    0,
    "rgba(255,255,255,1)"
  );

  mask.addColorStop(
    0.72,
    "rgba(255,255,255,1)"
  );

  mask.addColorStop(
    0.94,
    "rgba(255,255,255,0.97)"
  );

  mask.addColorStop(
    1,
    "rgba(255,255,255,0)"
  );

  context.fillStyle = mask;

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.globalCompositeOperation =
    "source-over";

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.wrapS =
    THREE.ClampToEdgeWrapping;

  texture.wrapT =
    THREE.ClampToEdgeWrapping;

  texture.minFilter =
    THREE.LinearFilter;

  texture.magFilter =
    THREE.LinearFilter;

  texture.generateMipmaps = true;

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

  const coronaInner =
    useRef<THREE.Sprite>(null);

  const coronaOuter =
    useRef<THREE.Sprite>(null);

  const prominences =
    useRef<THREE.Sprite>(null);

  const distantGlow =
    useRef<THREE.Sprite>(null);

  const sourceSunTexture =
    useLoader(
      THREE.TextureLoader,
      "/textures/sun.jpg"
    );

  const cleanSunTexture =
    useMemo(
      () =>
        createCleanSunTexture(
          sourceSunTexture
        ),
      [sourceSunTexture]
    );

  const softGlowTexture =
    useMemo(
      () =>
        createSoftGlowTexture(),
      []
    );

  const coronaInnerTexture =
    useMemo(
      () =>
        createCoronaTexture(
          800,
          520
        ),
      []
    );

  const coronaOuterTexture =
    useMemo(
      () =>
        createCoronaTexture(
          6200,
          340
        ),
      []
    );

  const prominenceTexture =
    useMemo(
      () =>
        createProminenceTexture(),
      []
    );

  useEffect(() => {
    sourceSunTexture.colorSpace =
      THREE.SRGBColorSpace;

    sourceSunTexture.wrapS =
      THREE.ClampToEdgeWrapping;

    sourceSunTexture.wrapT =
      THREE.ClampToEdgeWrapping;

    sourceSunTexture.minFilter =
      THREE.LinearFilter;

    sourceSunTexture.magFilter =
      THREE.LinearFilter;

    sourceSunTexture.needsUpdate =
      true;
  }, [sourceSunTexture]);

  useEffect(() => {
    return () => {
      cleanSunTexture.dispose();
      softGlowTexture.dispose();
      coronaInnerTexture.dispose();
      coronaOuterTexture.dispose();
      prominenceTexture.dispose();
    };
  }, [
    cleanSunTexture,
    softGlowTexture,
    coronaInnerTexture,
    coronaOuterTexture,
    prominenceTexture,
  ]);

  useEffect(() => {
    return () => {
      document.body.style.cursor =
        "default";
    };
  }, []);

  useFrame((state, delta) => {
    const time =
      state.clock.elapsedTime;

    if (sunPhoto.current) {
      sunPhoto.current
        .material.rotation +=
        delta * 0.0012;

      const size =
        0.96 +
        Math.sin(
          time * 0.46
        ) *
          0.0025;

      sunPhoto.current.scale.set(
        size,
        size,
        1
      );
    }

    if (innerGlow.current) {
      const size =
        1.13 +
        Math.sin(
          time * 0.76
        ) *
          0.008;

      innerGlow.current.scale.set(
        size,
        size,
        1
      );
    }

    if (coronaInner.current) {
      coronaInner.current
        .material.rotation +=
        delta * 0.001;

      const size =
        2.06 +
        Math.sin(
          time * 0.34
        ) *
          0.022;

      coronaInner.current.scale.set(
        size,
        size,
        1
      );
    }

    if (coronaOuter.current) {
      coronaOuter.current
        .material.rotation -=
        delta * 0.00045;

      const size =
        2.58 +
        Math.sin(
          time * 0.25
        ) *
          0.035;

      coronaOuter.current.scale.set(
        size,
        size,
        1
      );
    }

    if (prominences.current) {
      prominences.current
        .material.rotation +=
        delta * 0.0007;

      const size =
        1.52 +
        Math.sin(
          time * 0.42
        ) *
          0.016;

      prominences.current.scale.set(
        size,
        size,
        1
      );
    }

    if (distantGlow.current) {
      const size =
        3.25 +
        Math.sin(
          time * 0.2
        ) *
          0.028;

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
      <pointLight
        color="#fff2cc"
        intensity={34}
        distance={45}
        decay={2}
      />

      {/*
        Очень слабое дальнее сияние.

        Оно не должно окрашивать
        весь экран в красный цвет.
      */}

      <sprite
        ref={distantGlow}
        scale={[
          3.25,
          3.25,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={softGlowTexture}
          color="#ffad62"
          transparent
          opacity={0.038}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </sprite>

      {/*
        Внешний слой короны.

        Более длинный,
        слабый и неровный.
      */}

      <sprite
        ref={coronaOuter}
        scale={[
          2.58,
          2.58,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={
            coronaOuterTexture
          }
          color="#ff9946"
          transparent
          opacity={0.34}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </sprite>

      {/*
        Основной слой короны.

        Волокна сделаны кривыми,
        поэтому прямых графичных
        лучей больше нет.
      */}

      <sprite
        ref={coronaInner}
        scale={[
          2.06,
          2.06,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={
            coronaInnerTexture
          }
          color="#ffc066"
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
        Небольшие протуберанцы
        по краю солнечного диска.
      */}

      <sprite
        ref={prominences}
        scale={[
          1.52,
          1.52,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={
            prominenceTexture
          }
          color="#ff9c42"
          transparent
          opacity={0.64}
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
        вокруг фотографии Солнца.
      */}

      <sprite
        ref={innerGlow}
        scale={[
          1.13,
          1.13,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={softGlowTexture}
          color="#ffd681"
          transparent
          opacity={0.18}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </sprite>

      {/*
        Очищенная фотография NASA.

        Надписи и прямоугольный фон
        скрыты центральным crop
        и круглой маской.
      */}

      <sprite
        ref={sunPhoto}
        scale={[
          0.96,
          0.96,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={cleanSunTexture}
          color="#ffffff"
          transparent
          opacity={1}
          alphaTest={0.015}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={
            THREE.NormalBlending
          }
        />
      </sprite>

      {/*
        Невидимая кликабельная сфера.

        Первый клик приближает Солнце.
        Повторный клик возвращает Землю.
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