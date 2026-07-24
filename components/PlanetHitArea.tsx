"use client";

type Props = {
  radius: number;

  onSelect?: () => void;
};

export default function PlanetHitArea({
  radius,
  onSelect,
}: Props) {
  return (
    <mesh
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect?.();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();

        document.body.style.cursor =
          "pointer";
      }}
      onPointerOut={(event) => {
        event.stopPropagation();

        document.body.style.cursor =
          "default";
      }}
    >
      <sphereGeometry
        args={[
          radius,
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
  );
}