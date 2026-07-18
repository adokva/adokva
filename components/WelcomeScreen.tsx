"use client";

import {
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

  const startJourney = () => {
    if (closing) {
      return;
    }

    setClosing(true);

    /*
      Камера начинает движение
      сразу после нажатия.

      Заставка одновременно
      плавно растворяется,
      поэтому задержки больше нет.
    */

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
          closing
            ? 0
            : 1,

        transform:
          closing
            ? "scale(1.055)"
            : "scale(1)",

        filter:
          closing
            ? "blur(3px)"
            : "blur(0px)",

        transition:
          `
            opacity ${WELCOME_EXIT_DURATION}ms cubic-bezier(.22,1,.36,1),
            transform ${WELCOME_EXIT_DURATION}ms cubic-bezier(.22,1,.36,1),
            filter ${WELCOME_EXIT_DURATION}ms ease
          `,
      }}
    >
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
            closing
              ? "none"
              : "adokvaWelcomePulse 4s ease-in-out infinite",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,

          opacity:
            closing
              ? 0.25
              : 0.7,

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
            closing
              ? "none"
              : "adokvaStarsMove 22s linear infinite",

          transition:
            `opacity ${WELCOME_EXIT_DURATION}ms ease`,
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

          opacity:
            closing
              ? 0
              : 1,

          transform:
            closing
              ? "translateY(-18px) scale(.98)"
              : "translateY(0) scale(1)",

          transition:
            `
              opacity 560ms ease,
              transform 760ms cubic-bezier(.22,1,.36,1)
            `,
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
          disabled={closing}
          onClick={startJourney}
          style={{
            marginTop: 54,

            minWidth: 270,

            padding:
              "18px 36px",

            borderRadius: 999,

            border:
              "1px solid rgba(151,216,255,.55)",

            cursor:
              closing
                ? "default"
                : "pointer",

            background:
              "linear-gradient(135deg, rgba(12,102,232,.98), rgba(42,184,255,.98))",

            color: "#ffffff",

            fontSize: 17,
            fontWeight: 700,

            letterSpacing: 0.5,

            boxShadow:
              "0 0 28px rgba(22,139,255,.42), inset 0 1px rgba(255,255,255,.35)",

            animation:
              closing
                ? "none"
                : "adokvaButtonBreath 2.4s ease-in-out infinite",

            opacity:
              closing
                ? 0.7
                : 1,

            transition:
              "transform .25s ease, box-shadow .25s ease, opacity .25s ease",
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
              transform:
                translate3d(0, 0, 0);
            }

            to {
              transform:
                translate3d(-28px, 18px, 0);
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