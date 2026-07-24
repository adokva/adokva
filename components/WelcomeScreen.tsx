"use client";

import {
  useRef,
  useState,
} from "react";

type Props = {
  onJourneyStart: () => void;
  onFinish: () => void;
};

const WELCOME_EXIT_DURATION =
  900;

export default function WelcomeScreen({
  onJourneyStart,
  onFinish,
}: Props) {
  const [
    closing,
    setClosing,
  ] = useState(false);

  const started =
    useRef(false);

  const startJourney = () => {
    if (
      closing ||
      started.current
    ) {
      return;
    }

    started.current = true;
    setClosing(true);

    onJourneyStart();

    window.setTimeout(() => {
      onFinish();
    }, WELCOME_EXIT_DURATION);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,

        zIndex: 100000,

        overflow: "hidden",

        pointerEvents:
          closing
            ? "none"
            : "auto",

        background:
          "linear-gradient(90deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.48) 32%, rgba(0,0,0,.08) 62%, transparent 100%)",

        opacity:
          closing
            ? 0
            : 1,

        transition:
          `opacity ${WELCOME_EXIT_DURATION}ms cubic-bezier(.22,1,.36,1)`,

        willChange:
          "opacity",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,

          pointerEvents: "none",

          background:
            "radial-gradient(circle at 74% 48%, transparent 0%, transparent 24%, rgba(0,0,0,.08) 48%, rgba(0,0,0,.34) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,

          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",

          width: "100%",
          height: "100%",

          maxWidth: 720,

          padding:
            "clamp(28px, 6vw, 96px)",

          textAlign: "left",

          opacity:
            closing
              ? 0
              : 1,

          transform:
            closing
              ? "translate3d(-45px, 0, 0)"
              : "translate3d(0, 0, 0)",

          filter:
            closing
              ? "blur(8px)"
              : "blur(0)",

          transition:
            `
              opacity 420ms ease,
              transform 800ms cubic-bezier(.22,1,.36,1),
              filter 520ms ease
            `,

          willChange:
            "opacity, transform, filter",
        }}
      >
        <div
          style={{
            fontSize:
              "clamp(52px, 8vw, 112px)",

            fontWeight: 800,

            lineHeight: 0.92,

            letterSpacing:
              "clamp(5px, 1.3vw, 15px)",

            color: "#ffffff",

            textShadow:
              `
                0 0 18px rgba(116,199,255,.55),
                0 0 55px rgba(30,132,255,.25),
                0 5px 35px rgba(0,0,0,.95)
              `,
          }}
        >
          ADOKVA
        </div>

        <div
          style={{
            width:
              "clamp(90px, 10vw, 145px)",

            height: 2,

            marginTop: 24,

            background:
              "linear-gradient(90deg, #71c4ff, rgba(113,196,255,.2), transparent)",

            boxShadow:
              "0 0 18px rgba(81,181,255,.7)",
          }}
        />

        <div
          style={{
            marginTop: 28,

            fontSize:
              "clamp(24px, 3vw, 38px)",

            fontWeight: 500,

            letterSpacing: 1.5,

            color: "#a6ddff",

            textShadow:
              "0 0 24px rgba(88,190,255,.35)",
          }}
        >
          Ты не один.
        </div>

        <div
          style={{
            maxWidth: 520,

            marginTop: 20,

            fontSize:
              "clamp(15px, 1.5vw, 19px)",

            lineHeight: 1.7,

            color:
              "rgba(225,240,255,.78)",

            textShadow:
              "0 3px 18px rgba(0,0,0,.9)",
          }}
        >
          Найди связь с местом,
          где ты родился, и узнай,
          сколько твоих земляков
          живёт в разных уголках мира.
        </div>

        <button
          type="button"
          disabled={closing}
          onClick={startJourney}
          style={{
            position: "relative",

            marginTop: 46,

            minWidth: 270,

            padding:
              "18px 36px",

            overflow: "hidden",

            borderRadius: 999,

            border:
              "1px solid rgba(151,216,255,.58)",

            cursor:
              closing
                ? "default"
                : "pointer",

            background:
              "linear-gradient(135deg, rgba(9,82,195,.96), rgba(35,174,245,.96))",

            color: "#ffffff",

            fontSize: 17,
            fontWeight: 700,

            letterSpacing: 0.6,

            boxShadow:
              `
                0 0 32px rgba(22,139,255,.38),
                inset 0 1px rgba(255,255,255,.35)
              `,

            animation:
              closing
                ? "none"
                : "adokvaLaunchButton 2.8s ease-in-out infinite",

            opacity:
              closing
                ? 0
                : 1,

            transform:
              closing
                ? "scale(.96)"
                : "scale(1)",

            transition:
              `
                opacity 250ms ease,
                transform 300ms ease,
                box-shadow 250ms ease
              `,
          }}
        >
          Начать путешествие
          {"  "}→
        </button>
      </div>

      <div
        style={{
          position: "absolute",

          left:
            "clamp(28px, 6vw, 96px)",
          bottom:
            "clamp(20px, 4vh, 42px)",

          fontSize: 11,
          fontWeight: 500,

          letterSpacing: 3,

          color:
            "rgba(178,216,242,.45)",

          opacity:
            closing
              ? 0
              : 1,

          transition:
            "opacity 250ms ease",
        }}
      >
        PLANETARY CONNECTION SYSTEM
      </div>

      <style>
        {`
          @keyframes adokvaLaunchButton {
            0%, 100% {
              transform: scale(1);
              box-shadow:
                0 0 26px rgba(22,139,255,.34),
                inset 0 1px rgba(255,255,255,.35);
            }

            50% {
              transform: scale(1.025);
              box-shadow:
                0 0 42px rgba(22,139,255,.52),
                inset 0 1px rgba(255,255,255,.42);
            }
          }

          @media (max-width: 720px) {
            button {
              -webkit-tap-highlight-color:
                transparent;
            }
          }
        `}
      </style>
    </div>
  );
}