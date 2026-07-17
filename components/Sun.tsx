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
    "rgba(255,255,235,1)"
  );

  gradient.addColorStop(
    0.16,
    "rgba(255,232,145,0.92)"
  );

  gradient.addColorStop(
    0.34,
    "rgba(255,173,70,0.48)"
  );

  gradient.addColorStop(
    0.58,
    "rgba(255,110,30,0.16)"
  );

  gradient.addColorStop(
    0.8,
    "rgba(255,75,15,0.035)"
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

  context.translate(
    center,
    center
  );

  const innerRadius = 190;

  for (
    let index = 0;
    index < 460;
    index += 1
  ) {
    const random =
      pseudoRandom(
        index + 100
      );

    const secondRandom =
      pseudoRandom(
        index + 900
      );

    const thirdRandom =
      pseudoRandom(
        index + 1800
      );

    const angle =
      (index / 460) *
        Math.PI *
        2 +
      (random - 0.5) *
        0.018;

    const length =
      36 +
      Math.pow(
        random,
        2.1
      ) *
        185;

    const width =
      0.35 +
      secondRandom *
        1.6;

    const alpha =
      0.018 +
      thirdRandom *
        0.075;

    context.save();

    context.rotate(angle);

    const gradient =
      context.createLinearGradient(
        innerRadius,
        0,
        innerRadius + length,
        0
      );

    gradient.addColorStop(
      0,
      `rgba(255,242,175,${
        alpha * 1.5
      })`
    );

    gradient.addColorStop(
      0.28,
      `rgba(255,184,75,${alpha})`
    );

    gradient.addColorStop(
      0.7,
      `rgba(255,105,25,${
        alpha * 0.32
      })`
    );

    gradient.addColorStop(
      1,
      "rgba(255,75,10,0)"
    );

    context.fillStyle =
      gradient;

    context.fillRect(
      innerRadius,
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

  for (
    let index = 0;
    index < 18;
    index += 1
  ) {
    const random =
      pseudoRandom(
        index + 2400
      );

    const secondRandom =
      pseudoRandom(
        index + 3400
      );

    const thirdRandom =
      pseudoRandom(
        index + 4400
      );

    const angle =
      random *
      Math.PI *
      2;

    const startRadius =
      206 +
      secondRandom * 11;

    const height =
      24 +
      thirdRandom * 72;

    const sideways =
      -32 +
      pseudoRandom(
        index + 5400
      ) *
        64;

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
      "rgba(255,238,145,0.65)"
    );

    gradient.addColorStop(
      0.4,
      "rgba(255,145,45,0.42)"
    );

    gradient.addColorStop(
      1,
      "rgba(255,75,15,0)"
    );

    context.strokeStyle =
      gradient;

    context.lineWidth =
      1 +
      secondRandom * 2.2;

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
      sideways * 1.08,

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

  /*
    Берём центральную квадратную
    часть NASA-фотографии.

    Благодаря этому подписи,
    служебные данные и края
    исходного изображения
    уходят за пределы кадра.
  */

  const shortestSide =
    Math.min(
      sourceWidth,
      sourceHeight
    );

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
    Круглая маска с мягким краем.

    Она полностью убирает
    прямоугольную форму фотографии
    и остатки чёрного фона.
  */

  context.globalCompositeOperation =
    "destination-in";

  const center =
    canvas.width / 2;

  const mask =
    context.createRadialGradient(
      center,
      center,
      center * 0.83,
      center,
      center,
      center * 0.985
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
    0.93,
    "rgba(255,255,255,0.96)"
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

  const corona =
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

  const coronaTexture =
    useMemo(
      () =>
        createCoronaTexture(),
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
      coronaTexture.dispose();
      prominenceTexture.dispose();
    };
  }, [
    cleanSunTexture,
    softGlowTexture,
    coronaTexture,
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
        delta * 0.0015;

      const size =
        0.96 +
        Math.sin(
          time * 0.48
        ) *
          0.003;

      sunPhoto.current.scale.set(
        size,
        size,
        1
      );
    }

    if (innerGlow.current) {
      const size =
        1.14 +
        Math.sin(
          time * 0.72
        ) *
          0.01;

      innerGlow.current.scale.set(
        size,
        size,
        1
      );
    }

    if (corona.current) {
      corona.current
        .material.rotation +=
        delta * 0.00035;

      const size =
        2.18 +
        Math.sin(
          time * 0.34
        ) *
          0.026;

      corona.current.scale.set(
        size,
        size,
        1
      );
    }

    if (prominences.current) {
      prominences.current
        .material.rotation -=
        delta * 0.0008;

      const size =
        1.54 +
        Math.sin(
          time * 0.4
        ) *
          0.018;

      prominences.current.scale.set(
        size,
        size,
        1
      );
    }

    if (distantGlow.current) {
      const size =
        3.45 +
        Math.sin(
          time * 0.2
        ) *
          0.035;

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
        color="#fff1c7"
        intensity={34}
        distance={45}
        decay={2}
      />

      {/*
        Очень слабое дальнее сияние.

        Оно больше не должно
        заливать весь экран красным.
      */}

      <sprite
        ref={distantGlow}
        scale={[
          3.45,
          3.45,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={softGlowTexture}
          color="#ff9a45"
          transparent
          opacity={0.055}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </sprite>

      {/*
        Неровная тонкая корона.

        Здесь больше нет длинных
        одинаковых прямых лучей.
      */}

      <sprite
        ref={corona}
        scale={[
          2.18,
          2.18,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={coronaTexture}
          color="#ffb24f"
          transparent
          opacity={0.72}
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
          1.54,
          1.54,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={prominenceTexture}
          color="#ff9a3d"
          transparent
          opacity={0.7}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </sprite>

      {/*
        Мягкое свечение непосредственно
        вокруг солнечного диска.
      */}

      <sprite
        ref={innerGlow}
        scale={[
          1.14,
          1.14,
          1,
        ]}
        raycast={() => null}
      >
        <spriteMaterial
          map={softGlowTexture}
          color="#ffd07a"
          transparent
          opacity={0.2}
          depthWrite={false}
          depthTest={true}
          toneMapped={false}
          blending={
            THREE.AdditiveBlending
          }
        />
      </sprite>

      {/*
        Очищенная NASA-фотография.

        Центральный crop убирает
        служебные надписи.

        Круглая маска убирает
        прямоугольник и чёрный фон.
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
        Невидимая кликабельная область.

        Перелёт камеры и кнопка
        возврата продолжают работать
        через прежний onSelect.
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