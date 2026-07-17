"use client";

type Props = {
  onClick: () => void;
};

export default function MenuButton({
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",

        top: 20,

        left: 20,

        width: 56,

        height: 56,

        borderRadius: "50%",

        border: "none",

        cursor: "pointer",

        background:
          "rgba(18,25,45,.92)",

        color: "white",

        fontSize: 28,

        backdropFilter: "blur(18px)",

        boxShadow:
          "0 0 25px rgba(0,120,255,.35)",

        zIndex: 1000,

        transition: ".25s",
      }}
    >
      ☰
    </button>
  );
}