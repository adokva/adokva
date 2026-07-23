"use client";

import type {
  SelectedWorld,
} from "@/types/world";

type Props = {
  world: SelectedWorld;
  onClose: () => void;
};

type WorldInformation = {
  symbol: string;
  name: string;
  subtitle: string;
  facts: {
    label: string;
    value: string;
  }[];
};

const WORLD_INFORMATION: Partial<
  Record<
    NonNullable<SelectedWorld>,
    WorldInformation
  >
> = {
  sun: {
    symbol: "☀",
    name: "SUN",
    subtitle:
      "The star at the centre of our Solar System",
    facts: [
      {
        label: "Radius",
        value: "696 340 km",
      },
      {
        label: "Surface temperature",
        value: "≈ 5 500 °C",
      },
      {
        label: "Age",
        value: "≈ 4.6 billion years",
      },
      {
        label: "Distance from Earth",
        value: "≈ 149.6 million km",
      },
    ],
  },

  moon: {
    symbol: "◐",
    name: "MOON",
    subtitle:
      "Earth's natural satellite",
    facts: [
      {
        label: "Distance from Earth",
        value: "≈ 384 400 km",
      },
      {
        label: "Radius",
        value: "1 737 km",
      },
      {
        label: "Gravity",
        value: "1.62 m/s²",
      },
      {
        label: "Orbital period",
        value: "27.3 days",
      },
    ],
  },

  mars: {
    symbol: "●",
    name: "MARS",
    subtitle:
      "The fourth planet from the Sun",
    facts: [
      {
        label: "Distance from Sun",
        value: "≈ 227.9 million km",
      },
      {
        label: "Radius",
        value: "3 390 km",
      },
      {
        label: "Gravity",
        value: "3.72 m/s²",
      },
      {
        label: "Day length",
        value: "24 h 37 min",
      },
      {
        label: "Moons",
        value: "Phobos and Deimos",
      },
    ],
  },
};

export default function WorldInfoPanel({
  world,
  onClose,
}: Props) {
  if (
    !world ||
    world === "earth"
  ) {
    return null;
  }

  const information =
    WORLD_INFORMATION[world];

  if (!information) {
    return null;
  }

  return (
    <aside
      style={{
        position: "fixed",

        top: 28,
        right: 28,

        zIndex: 1000,

        width:
          "min(360px, calc(100vw - 40px))",

        padding: "24px",

        color: "#ffffff",

        background:
          "linear-gradient(145deg, rgba(10, 18, 35, 0.82), rgba(2, 6, 16, 0.68))",

        border:
          "1px solid rgba(255, 255, 255, 0.16)",

        borderRadius: 24,

        boxShadow:
          "0 24px 80px rgba(0, 0, 0, 0.48)",

        backdropFilter:
          "blur(22px)",

        WebkitBackdropFilter:
          "blur(22px)",

        animation:
          "adokvaWorldPanelOpen 500ms cubic-bezier(.22, 1, .36, 1)",
      }}
    >
      <button
        type="button"
        aria-label="Close world information"
        onClick={onClose}
        style={{
          position: "absolute",

          top: 16,
          right: 16,

          display: "grid",
          placeItems: "center",

          width: 36,
          height: 36,

          padding: 0,

          color:
            "rgba(255, 255, 255, 0.82)",

          background:
            "rgba(255, 255, 255, 0.07)",

          border:
            "1px solid rgba(255, 255, 255, 0.12)",

          borderRadius: "50%",

          fontSize: 20,
          lineHeight: 1,

          cursor: "pointer",
        }}
      >
        ×
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,

          paddingRight: 44,
        }}
      >
        <div
          style={{
            display: "grid",
            placeItems: "center",

            width: 58,
            height: 58,

            flexShrink: 0,

            borderRadius: "50%",

            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,.36), rgba(255,255,255,.08) 42%, rgba(255,255,255,.025) 72%)",

            border:
              "1px solid rgba(255, 255, 255, 0.16)",

            boxShadow:
              "0 0 34px rgba(130, 180, 255, 0.16)",

            fontSize: 27,
          }}
        >
          {information.symbol}
        </div>

        <div>
          <div
            style={{
              marginBottom: 5,

              color:
                "rgba(160, 205, 255, 0.72)",

              fontSize: 10,
              fontWeight: 700,

              letterSpacing: "0.24em",
            }}
          >
            ADOKVA WORLD
          </div>

          <h2
            style={{
              margin: 0,

              fontSize: 26,
              fontWeight: 600,

              letterSpacing: "0.12em",
            }}
          >
            {information.name}
          </h2>
        </div>
      </div>

      <p
        style={{
          margin:
            "20px 0 22px",

          color:
            "rgba(255, 255, 255, 0.58)",

          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {information.subtitle}
      </p>

      <div
        style={{
          display: "grid",
          gap: 10,
        }}
      >
        {information.facts.map(
          (fact) => (
            <div
              key={fact.label}
              style={{
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                gap: 18,

                minHeight: 52,

                padding:
                  "10px 14px",

                background:
                  "rgba(255, 255, 255, 0.045)",

                border:
                  "1px solid rgba(255, 255, 255, 0.075)",

                borderRadius: 14,
              }}
            >
              <span
                style={{
                  color:
                    "rgba(255, 255, 255, 0.48)",

                  fontSize: 12,
                  lineHeight: 1.35,
                }}
              >
                {fact.label}
              </span>

              <strong
                style={{
                  color:
                    "rgba(255, 255, 255, 0.92)",

                  fontSize: 13,
                  fontWeight: 500,

                  textAlign:
                    "right",
                }}
              >
                {fact.value}
              </strong>
            </div>
          )
        )}
      </div>

      <style>
        {`
          @keyframes adokvaWorldPanelOpen {
            from {
              opacity: 0;

              transform:
                translateX(30px)
                scale(.96);
            }

            to {
              opacity: 1;

              transform:
                translateX(0)
                scale(1);
            }
          }

          @media (max-width: 640px) {
            aside {
              top: 16px !important;
              right: 16px !important;
              width: calc(100vw - 32px) !important;
            }
          }
        `}
      </style>
    </aside>
  );
}