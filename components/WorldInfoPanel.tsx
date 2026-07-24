"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  SelectedWorld,
} from "@/types/world";

type Props = {
  world: SelectedWorld;
  onClose: () => void;
};

type PanelSection =
  | "overview"
  | "missions"
  | "surface";

type WorldFact = {
  label: string;
  value: string;
};

type WorldMission = {
  name: string;
  description: string;
};

type WorldInformation = {
  symbol: string;
  name: string;
  category: string;
  subtitle: string;
  accent: string;
  glow: string;
  facts: WorldFact[];
  missions: WorldMission[];
  surfaceTitle: string;
  surfaceDescription: string;
  surfaceHighlights: string[];
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
    category: "STAR",
    subtitle:
      "The star at the centre of our Solar System",
    accent: "#ffb347",
    glow:
      "rgba(255, 153, 45, 0.32)",
    facts: [
      {
        label: "Radius",
        value: "696 340 km",
      },
      {
        label:
          "Surface temperature",
        value: "≈ 5 500 °C",
      },
      {
        label:
          "Core temperature",
        value: "≈ 15 million °C",
      },
      {
        label: "Age",
        value:
          "≈ 4.6 billion years",
      },
      {
        label:
          "Distance from Earth",
        value:
          "≈ 149.6 million km",
      },
      {
        label:
          "Rotation period",
        value:
          "≈ 25–35 Earth days",
      },
    ],
    missions: [
      {
        name: "Parker Solar Probe",
        description:
          "A spacecraft studying the Sun's outer atmosphere and solar wind.",
      },
      {
        name: "Solar Orbiter",
        description:
          "Observes the Sun and investigates its magnetic environment.",
      },
      {
        name: "SOHO",
        description:
          "A long-running observatory studying the Sun from space.",
      },
    ],
    surfaceTitle:
      "A star without a solid surface",
    surfaceDescription:
      "The visible layer of the Sun is called the photosphere. Beneath it lies extremely hot plasma, while the corona extends far into space.",
    surfaceHighlights: [
      "Photosphere",
      "Sunspots",
      "Solar flares",
      "Prominences",
      "Corona",
    ],
  },

  moon: {
    symbol: "◐",
    name: "MOON",
    category:
      "NATURAL SATELLITE",
    subtitle:
      "Earth's natural satellite",
    accent: "#dce7f4",
    glow:
      "rgba(190, 215, 245, 0.24)",
    facts: [
      {
        label:
          "Distance from Earth",
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
        label:
          "Orbital period",
        value: "27.3 days",
      },
      {
        label:
          "Surface temperature",
        value:
          "−173 °C to 127 °C",
      },
      {
        label: "Atmosphere",
        value:
          "Extremely thin exosphere",
      },
    ],
    missions: [
      {
        name: "Apollo",
        description:
          "The programme that first landed humans on the lunar surface.",
      },
      {
        name:
          "Lunar Reconnaissance Orbiter",
        description:
          "Maps the Moon and studies possible future landing regions.",
      },
      {
        name: "Chang'e",
        description:
          "A series of lunar orbiters, landers and sample-return missions.",
      },
    ],
    surfaceTitle:
      "Craters, mountains and ancient plains",
    surfaceDescription:
      "The lunar surface preserves billions of years of impact history. Dark plains called maria formed from ancient volcanic activity.",
    surfaceHighlights: [
      "Sea of Tranquility",
      "Tycho crater",
      "Copernicus crater",
      "Lunar highlands",
      "South pole",
    ],
  },

  mercury: {
    symbol: "☿",
    name: "MERCURY",
    category: "TERRESTRIAL PLANET",
    subtitle:
      "The closest planet to the Sun",
    accent: "#d5b38b",
    glow:
      "rgba(223, 169, 108, 0.28)",
    facts: [
      {
        label:
          "Distance from Sun",
        value:
          "≈ 57.9 million km",
      },
      {
        label: "Radius",
        value: "2 440 km",
      },
      {
        label: "Gravity",
        value: "3.70 m/s²",
      },
      {
        label: "Day length",
        value:
          "≈ 176 Earth days",
      },
      {
        label:
          "Orbital period",
        value: "88 Earth days",
      },
      {
        label:
          "Surface temperature",
        value:
          "−180 °C to 430 °C",
      },
    ],
    missions: [
      {
        name: "Mariner 10",
        description:
          "The first spacecraft to visit Mercury and photograph its surface.",
      },
      {
        name: "MESSENGER",
        description:
          "Orbited Mercury and mapped the planet in unprecedented detail.",
      },
      {
        name: "BepiColombo",
        description:
          "A mission created to investigate Mercury's surface, interior and magnetic field.",
      },
    ],
    surfaceTitle:
      "A heavily cratered world",
    surfaceDescription:
      "Mercury resembles the Moon but contains enormous impact basins, long cliffs and regions of permanently shadowed ice.",
    surfaceHighlights: [
      "Caloris Basin",
      "Discovery Rupes",
      "Northern plains",
      "Polar ice deposits",
      "Volcanic terrain",
    ],
  },

  mars: {
    symbol: "●",
    name: "MARS",
    category: "TERRESTRIAL PLANET",
    subtitle:
      "The fourth planet from the Sun",
    accent: "#ff7959",
    glow:
      "rgba(255, 83, 45, 0.28)",
    facts: [
      {
        label:
          "Distance from Sun",
        value:
          "≈ 227.9 million km",
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
        value:
          "Phobos and Deimos",
      },
      {
        label: "Atmosphere",
        value:
          "Mostly carbon dioxide",
      },
    ],
    missions: [
      {
        name: "Viking",
        description:
          "The first successful spacecraft to operate for a long period on Mars.",
      },
      {
        name: "Curiosity",
        description:
          "Explores Gale crater and investigates whether Mars once supported life.",
      },
      {
        name: "Perseverance",
        description:
          "Studies Jezero crater and collects samples for possible future return.",
      },
    ],
    surfaceTitle:
      "The red planet",
    surfaceDescription:
      "Mars contains giant volcanoes, immense canyon systems, ancient river valleys and polar ice caps.",
    surfaceHighlights: [
      "Olympus Mons",
      "Valles Marineris",
      "Jezero crater",
      "Gale crater",
      "Polar ice caps",
    ],
  },
};

function SectionButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,

        minWidth: 0,

        padding:
          "11px 8px",

        color: active
          ? "#ffffff"
          : "rgba(255,255,255,.42)",

        background: active
          ? "rgba(255,255,255,.105)"
          : "transparent",

        border: active
          ? "1px solid rgba(255,255,255,.12)"
          : "1px solid transparent",

        borderRadius: 12,

        cursor: "pointer",

        fontSize: 10,
        fontWeight: 800,

        letterSpacing:
          "0.12em",

        transition:
          "background 180ms ease, color 180ms ease, border-color 180ms ease",
      }}
    >
      {label}
    </button>
  );
}

export default function WorldInfoPanel({
  world,
  onClose,
}: Props) {
  const [
    activeSection,
    setActiveSection,
  ] =
    useState<PanelSection>(
      "overview"
    );

  useEffect(() => {
    setActiveSection(
      "overview"
    );
  }, [world]);

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

        display: "flex",
        flexDirection:
          "column",

        width:
          "min(390px, calc(100vw - 40px))",

        maxHeight:
          "calc(100vh - 56px)",

        padding: 22,

        boxSizing:
          "border-box",

        overflow: "hidden",

        color: "#ffffff",

        background:
          "linear-gradient(145deg, rgba(10, 18, 35, 0.9), rgba(2, 6, 16, 0.78))",

        border:
          "1px solid rgba(255, 255, 255, 0.15)",

        borderRadius: 26,

        boxShadow: `
          0 26px 90px rgba(0, 0, 0, 0.56),
          0 0 80px ${information.glow}
        `,

        backdropFilter:
          "blur(26px)",

        WebkitBackdropFilter:
          "blur(26px)",

        animation:
          "adokvaWorldPanelOpen 500ms cubic-bezier(.22, 1, .36, 1)",
      }}
    >
      <div
        style={{
          position:
            "absolute",

          top: -90,
          left: -70,

          width: 220,
          height: 220,

          pointerEvents:
            "none",

          borderRadius:
            "50%",

          background: `
            radial-gradient(
              circle,
              ${information.glow},
              transparent 68%
            )
          `,

          filter: "blur(4px)",
        }}
      />

      <button
        type="button"
        aria-label="Close world information"
        onClick={onClose}
        style={{
          position:
            "absolute",

          top: 16,
          right: 16,

          zIndex: 4,

          display: "grid",
          placeItems:
            "center",

          width: 36,
          height: 36,

          padding: 0,

          color:
            "rgba(255, 255, 255, 0.82)",

          background:
            "rgba(255, 255, 255, 0.07)",

          border:
            "1px solid rgba(255, 255, 255, 0.12)",

          borderRadius:
            "50%",

          fontSize: 20,
          lineHeight: 1,

          cursor: "pointer",

          transition:
            "transform 180ms ease, background 180ms ease",
        }}
        onMouseEnter={(
          event
        ) => {
          event.currentTarget.style.transform =
            "scale(1.08)";

          event.currentTarget.style.background =
            "rgba(255,255,255,.13)";
        }}
        onMouseLeave={(
          event
        ) => {
          event.currentTarget.style.transform =
            "scale(1)";

          event.currentTarget.style.background =
            "rgba(255,255,255,.07)";
        }}
      >
        ×
      </button>

      <div
        style={{
          position:
            "relative",

          zIndex: 2,

          display: "flex",
          alignItems:
            "center",

          gap: 15,

          paddingRight: 44,
        }}
      >
        <div
          style={{
            display: "grid",
            placeItems:
              "center",

            width: 64,
            height: 64,

            flexShrink: 0,

            color:
              information.accent,

            borderRadius:
              "50%",

            background: `
              radial-gradient(
                circle at 35% 28%,
                rgba(255,255,255,.42),
                ${information.glow} 38%,
                rgba(255,255,255,.025) 74%
              )
            `,

            border: `
              1px solid
              ${information.accent}55
            `,

            boxShadow: `
              0 0 38px
              ${information.glow}
            `,

            fontSize: 30,
          }}
        >
          {information.symbol}
        </div>

        <div
          style={{
            minWidth: 0,
          }}
        >
          <div
            style={{
              marginBottom: 5,

              color:
                information.accent,

              fontSize: 9,
              fontWeight: 800,

              letterSpacing:
                "0.22em",
            }}
          >
            ADOKVA ·{" "}
            {
              information.category
            }
          </div>

          <h2
            style={{
              margin: 0,

              fontSize: 27,
              fontWeight: 650,

              letterSpacing:
                "0.11em",
            }}
          >
            {information.name}
          </h2>
        </div>
      </div>

      <p
        style={{
          position:
            "relative",

          zIndex: 2,

          margin:
            "18px 0 18px",

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
          position:
            "relative",

          zIndex: 2,

          display: "flex",
          gap: 4,

          padding: 4,

          marginBottom: 14,

          background:
            "rgba(255,255,255,.035)",

          border:
            "1px solid rgba(255,255,255,.065)",

          borderRadius: 15,
        }}
      >
        <SectionButton
          active={
            activeSection ===
            "overview"
          }
          label="OVERVIEW"
          onClick={() => {
            setActiveSection(
              "overview"
            );
          }}
        />

        <SectionButton
          active={
            activeSection ===
            "missions"
          }
          label="MISSIONS"
          onClick={() => {
            setActiveSection(
              "missions"
            );
          }}
        />

        <SectionButton
          active={
            activeSection ===
            "surface"
          }
          label="SURFACE"
          onClick={() => {
            setActiveSection(
              "surface"
            );
          }}
        />
      </div>

      <div
        style={{
          position:
            "relative",

          zIndex: 2,

          flex: 1,

          minHeight: 0,

          overflowY:
            "auto",

          paddingRight: 3,

          scrollbarWidth:
            "thin",
        }}
      >
        {activeSection ===
          "overview" && (
          <div
            key={`${world}-overview`}
            style={{
              display: "grid",
              gap: 9,

              animation:
                "adokvaWorldSectionOpen 280ms ease",
            }}
          >
            {information.facts.map(
              (fact) => (
                <div
                  key={
                    fact.label
                  }
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "space-between",

                    gap: 18,

                    minHeight: 50,

                    padding:
                      "9px 14px",

                    boxSizing:
                      "border-box",

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
                        "rgba(255, 255, 255, 0.45)",

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
                      fontWeight: 550,

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
        )}

        {activeSection ===
          "missions" && (
          <div
            key={`${world}-missions`}
            style={{
              display: "grid",
              gap: 10,

              animation:
                "adokvaWorldSectionOpen 280ms ease",
            }}
          >
            <div
              style={{
                marginBottom: 3,

                color:
                  "rgba(255,255,255,.4)",

                fontSize: 11,
                lineHeight: 1.55,
              }}
            >
              Selected missions
              connected with{" "}
              {
                information.name
              }
            </div>

            {information.missions.map(
              (
                mission,
                index
              ) => (
                <div
                  key={
                    mission.name
                  }
                  style={{
                    position:
                      "relative",

                    padding:
                      "15px 15px 15px 50px",

                    background:
                      "rgba(255,255,255,.045)",

                    border:
                      "1px solid rgba(255,255,255,.075)",

                    borderRadius: 15,
                  }}
                >
                  <div
                    style={{
                      position:
                        "absolute",

                      top: 15,
                      left: 14,

                      display:
                        "grid",

                      placeItems:
                        "center",

                      width: 25,
                      height: 25,

                      color:
                        information.accent,

                      background:
                        information.glow,

                      border: `
                        1px solid
                        ${information.accent}55
                      `,

                      borderRadius:
                        "50%",

                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  >
                    {index + 1}
                  </div>

                  <div
                    style={{
                      color:
                        "rgba(255,255,255,.92)",

                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {mission.name}
                  </div>

                  <p
                    style={{
                      margin:
                        "7px 0 0",

                      color:
                        "rgba(255,255,255,.48)",

                      fontSize: 11,
                      lineHeight: 1.55,
                    }}
                  >
                    {
                      mission.description
                    }
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {activeSection ===
          "surface" && (
          <div
            key={`${world}-surface`}
            style={{
              animation:
                "adokvaWorldSectionOpen 280ms ease",
            }}
          >
            <div
              style={{
                padding: 17,

                background: `
                  linear-gradient(
                    145deg,
                    ${information.glow},
                    rgba(255,255,255,.025)
                  )
                `,

                border: `
                  1px solid
                  ${information.accent}33
                `,

                borderRadius: 17,
              }}
            >
              <div
                style={{
                  color:
                    information.accent,

                  fontSize: 10,
                  fontWeight: 800,

                  letterSpacing:
                    "0.16em",
                }}
              >
                SURFACE PROFILE
              </div>

              <h3
                style={{
                  margin:
                    "9px 0 0",

                  fontSize: 17,
                  fontWeight: 650,

                  lineHeight: 1.35,
                }}
              >
                {
                  information.surfaceTitle
                }
              </h3>

              <p
                style={{
                  margin:
                    "10px 0 0",

                  color:
                    "rgba(255,255,255,.54)",

                  fontSize: 12,
                  lineHeight: 1.65,
                }}
              >
                {
                  information.surfaceDescription
                }
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",

                gap: 8,

                marginTop: 13,
              }}
            >
              {information.surfaceHighlights.map(
                (
                  highlight
                ) => (
                  <div
                    key={
                      highlight
                    }
                    style={{
                      padding:
                        "9px 11px",

                      color:
                        "rgba(255,255,255,.66)",

                      background:
                        "rgba(255,255,255,.045)",

                      border:
                        "1px solid rgba(255,255,255,.075)",

                      borderRadius:
                        999,

                      fontSize: 11,
                    }}
                  >
                    {highlight}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        style={{
          position:
            "relative",

          zIndex: 2,

          width: "100%",

          marginTop: 16,
          padding:
            "14px 16px",

          color: "#ffffff",

          background: `
            linear-gradient(
              135deg,
              ${information.accent}cc,
              ${information.glow}
            )
          `,

          border: `
            1px solid
            ${information.accent}88
          `,

          borderRadius: 15,

          boxShadow: `
            0 10px 32px
            ${information.glow}
          `,

          cursor: "pointer",

          fontSize: 11,
          fontWeight: 900,

          letterSpacing:
            "0.13em",

          transition:
            "transform 180ms ease, box-shadow 180ms ease",
        }}
        onMouseEnter={(
          event
        ) => {
          event.currentTarget.style.transform =
            "translateY(-2px)";
        }}
        onMouseLeave={(
          event
        ) => {
          event.currentTarget.style.transform =
            "translateY(0)";
        }}
      >
        ← RETURN TO EARTH
      </button>

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

          @keyframes adokvaWorldSectionOpen {
            from {
              opacity: 0;

              transform:
                translateY(8px);
            }

            to {
              opacity: 1;

              transform:
                translateY(0);
            }
          }

          @media (max-width: 640px) {
            aside {
              top: 16px !important;
              right: 16px !important;

              width:
                calc(100vw - 32px)
                !important;

              max-height:
                calc(100vh - 32px)
                !important;
            }
          }
        `}
      </style>
    </aside>
  );
}