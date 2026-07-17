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

import { locations } from "../data/locations";
import { SUN_POSITION } from "../lib/space";

export type GlobeTarget = {
  lat: number;
  lon: number;
} | null;

type Props = {
  target: GlobeTarget;
};

function latLonToVector3(
  lat: number,
  lon: number,
  radius: number
) {
  const phi =
    (90 - lat) *
    (Math.PI / 180);

  const theta =
    (lon + 180) *
    (Math.PI / 180);

  return new THREE.Vector3(
    -radius *
      Math.sin(phi) *
      Math.cos(theta),

    radius *
      Math.cos(phi),

    radius *
      Math.sin(phi) *
      Math.sin(theta)
  );
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
      city.lat - target.lat
    ) < 0.01 &&
    Math.abs(
      city.lon - target.lon
    ) < 0.01
  );
}

export default function Globe({
  target,
}: Props) {
  const group =
    useRef<THREE.Group>(null!);

  const { camera } = useThree();

  const destinationQuaternion =
    useRef<THREE.Quaternion | null>(
      null
    );

  const neutralQuaternion =
    useMemo(
      () => new THREE.Quaternion(),
      []
    );

  const day = useLoader(
    THREE.TextureLoader,
    "/textures/earth.jpg"
  );

  const night = useLoader(
    THREE.TextureLoader,
    "/textures/night.jpg"
  );

  day.colorSpace =
    THREE.SRGBColorSpace;

  night.colorSpace =
    THREE.SRGBColorSpace;

  day.anisotropy = 16;
  night.anisotropy = 16;

  day.wrapS =
    THREE.RepeatWrapping;

  night.wrapS =
    THREE.RepeatWrapping;

  const earthUniforms =
    useMemo(
      () => ({
        dayTexture: {
          value: day,
        },

        nightTexture: {
          value: night,
        },

        sunPosition: {
          value:
            new THREE.Vector3(
              SUN_POSITION[0],
              SUN_POSITION[1],
              SUN_POSITION[2]
            ),
        },

        daylightStrength: {
          value: 0.93,
        },

        nightStrength: {
          value: 1.05,
        },

        ambientStrength: {
          value: 0.035,
        },
      }),
      [day, night]
    );

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

  useFrame((_, delta) => {
    if (
      !group.current ||
      !destinationQuaternion.current
    ) {
      return;
    }

    const smoothness =
      1 -
      Math.exp(-delta * 2.25);

    group.current.quaternion.slerp(
      destinationQuaternion.current,
      smoothness
    );

    const remainingAngle =
      group.current.quaternion.angleTo(
        destinationQuaternion.current
      );

    if (
      remainingAngle < 0.0005
    ) {
      group.current.quaternion.copy(
        destinationQuaternion.current
      );

      destinationQuaternion.current =
        null;
    }
  });

  return (
    <group ref={group}>
      {/* Земля: естественный день и глубокая ночь */}

      <mesh>
        <sphereGeometry
          args={[2, 192, 192]}
        />

        <shaderMaterial
          uniforms={earthUniforms}
          vertexShader={`
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            varying vec3 vWorldPosition;

            void main() {
              vUv = uv;

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
            uniform sampler2D dayTexture;
            uniform sampler2D nightTexture;

            uniform vec3 sunPosition;

            uniform float daylightStrength;
            uniform float nightStrength;
            uniform float ambientStrength;

            varying vec2 vUv;
            varying vec3 vWorldNormal;
            varying vec3 vWorldPosition;

            void main() {
              vec3 normalDirection =
                normalize(vWorldNormal);

              vec3 sunDirection =
                normalize(
                  sunPosition -
                  vWorldPosition
                );

              float sunDot =
                dot(
                  normalDirection,
                  sunDirection
                );

              /*
                Мягкое дневное освещение.
              */

              float daylight =
                smoothstep(
                  -0.08,
                  0.38,
                  sunDot
                );

              /*
                Огни появляются только
                в глубокой ночи.

                На дневной стороне они
                полностью выключены.
              */

              float nightMask =
                1.0 -
                smoothstep(
                  -0.34,
                  -0.08,
                  sunDot
                );

              /*
                Очень узкая и спокойная
                сумеречная полоса.
              */

              float twilight =
                1.0 -
                smoothstep(
                  0.0,
                  0.09,
                  abs(sunDot)
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
                Убираем пластиковую
                насыщенную синеву океана.

                Немного снижаем синий канал
                и возвращаем естественную
                глубину изображения.
              */

              dayColor *= vec3(
                0.98,
                0.97,
                0.84
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
                  vec3(luminance),
                  dayColor,
                  0.94
                );

              /*
                На освещённой стороне
                есть мягкий солнечный свет.

                На ночной стороне остаётся
                только слабая видимость
                поверхности.
              */

              float surfaceLight =
                ambientStrength +
                daylight *
                daylightStrength;

              vec3 illuminatedDay =
                dayColor *
                surfaceLight;

              /*
                Огни городов не окрашивают
                всю поверхность, а добавляются
                только в глубокой ночи.
              */

              vec3 illuminatedNight =
                cityLights *
                nightMask *
                nightStrength;

              /*
                Едва заметный тёплый край,
                без фиолетового пятна.
              */

              vec3 sunsetColor =
                vec3(
                  0.16,
                  0.055,
                  0.012
                ) *
                twilight *
                0.035;

              vec3 finalColor =
                illuminatedDay +
                illuminatedNight +
                sunsetColor;

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

      {/* Очень тонкий океанический блеск */}

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
          clearcoatRoughness={0.72}
          depthWrite={false}
        />
      </mesh>

      {/* Атмосфера */}

      <Atmosphere />

      {/* Маркеры */}

      {locations.map((city) => {
        const selected =
          isSameLocation(
            city,
            target
          );

        return (
          <Marker
            key={city.id}
            selected={selected}
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
      })}

      {/* Облака */}

      <Clouds />
    </group>
  );
}