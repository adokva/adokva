"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SatelliteManager() {
  const orbitRef =
    useRef<THREE.Group>(null);

  const satelliteRef =
    useRef<THREE.Group>(null);

  const leftPanelRef =
    useRef<THREE.Group>(null);

  const rightPanelRef =
    useRef<THREE.Group>(null);

  const redLightRef =
    useRef<THREE.Mesh>(null);

  const greenLightRef =
    useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const time =
      state.clock.elapsedTime;

    if (orbitRef.current) {
      orbitRef.current.rotation.y +=
        delta * 0.16;
    }

    if (satelliteRef.current) {
      satelliteRef.current.rotation.y =
        -time * 0.18;

      satelliteRef.current.rotation.z =
        Math.sin(time * 0.45) *
        0.035;
    }

    if (leftPanelRef.current) {
      leftPanelRef.current.rotation.z =
        Math.sin(time * 0.32) *
        0.025;
    }

    if (rightPanelRef.current) {
      rightPanelRef.current.rotation.z =
        -Math.sin(time * 0.32) *
        0.025;
    }

    if (redLightRef.current) {
      const blink =
        Math.sin(time * 4.5) >
        0.7;

      redLightRef.current.visible =
        blink;
    }

    if (greenLightRef.current) {
      const blink =
        Math.sin(
          time * 4.5 +
            Math.PI
        ) > 0.7;

      greenLightRef.current.visible =
        blink;
    }
  });

  return (
    <group
      rotation={[
        0.5,
        0,
        0.18,
      ]}
    >
      <group ref={orbitRef}>
        <group
          ref={satelliteRef}
          position={[
            3.35,
            0,
            0,
          ]}
          rotation={[
            0.1,
            0.3,
            0,
          ]}
          scale={0.38}
        >
          {/* Центральный корпус */}

          <mesh>
            <boxGeometry
              args={[
                0.32,
                0.3,
                0.42,
              ]}
            />

            <meshStandardMaterial
              color="#9da4ad"
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>

          {/* Золотая термозащита */}

          <mesh
            scale={[
              1.035,
              1.035,
              1.035,
            ]}
          >
            <boxGeometry
              args={[
                0.32,
                0.3,
                0.42,
              ]}
            />

            <meshStandardMaterial
              color="#b97920"
              emissive="#271200"
              emissiveIntensity={
                0.12
              }
              metalness={0.7}
              roughness={0.42}
              transparent
              opacity={0.82}
            />
          </mesh>

          {/* Передняя панель корпуса */}

          <mesh
            position={[
              0,
              0,
              0.218,
            ]}
          >
            <boxGeometry
              args={[
                0.22,
                0.2,
                0.018,
              ]}
            />

            <meshStandardMaterial
              color="#242b35"
              metalness={0.8}
              roughness={0.28}
            />
          </mesh>

          {/* Верхний приборный модуль */}

          <mesh
            position={[
              0,
              0.205,
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                0.12,
                0.14,
                0.12,
                24,
              ]}
            />

            <meshStandardMaterial
              color="#c6cbd1"
              metalness={0.88}
              roughness={0.24}
            />
          </mesh>

          {/* Левая штанга */}

          <mesh
            position={[
              -0.34,
              0,
              0,
            ]}
            rotation={[
              0,
              0,
              Math.PI / 2,
            ]}
          >
            <cylinderGeometry
              args={[
                0.018,
                0.018,
                0.36,
                12,
              ]}
            />

            <meshStandardMaterial
              color="#7b828b"
              metalness={0.9}
              roughness={0.24}
            />
          </mesh>

          {/* Правая штанга */}

          <mesh
            position={[
              0.34,
              0,
              0,
            ]}
            rotation={[
              0,
              0,
              Math.PI / 2,
            ]}
          >
            <cylinderGeometry
              args={[
                0.018,
                0.018,
                0.36,
                12,
              ]}
            />

            <meshStandardMaterial
              color="#7b828b"
              metalness={0.9}
              roughness={0.24}
            />
          </mesh>

          {/* Левая солнечная панель */}

          <group
            ref={leftPanelRef}
            position={[
              -0.78,
              0,
              0,
            ]}
          >
            <mesh>
              <boxGeometry
                args={[
                  0.86,
                  0.018,
                  0.34,
                ]}
              />

              <meshStandardMaterial
                color="#0b315f"
                emissive="#041629"
                emissiveIntensity={
                  0.5
                }
                metalness={0.42}
                roughness={0.26}
                side={
                  THREE.DoubleSide
                }
              />
            </mesh>

            <mesh
              position={[
                0,
                0.013,
                0,
              ]}
            >
              <boxGeometry
                args={[
                  0.88,
                  0.008,
                  0.018,
                ]}
              />

              <meshStandardMaterial
                color="#9aa6b4"
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>

            <mesh
              position={[
                0,
                0.013,
                -0.11,
              ]}
            >
              <boxGeometry
                args={[
                  0.88,
                  0.008,
                  0.012,
                ]}
              />

              <meshStandardMaterial
                color="#7d8b9b"
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>

            <mesh
              position={[
                0,
                0.013,
                0.11,
              ]}
            >
              <boxGeometry
                args={[
                  0.88,
                  0.008,
                  0.012,
                ]}
              />

              <meshStandardMaterial
                color="#7d8b9b"
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>
          </group>

          {/* Правая солнечная панель */}

          <group
            ref={rightPanelRef}
            position={[
              0.78,
              0,
              0,
            ]}
          >
            <mesh>
              <boxGeometry
                args={[
                  0.86,
                  0.018,
                  0.34,
                ]}
              />

              <meshStandardMaterial
                color="#0b315f"
                emissive="#041629"
                emissiveIntensity={
                  0.5
                }
                metalness={0.42}
                roughness={0.26}
                side={
                  THREE.DoubleSide
                }
              />
            </mesh>

            <mesh
              position={[
                0,
                0.013,
                0,
              ]}
            >
              <boxGeometry
                args={[
                  0.88,
                  0.008,
                  0.018,
                ]}
              />

              <meshStandardMaterial
                color="#9aa6b4"
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>

            <mesh
              position={[
                0,
                0.013,
                -0.11,
              ]}
            >
              <boxGeometry
                args={[
                  0.88,
                  0.008,
                  0.012,
                ]}
              />

              <meshStandardMaterial
                color="#7d8b9b"
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>

            <mesh
              position={[
                0,
                0.013,
                0.11,
              ]}
            >
              <boxGeometry
                args={[
                  0.88,
                  0.008,
                  0.012,
                ]}
              />

              <meshStandardMaterial
                color="#7d8b9b"
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>
          </group>

          {/* Основание антенны */}

          <mesh
            position={[
              0,
              0,
              -0.25,
            ]}
            rotation={[
              Math.PI / 2,
              0,
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                0.035,
                0.035,
                0.12,
                16,
              ]}
            />

            <meshStandardMaterial
              color="#8f969f"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>

          {/* Тарелка антенны */}

          <mesh
            position={[
              0,
              0,
              -0.36,
            ]}
            rotation={[
              Math.PI / 2,
              0,
              0,
            ]}
          >
            <coneGeometry
              args={[
                0.15,
                0.055,
                32,
                1,
                true,
              ]}
            />

            <meshStandardMaterial
              color="#d6d9dd"
              metalness={0.82}
              roughness={0.22}
              side={
                THREE.DoubleSide
              }
            />
          </mesh>

          {/* Двигатели */}

          <mesh
            position={[
              -0.09,
              -0.19,
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                0.038,
                0.055,
                0.11,
                16,
              ]}
            />

            <meshStandardMaterial
              color="#555c65"
              metalness={0.92}
              roughness={0.28}
            />
          </mesh>

          <mesh
            position={[
              0.09,
              -0.19,
              0,
            ]}
          >
            <cylinderGeometry
              args={[
                0.038,
                0.055,
                0.11,
                16,
              ]}
            />

            <meshStandardMaterial
              color="#555c65"
              metalness={0.92}
              roughness={0.28}
            />
          </mesh>

          {/* Красный навигационный огонь */}

          <mesh
            ref={redLightRef}
            position={[
              -0.18,
              0.16,
              0.16,
            ]}
          >
            <sphereGeometry
              args={[
                0.018,
                12,
                12,
              ]}
            />

            <meshBasicMaterial
              color="#ff3028"
              toneMapped={false}
            />
          </mesh>

          {/* Зелёный навигационный огонь */}

          <mesh
            ref={greenLightRef}
            position={[
              0.18,
              0.16,
              0.16,
            ]}
          >
            <sphereGeometry
              args={[
                0.018,
                12,
                12,
              ]}
            />

            <meshBasicMaterial
              color="#35ff74"
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}