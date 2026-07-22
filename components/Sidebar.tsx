"use client";

import {
  useState,
} from "react";

import {
  WORLDS,
} from "@/lib/worlds";

import type {
  WorldId,
} from "@/types/world";

const menuItems = [
  {
    id: "search",
    title: "🔍 Найти земляков",
  },
  {
    id: "add",
    title: "➕ Добавить себя",
  },
  {
    id: "stats",
    title: "📊 Статистика",
  },
  {
    id: "moon",
    worldId: "moon" as WorldId,
    title: `${WORLDS.moon.emoji} ${WORLDS.moon.name}`,
  },
  {
    id: "sun",
    worldId: "sun" as WorldId,
    title: `${WORLDS.sun.emoji} ${WORLDS.sun.name}`,
  },
  {
    id: "visited",
    title: "🌎 Где были",
  },
  {
    id: "settings",
    title: "⚙ Настройки",
  },
];
export default function Sidebar() {
  const [
    open,
    setOpen,
  ] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={
          open
            ? "Закрыть меню"
            : "Открыть меню"
        }
        aria-expanded={open}
        onClick={() => {
          setOpen(
            (current) =>
              !current
          );
        }}
        className={
          open
            ? "adokva-sidebar-button adokva-sidebar-button-open"
            : "adokva-sidebar-button"
        }
      >
        <span className="adokva-sidebar-button-glow" />

        <span className="adokva-sidebar-button-icon">
          {open
            ? "×"
            : WORLDS.earth
                .emoji}
        </span>
      </button>

      <aside
        aria-hidden={!open}
        className={
          open
            ? "adokva-sidebar adokva-sidebar-open"
            : "adokva-sidebar"
        }
      >
        <div className="adokva-sidebar-light" />

        <div className="adokva-sidebar-header">
          <div className="adokva-sidebar-title">
            ADOKVA
          </div>

          <div className="adokva-sidebar-subtitle">
            Explore your world
          </div>
        </div>

        <nav className="adokva-sidebar-menu">
          {menuItems.map(
            (
              title,
              index
            ) => (
              <MenuItem
                key={title.id}
                title={title.title}
                index={index}
                open={open}
              />
            )
          )}
        </nav>

        <div className="adokva-sidebar-footer">
          {WORLDS.earth.emoji}{" "}
          Connected to Earth
        </div>
      </aside>

      <style jsx global>
        {`
          .adokva-sidebar-button {
            position: absolute;
            top: 20px;
            left: 20px;

            display: flex;
            align-items: center;
            justify-content: center;

            width: 58px;
            height: 58px;

            padding: 0;

            border: 1px solid
              rgba(
                120,
                190,
                255,
                0.28
              );
            border-radius: 50%;

            background:
              radial-gradient(
                circle at 30% 30%,
                rgba(
                  90,
                  170,
                  255,
                  0.35
                ),
                rgba(
                  23,
                  37,
                  84,
                  0.96
                )
                  45%,
                rgba(
                  6,
                  10,
                  20,
                  0.98
                )
                  100%
              );

            box-shadow:
              0 18px 42px
                rgba(
                  0,
                  0,
                  0,
                  0.48
                ),
              0 0 26px
                rgba(
                  70,
                  150,
                  255,
                  0.18
                ),
              inset 0 1px 0
                rgba(
                  255,
                  255,
                  255,
                  0.18
                );

            color: white;

            cursor: pointer;

            overflow: hidden;

            z-index: 1000;

            transition:
              left 0.5s
                cubic-bezier(
                  0.22,
                  1,
                  0.36,
                  1
                ),
              transform 0.3s ease,
              border-color 0.3s ease,
              box-shadow 0.3s ease;
          }

          .adokva-sidebar-button:hover {
            transform:
              scale(1.09)
              rotate(8deg);

            border-color:
              rgba(
                160,
                220,
                255,
                0.65
              );

            box-shadow:
              0 24px 56px
                rgba(
                  0,
                  0,
                  0,
                  0.55
                ),
              0 0 40px
                rgba(
                  80,
                  180,
                  255,
                  0.42
                ),
              inset 0 1px 0
                rgba(
                  255,
                  255,
                  255,
                  0.25
                );
          }

          .adokva-sidebar-button:active {
            transform:
              scale(0.96);
          }

          .adokva-sidebar-button-open {
            left: 322px;
          }

          .adokva-sidebar-button-glow {
            position: absolute;

            width: 72px;
            height: 72px;

            border-radius: 50%;

            background:
              radial-gradient(
                circle,
                rgba(
                  120,
                  210,
                  255,
                  0.55
                ),
                rgba(
                  70,
                  150,
                  255,
                  0.15
                )
                  55%,
                transparent 72%
              );

            opacity: 0;

            transition:
              opacity 0.35s ease;
          }

          .adokva-sidebar-button:hover
            .adokva-sidebar-button-glow {
            opacity: 1;
          }

          .adokva-sidebar-button-icon {
            position: relative;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 28px;
            line-height: 1;

            transform:
              translateY(-1px);

            z-index: 1;

            transition:
              transform 0.4s
                cubic-bezier(
                  0.22,
                  1,
                  0.36,
                  1
                );
          }

          .adokva-sidebar-button-open
            .adokva-sidebar-button-icon {
            font-size: 36px;

            transform:
              rotate(90deg);
          }

          .adokva-sidebar {
            position: absolute;
            top: 0;
            left: 0;

            width: 300px;
            height: 100vh;

            padding:
              104px 16px 24px;

            box-sizing:
              border-box;

            overflow: hidden;

            background:
              linear-gradient(
                180deg,
                rgba(
                  15,
                  24,
                  42,
                  0.94
                ),
                rgba(
                  5,
                  10,
                  20,
                  0.91
                )
              );

            border-right:
              1px solid
              rgba(
                255,
                255,
                255,
                0.12
              );

            box-shadow:
              24px 0 70px
                rgba(
                  0,
                  0,
                  0,
                  0.42
                );

            backdrop-filter:
              blur(26px);
            -webkit-backdrop-filter:
              blur(26px);

            opacity: 0;

            transform:
              translateX(
                -105%
              );

            pointer-events: none;

            z-index: 900;

            transition:
              transform 0.52s
                cubic-bezier(
                  0.22,
                  1,
                  0.36,
                  1
                ),
              opacity 0.35s
                ease;
          }

          .adokva-sidebar-open {
            opacity: 1;

            transform:
              translateX(0);

            pointer-events: auto;
          }

          .adokva-sidebar-light {
            position: absolute;
            top: -140px;
            left: -110px;

            width: 360px;
            height: 360px;

            border-radius: 50%;

            background:
              radial-gradient(
                circle,
                rgba(
                  64,
                  157,
                  255,
                  0.2
                ),
                transparent 68%
              );

            pointer-events: none;
          }

          .adokva-sidebar-header {
            position: relative;

            padding:
              0 12px 25px;

            border-bottom:
              1px solid
              rgba(
                255,
                255,
                255,
                0.09
              );
          }

          .adokva-sidebar-title {
            color:
              rgba(
                255,
                255,
                255,
                0.96
              );

            font-size: 22px;
            font-weight: 700;
            letter-spacing:
              0.2em;
          }

          .adokva-sidebar-subtitle {
            margin-top: 7px;

            color:
              rgba(
                180,
                203,
                229,
                0.65
              );

            font-size: 12px;
            letter-spacing:
              0.08em;
          }

          .adokva-sidebar-menu {
            display: flex;
            flex-direction:
              column;

            gap: 7px;

            margin-top: 20px;
          }

          .adokva-menu-item {
            position: relative;

            display: flex;
            align-items: center;

            min-height: 54px;

            padding:
              0 16px;

            border:
              1px solid
              transparent;
            border-radius: 15px;

            color:
              rgba(
                255,
                255,
                255,
                0.82
              );

            font-size: 17px;
            font-weight: 400;

            cursor: pointer;

            overflow: hidden;

            opacity: 0;

            transform:
              translateX(
                -24px
              );

            transition:
              opacity 0.45s
                ease,
              transform 0.45s
                cubic-bezier(
                  0.22,
                  1,
                  0.36,
                  1
                ),
              color 0.25s
                ease,
              background 0.25s
                ease,
              border-color 0.25s
                ease,
              box-shadow 0.25s
                ease;
          }

          .adokva-menu-item-visible {
            opacity: 1;

            transform:
              translateX(0);
          }

          .adokva-menu-item::before {
            content: "";

            position: absolute;
            top: 50%;
            left: -24px;

            width: 5px;
            height: 28px;

            border-radius:
              0 6px 6px 0;

            background:
              linear-gradient(
                180deg,
                #7cd7ff,
                #3488ff
              );

            box-shadow:
              0 0 18px
                rgba(
                  73,
                  172,
                  255,
                  0.8
                );

            opacity: 0;

            transform:
              translateY(-50%);

            transition:
              left 0.3s ease,
              opacity 0.3s ease;
          }

          .adokva-menu-item::after {
            content: "";

            position: absolute;
            inset: 0;

            background:
              linear-gradient(
                100deg,
                transparent,
                rgba(
                  255,
                  255,
                  255,
                  0.07
                ),
                transparent
              );

            transform:
              translateX(
                -120%
              );

            transition:
              transform 0.6s
                ease;
          }

          .adokva-menu-item:hover {
            color: white;

            background:
              linear-gradient(
                90deg,
                rgba(
                  44,
                  125,
                  209,
                  0.2
                ),
                rgba(
                  76,
                  156,
                  239,
                  0.08
                )
              );

            border-color:
              rgba(
                116,
                190,
                255,
                0.2
              );

            box-shadow:
              0 10px 26px
                rgba(
                  0,
                  0,
                  0,
                  0.18
                );

            transform:
              translateX(
                7px
              );
          }

          .adokva-menu-item:hover::before {
            left: 0;

            opacity: 1;
          }

          .adokva-menu-item:hover::after {
            transform:
              translateX(
                120%
              );
          }

          .adokva-menu-item:active {
            transform:
              translateX(
                7px
              )
              scale(0.98);
          }

          .adokva-menu-item-text {
            position: relative;

            z-index: 1;
          }

          .adokva-sidebar-footer {
            position: absolute;
            right: 28px;
            bottom: 28px;
            left: 28px;

            padding-top: 18px;

            border-top:
              1px solid
              rgba(
                255,
                255,
                255,
                0.08
              );

            color:
              rgba(
                176,
                197,
                221,
                0.55
              );

            font-size: 11px;
            letter-spacing:
              0.08em;
            text-transform:
              uppercase;
          }

          @media (
            max-width: 480px
          ) {
            .adokva-sidebar {
              width: min(
                300px,
                calc(
                  100vw - 76px
                )
              );
            }

            .adokva-sidebar-button-open {
              left: calc(
                min(
                    300px,
                    calc(
                      100vw -
                        76px
                    )
                  ) +
                  22px
              );
            }
          }

          @media (
            prefers-reduced-motion:
              reduce
          ) {
            .adokva-sidebar,
            .adokva-sidebar-button,
            .adokva-sidebar-button-icon,
            .adokva-menu-item {
              transition:
                none;
            }
          }
        `}
      </style>
    </>
  );
}

function MenuItem({
  title,
  index,
  open,
}: {
  title: string;
  index: number;
  open: boolean;
}) {
  return (
    <div
      className={
        open
          ? "adokva-menu-item adokva-menu-item-visible"
          : "adokva-menu-item"
      }
      style={{
        transitionDelay: open
          ? `${120 + index * 65}ms`
          : "0ms",
      }}
    >
      <span className="adokva-menu-item-text">
        {title}
      </span>
    </div>
  );
}