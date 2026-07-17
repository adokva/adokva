"use client";

type Props = {
  open: boolean;
  name: string;
  city: string;
  country: string;
  onClose: () => void;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function PersonCard({
  open,
  name,
  city,
  country,
  onClose,
}: Props) {
  if (!open) return null;

  const initials = getInitials(name);

  return (
    <aside
      style={{
        position: "fixed",
        top: 18,
        right: 18,
        bottom: 18,

        width: 390,
        maxWidth: "calc(100vw - 36px)",

        zIndex: 1200,

        padding: 24,
        boxSizing: "border-box",

        overflowY: "auto",

        color: "#fff",

        background:
          "linear-gradient(160deg, rgba(25,37,62,.84), rgba(7,13,27,.94))",

        border:
          "1px solid rgba(158,207,255,.16)",

        borderRadius: 30,

        backdropFilter: "blur(32px) saturate(135%)",
        WebkitBackdropFilter:
          "blur(32px) saturate(135%)",

        boxShadow:
          "0 32px 100px rgba(0,0,0,.55), 0 0 70px rgba(48,145,255,.12), inset 0 1px rgba(255,255,255,.1)",

        animation:
          "adokvaPersonCardOpen .48s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {/* Верхнее отражение */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 34,
          right: 34,

          height: 1,

          background:
            "linear-gradient(90deg, transparent, rgba(185,226,255,.65), transparent)",
        }}
      />

      {/* Верхняя строка */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,

            color: "rgba(203,224,247,.72)",

            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1.6,
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#55ff9a",
              boxShadow: "0 0 14px #35ef84",
            }}
          />

          Профиль
        </div>

        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          style={{
            width: 42,
            height: 42,

            display: "grid",
            placeItems: "center",

            border:
              "1px solid rgba(255,255,255,.09)",

            borderRadius: "50%",

            cursor: "pointer",

            background:
              "rgba(255,255,255,.045)",

            color: "#fff",

            fontSize: 24,
            lineHeight: 1,

            transition:
              "transform .2s ease, background .2s ease",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform =
              "rotate(8deg) scale(1.06)";

            event.currentTarget.style.background =
              "rgba(255,255,255,.1)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform =
              "rotate(0deg) scale(1)";

            event.currentTarget.style.background =
              "rgba(255,255,255,.045)";
          }}
        >
          ×
        </button>
      </div>

      {/* Аватар */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",

          marginTop: 26,
        }}
      >
        <div
          style={{
            position: "relative",

            width: 138,
            height: 138,

            display: "grid",
            placeItems: "center",

            borderRadius: "50%",

            background:
              "linear-gradient(145deg, rgba(59,162,255,.28), rgba(34,65,130,.18))",

            border:
              "1px solid rgba(139,210,255,.45)",

            boxShadow:
              "0 0 0 7px rgba(52,154,255,.06), 0 0 45px rgba(40,153,255,.22), inset 0 0 30px rgba(83,182,255,.12)",
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: 2,

              color: "#e8f7ff",

              textShadow:
                "0 0 20px rgba(91,195,255,.55)",
            }}
          >
            {initials || "A"}
          </div>

          <div
            style={{
              position: "absolute",
              right: 8,
              bottom: 10,

              width: 20,
              height: 20,

              borderRadius: "50%",

              background: "#4cff93",

              border: "4px solid #101a2d",

              boxShadow:
                "0 0 16px rgba(76,255,147,.75)",
            }}
          />
        </div>
      </div>

      {/* Имя */}
      <div
        style={{
          marginTop: 22,

          textAlign: "center",
        }}
      >
        <h2
          style={{
            margin: 0,

            fontSize: 27,
            fontWeight: 750,
            letterSpacing: -0.5,
          }}
        >
          {name}
        </h2>

        <div
          style={{
            marginTop: 9,

            color: "rgba(208,225,244,.67)",

            fontSize: 16,
          }}
        >
          📍 {city}, {country}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,

            marginTop: 14,
            padding: "8px 13px",

            borderRadius: 999,

            background:
              "rgba(52,235,135,.08)",

            border:
              "1px solid rgba(82,255,157,.16)",

            color: "#72ffa9",

            fontSize: 14,
            fontWeight: 750,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#66ffa3",
              boxShadow: "0 0 12px #46f68d",
            }}
          />

          В сети
        </div>
      </div>

      {/* Информация */}
      <div
        style={{
          marginTop: 26,
          padding: 19,

          borderRadius: 22,

          background:
            "linear-gradient(145deg, rgba(255,255,255,.065), rgba(255,255,255,.025))",

          border:
            "1px solid rgba(255,255,255,.065)",

          color: "rgba(229,239,251,.78)",

          fontSize: 15,
          lineHeight: 1.75,
        }}
      >
        Здесь появится информация о человеке, его
        интересах, языках, родном городе и истории
        переезда.
      </div>

      {/* Быстрые показатели */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,

          marginTop: 14,
        }}
      >
        <div
          style={{
            padding: 15,

            borderRadius: 18,

            background:
              "rgba(255,255,255,.035)",

            border:
              "1px solid rgba(255,255,255,.055)",
          }}
        >
          <div
            style={{
              color: "rgba(190,210,235,.55)",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Языки
          </div>

          <div
            style={{
              marginTop: 7,
              fontWeight: 700,
            }}
          >
            Русский · English
          </div>
        </div>

        <div
          style={{
            padding: 15,

            borderRadius: 18,

            background:
              "rgba(255,255,255,.035)",

            border:
              "1px solid rgba(255,255,255,.055)",
          }}
        >
          <div
            style={{
              color: "rgba(190,210,235,.55)",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Статус
          </div>

          <div
            style={{
              marginTop: 7,
              fontWeight: 700,
            }}
          >
            Открыт к общению
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <button
        type="button"
        style={{
          width: "100%",

          marginTop: 22,
          padding: "16px 20px",

          border: "none",
          borderRadius: 18,

          cursor: "pointer",

          background:
            "linear-gradient(135deg, #1675ff, #32b8ff)",

          color: "#fff",

          fontSize: 16,
          fontWeight: 800,

          boxShadow:
            "0 15px 35px rgba(21,126,255,.3), inset 0 1px rgba(255,255,255,.28)",

          transition:
            "transform .22s ease, box-shadow .22s ease",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform =
            "translateY(-2px)";

          event.currentTarget.style.boxShadow =
            "0 20px 42px rgba(21,126,255,.42), inset 0 1px rgba(255,255,255,.32)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform =
            "translateY(0)";

          event.currentTarget.style.boxShadow =
            "0 15px 35px rgba(21,126,255,.3), inset 0 1px rgba(255,255,255,.28)";
        }}
      >
        💬 Написать
      </button>

      <button
        type="button"
        style={{
          width: "100%",

          marginTop: 11,
          padding: "16px 20px",

          border:
            "1px solid rgba(109,204,255,.22)",

          borderRadius: 18,

          cursor: "pointer",

          background:
            "rgba(65,163,255,.09)",

          color: "#d9f2ff",

          fontSize: 16,
          fontWeight: 800,

          transition:
            "transform .22s ease, background .22s ease",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform =
            "translateY(-2px)";

          event.currentTarget.style.background =
            "rgba(65,163,255,.17)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform =
            "translateY(0)";

          event.currentTarget.style.background =
            "rgba(65,163,255,.09)";
        }}
      >
        🌍 Показать на карте
      </button>

      <style>
        {`
          @keyframes adokvaPersonCardOpen {
            from {
              opacity: 0;
              transform: translateX(42px) scale(.96);
              filter: blur(10px);
            }

            to {
              opacity: 1;
              transform: translateX(0) scale(1);
              filter: blur(0);
            }
          }
        `}
      </style>
    </aside>
  );
}