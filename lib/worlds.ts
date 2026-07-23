import type {
  WorldId,
  WorldType,
} from "@/types/world";

export type WorldInfo = {
  id: WorldId;

  name: string;

  emoji: string;

  type: WorldType;

  parent: WorldId | null;
};

export const WORLDS: Record<
  WorldId,
  WorldInfo
> = {
  earth: {
    id: "earth",

    name: "Earth",

    emoji: "🌍",

    type: "planet",

    parent: "sun",
  },

  moon: {
    id: "moon",

    name: "Moon",

    emoji: "🌙",

    type: "moon",

    parent: "earth",
  },

  sun: {
    id: "sun",

    name: "Sun",

    emoji: "☀️",

    type: "star",

    parent: null,
  },

  mercury: {
    id: "mercury",

    name: "Mercury",

    emoji: "☿️",

    type: "planet",

    parent: "sun",
  },

  mars: {
    id: "mars",

    name: "Mars",

    emoji: "🔴",

    type: "planet",

    parent: "sun",
  },
};