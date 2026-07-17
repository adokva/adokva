"use client";

import { useMemo } from "react";
import * as THREE from "three";

import { SUN_POSITION } from "../lib/space";

export default function Atmosphere() {
  const uniforms = useMemo(
    () => ({
      sunPosition: {
        value: new THREE.Vector3(
          SUN_POSITION[0],
          SUN_POSITION[1],
          SUN_POSITION[2]
        ),
      },

      dayColor: {
        value: new THREE.Color("#57aaff"),
      },

      horizonColor: {
        value: new THREE.Color("#b7dcff"),
      },

      sunsetColor: {
        value: new THREE.Color("#ff8a43"),
      },
    }),
    []
  );

  return (
    <mesh
      scale={1.026}
      renderOrder={2}
    >
      <sphereGeometry args={[2, 192, 192]} />

      <shaderMaterial
        uniforms={uniforms}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        depthTest
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        vertexShader={`
          varying vec3 vWorldPosition;
          varying vec3 vWorldNormal;

          void main() {
            vec4 worldPosition =
              modelMatrix *
              vec4(position, 1.0);

            vWorldPosition =
              worldPosition.xyz;

            vWorldNormal =
              normalize(
                mat3(modelMatrix) *
                normal
              );

            gl_Position =
              projectionMatrix *
              viewMatrix *
              worldPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 sunPosition;
          uniform vec3 dayColor;
          uniform vec3 horizonColor;
          uniform vec3 sunsetColor;

          varying vec3 vWorldPosition;
          varying vec3 vWorldNormal;

          void main() {
            vec3 normalDirection =
              normalize(vWorldNormal);

            vec3 viewDirection =
              normalize(
                cameraPosition -
                vWorldPosition
              );

            vec3 sunDirection =
              normalize(
                sunPosition -
                vWorldPosition
              );

            /*
              Значение 0 находится в центре,
              значение 1 — на самом горизонте.
            */

            float fresnel =
              1.0 -
              abs(
                dot(
                  normalDirection,
                  viewDirection
                )
              );

            /*
              Оставляем только узчайшую
              внешнюю дугу атмосферы.

              Центр сферы становится
              полностью прозрачным.
            */

            float outerRim =
              smoothstep(
                0.84,
                0.995,
                fresnel
              );

            outerRim =
              pow(
                outerRim,
                2.4
              );

            float sunAmount =
              dot(
                normalDirection,
                sunDirection
              );

            /*
              Голубая атмосфера видна
              преимущественно на дневной
              стороне и немного в сумерках.
            */

            float dayMask =
              smoothstep(
                -0.28,
                0.38,
                sunAmount
              );

            /*
              Узкая полоса рассвета
              и заката возле терминатора.
            */

            float terminatorDistance =
              abs(sunAmount);

            float sunsetBand =
              1.0 -
              smoothstep(
                0.015,
                0.115,
                terminatorDistance
              );

            sunsetBand *=
              smoothstep(
                -0.12,
                0.08,
                sunAmount
              );

            /*
              Светлый тонкий край ближе
              к направлению Солнца.
            */

            float forwardSun =
              pow(
                max(
                  dot(
                    viewDirection,
                    sunDirection
                  ),
                  0.0
                ),
                3.0
              );

            vec3 blueColor =
              mix(
                dayColor,
                horizonColor,
                forwardSun * 0.52
              );

            vec3 finalColor =
              mix(
                blueColor,
                sunsetColor,
                sunsetBand * 0.88
              );

            float blueAlpha =
              outerRim *
              dayMask *
              0.28;

            float sunsetAlpha =
              outerRim *
              sunsetBand *
              0.22;

            float alpha =
              blueAlpha +
              sunsetAlpha;

            /*
              Ночная половина почти
              не получает голубой каймы.
            */

            float nightSuppression =
              smoothstep(
                -0.48,
                -0.12,
                sunAmount
              );

            alpha *=
              mix(
                0.035,
                1.0,
                nightSuppression
              );

            if (alpha < 0.004) {
              discard;
            }

            gl_FragColor =
              vec4(
                finalColor * alpha,
                alpha
              );
          }
        `}
      />
    </mesh>
  );
}