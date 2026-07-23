"use client";

import {
  useMemo,
  useRef,
} from "react";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

type Props = {
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitTilt?: number;
  startAngle?: number;
  scale?: number;
};

export default function Satellite({
  orbitRadius = 3.35,
  orbitSpeed = 0.16,
  orbitTilt = 0.42,
  startAngle = 0,
  scale = 1,
}: Props) {
  const orbitGroup =
    useRef<THREE.Group>(null);

  const satelliteGroup =
    useRef<THREE.Group>(null);

  const antenna =
    useRef<THREE.Mesh>(null);

  const solarPanelMaterial =
    useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          color: "#173f78",
          emissive: "#07182f",
          emissiveIntensity: 0.65,
          metalness: 0.42,
          roughness: 0.32,
          side: THREE.DoubleSide,
        }),
      []
    );

  useFrame(
    (
      state,
      delta
    ) => {
      const time =
        state.clock.elapsedTime;

      if (orbitGroup.current) {
        orbitGroup.current.rotation.y +=
          delta * orbitSpeed;
      }

      if (satelliteGroup.current) {
        satelliteGroup.current.rotation.y =
          -time * 0.18;

        satelliteGroup.current.rotation.z =
          Math.sin(
            time * 0.7
          ) * 0.035;
      }

      if (antenna.current) {
        antenna.current.rotation.z =
          Math.sin(
            time * 0.85
          ) * 0.045;
      }
    }
  );

  return (
    <group
      rotation={[
        orbitTilt,
        startAngle,
        orbitTilt * 0.35,
      ]}
    >
      <group
        ref={orbitGroup}
      >
        <group
          ref={satelliteGroup}
          position={[
            orbitRadius,
            0,
            0,
          ]}
          scale={scale}
        >
          {/*
            Центральный корпус спутника.
          */}

          <mesh>
            <boxGeometry
              args={[
                0.16,
                0.13,
                0.22,
              ]}
            />

            <meshStandardMaterial
              color="#b7bcc4"
              metalness={0.82}
              roughness={0.28}
            />
          </mesh>

          {/*
            Золотой защитный слой.
          */}

          <mesh
            position={[
              0,
              0,
              0.003,
            ]}
            scale={[
              1.04,
              1.04,
              1.04,
            ]}
          >
            <boxGeometry
              args={[
                0.16,
                0.13,
                0.22,
              ]}
            />

            <meshStandardMaterial
              color="#b57a20"
              emissive="#271200"
              emissiveIntensity={0.22}
              metalness={0.7}
              roughness={0.38}
              transparent
              opacity={0.52}
            />
          </mesh>

          {/*
            Левая солнечная панель.
          */}

          <mesh
            position={[
              -0.34,
              0,
              0,
            ]}
            material={
              solarPanelMaterial
            }
          >
            <boxGeometry
              args={[
                0.48,
                0.012,
                0.22,
              ]}
            />
          </mesh>

          {/*
            Правая солнечная панель.
          */}

          <mesh
            position={[
              0.34,
              0,
              0,
            ]}
            material={
              solarPanelMaterial
            }
          >
            <boxGeometry
              args={[
                0.48,
                0.012,
                0.22,
              ]}
            />
          </mesh>

          {/*
            Светлые линии на панелях.
          */}

          {[
            -0.52,
            -0.4,
            -0.28,
            0.28,
            0.4,
            0.52,
          ].map(
            (
              panelX
            ) => (
              <mesh
                key={panelX}
                position={[
                  panelX,
                  0.009,
                  0,
                ]}
              >
                <boxGeometry
                  args={[
                    0.008,
                    0.004,
                    0.21,
                  ]}
                />

                <meshBasicMaterial
                  color="#6c91c8"
                  transparent
                  opacity={0.7}
                />
              </mesh>
            )
          )}

          {/*
            Центральная антенна.
          */}

          <group
            ref={antenna}
            position={[
              0,
              0.11,
              0,
            ]}
          >
            <mesh
              position={[
                0,
                0.055,
                0,
              ]}
            >
              <cylinderGeometry
                args={[
                  0.012,
                  0.012,
                  0.11,
                  12,
                ]}
              />

              <meshStandardMaterial
                color="#d4d8de"
                metalness={0.9}
                roughness={0.22}
              />
            </mesh>

            <mesh
              position={[
                0,
                0.12,
                0,
              ]}
              rotation={[
                Math.PI,
                0,
                0,
              ]}
            >
              <coneGeometry
                args={[
                  0.055,
                  0.03,
                  24,
                  1,
                  true,
                ]}
              />

              <meshStandardMaterial
                color="#d9dde3"
                metalness={0.72}
                roughness={0.3}
                side={
                  THREE.DoubleSide
                }
              />
            </mesh>
          </group>

          {/*
            Маленький навигационный огонь.
          */}

          <mesh
            position={[
              0,
              0.075,
              0.12,
            ]}
          >
            <sphereGeometry
              args={[
                0.018,
                16,
                16,
              ]}
            />

            <meshBasicMaterial
              color="#ff3e35"
              toneMapped={false}
            />
          </mesh>

          <pointLight
            position={[
              0,
              0.075,
              0.14,
            ]}
            color="#ff3e35"
            intensity={0.18}
            distance={0.45}
            decay={2}
          />
        </group>
      </group>
    </group>
  );
}