"use client";

export default function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry
        args={[1.58, 64, 64]}
      />

      <meshBasicMaterial
        color="#4da6ff"
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}
