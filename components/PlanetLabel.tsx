"use client";

import {
  Html,
} from "@react-three/drei";

type Props = {
  name: string;

  position: [
    number,
    number,
    number
  ];

  visible?: boolean;
};

export default function PlanetLabel({
  name,
  position,
  visible = true,
}: Props) {
  if (!visible) {
    return null;
  }

  return (
    <Html
      position={position}
      center
      transform
      distanceFactor={12}
      zIndexRange={[
        20,
        0,
      ]}
      style={{
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <div
        style={{
          padding:
            "7px 12px",

          border:
            "1px solid rgba(255, 255, 255, 0.28)",

          borderRadius:
            "999px",

          background:
            "rgba(4, 8, 18, 0.72)",

          boxShadow:
            "0 8px 30px rgba(0, 0, 0, 0.45)",

          backdropFilter:
            "blur(12px)",

          WebkitBackdropFilter:
            "blur(12px)",

          color: "#ffffff",

          fontFamily:
            "Arial, Helvetica, sans-serif",

          fontSize: "13px",

          fontWeight: 700,

          letterSpacing:
            "0.16em",

          lineHeight: 1,

          textAlign:
            "center",

          textTransform:
            "uppercase",

          whiteSpace:
            "nowrap",

          textShadow:
            "0 0 12px rgba(255, 255, 255, 0.5)",

          opacity: 1,

          transform:
            "translateY(-8px)",

          animation:
            "adokvaPlanetLabelAppear 700ms ease-out both",
        }}
      >
        {name}

        <style>
          {`
            @keyframes adokvaPlanetLabelAppear {
              0% {
                opacity: 0;
                transform: translateY(4px) scale(0.88);
              }

              100% {
                opacity: 1;
                transform: translateY(-8px) scale(1);
              }
            }
          `}
        </style>
      </div>
    </Html>
  );
}