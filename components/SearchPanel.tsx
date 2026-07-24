"use client";

import {
  useEffect,
  useMemo,
  useRef,
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

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(-1);

  const resultRefs =
    useRef<
      Array<HTMLButtonElement | null>
    >([]);

  const results =
    useMemo(() => {
      if (!query.trim()) {
        return [];
      }

      return searchAll(
        query
      );
    }, [query]);

  useEffect(() => {
    setActiveIndex(
      results.length > 0
        ? 0
        : -1
    );
  }, [results]);

  useEffect(() => {
    if (activeIndex < 0) {
      return;
    }

    resultRefs.current[
      activeIndex
    ]?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

  function selectResult(
    result:
      SelectedSearchResult
  ) {
    onSelect?.(result);
    setQuery("");
    setActiveIndex(-1);
  }

  function handleKeyDown(
    event:
      React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      results.length === 0
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setQuery("");
      }

      return;
    }

    if (
      event.key ===
      "ArrowDown"
    ) {
      event.preventDefault();

      setActiveIndex(
        (current) =>
          current >=
          results.length - 1
            ? 0
            : current + 1
      );

      return;
    }

    if (
      event.key ===
      "ArrowUp"
    ) {
      event.preventDefault();

      setActiveIndex(
        (current) =>
          current <= 0
            ? results.length - 1
            : current - 1
      );

      return;
    }

    if (
      event.key ===
        "Enter" &&
      activeIndex >= 0
    ) {
      event.preventDefault();

      selectResult(
        results[activeIndex]
      );

      return;
    }

    if (
      event.key ===
      "Escape"
    ) {
      setQuery("");
      setActiveIndex(-1);
    }
  }

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
          onKeyDown={
            handleKeyDown
          }
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

        {query.length > 0 && (
          <button
            type="button"
            aria-label="Очистить поиск"
            onClick={() => {
              setQuery("");
              setActiveIndex(-1);
            }}
            style={{
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "center",

              width: 30,
              height: 30,

              flexShrink: 0,

              border: "none",
              borderRadius:
                "50%",

              background:
                "rgba(255,255,255,.08)",

              color:
                "rgba(235,242,255,.72)",

              cursor:
                "pointer",

              fontSize: 16,
            }}
          >
            ×
          </button>
        )}
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

      {query.trim() !== "" &&
        results.length > 0 && (
          <div
            style={{
              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              gap: 12,

              marginTop: 16,

              padding:
                "0 6px",

              color:
                "rgba(225,235,250,.48)",

              fontSize: 12,
            }}
          >
            <span>
              Найдено:{" "}
              {results.length}
            </span>

            <span>
              ↑ ↓ выбор · Enter
            </span>
          </div>
        )}

      <div
        style={{
          marginTop:
            results.length
              ? 6
              : 0,

          maxHeight: 430,

          overflowY: "auto",

          scrollbarWidth:
            "thin",
        }}
      >
        {results.map(
          (
            result,
            index
          ) => {
            const isCity =
              result.type ===
              "city";

            const isWorld =
              result.type ===
              "world";

            const isActive =
              index ===
              activeIndex;

            const border =
              isActive
                ? isWorld
                  ? "1px solid rgba(205,167,255,.58)"
                  : isCity
                    ? "1px solid rgba(107,199,255,.48)"
                    : "1px solid rgba(118,177,255,.42)"
                : isWorld
                  ? "1px solid rgba(178,127,255,.24)"
                  : isCity
                    ? "1px solid rgba(79,181,255,.16)"
                    : "1px solid rgba(255,255,255,.06)";

            const background =
              isActive
                ? isWorld
                  ? "rgba(140,91,230,.22)"
                  : isCity
                    ? "rgba(38,151,240,.18)"
                    : "rgba(52,130,255,.14)"
                : isWorld
                  ? "rgba(115,72,196,.12)"
                  : isCity
                    ? "rgba(30,118,196,.09)"
                    : "rgba(255,255,255,.045)";

            return (
              <button
                ref={(element) => {
                  resultRefs.current[
                    index
                  ] = element;
                }}
                type="button"
                key={`${result.type}-${result.id}`}
                onMouseEnter={() => {
                  setActiveIndex(
                    index
                  );
                }}
                onClick={() => {
                  selectResult(
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

                  transform:
                    isActive
                      ? "translateX(5px)"
                      : "translateX(0)",

                  transition:
                    "transform .2s ease, background .2s ease, border-color .2s ease",
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
                  "24px 8px 8px",

                textAlign:
                  "center",

                color:
                  "rgba(225,235,250,.55)",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  marginBottom: 8,
                }}
              >
                🌌
              </div>

              Ничего не найдено
            </div>
          )}
      </div>
    </div>
  );
}