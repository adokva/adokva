"use client";

import { useState } from "react";

type Props = {
  onJourneyStart: () => void;
  onFinish: () => void;
};

export default function WelcomeScreen({
  onJourneyStart,
  onFinish,
}: Props) {
  const [closing, setClosing] =
    useState(false);

  const startJourney = () => {
    if (closing) return;

    setClosing(true);

    /*
      Запускаем камеру сразу,
      пока заставка ещё начинает
      исчезать.
    */

    onJourneyStart();

    window.setTimeout(() => {
      onFinish();
    }, 1400);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,

        zIndex: 100000,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        overflow: "hidden",

        pointerEvents:
          closing
            ? "none"
            : "auto",

        background:
          "radial-gradient(circle at 50% 42%, rgba(16,40,66,.98) 0%, rgba(6,17,31,.98) 34%, rgba(2,6,12,.99) 66%, #000 100%)",

        opacity:
          closing ? 0 : 1,

        transform:
          closing
            ? "scale(1.1)"
            : "scale(1)",

        transition:
          "opacity 1400ms ease, transform 1400ms cubic-bezier(.22,1,.36,1)",
      }}
    >
      {/* Голубое свечение */}
      <div
        style={{
          position: "absolute",

          width: 700,
          height: 700,

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(38,142,255,.2), rgba(12,70,145,.06) 43%, transparent 72%)",

          filter: "blur(22px)",

          animation:
            "adokvaWelcomePulse 4s ease-in-out infinite",
        }}
      />

      {/* Звёздный слой */}
      <div
        style={{
          position: "absolute",
          inset: 0,

          opacity: 0.7,

          backgroundImage: `
            radial-gradient(circle at 12% 18%, white 0 1px, transparent 1.5px),
            radial-gradient(circle at 78% 22%, white 0 1px, transparent 1.5px),
            radial-gradient(circle at 36% 72%, white 0 1px, transparent 1.5px),
            radial-gradient(circle at 88% 78%, white 0 1px, transparent 1.5px),
            radial-gradient(circle at 62% 48%, white 0 1px, transparent 1.5px),
            radial-gradient(circle at 20% 88%, white 0 1px, transparent 1.5px)
          `,

          backgroundSize:
            "210px 210px, 260px 260px, 190px 190px, 310px 310px, 230px 230px, 280px 280px",

          animation:
            "adokvaStarsMove 22s linear infinite",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          width: "100%",
          maxWidth: 900,

          padding: 24,

          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize:
              "clamp(48px, 9vw, 104px)",

            fontWeight: 800,

            letterSpacing:
              "clamp(5px, 1.5vw, 15px)",

            color: "#ffffff",

            textShadow:
              "0 0 18px rgba(116,199,255,.65), 0 0 55px rgba(30,132,255,.35)",
          }}
        >
          ADOKVA
        </div>

        <div
          style={{
            width: 120,
            height: 2,

            marginTop: 18,

            background:
              "linear-gradient(90deg, transparent, #71c4ff, transparent)",

            boxShadow:
              "0 0 18px rgba(81,181,255,.8)",
          }}
        />

        <div
          style={{
            marginTop: 25,

            fontSize:
              "clamp(22px, 3vw, 34px)",

            letterSpacing: 2,

            color: "#8fd3ff",

            textShadow:
              "0 0 22px rgba(88,190,255,.45)",
          }}
        >
          Ты не один.
        </div>

        <div
          style={{
            maxWidth: 580,

            marginTop: 20,

            fontSize:
              "clamp(14px, 1.5vw, 18px)",

            lineHeight: 1.7,

            color:
              "rgba(220,238,255,.72)",
          }}
        >
          Найди связь с местом,
          где ты родился, и узнай,
          сколько твоих земляков
          живёт в разных уголках мира.
        </div>

        <button
          type="button"
          onClick={startJourney}
          style={{
            marginTop: 54,

            minWidth: 270,

            padding:
              "18px 36px",

            borderRadius: 999,

            border:
              "1px solid rgba(151,216,255,.55)",

            cursor: "pointer",

            background:
              "linear-gradient(135deg, rgba(12,102,232,.98), rgba(42,184,255,.98))",

            color: "#ffffff",

            fontSize: 17,
            fontWeight: 700,

            letterSpacing: 0.5,

            boxShadow:
              "0 0 28px rgba(22,139,255,.42), inset 0 1px rgba(255,255,255,.35)",

            animation:
              "adokvaButtonBreath 2.4s ease-in-out infinite",

            transition:
              "transform .25s ease, box-shadow .25s ease",
          }}
        >
          Начать путешествие
          {"  "}→
        </button>
      </div>

      <style>
        {`
          @keyframes adokvaWelcomePulse {
            0%, 100% {
              transform: scale(.92);
              opacity: .65;
            }

            50% {
              transform: scale(1.08);
              opacity: 1;
            }
          }

          @keyframes adokvaStarsMove {
            from {
              transform: translate3d(0, 0, 0);
            }

            to {
              transform: translate3d(-28px, 18px, 0);
            }
          }

          @keyframes adokvaButtonBreath {
            0%, 100% {
              transform: scale(1);
            }

            50% {
              transform: scale(1.025);
            }
          }
        `}
      </style>
    </div>
  );
}