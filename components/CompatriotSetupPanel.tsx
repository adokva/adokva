"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  searchCities,
} from "../services/search";

import type {
  CitySearchResult,
} from "../services/search";

export type CompatriotSelection = {
  birthWorldId: string;
  birthWorldName: string;
  birthPlace: string;

  residenceWorldId: string;
  residenceWorldName: string;
  residenceCountry: string;
  residencePlace: string;
};

type Props = {
  onComplete?: (
    selection: CompatriotSelection
  ) => void;
};

type WorldOption = {
  id: string;
  name: string;
  icon: string;
};

const WORLD_OPTIONS: WorldOption[] = [
  {
    id: "mercury",
    name: "Меркурий",
    icon: "☿",
  },
  {
    id: "venus",
    name: "Венера",
    icon: "♀",
  },
  {
    id: "earth",
    name: "Земля",
    icon: "🌍",
  },
  {
    id: "mars",
    name: "Марс",
    icon: "♂",
  },
  {
    id: "jupiter",
    name: "Юпитер",
    icon: "♃",
  },
  {
    id: "saturn",
    name: "Сатурн",
    icon: "♄",
  },
  {
    id: "uranus",
    name: "Уран",
    icon: "⛢",
  },
  {
    id: "neptune",
    name: "Нептун",
    icon: "♆",
  },
];

function getWorld(
  worldId: string
) {
  return (
    WORLD_OPTIONS.find(
      (world) =>
        world.id === worldId
    ) ?? WORLD_OPTIONS[2]
  );
}

const fieldStyle = {
  width: "100%",

  boxSizing:
    "border-box" as const,

  padding: "15px 16px",

  borderRadius: 17,

  border:
    "1px solid rgba(255,255,255,.09)",

  outline: "none",

  background:
    "rgba(255,255,255,.055)",

  color: "white",

  fontSize: 16,

  transition:
    "border-color .2s ease, background .2s ease",
};

const labelStyle = {
  display: "block",

  marginBottom: 8,

  color:
    "rgba(225,235,250,.72)",

  fontSize: 13,

  fontWeight: 700,

  letterSpacing: 0.2,
};

type PlaceSuggestionsProps = {
  results: CitySearchResult[];
  visible: boolean;

  onSelect: (
    city: CitySearchResult
  ) => void;
};

function PlaceSuggestions({
  results,
  visible,
  onSelect,
}: PlaceSuggestionsProps) {
  if (
    !visible ||
    results.length === 0
  ) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",

        top: "calc(100% + 8px)",
        left: 0,
        right: 0,

        zIndex: 50,

        maxHeight: 240,
        overflowY: "auto",

        padding: 8,

        borderRadius: 18,

        background:
          "rgba(8,14,28,.98)",

        border:
          "1px solid rgba(110,180,255,.2)",

        boxShadow:
          "0 20px 50px rgba(0,0,0,.55)",

        backdropFilter:
          "blur(24px)",

        WebkitBackdropFilter:
          "blur(24px)",
      }}
    >
      {results.map(
        (city) => (
          <button
            key={city.id}
            type="button"
            onMouseDown={(
              event
            ) => {
              event.preventDefault();
            }}
            onClick={() => {
              onSelect(city);
            }}
            style={{
              display: "block",

              width: "100%",

              padding:
                "12px 13px",

              border: "none",
              borderRadius: 13,

              cursor: "pointer",

              textAlign: "left",

              background:
                "transparent",

              color: "white",
            }}
            onMouseEnter={(
              event
            ) => {
              event.currentTarget
                .style.background =
                "rgba(65,145,255,.16)";
            }}
            onMouseLeave={(
              event
            ) => {
              event.currentTarget
                .style.background =
                "transparent";
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 750,
              }}
            >
              🏙️ {city.city}
            </div>

            <div
              style={{
                marginTop: 4,

                color:
                  "rgba(215,230,250,.57)",

                fontSize: 12,
              }}
            >
              📍 {city.country}
            </div>
          </button>
        )
      )}
    </div>
  );
}

export default function CompatriotSetupPanel({
  onComplete,
}: Props) {
  const [
    birthWorldId,
    setBirthWorldId,
  ] = useState("earth");

  const [
    birthPlace,
    setBirthPlace,
  ] = useState("");

  const [
    birthPlaceFocused,
    setBirthPlaceFocused,
  ] = useState(false);

  const [
    residenceWorldId,
    setResidenceWorldId,
  ] = useState("earth");

  const [
    residenceCountry,
    setResidenceCountry,
  ] = useState("");

  const [
    residencePlace,
    setResidencePlace,
  ] = useState("");

  const [
    residencePlaceFocused,
    setResidencePlaceFocused,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const birthWorld =
    useMemo(
      () =>
        getWorld(
          birthWorldId
        ),
      [birthWorldId]
    );

  const residenceWorld =
    useMemo(
      () =>
        getWorld(
          residenceWorldId
        ),
      [residenceWorldId]
    );

  const residenceIsEarth =
    residenceWorldId ===
    "earth";

  const birthCityResults =
    useMemo(() => {
      if (
        birthWorldId !==
          "earth" ||
        birthPlace.trim()
          .length < 2
      ) {
        return [];
      }

      return searchCities(
        birthPlace
      ).slice(0, 6);
    }, [
      birthPlace,
      birthWorldId,
    ]);

  const residenceCityResults =
    useMemo(() => {
      if (
        residenceWorldId !==
          "earth" ||
        residencePlace.trim()
          .length < 2
      ) {
        return [];
      }

      return searchCities(
        residencePlace
      ).slice(0, 6);
    }, [
      residencePlace,
      residenceWorldId,
    ]);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const normalizedBirthPlace =
      birthPlace.trim();

    const normalizedCountry =
      residenceCountry.trim();

    const normalizedResidencePlace =
      residencePlace.trim();

    if (!normalizedBirthPlace) {
      setError(
        "Укажи город, деревню или другое место рождения."
      );

      return;
    }

    if (
      residenceIsEarth &&
      !normalizedCountry
    ) {
      setError(
        "Укажи страну, где живёшь сейчас."
      );

      return;
    }

    if (
      !normalizedResidencePlace
    ) {
      setError(
        "Укажи город, деревню или другое место проживания."
      );

      return;
    }

    setError("");

    onComplete?.({
      birthWorldId:
        birthWorld.id,

      birthWorldName:
        birthWorld.name,

      birthPlace:
        normalizedBirthPlace,

      residenceWorldId:
        residenceWorld.id,

      residenceWorldName:
        residenceWorld.name,

      residenceCountry:
        residenceIsEarth
          ? normalizedCountry
          : "",

      residencePlace:
        normalizedResidencePlace,
    });
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      style={{
        width: 460,

        maxWidth:
          "calc(100vw - 32px)",

        maxHeight:
          "calc(100vh - 32px)",

        overflowY: "auto",

        padding: 24,

        boxSizing:
          "border-box",

        borderRadius: 30,

        background:
          "linear-gradient(180deg, rgba(20,28,48,.82), rgba(7,12,25,.94))",

        border:
          "1px solid rgba(255,255,255,.09)",

        backdropFilter:
          "blur(32px)",

        WebkitBackdropFilter:
          "blur(32px)",

        boxShadow:
          "0 30px 100px rgba(0,0,0,.5), 0 0 90px rgba(55,135,255,.13)",
      }}
    >
      <div
        style={{
          display: "flex",

          alignItems:
            "center",

          gap: 13,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,

            display: "grid",

            placeItems:
              "center",

            flexShrink: 0,

            borderRadius: 16,

            background:
              "linear-gradient(135deg, rgba(58,153,255,.28), rgba(141,81,255,.2))",

            border:
              "1px solid rgba(130,190,255,.18)",

            fontSize: 25,
          }}
        >
          🌍
        </div>

        <div>
          <div
            style={{
              color: "white",

              fontSize: 23,

              fontWeight: 800,

              letterSpacing:
                -0.4,
            }}
          >
            Найти земляков
          </div>

          <div
            style={{
              marginTop: 3,

              color:
                "rgba(225,235,250,.55)",

              fontSize: 13,
            }}
          >
            Анонимно и без регистрации
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 21,

          padding:
            "13px 15px",

          borderRadius: 17,

          background:
            "rgba(60,150,255,.075)",

          border:
            "1px solid rgba(90,175,255,.11)",

          color:
            "rgba(210,229,250,.7)",

          fontSize: 12,

          lineHeight: 1.55,
        }}
      >
        ADOKVA не просит имя,
        телефон, электронную
        почту или точный адрес.
        Выбираются только общие
        места рождения и
        проживания.
      </div>

      <section
        style={{
          marginTop: 23,
        }}
      >
        <div
          style={{
            color:
              "rgba(143,198,255,.95)",

            fontSize: 12,

            fontWeight: 800,

            letterSpacing: 1,

            textTransform:
              "uppercase",
          }}
        >
          Место рождения
        </div>

        <div
          style={{
            marginTop: 14,
          }}
        >
          <label
            style={
              labelStyle
            }
          >
            1. Планета, где ты
            родился
          </label>

          <select
            value={
              birthWorldId
            }
            onChange={(
              event
            ) => {
              setBirthWorldId(
                event.target
                  .value
              );
            }}
            style={
              fieldStyle
            }
          >
            {WORLD_OPTIONS.map(
              (world) => (
                <option
                  key={
                    world.id
                  }
                  value={
                    world.id
                  }
                  style={{
                    color:
                      "black",
                  }}
                >
                  {
                    world.icon
                  }{" "}
                  {
                    world.name
                  }
                </option>
              )
            )}
          </select>
        </div>

        <div
          style={{
            position:
              "relative",

            marginTop: 15,
          }}
        >
          <label
            style={
              labelStyle
            }
          >
            2. Город, деревня
            или другое место
            рождения
          </label>

          <input
            value={
              birthPlace
            }
            onFocus={() => {
              setBirthPlaceFocused(
                true
              );
            }}
            onBlur={() => {
              setBirthPlaceFocused(
                false
              );
            }}
            onChange={(
              event
            ) => {
              setBirthPlace(
                event.target
                  .value
              );
            }}
            placeholder="Например: Москва или деревня Ивановка"
            autoComplete="off"
            style={
              fieldStyle
            }
          />

          <PlaceSuggestions
            visible={
              birthPlaceFocused
            }
            results={
              birthCityResults
            }
            onSelect={(
              city
            ) => {
              setBirthPlace(
                city.city
              );

              setBirthPlaceFocused(
                false
              );
            }}
          />
        </div>
      </section>

      <div
        style={{
          height: 1,

          margin:
            "23px 0",

          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,.11), transparent)",
        }}
      />

      <section>
        <div
          style={{
            color:
              "rgba(190,162,255,.96)",

            fontSize: 12,

            fontWeight: 800,

            letterSpacing: 1,

            textTransform:
              "uppercase",
          }}
        >
          Место проживания
        </div>

        <div
          style={{
            marginTop: 14,
          }}
        >
          <label
            style={
              labelStyle
            }
          >
            3. Планета, где ты
            живёшь сейчас
          </label>

          <select
            value={
              residenceWorldId
            }
            onChange={(
              event
            ) => {
              setResidenceWorldId(
                event.target
                  .value
              );
            }}
            style={
              fieldStyle
            }
          >
            {WORLD_OPTIONS.map(
              (world) => (
                <option
                  key={
                    world.id
                  }
                  value={
                    world.id
                  }
                  style={{
                    color:
                      "black",
                  }}
                >
                  {
                    world.icon
                  }{" "}
                  {
                    world.name
                  }
                </option>
              )
            )}
          </select>
        </div>

        {residenceIsEarth && (
          <div
            style={{
              marginTop: 15,
            }}
          >
            <label
              style={
                labelStyle
              }
            >
              4. Страна, где ты
              живёшь
            </label>

            <input
              value={
                residenceCountry
              }
              onChange={(
                event
              ) => {
                setResidenceCountry(
                  event.target
                    .value
                );
              }}
              placeholder="Например: Великобритания"
              autoComplete="off"
              style={
                fieldStyle
              }
            />
          </div>
        )}

        <div
          style={{
            position:
              "relative",

            marginTop: 15,
          }}
        >
          <label
            style={
              labelStyle
            }
          >
            {residenceIsEarth
              ? "5. Город, деревня или другое место проживания"
              : "4. Поселение или место проживания"}
          </label>

          <input
            value={
              residencePlace
            }
            onFocus={() => {
              setResidencePlaceFocused(
                true
              );
            }}
            onBlur={() => {
              setResidencePlaceFocused(
                false
              );
            }}
            onChange={(
              event
            ) => {
              setResidencePlace(
                event.target
                  .value
              );
            }}
            placeholder={
              residenceIsEarth
                ? "Например: Лондон"
                : `Например: поселение на планете ${residenceWorld.name}`
            }
            autoComplete="off"
            style={
              fieldStyle
            }
          />

          <PlaceSuggestions
            visible={
              residencePlaceFocused
            }
            results={
              residenceCityResults
            }
            onSelect={(
              city
            ) => {
              setResidencePlace(
                city.city
              );

              setResidenceCountry(
                city.country
              );

              setResidencePlaceFocused(
                false
              );
            }}
          />
        </div>
      </section>

      {error && (
        <div
          role="alert"
          style={{
            marginTop: 17,

            padding:
              "12px 14px",

            borderRadius: 15,

            background:
              "rgba(255,75,95,.1)",

            border:
              "1px solid rgba(255,100,120,.17)",

            color:
              "rgba(255,190,200,.94)",

            fontSize: 13,

            lineHeight: 1.45,
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        style={{
          width: "100%",

          marginTop: 21,

          padding:
            "16px 20px",

          border: "none",

          borderRadius: 18,

          cursor:
            "pointer",

          background:
            "linear-gradient(135deg, #3d9cff, #8068ff)",

          color: "white",

          fontSize: 16,

          fontWeight: 800,

          boxShadow:
            "0 14px 38px rgba(65,125,255,.3)",

          transition:
            "transform .2s ease, box-shadow .2s ease",
        }}
        onMouseEnter={(
          event
        ) => {
          event.currentTarget
            .style.transform =
            "translateY(-2px)";

          event.currentTarget
            .style.boxShadow =
            "0 18px 45px rgba(65,125,255,.42)";
        }}
        onMouseLeave={(
          event
        ) => {
          event.currentTarget
            .style.transform =
            "translateY(0)";

          event.currentTarget
            .style.boxShadow =
            "0 14px 38px rgba(65,125,255,.3)";
        }}
      >
        Показать моих земляков
      </button>

      <div
        style={{
          marginTop: 13,

          textAlign:
            "center",

          color:
            "rgba(225,235,250,.38)",

          fontSize: 11,

          lineHeight: 1.45,
        }}
      >
        Результаты должны
        отображаться только в
        обезличенном виде без
        показа конкретных людей.
      </div>
    </form>
  );
}