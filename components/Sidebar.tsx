"use client";

import { useState } from "react";

import { WORLDS } from "@/lib/worlds";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Кнопка */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: 58,
          height: 58,
          borderRadius: "50%",
          border: "none",
          background: "#111827",
          color: "white",
          fontSize: 28,
          cursor: "pointer",
          zIndex: 20,
        }}
      >
        {WORLDS.earth.emoji}
      </button>

      {/* Меню */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: open ? 0 : -320,
          width: 300,
          height: "100vh",
          background: "#111827ee",
          backdropFilter: "blur(20px)",
          transition: "0.35s",
          zIndex: 15,
          paddingTop: 90,
          boxSizing: "border-box",
        }}
      >
        <MenuItem title="🔍 Найти земляков" />
        <MenuItem title="➕ Добавить себя" />
        <MenuItem title="📊 Статистика" />

        <MenuItem
          title={`${WORLDS.moon.emoji} ${WORLDS.moon.name}`}
        />

        <MenuItem
          title={`${WORLDS.sun.emoji} ${WORLDS.sun.name}`}
        />

        <MenuItem title="🌎 Где были" />
        <MenuItem title="⚙ Настройки" />
      </div>
    </>
  );
}

function MenuItem({
  title,
}: {
  title: string;
}) {
  return (
    <div
      style={{
        padding: "18px 26px",
        color: "white",
        fontSize: 20,
        cursor: "pointer",
        transition: ".25s",
      }}
    >
      {title}
    </div>
  );
}