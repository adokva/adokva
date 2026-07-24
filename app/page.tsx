"use client";

import {
  useEffect,
  useState,
} from "react";

import CanvasScene from "@/components/CanvasScene";
import CompatriotSetupPanel from "@/components/CompatriotSetupPanel";
import MenuButton from "@/components/MenuButton";
import PersonCard from "@/components/PersonCard";
import SearchPanel from "@/components/SearchPanel";
import WelcomeScreen from "@/components/WelcomeScreen";
import WorldInfoPanel from "@/components/WorldInfoPanel";

import type {
  CompatriotSelection,
} from "@/components/CompatriotSetupPanel";

import type {
  SelectedSearchResult,
} from "@/components/SearchPanel";

import type {
  SelectedWorld,
} from "@/types/world";

export default function Home() {
  const [
    welcomeOpen,
    setWelcomeOpen,
  ] = useState(true);

  const [
    introStarted,
    setIntroStarted,
  ] = useState(false);

  const [
    introComplete,
    setIntroComplete,
  ] = useState(false);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    compatriotOpen,
    setCompatriotOpen,
  ] = useState(false);

  const [
    compatriotSelection,
    setCompatriotSelection,
  ] =
    useState<CompatriotSelection | null>(
      null
    );

  const [
    selectedResult,
    setSelectedResult,
  ] =
    useState<SelectedSearchResult | null>(
      null
    );

  const [
    selectedWorld,
    setSelectedWorld,
  ] =
    useState<SelectedWorld>(
      "earth"
    );

  const [
    solarSystemView,
    setSolarSystemView,
  ] = useState(false);

  const [
    worldPanelVisible,
    setWorldPanelVisible,
  ] = useState(false);

  const exploringWorld =
    selectedWorld !== null &&
    selectedWorld !== "earth";

  useEffect(() => {
    setWorldPanelVisible(false);

    if (
      !introComplete ||
      !exploringWorld
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          setWorldPanelVisible(
            true
          );
        },
        1800
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    exploringWorld,
    introComplete,
    selectedWorld,
  ]);

  const selectedPerson =
    selectedResult?.type ===
    "person"
      ? selectedResult
      : null;

  const selectedLocation =
    selectedResult &&
    selectedResult.type !==
      "world"
      ? {
          lat:
            selectedResult.lat,

          lon:
            selectedResult.lon,
        }
      : null;

  const handleSelectWorld = (
    world: SelectedWorld
  ) => {
    setSelectedResult(null);
    setSearchOpen(false);
    setCompatriotOpen(false);
    setSolarSystemView(false);

    setSelectedWorld(
      (currentWorld) => {
        if (
          currentWorld ===
          world
        ) {
          return "earth";
        }

        return world;
      }
    );
  };

  const closeFloatingPanels =
    () => {
      setSearchOpen(false);
      setCompatriotOpen(false);
    };

  const handleCompatriotComplete =
    (
      selection:
        CompatriotSelection
    ) => {
      setCompatriotSelection(
        selection
      );
    };

  return (
    <main
      style={{
        position:
          "relative",

        width: "100vw",
        height: "100vh",

        overflow:
          "hidden",

        background:
          "#000",
      }}
    >
      <CanvasScene
        introStarted={
          introStarted
        }
        introComplete={
          introComplete
        }
        selectedLocation={
          exploringWorld
            ? null
            : selectedLocation
        }
        selectedWorld={
          selectedWorld
        }
        solarSystemView={
          solarSystemView
        }
        onSelectWorld={
          handleSelectWorld
        }
        onIntroComplete={() => {
          setIntroComplete(
            true
          );
        }}
      />

      {introComplete && (
        <button
          type="button"
          onClick={() => {
            setSearchOpen(false);
            setCompatriotOpen(false);
            setCompatriotSelection(
              null
            );
            setSelectedResult(null);
            setSelectedWorld(
              "earth"
            );
            setSolarSystemView(
              (current) =>
                !current
            );
          }}
          style={{
            position: "fixed",
            left: "50%",
            bottom: 24,
            zIndex: 880,
            transform:
              "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding:
              "13px 20px",
            borderRadius: 999,
            border: solarSystemView
              ? "1px solid rgba(155,218,255,.7)"
              : "1px solid rgba(126,190,255,.28)",
            background: solarSystemView
              ? "linear-gradient(135deg, rgba(29,135,220,.92), rgba(108,68,202,.92))"
              : "linear-gradient(135deg, rgba(10,24,48,.78), rgba(37,28,78,.78))",
            backdropFilter:
              "blur(20px)",
            WebkitBackdropFilter:
              "blur(20px)",
            boxShadow: solarSystemView
              ? "0 0 34px rgba(79,167,255,.42), 0 14px 40px rgba(0,0,0,.35)"
              : "0 14px 40px rgba(0,0,0,.38)",
            color: "white",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 0.7,
            transition:
              "transform .2s ease, box-shadow .2s ease, background .2s ease",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.transform =
              "translateX(-50%) translateY(-2px) scale(1.02)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.transform =
              "translateX(-50%) translateY(0) scale(1)";
          }}
        >
          <span
            style={{
              fontSize: 18,
            }}
          >
            {solarSystemView
              ? "🌍"
              : "🌌"}
          </span>

          {solarSystemView
            ? "ВЕРНУТЬСЯ К ЗЕМЛЕ"
            : "SOLAR SYSTEM VIEW"}
        </button>
      )}

      {introComplete &&
        !exploringWorld &&
        !solarSystemView && (
          <MenuButton
            onClick={() => {
              setCompatriotOpen(
                false
              );

              setCompatriotSelection(
                null
              );

              setSearchOpen(
                (current) =>
                  !current
              );
            }}
          />
        )}

      {introComplete &&
        !exploringWorld &&
        !solarSystemView && (
          <button
            type="button"
            onClick={() => {
              setSearchOpen(
                false
              );

              setCompatriotSelection(
                null
              );

              setCompatriotOpen(
                (current) =>
                  !current
              );
            }}
            style={{
              position:
                "fixed",

              top: 22,
              right: 22,

              zIndex: 850,

              display:
                "flex",

              alignItems:
                "center",

              gap: 10,

              padding:
                "13px 18px",

              borderRadius:
                999,

              border:
                "1px solid rgba(126,190,255,.24)",

              background:
                "linear-gradient(135deg, rgba(27,111,205,.72), rgba(101,64,190,.72))",

              backdropFilter:
                "blur(20px)",

              WebkitBackdropFilter:
                "blur(20px)",

              boxShadow:
                "0 14px 40px rgba(25,95,220,.25)",

              color:
                "white",

              cursor:
                "pointer",

              fontSize: 13,

              fontWeight:
                800,

              letterSpacing:
                0.7,

              transition:
                "transform .2s ease, box-shadow .2s ease",
            }}
            onMouseEnter={(
              event
            ) => {
              event.currentTarget
                .style
                .transform =
                "translateY(-2px) scale(1.02)";

              event.currentTarget
                .style
                .boxShadow =
                "0 18px 50px rgba(45,110,255,.38)";
            }}
            onMouseLeave={(
              event
            ) => {
              event.currentTarget
                .style
                .transform =
                "translateY(0) scale(1)";

              event.currentTarget
                .style
                .boxShadow =
                "0 14px 40px rgba(25,95,220,.25)";
            }}
          >
            <span
              style={{
                fontSize: 18,
              }}
            >
              🌍
            </span>

            ЗЕМЛЯКИ
          </button>
        )}

      {introComplete &&
        (searchOpen ||
          compatriotOpen) &&
        !exploringWorld && (
          <div
            onClick={
              closeFloatingPanels
            }
            style={{
              position:
                "fixed",

              inset: 0,

              zIndex: 900,

              background:
                "rgba(0,0,0,.46)",

              backdropFilter:
                "blur(5px)",

              WebkitBackdropFilter:
                "blur(5px)",
            }}
          />
        )}

      {introComplete &&
        searchOpen &&
        !exploringWorld &&
        !solarSystemView && (
          <div
            style={{
              position:
                "fixed",

              top: 92,
              left: 20,

              zIndex: 950,

              animation:
                "adokvaPanelOpen .35s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <SearchPanel
              onSelect={(
                result
              ) => {
                if (
                  result.type ===
                  "world"
                ) {
                  handleSelectWorld(
                    result.id
                  );

                  return;
                }

                setSelectedResult(
                  result
                );

                setSearchOpen(
                  false
                );
              }}
            />
          </div>
        )}

      {introComplete &&
        compatriotOpen &&
        !exploringWorld &&
        !solarSystemView && (
          <div
            style={{
              position:
                "fixed",

              inset: 0,

              zIndex: 950,

              display:
                "grid",

              placeItems:
                "center",

              padding: 16,

              pointerEvents:
                "none",

              animation:
                "adokvaCompatriotOpen .42s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <div
              style={{
                pointerEvents:
                  "auto",

                position:
                  "relative",
              }}
            >
              <button
                type="button"
                aria-label="Закрыть"
                onClick={
                  closeFloatingPanels
                }
                style={{
                  position:
                    "absolute",

                  top: 14,
                  right: 14,

                  zIndex: 10,

                  width: 38,
                  height: 38,

                  display:
                    "grid",

                  placeItems:
                    "center",

                  borderRadius:
                    "50%",

                  border:
                    "1px solid rgba(255,255,255,.1)",

                  background:
                    "rgba(0,0,0,.25)",

                  color:
                    "rgba(255,255,255,.8)",

                  cursor:
                    "pointer",

                  fontSize: 18,
                }}
              >
                ×
              </button>

              {!compatriotSelection ? (
                <CompatriotSetupPanel
                  onComplete={
                    handleCompatriotComplete
                  }
                />
              ) : (
                <div
                  style={{
                    width: 460,

                    maxWidth:
                      "calc(100vw - 32px)",

                    boxSizing:
                      "border-box",

                    padding:
                      "30px 26px",

                    borderRadius:
                      30,

                    background:
                      "linear-gradient(180deg, rgba(20,28,48,.88), rgba(7,12,25,.96))",

                    border:
                      "1px solid rgba(255,255,255,.09)",

                    backdropFilter:
                      "blur(32px)",

                    WebkitBackdropFilter:
                      "blur(32px)",

                    boxShadow:
                      "0 30px 100px rgba(0,0,0,.55), 0 0 90px rgba(55,135,255,.15)",

                    color:
                      "white",
                  }}
                >
                  <div
                    style={{
                      fontSize: 42,

                      textAlign:
                        "center",
                    }}
                  >
                    🌍
                  </div>

                  <h2
                    style={{
                      margin:
                        "14px 0 0",

                      textAlign:
                        "center",

                      fontSize: 25,
                    }}
                  >
                    Выбор принят
                  </h2>

                  <p
                    style={{
                      margin:
                        "10px 0 0",

                      textAlign:
                        "center",

                      color:
                        "rgba(225,235,250,.58)",

                      fontSize: 14,

                      lineHeight:
                        1.55,
                    }}
                  >
                    Пока данные
                    сохраняются
                    только в текущем
                    интерфейсе. Сервер
                    и анонимная
                    статистика будут
                    подключены на
                    следующем этапе.
                  </p>

                  <div
                    style={{
                      marginTop: 22,

                      padding:
                        "17px 18px",

                      borderRadius:
                        19,

                      background:
                        "rgba(255,255,255,.05)",

                      border:
                        "1px solid rgba(255,255,255,.07)",

                      fontSize: 14,

                      lineHeight:
                        1.75,
                    }}
                  >
                    <div>
                      <span
                        style={{
                          color:
                            "rgba(225,235,250,.5)",
                        }}
                      >
                        Родился:
                      </span>{" "}
                      {
                        compatriotSelection.birthPlace
                      }
                      ,{" "}
                      {
                        compatriotSelection.birthWorldName
                      }
                    </div>

                    <div>
                      <span
                        style={{
                          color:
                            "rgba(225,235,250,.5)",
                        }}
                      >
                        Живёт:
                      </span>{" "}
                      {
                        compatriotSelection.residencePlace
                      }
                      {compatriotSelection.residenceCountry
                        ? `, ${compatriotSelection.residenceCountry}`
                        : ""}
                      ,{" "}
                      {
                        compatriotSelection.residenceWorldName
                      }
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCompatriotSelection(
                        null
                      );
                    }}
                    style={{
                      width:
                        "100%",

                      marginTop: 20,

                      padding:
                        "15px 18px",

                      border:
                        "none",

                      borderRadius:
                        17,

                      background:
                        "linear-gradient(135deg, #3d9cff, #8068ff)",

                      color:
                        "white",

                      cursor:
                        "pointer",

                      fontSize: 15,

                      fontWeight:
                        800,
                    }}
                  >
                    Изменить выбор
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      {selectedPerson &&
        !exploringWorld &&
        !solarSystemView && (
          <PersonCard
            open={true}
            name={
              selectedPerson.name
            }
            city={
              selectedPerson.city
            }
            country={
              selectedPerson.country
            }
            onClose={() => {
              setSelectedResult(
                null
              );
            }}
          />
        )}

      {welcomeOpen && (
        <WelcomeScreen
          onJourneyStart={() => {
            setIntroStarted(
              true
            );
          }}
          onFinish={() => {
            setWelcomeOpen(
              false
            );
          }}
        />
      )}

      {introComplete &&
        exploringWorld &&
        worldPanelVisible && (
          <WorldInfoPanel
            world={
              selectedWorld
            }
            onClose={() => {
              setSelectedWorld(
                "earth"
              );
            }}
          />
        )}

      <style>
        {`
          @keyframes adokvaPanelOpen {
            from {
              opacity: 0;

              transform:
                translateX(-28px)
                scale(.97);
            }

            to {
              opacity: 1;

              transform:
                translateX(0)
                scale(1);
            }
          }

          @keyframes adokvaCompatriotOpen {
            from {
              opacity: 0;

              transform:
                translateY(25px)
                scale(.96);
            }

            to {
              opacity: 1;

              transform:
                translateY(0)
                scale(1);
            }
          }
        `}
      </style>
    </main>
  );
}