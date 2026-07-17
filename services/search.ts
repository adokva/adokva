import { people } from "../data/people";
import { Person } from "../types/person";

export function searchPeople(query: string): Person[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase();

  return people.filter((person) => {
    return (
      person.name.toLowerCase().includes(q) ||
      person.city.toLowerCase().includes(q) ||
      person.country.toLowerCase().includes(q)
    );
  });
}

export function findPerson(id: number): Person | undefined {
  return people.find((person) => person.id === id);
}