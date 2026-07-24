import type {
  WorldObject,
} from "../types/worldObject";

import {
  locations,
} from "./locations";

export const worldObjects: WorldObject[] =
  locations.map((location) => {
    return {
      id: `city-${location.id}`,

      kind: "city",

      name: location.city,
      country: location.country,

      coordinates: {
        lat: location.lat,
        lon: location.lon,
      },

      searchTerms: [
        location.city,
        location.country,
      ],
    };
  });