export type WorldId =
  | "earth"
  | "sun"
  | "moon"
  | "mars";

export type WorldType =
  | "planet"
  | "moon"
  | "star";

export type SelectedWorld =
  WorldId | null;