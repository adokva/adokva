"use client";

import { useState } from "react";

import type { Language } from "../lib/i18n";

type Props = {
  language: Language;
  onChange: (language: Language) => void;
};

const languageList: Array<{
  code: Language;
  name: string;
  direction: "ltr" | "rtl";
}> = [
  {
    code: "ru",
    name: "Русский",
    direction: "ltr",
  },
  {
    code: "en",
    name: "English",
    direction: "ltr",
  },
  {
    code: "ar",
    name: "العربية",
    direction: "rtl",
  },
];

export default function LanguageSwitcher({
  language,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 100001,
      }}
    >
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
        }}
        style={{
          minWidth: 64,
          height: 44,
          padding: "0 14px",
          borderRadius: 999,
          border:
            "1px solid rgba(150,210,255,.25)",
          cursor: "pointer",
          background: "rgba(12,22,40,.82)",
          color: "white",
          fontSize: 14,
          fontWeight: 700,
          backdropFilter: "blur(18px)",
          boxShadow:
            "0 0 24px rgba(0,120,255,.2)",
        }}
      >
        🌐 {language.toUpperCase()}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: 52,
            right: 0,
            width: 170,
            padding: 8,
            borderRadius: 16,
            background: "rgba(12,22,40,.96)",
            border:
              "1px solid rgba(150,210,255,.18)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 16px 40px rgba(0,0,0,.4)",
          }}
        >
          {languageList.map((item) => (
            <button
              type="button"
              key={item.code}
              onClick={() => {
                onChange(item.code);
                setOpen(false);
              }}
              style={{
                width: "100%",
                padding: "11px 12px",
                marginBottom: 4,
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                textAlign:
                  item.direction === "rtl"
                    ? "right"
                    : "left",
                background:
                  language === item.code
                    ? "rgba(55,150,255,.25)"
                    : "transparent",
                color: "white",
                fontSize: 14,
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}