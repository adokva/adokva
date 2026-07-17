"use client";

export default function UI() {
  return (
    <div
      style={{
        position: "absolute",
        top: 40,
        left: 40,
        padding: 24,
        borderRadius: 20,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.2)",
        color: "white",
        fontFamily: "Arial",
        width: 280,
      }}
    >
      <h1>
        Adokva 🌍
      </h1>

      <p>
        Explore the planet.
      </p>

      <button
        style={{
          marginTop: 20,
          padding: "12px 20px",
          borderRadius: 12,
          border: "none",
          background: "#4da6ff",
          color: "white",
          cursor: "pointer",
        }}
      >
        Start Journey
      </button>
    </div>
  );
}
