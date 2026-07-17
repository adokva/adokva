"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";

import * as THREE from "three";

import Atmosphere from "./Atmosphere";
import Clouds from "./Clouds";
import Marker from "./Marker";

import {
  locations,
} from "../data/locations";

export type GlobeTarget = {
  lat: number;
  lon: number;
} | null;

type Props = {
  target: GlobeTarget;
};

type SolarCoordinates = {
  latitude: number;
  longitude: number;
};

const DEG_TO_RAD =
  Math.PI / 180;

const RAD_TO_DEG =
  180 / Math.PI;

/*
  Новая астрономическая позиция
  Солнца рассчитывается раз
  в 30 секунд.

  Между расчётами направление
  изменяется плавно.
*/

const SUN_UPDATE_INTERVAL =
  30000;

function normalizeDegrees(
  value: number
) {
  return (
    ((value % 360) + 360) %
    360
  );
}

function normalizeLongitude(
  value: number
) {
  return (
    ((value + 180) % 360 +
      360) %
      360 -
    180
  );
}

function dateToJulianDay(
  date: Date
) {
  return (
    date.getTime() /
      86400000 +
    2440587.5
  );
}

/*
  Рассчитывает географическую точку,
  над которой Солнце находится
  практически в зените.

  Расчёт основан на текущей дате
  и времени UTC.
*/

function getSubsolarCoordinates(
  date: Date
): SolarCoordinates {
  const julianDay =
    dateToJulianDay(
      date
    );

  const daysSinceJ2000 =
    julianDay -
    2451545;

  const centuriesSinceJ2000 =
    daysSinceJ2000 /
    36525;

  const meanLongitude =
    normalizeDegrees(
      280.46646 +
        36000.76983 *
          centuriesSinceJ2000 +
        0.0003032 *
          centuriesSinceJ2000 *
          centuriesSinceJ2000
    );

  const meanAnomaly =
    normalizeDegrees(
      357.52911 +
        35999.05029 *
          centuriesSinceJ2000 -
        0.0001537 *
          centuriesSinceJ2000 *
          centuriesSinceJ2000
    ) *
    DEG_TO_RAD;

  const equationOfCenter =
    (
      1.914602 -
      0.004817 *
        centuriesSinceJ2000 -
      0.000014 *
        centuriesSinceJ2000 *
        centuriesSinceJ2000
    ) *
      Math.sin(
        meanAnomaly
      ) +
    (
      0.019993 -
      0.000101 *
        centuriesSinceJ2000
    ) *
      Math.sin(
        meanAnomaly * 2
      ) +
    0.000289 *
      Math.sin(
        meanAnomaly * 3
      );

  const trueLongitude =
    meanLongitude +
    equationOfCenter;

  const omega =
    (
      125.04 -
      1934.136 *
        centuriesSinceJ2000
    ) *
    DEG_TO_RAD;

  const apparentLongitude =
    (
      trueLongitude -
      0.00569 -
      0.00478 *
        Math.sin(
          omega
        )
    ) *
    DEG_TO_RAD;

  const meanObliquity =
    (
      23 +
      (
        26 +
        (
          21.448 -
          46.815 *
            centuriesSinceJ2000 -
          0.00059 *
            centuriesSinceJ2000 *
            centuriesSinceJ2000 +
          0.001813 *
            centuriesSinceJ2000 *
            centuriesSinceJ2000 *
            centuriesSinceJ2000
        ) /
          60
      ) /
        60
    ) *
    DEG_TO_RAD;

  const trueObliquity =
    meanObliquity +
    0.00256 *
      DEG_TO_RAD *
      Math.cos(
        omega
      );

  const rightAscension =
    Math.atan2(
      Math.cos(
        trueObliquity
      ) *
        Math.sin(
          apparentLongitude
        ),

      Math.cos(
        apparentLongitude
      )
    );

  const declination =
    Math.asin(
      Math.sin(
        trueObliquity
      ) *
        Math.sin(
          apparentLongitude
        )
    );

  const greenwichSiderealTime =
    normalizeDegrees(
      280.46061837 +
        360.98564736629 *
          daysSinceJ2000 +
        0.000387933 *
          centuriesSinceJ2000 *
          centuriesSinceJ2000 -
        (
          centuriesSinceJ2000 *
          centuriesSinceJ2000 *
          centuriesSinceJ2000
        ) /
          38710000
    );

  const latitude =
    declination *
    RAD_TO_DEG;

  const longitude =
    normalizeLongitude(
      rightAscension *
        RAD_TO_DEG -
        greenwichSiderealTime
    );

  return {
    latitude,
    longitude,
  };
}

function latLonToVector3(
  lat: number,
  lon: number,
  radius: number
) {
  const phi =
    (90 - lat) *
    DEG_TO_RAD;

  const theta =
    (lon + 180) *
    DEG_TO_RAD;

  return new THREE.Vector3(
    -radius *
      Math.sin(
        phi
      ) *
      Math.cos(
        theta
      ),

    radius *
      Math.cos(
        phi
      ),

    radius *
      Math.sin(
        phi
      ) *
      Math.sin(
        theta
      )
  );
}

function getRealSunDirection(
  date: Date
) {
  const coordinates =
    getSubsolarCoordinates(
      date
    );

  return latLonToVector3(
    coordinates.latitude,
    coordinates.longitude,
    1
  ).normalize();
}

function isSameLocation(
  city: {
    lat: number;
    lon: number;
  },
  target: GlobeTarget
) {
  if (!target) {
    return false;
  }

  return (
    Math.abs(
      city.lat -
        target.lat
    ) < 0.01 &&
    Math.abs(
      city.lon -
        target.lon
    ) < 0.01
  );
}

export default function Globe({
  target,
}: Props) {
  const group =
    useRef<THREE.Group>(
      null
    );

  const {
    camera,
  } = useThree();

  const destinationQuaternion =
    useRef<
      THREE.Quaternion | null
    >(null);

  const lastSunUpdate =
    useRef(0);

  const neutralQuaternion =
    useMemo(
      () =>
        new THREE.Quaternion(),
      []
    );

  const initialSunDirection =
    useMemo(
      () =>
        getRealSunDirection(
          new Date()
        ),
      []
    );

  const targetSunDirection =
    useRef(
      initialSunDirection.clone()
    );

  const dayTexture =
    useLoader(
      THREE.TextureLoader,
      "/textures/earth.jpg"
    );

  const nightTexture =
    useLoader(
      THREE.TextureLoader,
      "/textures/night.jpg"
    );

  useEffect(() => {
    dayTexture.colorSpace =
      THREE.SRGBColorSpace;

    nightTexture.colorSpace =
      THREE.SRGBColorSpace;

    dayTexture.anisotropy = 16;
    nightTexture.anisotropy = 16;

    dayTexture.wrapS =
      THREE.RepeatWrapping;

    nightTexture.wrapS =
      THREE.RepeatWrapping;

    dayTexture.wrapT =
      THREE.ClampToEdgeWrapping;

    nightTexture.wrapT =
      THREE.ClampToEdgeWrapping;

    dayTexture.needsUpdate =
      true;

    nightTexture.needsUpdate =
      true;
  }, [
    dayTexture,
    nightTexture,
  ]);

  const earthUniforms =
    useMemo(
      () => ({
        dayTexture: {
          value:
            dayTexture,
        },

        nightTexture: {
          value:
            nightTexture,
        },

        sunDirection: {
          value:
            initialSunDirection.clone(),
        },

        daylightStrength: {
          value: 0.96,
        },

        nightStrength: {
          value: 1.08,
        },

        ambientStrength: {
          value: 0.022,
        },
      }),
      [
        dayTexture,
        initialSunDirection,
        nightTexture,
      ]
    );

  /*
    Поворот Земли к найденному
    человеку или городу.
  */

  useEffect(() => {
    if (!target) {
      destinationQuaternion.current =
        neutralQuaternion.clone();

      return;
    }

    const cityDirection =
      latLonToVector3(
        target.lat,
        target.lon,
        1
      ).normalize();

    const cameraDirection =
      camera.position
        .clone()
        .normalize();

    const cameraRight =
      new THREE.Vector3()
        .setFromMatrixColumn(
          camera.matrixWorld,
          0
        )
        .normalize();

    const displayDirection =
      cameraDirection
        .clone()
        .addScaledVector(
          cameraRight,
          -0.24
        )
        .normalize();

    destinationQuaternion.current =
      new THREE.Quaternion()
        .setFromUnitVectors(
          cityDirection,
          displayDirection
        );
  }, [
    camera,
    neutralQuaternion,
    target,
  ]);

  useFrame(
    (
      state,
      delta
    ) => {
      /*
        Пересчёт настоящего положения
        Солнца по текущему UTC.
      */

      const elapsedMilliseconds =
        state.clock
          .elapsedTime *
        1000;

      if (
        lastSunUpdate.current ===
          0 ||
        elapsedMilliseconds -
          lastSunUpdate.current >=
          SUN_UPDATE_INTERVAL
      ) {
        targetSunDirection.current.copy(
          getRealSunDirection(
            new Date()
          )
        );

        lastSunUpdate.current =
          elapsedMilliseconds;
      }

      /*
        Плавное движение терминатора.

        Даже при новом расчёте
        граница дня и ночи
        не должна дёргаться.
      */

      const sunSmoothness =
        1 -
        Math.exp(
          -delta * 0.8
        );

      earthUniforms
        .sunDirection
        .value
        .lerp(
          targetSunDirection.current,
          sunSmoothness
        )
        .normalize();

      /*
        Плавный поворот Земли
        к выбранному человеку.
      */

      if (
        !group.current ||
        !destinationQuaternion.current
      ) {
        return;
      }

      const rotationSmoothness =
        1 -
        Math.exp(
          -delta * 2.25
        );

      group.current.quaternion.slerp(
        destinationQuaternion.current,
        rotationSmoothness
      );

      const remainingAngle =
        group.current
          .quaternion
          .angleTo(
            destinationQuaternion.current
          );

      if (
        remainingAngle <
        0.0005
      ) {
        group.current.quaternion.copy(
          destinationQuaternion.current
        );

        destinationQuaternion.current =
          null;
      }
    }
  );

  return (
    <group
      ref={group}
    >
      {/*
        Земля с реальным терминатором,
        рассчитанным по времени UTC.
      */}

      <mesh>
        <sphereGeometry
          args={[
            2,
            192,
            192,
          ]}
        />

        <shaderMaterial
          uniforms={
            earthUniforms
          }
          vertexShader={`
            varying vec2 vUv;
            varying vec3 vLocalNormal;

            void main() {
              vUv = uv;

              vLocalNormal =
                normalize(normal);

              gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(
                  position,
                  1.0
                );
            }
          `}
          fragmentShader={`
            uniform sampler2D dayTexture;
            uniform sampler2D nightTexture;

            uniform vec3 sunDirection;

            uniform float daylightStrength;
            uniform float nightStrength;
            uniform float ambientStrength;

            varying vec2 vUv;
            varying vec3 vLocalNormal;

            void main() {
              vec3 normalDirection =
                normalize(
                  vLocalNormal
                );

              vec3 normalizedSunDirection =
                normalize(
                  sunDirection
                );

              float sunDot =
                dot(
                  normalDirection,
                  normalizedSunDirection
                );

              /*
                Дневная сторона.

                Переход достаточно мягкий,
                но географическая граница
                остаётся настоящей.
              */

              float daylight =
                smoothstep(
                  -0.13,
                  0.28,
                  sunDot
                );

              /*
                Огни городов включаются
                после захода Солнца.

                На дневной стороне
                они полностью исчезают.
              */

              float nightMask =
                1.0 -
                smoothstep(
                  -0.22,
                  0.015,
                  sunDot
                );

              /*
                Сумеречная зона
                вдоль терминатора.
              */

              float twilight =
                1.0 -
                smoothstep(
                  0.0,
                  0.15,
                  abs(
                    sunDot
                  )
                );

              vec3 dayColor =
                texture2D(
                  dayTexture,
                  vUv
                ).rgb;

              vec3 cityLights =
                texture2D(
                  nightTexture,
                  vUv
                ).rgb;

              /*
                Естественная цветокоррекция
                поверхности Земли.
              */

              dayColor *=
                vec3(
                  0.98,
                  0.97,
                  0.87
                );

              float luminance =
                dot(
                  dayColor,
                  vec3(
                    0.2126,
                    0.7152,
                    0.0722
                  )
                );

              dayColor =
                mix(
                  vec3(
                    luminance
                  ),
                  dayColor,
                  0.95
                );

              float surfaceLight =
                ambientStrength +
                daylight *
                daylightStrength;

              vec3 illuminatedDay =
                dayColor *
                surfaceLight;

              vec3 illuminatedNight =
                cityLights *
                nightMask *
                nightStrength;

              /*
                Очень тонкая тёплая линия
                заката и рассвета.
              */

              vec3 twilightColor =
                vec3(
                  0.17,
                  0.045,
                  0.006
                ) *
                twilight *
                0.04;

              vec3 finalColor =
                illuminatedDay +
                illuminatedNight +
                twilightColor;

              gl_FragColor =
                vec4(
                  finalColor,
                  1.0
                );

              #include <tonemapping_fragment>
              #include <colorspace_fragment>
            }
          `}
        />
      </mesh>

      {/*
        Тонкий океанический слой.
      */}

      <mesh>
        <sphereGeometry
          args={[
            2.005,
            160,
            160,
          ]}
        />

        <meshPhysicalMaterial
          color="#071c2e"
          transparent
          opacity={0.012}
          roughness={0.62}
          metalness={0}
          clearcoat={0.08}
          clearcoatRoughness={
            0.72
          }
          depthWrite={false}
        />
      </mesh>

      <Atmosphere />

      {/*
        Маркеры городов.
      */}

      {locations.map(
        (city) => {
          const selected =
            isSameLocation(
              city,
              target
            );

          return (
            <Marker
              key={city.id}
              selected={
                selected
              }
              position={
                latLonToVector3(
                  city.lat,
                  city.lon,
                  selected
                    ? 2.065
                    : 2.035
                ).toArray() as [
                  number,
                  number,
                  number,
                ]
              }
            />
          );
        }
      )}

      <Clouds />
    </group>
  );
}