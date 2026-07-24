import {
  locations,
} from "../data/locations";

import {
  people,
} from "../data/people";

import {
  WORLDS,
} from "../lib/worlds";

import type {
  Person,
} from "../types/person";

import type {
  WorldId,
} from "../types/world";

export type PersonSearchResult = {
  type: "person";

  id: number;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
};

export type CitySearchResult = {
  type: "city";

  id: number;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
};

export type WorldSearchResult = {
  type: "world";

  id: WorldId;
  name: string;
};

export type SearchResult =
  | PersonSearchResult
  | CitySearchResult
  | WorldSearchResult;

const CITY_ALIASES: Record<
  string,
  string[]
> = {
  Dubai: [
    "дубай",
    "дубаи",
  ],

  Moscow: [
    "москва",
    "москве",
    "москвы",
  ],

  London: [
    "лондон",
  ],

  Paris: [
    "париж",
  ],

  Berlin: [
    "берлин",
  ],

  Rome: [
    "рим",
  ],

  Istanbul: [
    "стамбул",
    "истанбул",
  ],

  "New York": [
    "нью-йорк",
    "нью йорк",
    "ньюйорк",
  ],

  "Los Angeles": [
    "лос-анджелес",
    "лос анджелес",
    "лосанджелес",
  ],

  Toronto: [
    "торонто",
  ],

  "Mexico City": [
    "мехико",
    "мехико-сити",
    "мехико сити",
  ],

  "Rio de Janeiro": [
    "рио-де-жанейро",
    "рио де жанейро",
    "рио",
  ],

  "Cape Town": [
    "кейптаун",
    "кейп-таун",
    "кейп таун",
  ],

  Cairo: [
    "каир",
  ],

  Mumbai: [
    "мумбаи",
    "бомбей",
  ],

  Singapore: [
    "сингапур",
  ],

  Bangkok: [
    "бангкок",
  ],

  "Hong Kong": [
    "гонконг",
  ],

  Beijing: [
    "пекин",
  ],

  Seoul: [
    "сеул",
  ],

  Tokyo: [
    "токио",
  ],

  Sydney: [
    "сидней",
  ],
};

const COUNTRY_ALIASES: Record<
  string,
  string[]
> = {
  UAE: [
    "оаэ",
    "объединённые арабские эмираты",
    "объединенные арабские эмираты",
    "эмираты",
  ],

  Russia: [
    "россия",
    "рф",
  ],

  "United Kingdom": [
    "великобритания",
    "англия",
  ],

  France: [
    "франция",
  ],

  Germany: [
    "германия",
  ],

  Italy: [
    "италия",
  ],

  Turkey: [
    "турция",
  ],

  USA: [
    "сша",
    "соединённые штаты",
    "соединенные штаты",
    "америка",
  ],

  Canada: [
    "канада",
  ],

  Mexico: [
    "мексика",
  ],

  Brazil: [
    "бразилия",
  ],

  "South Africa": [
    "юар",
    "южная африка",
  ],

  Egypt: [
    "египет",
  ],

  India: [
    "индия",
  ],

  Singapore: [
    "сингапур",
  ],

  Thailand: [
    "таиланд",
  ],

  China: [
    "китай",
  ],

  "South Korea": [
    "южная корея",
    "корея",
  ],

  Japan: [
    "япония",
  ],

  Australia: [
    "австралия",
  ],
};

const WORLD_ALIASES: Record<
  WorldId,
  string[]
> = {
  earth: [
    "earth",
    "земля",
    "планета земля",
    "мир земля",
  ],

  moon: [
    "moon",
    "луна",
    "спутник земли",
    "спутник",
  ],

  sun: [
    "sun",
    "солнце",
    "звезда",
    "солнечная система",
  ],
    mars: [
    "mars",
    "марс",
    "красная планета",
    "планета марс",
  ],
  mercury: [
  "mercury",
  "меркурий",
],

};

function normalizeSearchText(
  value: string
) {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(
      /ё/g,
      "е"
    )
    .replace(
      /[\u2010-\u2015]/g,
      "-"
    )
    .replace(
      /\s+/g,
      " "
    );
}

function includesQuery(
  value: string,
  query: string
) {
  return normalizeSearchText(
    value
  ).includes(
    query
  );
}

function aliasesIncludeQuery(
  aliases: string[],
  query: string
) {
  return aliases.some(
    (alias) =>
      includesQuery(
        alias,
        query
      )
  );
}

export function searchPeople(
  query: string
): Person[] {
  const normalizedQuery =
    normalizeSearchText(
      query
    );

  if (!normalizedQuery) {
    return [];
  }

  return people.filter(
    (person) => {
      const cityAliases =
        CITY_ALIASES[
          person.city
        ] ?? [];

      const countryAliases =
        COUNTRY_ALIASES[
          person.country
        ] ?? [];

      return (
        includesQuery(
          person.name,
          normalizedQuery
        ) ||
        includesQuery(
          person.city,
          normalizedQuery
        ) ||
        includesQuery(
          person.country,
          normalizedQuery
        ) ||
        aliasesIncludeQuery(
          cityAliases,
          normalizedQuery
        ) ||
        aliasesIncludeQuery(
          countryAliases,
          normalizedQuery
        )
      );
    }
  );
}

export function searchCities(
  query: string
): CitySearchResult[] {
  const normalizedQuery =
    normalizeSearchText(
      query
    );

  if (!normalizedQuery) {
    return [];
  }

  return locations
    .filter((location) => {
      const cityAliases =
        CITY_ALIASES[
          location.city
        ] ?? [];

      const countryAliases =
        COUNTRY_ALIASES[
          location.country
        ] ?? [];

      return (
        includesQuery(
          location.city,
          normalizedQuery
        ) ||
        includesQuery(
          location.country,
          normalizedQuery
        ) ||
        aliasesIncludeQuery(
          cityAliases,
          normalizedQuery
        ) ||
        aliasesIncludeQuery(
          countryAliases,
          normalizedQuery
        )
      );
    })
    .map((location) => ({
      type: "city" as const,

      id: location.id,
      name: location.city,
      city: location.city,
      country:
        location.country,
      lat: location.lat,
      lon: location.lon,
    }));
}

export function searchWorlds(
  query: string
): WorldSearchResult[] {
  const normalizedQuery =
    normalizeSearchText(
      query
    );

  if (!normalizedQuery) {
    return [];
  }

  return Object.values(
    WORLDS
  ).flatMap(
    (
      world
    ): WorldSearchResult[] => {
      const worldId =
        world.id;

      const aliases =
        WORLD_ALIASES[
          worldId
        ] ?? [];

      const matches =
        includesQuery(
          world.name,
          normalizedQuery
        ) ||
        includesQuery(
          worldId,
          normalizedQuery
        ) ||
        aliasesIncludeQuery(
          aliases,
          normalizedQuery
        );

      if (!matches) {
        return [];
      }

      return [
        {
          type: "world",

          id: worldId,
          name: world.name,
        },
      ];
    }
  );
}

function cityStartsWithQuery(
  city: CitySearchResult,
  query: string
) {
  const cityAliases =
    CITY_ALIASES[
      city.city
    ] ?? [];

  if (
    normalizeSearchText(
      city.city
    ).startsWith(
      query
    )
  ) {
    return true;
  }

  return cityAliases.some(
    (alias) =>
      normalizeSearchText(
        alias
      ).startsWith(
        query
      )
  );
}

export function searchAll(
  query: string
): SearchResult[] {
  const normalizedQuery =
    normalizeSearchText(
      query
    );

  if (!normalizedQuery) {
    return [];
  }

  const worldResults =
    searchWorlds(query);

  const personResults:
    PersonSearchResult[] =
    searchPeople(query).map(
      (person) => ({
        type:
          "person" as const,

        id: person.id,
        name: person.name,
        city: person.city,
        country:
          person.country,
        lat: person.lat,
        lon: person.lon,
      })
    );

  const cityResults =
    searchCities(query);

  const sortedCities =
    [...cityResults].sort(
      (
        first,
        second
      ) => {
        const firstStarts =
          cityStartsWithQuery(
            first,
            normalizedQuery
          );

        const secondStarts =
          cityStartsWithQuery(
            second,
            normalizedQuery
          );

        if (
          firstStarts &&
          !secondStarts
        ) {
          return -1;
        }

        if (
          !firstStarts &&
          secondStarts
        ) {
          return 1;
        }

        return first.city.localeCompare(
          second.city
        );
      }
    );

  return [
    ...worldResults,
    ...sortedCities,
    ...personResults,
  ].slice(
    0,
    30
  );
}

export function findPerson(
  id: number
): Person | undefined {
  return people.find(
    (person) =>
      person.id === id
  );
}