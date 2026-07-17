"use client";

import {
  useState,
} from "react";

import CanvasScene from "@/components/CanvasScene";
import MenuButton from "@/components/MenuButton";
import PersonCard from "@/components/PersonCard";

import SearchPanel, {
  SelectedPerson,
} from "@/components/SearchPanel";

import WelcomeScreen from "@/components/WelcomeScreen";

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
    selectedPerson,
    setSelectedPerson,
  ] =
    useState<SelectedPerson | null>(
      null
    );

  const [
    selectedWorld,
    setSelectedWorld,
  ] =
    useState<SelectedWorld>(
      "earth"
    );

  const exploringWorld =
    selectedWorld !== null &&
    selectedWorld !== "earth";

  const handleSelectWorld = (
    world: SelectedWorld
  ) => {
    setSelectedPerson(null);
    setSearchOpen(false);

    /*
      Повторное нажатие на уже
      выбранный мир возвращает
      камеру к Земле.

      Пример:

      Солнце → Солнце = Земля
      Луна → Луна = Земля
    */

    setSelectedWorld(
      (currentWorld) => {
        if (
          currentWorld === world
        ) {
          return "earth";
        }

        return world;
      }
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
            : selectedPerson
              ? {
                  lat:
                    selectedPerson.lat,

                  lon:
                    selectedPerson.lon,
                }
              : null
        }
        selectedWorld={
          selectedWorld
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

      {introComplete &&
        !exploringWorld && (
          <MenuButton
            onClick={() => {
              setSearchOpen(
                (current) =>
                  !current
              );
            }}
          />
        )}

      {introComplete &&
        searchOpen &&
        !exploringWorld && (
          <div
            onClick={() => {
              setSearchOpen(
                false
              );
            }}
            style={{
              position:
                "fixed",

              inset: 0,

              zIndex: 900,

              background:
                "rgba(0,0,0,.32)",

              backdropFilter:
                "blur(2px)",
            }}
          />
        )}

      {introComplete &&
        searchOpen &&
        !exploringWorld && (
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
                person
              ) => {
                setSelectedPerson(
                  person
                );

                setSearchOpen(
                  false
                );
              }}
            />
          </div>
        )}

      {selectedPerson &&
        !exploringWorld && (
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
              setSelectedPerson(
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
        `}
      </style>
    </main>
  );
}