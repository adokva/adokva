"use client";

import {
  useMemo,
  useRef,
} from "react";

import {
  Stars,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

function createSpaceDust(
  count: number,
  minimumRadius: number,
  maximumRadius: number
) {
  const positions =
    new Float32Array(
      count * 3
    );

  const colors =
    new Float32Array(
      count * 3
    );

  const warmColor =
    new THREE.Color(
      "#ffe8cf"
    );

  const coldColor =
    new THREE.Color(
      "#cfe5ff"
    );

  const neutralColor =
    new THREE.Color(
      "#ffffff"
    );

  const finalColor =
    new THREE.Color();

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const radius =
      THREE.MathUtils.lerp(
        minimumRadius,
        maximumRadius,
        Math.pow(
          Math.random(),
          0.55
        )
      );

    const theta =
      Math.random() *
      Math.PI *
      2;

    const phi =
      Math.acos(
        THREE.MathUtils.lerp(
          -1,
          1,
          Math.random()
        )
      );

    const positionIndex =
      index * 3;

    positions[
      positionIndex
    ] =
      radius *
      Math.sin(phi) *
      Math.cos(theta);

    positions[
      positionIndex + 1
    ] =
      radius *
      Math.cos(phi);

    positions[
      positionIndex + 2
    ] =
      radius *
      Math.sin(phi) *
      Math.sin(theta);

    const colorChoice =
      Math.random();

    if (
      colorChoice < 0.18
    ) {
      finalColor.copy(
        warmColor
      );
    } else if (
      colorChoice < 0.38
    ) {
      finalColor.copy(
        coldColor
      );
    } else {
      finalColor.copy(
        neutralColor
      );
    }

    const brightness =
      THREE.MathUtils.lerp(
        0.38,
        1,
        Math.random()
      );

    finalColor.multiplyScalar(
      brightness
    );

    colors[
      positionIndex
    ] = finalColor.r;

    colors[
      positionIndex + 1
    ] = finalColor.g;

    colors[
      positionIndex + 2
    ] = finalColor.b;
  }

  return {
    positions,
    colors,
  };
}

export default function AnimatedStars() {
  const distantDust =
    useRef<THREE.Points>(
      null
    );

  const nearbyDust =
    useRef<THREE.Points>(
      null
    );

  const distantDustData =
    useMemo(
      () =>
        createSpaceDust(
          4200,
          120,
          310
        ),
      []
    );

  const nearbyDustData =
    useMemo(
      () =>
        createSpaceDust(
          950,
          38,
          105
        ),
      []
    );

  useFrame(
    (
      state,
      delta
    ) => {
      const time =
        state.clock.elapsedTime;

      if (
        distantDust.current
      ) {
        distantDust.current
          .rotation.y +=
          delta * 0.00035;

        distantDust.current
          .rotation.x =
          Math.sin(
            time * 0.025
          ) *
          0.004;
      }

      if (
        nearbyDust.current
      ) {
        nearbyDust.current
          .rotation.y -=
          delta * 0.0007;

        nearbyDust.current
          .rotation.z =
          Math.sin(
            time * 0.04
          ) *
          0.006;
      }
    }
  );

  return (
    <>
      {/*
        Очень далёкие мелкие звёзды.

        Этот слой создаёт плотность
        и глубину космоса.
      */}

      <Stars
        radius={320}
        depth={150}
        count={11000}
        factor={2.6}
        saturation={0.12}
        fade
        speed={0.018}
      />

      {/*
        Средний звёздный слой.

        Звёзды немного крупнее,
        но не перетягивают внимание
        с Земли и Солнца.
      */}

      <Stars
        radius={210}
        depth={90}
        count={4600}
        factor={4.4}
        saturation={0.18}
        fade
        speed={0.045}
      />

      {/*
        Редкие яркие звёзды
        переднего плана.
      */}

      <Stars
        radius={110}
        depth={42}
        count={720}
        factor={7.2}
        saturation={0.28}
        fade
        speed={0.085}
      />

      {/*
        Цветная звёздная пыль
        дальнего космоса.
      */}

      <points
        ref={distantDust}
        raycast={() => null}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              distantDustData.positions,
              3,
            ]}
          />

          <bufferAttribute
            attach="attributes-color"
            args={[
              distantDustData.colors,
              3,
            ]}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.19}
          sizeAttenuation
          transparent
          opacity={0.58}
          vertexColors
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
          toneMapped={false}
        />
      </points>

      {/*
        Ближняя пыль.

        Она движется немного иначе,
        поэтому пространство ощущается
        объёмным, а не плоской картинкой.
      */}

      <points
        ref={nearbyDust}
        raycast={() => null}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              nearbyDustData.positions,
              3,
            ]}
          />

          <bufferAttribute
            attach="attributes-color"
            args={[
              nearbyDustData.colors,
              3,
            ]}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.095}
          sizeAttenuation
          transparent
          opacity={0.44}
          vertexColors
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
          toneMapped={false}
        />
      </points>
    </>
  );
}