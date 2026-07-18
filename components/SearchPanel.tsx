"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  searchAll,
} from "../services/search";

import type {
  SearchResult,
  WorldSearchResult,
} from "../services/search";

export type SelectedSearchResult =
  SearchResult;

export type SelectedPerson = {
  id: number;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
};

type Props = {
  onSelect?: (
    result:
      SelectedSearchResult
  ) => void;
};

function getWorldIcon(
  world: WorldSearchResult
) {
  if (world.id === "earth") {
    return "🌍";
  }

  if (world.id === "moon") {
    return "🌙";
  }

  return "☀️";
}

function getWorldDescription(
  world: WorldSearchResult
) {
  if (world.id === "earth") {
    return "Планета";
  }

  if (world.id === "moon") {
    return "Естественный спутник";
  }

  return "Звезда";
}

export default function SearchPanel({
  onSelect,
}: Props) {
  const [
    query,
    setQuery,
  ] = useState("");

  const results =
    useMemo(() => {
      if (!query.trim()) {
        return [];
      }

      return searchAll(
        query
      );
    }, [query]);

  return (
    <div
      style={{
        width: 430,

        maxWidth:
          "calc(100vw - 40px)",

        padding: 22,

        borderRadius: 28,

        background:
          "linear-gradient(180deg, rgba(20,28,48,.78), rgba(8,14,28,.92))",

        border:
          "1px solid rgba(255,255,255,.08)",

        backdropFilter:
          "blur(30px)",

        WebkitBackdropFilter:
          "blur(30px)",

        boxShadow:
          "0 30px 90px rgba(0,0,0,.45), 0 0 80px rgba(60,140,255,.15)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",

          gap: 14,

          padding:
            "16px 20px",

          borderRadius: 20,

          background:
            "rgba(255,255,255,.05)",

          border:
            "1px solid rgba(255,255,255,.06)",
        }}
      >
        <span
          style={{
            fontSize: 24,
          }}
        >
          🔍
        </span>

        <input
          autoFocus
          value={query}
          onChange={(event) => {
            setQuery(
              event.target.value
            );
          }}
          placeholder="Мир, человек, город или страна..."
          style={{
            flex: 1,
            minWidth: 0,

            background:
              "transparent",

            border: "none",
            outline: "none",

            color: "white",

            fontSize: 18,
          }}
        />
      </div>

      {!query.trim() && (
        <div
          style={{
            padding:
              "18px 8px 2px",

            textAlign:
              "center",

            color:
              "rgba(225,235,250,.48)",

            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          Например: Луна,
          Солнце, Dubai,
          Moscow или имя человека
        </div>
      )}

      <div
        style={{
          marginTop:
            results.length
              ? 18
              : 0,

          maxHeight: 430,

          overflowY: "auto",
        }}
      >
        {results.map(
          (result) => {
            const isCity =
              result.type ===
              "city";

            const isWorld =
              result.type ===
              "world";

            const border =
              isWorld
                ? "1px solid rgba(178,127,255,.24)"
                : isCity
                  ? "1px solid rgba(79,181,255,.16)"
                  : "1px solid rgba(255,255,255,.06)";

            const background =
              isWorld
                ? "rgba(115,72,196,.12)"
                : isCity
                  ? "rgba(30,118,196,.09)"
                  : "rgba(255,255,255,.045)";

            return (
              <button
                type="button"
                key={`${result.type}-${result.id}`}
                onClick={() => {
                  onSelect?.(
                    result
                  );
                }}
                style={{
                  display:
                    "block",

                  width: "100%",

                  padding: 18,
                  marginTop: 12,

                  borderRadius: 20,

                  border,

                  cursor:
                    "pointer",

                  textAlign:
                    "left",

                  background,

                  color: "white",

                  transition:
                    "transform .2s ease, background .2s ease, border-color .2s ease",
                }}
                onMouseEnter={(
                  event
                ) => {
                  event.currentTarget
                    .style
                    .transform =
                    "translateX(5px)";

                  event.currentTarget
                    .style
                    .background =
                    isWorld
                      ? "rgba(140,91,230,.22)"
                      : isCity
                        ? "rgba(38,151,240,.18)"
                        : "rgba(52,130,255,.14)";

                  event.currentTarget
                    .style
                    .borderColor =
                    isWorld
                      ? "rgba(190,145,255,.42)"
                      : "rgba(93,177,255,.28)";
                }}
                onMouseLeave={(
                  event
                ) => {
                  event.currentTarget
                    .style
                    .transform =
                    "translateX(0)";

                  event.currentTarget
                    .style
                    .background =
                    background;

                  event.currentTarget
                    .style
                    .borderColor =
                    isWorld
                      ? "rgba(178,127,255,.24)"
                      : isCity
                        ? "rgba(79,181,255,.16)"
                        : "rgba(255,255,255,.06)";
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "space-between",

                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 17,

                      fontWeight:
                        700,
                    }}
                  >
                    {isWorld
                      ? `${getWorldIcon(result)} ${result.name}`
                      : isCity
                        ? `🏙️ ${result.city}`
                        : `👤 ${result.name}`}
                  </div>

                  <div
                    style={{
                      flexShrink: 0,

                      padding:
                        "5px 9px",

                      borderRadius:
                        999,

                      background:
                        isWorld
                          ? "rgba(176,121,255,.16)"
                          : isCity
                            ? "rgba(55,169,255,.13)"
                            : "rgba(255,255,255,.06)",

                      color:
                        isWorld
                          ? "rgba(218,190,255,.95)"
                          : isCity
                            ? "rgba(156,217,255,.9)"
                            : "rgba(225,235,250,.56)",

                      fontSize: 11,

                      fontWeight:
                        700,

                      letterSpacing:
                        0.4,
                    }}
                  >
                    {isWorld
                      ? "МИР"
                      : isCity
                        ? "ГОРОД"
                        : "ЧЕЛОВЕК"}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 7,

                    fontSize: 14,

                    color:
                      "rgba(225,235,250,.66)",
                  }}
                >
                  {isWorld
                    ? `✨ ${getWorldDescription(result)}`
                    : isCity
                      ? `📍 ${result.country}`
                      : `📍 ${result.city}, ${result.country}`}
                </div>
              </button>
            );
          }
        )}

        {query.trim() !== "" &&
          results.length ===
            0 && (
            <div
              style={{
                padding:
                  "22px 8px 6px",

                textAlign:
                  "center",

                color:
                  "rgba(225,235,250,.55)",
              }}
            >
              Ничего не найдено
            </div>
          )}
      </div>
    </div>
  );
}