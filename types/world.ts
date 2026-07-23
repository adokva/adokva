export type WorldId =
  | "earth"
  | "sun"
  | "moon"
  | "mercury"
  | "mars";

export type WorldType =
  | "planet"
  | "moon"
  | "star";

export type SelectedWorld =
  WorldId | null;