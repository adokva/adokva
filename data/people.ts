import { Person } from "../types/person";

export const people: Person[] = [
  {
    id: 1,
    name: "Иван Петров",
    city: "Dubai",
    country: "UAE",
    lat: 25.2048,
    lon: 55.2708,
    online: true,
    avatar: "/avatars/default.png",
    about: "Люблю путешествия и новые знакомства.",
  },

  {
    id: 2,
    name: "Алексей Иванов",
    city: "Moscow",
    country: "Russia",
    lat: 55.7558,
    lon: 37.6176,
    online: false,
    avatar: "/avatars/default.png",
    about: "Работаю в IT и люблю природу.",
  },

  {
    id: 3,
    name: "Anna Müller",
    city: "Berlin",
    country: "Germany",
    lat: 52.52,
    lon: 13.405,
    online: true,
    avatar: "/avatars/default.png",
    about: "Люблю путешествовать по миру.",
  },
];