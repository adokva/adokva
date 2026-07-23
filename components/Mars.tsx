"use client";

import {
  MARS_CONFIG,
} from "../data/planets";

import Planet from "./Planet";

type Props = {
  onSelect: () => void;
};

export default function Mars({
  onSelect,
}: Props) {
  return (
    <Planet
      config={MARS_CONFIG}
      onSelect={onSelect}
    />
  );
}