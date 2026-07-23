import { allLocations } from "./locations/index";

export type Location = {
  id: number;
  city: string;
  country: string;
  lat: number;
  lon: number;
};

export const locations: Location[] = allLocations;