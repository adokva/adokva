import * as THREE from "three";

import {
  MARS_POSITION,
  MERCURY_CURRENT_POSITION,
  MERCURY_INITIAL_ANGLE,
  MERCURY_ORBIT_HEIGHT,
  MERCURY_ORBIT_RADIUS,
  MERCURY_ORBIT_SPEED,
  MERCURY_POSITION,
  SUN_POSITION,
} from "../lib/space";

export type PlanetId =
  | "mercury"
  | "mars";

export type PlanetOrbitConfig = {
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

export type PlanetConfig = {
  id: PlanetId;

  name: string;

  texturePath: string;

  radius: number;

  geometrySegments: number;

  rotationSpeed: number;

  initialRotationY?: number;

  initialPosition: readonly [
    number,
    number,
    number,
  ];

  currentPosition:
    THREE.Vector3;

  orbit?: PlanetOrbitConfig;

  texture?: {
    wrapS?: THREE.Wrapping;

    wrapT?: THREE.Wrapping;

    anisotropy?: number;
  };

  material: {
    bumpScale: number;

    roughness: number;

    metalness: number;

    color?: string;
  };

  glow?: {
    scale: number;

    geometrySegments: number;

    color: string;

    opacity: number;
  };

  interactionRadius?: number;

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

  texture: {
    anisotropy: 16,
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

export const MARS_CONFIG:
  PlanetConfig = {
  id: "mars",

  name: "Mars",

  texturePath:
    "/textures/Mars.jpg",

  radius: 0.34,

  geometrySegments: 192,

  rotationSpeed: 0.01,

  initialRotationY: Math.PI,

  initialPosition:
    MARS_POSITION,

  currentPosition:
    new THREE.Vector3(
      MARS_POSITION[0],
      MARS_POSITION[1],
      MARS_POSITION[2]
    ),

  texture: {
    wrapS:
      THREE.RepeatWrapping,

    wrapT:
      THREE.ClampToEdgeWrapping,

    anisotropy: 16,
  },

  material: {
    bumpScale: 0.004,

    roughness: 1,

    metalness: 0,

    color: "#ffffff",
  },

  glow: {
    scale: 1.01,

    geometrySegments: 96,

    color: "#ffb18a",

    opacity: 0.015,
  },

  interactionRadius: 0.65,

  camera: {
    visualRadius: 0.8,

    framePadding: 1.6,

    flightDuration: 3.4,
  },
};

export const PLANETS:
  readonly PlanetConfig[] = [
  MERCURY_CONFIG,
  MARS_CONFIG,
];

export function getPlanetConfig(
  planetId: PlanetId
) {
  return PLANETS.find(
    (planet) =>
      planet.id === planetId
  );
}