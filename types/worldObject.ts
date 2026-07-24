export type WorldObjectKind =
  | "city"
  | "airport"
  | "landmark";

export type GeoCoordinates = {
  lat: number;
  lon: number;
  altitude?: number;
};

export type WorldObject = {
  id: string;

  kind: WorldObjectKind;

  name: string;
  country?: string;

  coordinates: GeoCoordinates;

  searchTerms?: string[];
};