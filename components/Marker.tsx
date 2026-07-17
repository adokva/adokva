"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
  position: [number, number, number];
  selected?: boolean;
};

export default function Marker({
  position,
  selected = false,
}: Props) {
  const group = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!group.current) return;

    const time = clock.elapsedTime;

    const pulse = selected
      ? 1 + Math.sin(time * 3.5) * 0.12
      : 1 + Math.sin(time * 2) * 0.04;

    group.current.scale.setScalar(pulse);
  });

  return (
    <group
      ref={group}
      position={position}
    >
      {/* Мягкое небольшое свечение */}
      <mesh>
        <sphereGeometry
          args={[
            selected ? 0.055 : 0.028,
            24,
            24,
          ]}
        />

        <meshBasicMaterial
          color={
            selected
              ? "#39bfff"
              : "#ffd84a"
          }
          transparent
          opacity={
            selected ? 0.22 : 0.14
          }
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Ядро маркера */}
      <mesh>
        <sphereGeometry
          args={[
            selected ? 0.024 : 0.013,
            24,
            24,
          ]}
        />

        <meshBasicMaterial
          color={
            selected
              ? "#a9e8ff"
              : "#fff0a0"
          }
          toneMapped={false}
        />
      </mesh>

      {/* Дополнительное голубое кольцо выбранного города */}
      {selected && (
        <mesh scale={1.55}>
          <sphereGeometry
            args={[0.04, 24, 24]}
          />

          <meshBasicMaterial
            color="#2dafff"
            transparent
            opacity={0.1}
            depthWrite={false}
            toneMapped={false}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}