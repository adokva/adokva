"use client";

import CanvasScene from "@/components/CanvasScene";
import UI from "@/components/UI";

export default function Home() {
  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "black",
      }}
    >
      <CanvasScene />

      <UI />
    </main>
  );
}
