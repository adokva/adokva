import * as THREE from "three";

import {
  MERCURY_CURRENT_POSITION,
  MERCURY_INITIAL_ANGLE,
  MERCURY_ORBIT_HEIGHT,
  MERCURY_ORBIT_RADIUS,
  MERCURY_ORBIT_SPEED,
  MERCURY_POSITION,
  SUN_POSITION,
} from "../lib/space";

export type PlanetId =
  | "mercury";

export type PlanetConfig = {
  id: PlanetId;

  name: string;

  texturePath: string;

  radius: number;

  geometrySegments: number;

  rotationSpeed: number;

  initialPosition: readonly [
    number,
    number,
    number,
  ];

  currentPosition:
    THREE.Vector3;

  orbit: {
    center: readonly [
      number,
      number,
      number,
    ];

    radius: number;

    height: number;

    speed: number;

    initialAngle: number;

    segments: number;

    color: string;

    lineWidth: number;

    opacity: number;
  };

  material: {
    bumpScale: number;

    roughness: number;

    metalness: number;
  };

  camera: {
    visualRadius: number;

    framePadding: number;

    flightDuration: number;
  };
};

export const MERCURY_CONFIG:
  PlanetConfig = {
  id: "mercury",

  name: "Mercury",

  texturePath:
    "/textures/mercury.jpg",

  radius: 0.42,

  geometrySegments: 128,

  rotationSpeed: 0.12,

  initialPosition:
    MERCURY_POSITION,

  currentPosition:
    MERCURY_CURRENT_POSITION,

  orbit: {
    center: SUN_POSITION,

    radius:
      MERCURY_ORBIT_RADIUS,

    height:
      MERCURY_ORBIT_HEIGHT,

    speed:
      MERCURY_ORBIT_SPEED,

    initialAngle:
      MERCURY_INITIAL_ANGLE,

    segments: 256,

    color: "#ffb45f",

    lineWidth: 0.75,

    opacity: 0.34,
  },

  material: {
    bumpScale: 0.025,

    roughness: 0.92,

    metalness: 0.02,
  },

  camera: {
    visualRadius: 0.58,

    framePadding: 1.65,

    flightDuration: 3.2,
  },
};

export const PLANETS:
  readonly PlanetConfig[] = [
  MERCURY_CONFIG,
];

export function getPlanetConfig(
  planetId: PlanetId
) {
  return PLANETS.find(
    (planet) =>
      planet.id === planetId
  );
}