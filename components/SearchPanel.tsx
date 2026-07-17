"use client";

import { useMemo, useState } from "react";
import { searchPeople } from "../services/search";

export type SelectedPerson = {
  id: number;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
};

type Props = {
  onSelect?: (person: SelectedPerson) => void;
};

export default function SearchPanel({
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];

    return searchPeople(query);
  }, [query]);

  return (
    <div
      style={{
        width: 430,
        maxWidth: "calc(100vw - 40px)",
        padding: 22,
        borderRadius: 28,

        background:
          "linear-gradient(180deg, rgba(20,28,48,.78), rgba(8,14,28,.92))",

        border:
          "1px solid rgba(255,255,255,.08)",

        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",

        boxShadow:
          "0 30px 90px rgba(0,0,0,.45), 0 0 80px rgba(60,140,255,.15)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 20px",
          borderRadius: 20,

          background:
            "rgba(255,255,255,.05)",

          border:
            "1px solid rgba(255,255,255,.06)",
        }}
      >
        <span style={{ fontSize: 24 }}>
          🔍
        </span>

        <input
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Поиск человека или города..."
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "white",
            fontSize: 18,
          }}
        />
      </div>

      <div
        style={{
          marginTop: results.length ? 18 : 0,
          maxHeight: 430,
          overflowY: "auto",
        }}
      >
        {results.map((person) => (
          <button
            type="button"
            key={person.id}
            onClick={() => {
              onSelect?.({
                id: person.id,
                name: person.name,
                city: person.city,
                country: person.country,
                lat: person.lat,
                lon: person.lon,
              });
            }}
            style={{
              display: "block",
              width: "100%",
              padding: 18,
              marginTop: 12,

              borderRadius: 20,
              border:
                "1px solid rgba(255,255,255,.06)",

              cursor: "pointer",
              textAlign: "left",

              background:
                "rgba(255,255,255,.045)",

              color: "white",

              transition:
                "transform .2s ease, background .2s ease, border-color .2s ease",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform =
                "translateX(5px)";

              event.currentTarget.style.background =
                "rgba(52,130,255,.14)";

              event.currentTarget.style.borderColor =
                "rgba(93,177,255,.22)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform =
                "translateX(0)";

              event.currentTarget.style.background =
                "rgba(255,255,255,.045)";

              event.currentTarget.style.borderColor =
                "rgba(255,255,255,.06)";
            }}
          >
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
              }}
            >
              {person.name}
            </div>

            <div
              style={{
                marginTop: 7,
                fontSize: 14,
                color:
                  "rgba(225,235,250,.66)",
              }}
            >
              📍 {person.city}, {person.country}
            </div>
          </button>
        ))}

        {query.trim() !== "" &&
          results.length === 0 && (
            <div
              style={{
                padding: "22px 8px 6px",
                textAlign: "center",
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