import type {
  WorldId,
} from "@/types/world";

export type WorldInfo = {
  id: WorldId;
  name: string;
  emoji: string;
};

export const WORLDS: Record<
  WorldId,
  WorldInfo
> = {
  earth: {
    id: "earth",
    name: "Earth",
    emoji: "🌍",
  },

  moon: {
    id: "moon",
    name: "Moon",
    emoji: "🌙",
  },

  sun: {
    id: "sun",
    name: "Sun",
    emoji: "☀️",
  },
};