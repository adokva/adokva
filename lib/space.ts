import * as THREE from "three";

export const SUN_POSITION = [
  -8.5,
  2.5,
  2.5,
] as const;

export const MERCURY_POSITION = [
  -4.9,
  2.2,
  2.2,
] as const;

export const MARS_POSITION = [
  10.5,
  0.9,
  -4.2,
] as const;

/*
  MERCURY
*/

export const MERCURY_ORBIT_RADIUS =
  Math.hypot(
    MERCURY_POSITION[0] -
      SUN_POSITION[0],
    MERCURY_POSITION[2] -
      SUN_POSITION[2]
  );

export const MERCURY_ORBIT_HEIGHT =
  MERCURY_POSITION[1] -
  SUN_POSITION[1];

export const MERCURY_INITIAL_ANGLE =
  Math.atan2(
    MERCURY_POSITION[2] -
      SUN_POSITION[2],
    MERCURY_POSITION[0] -
      SUN_POSITION[0]
  );

export const MERCURY_ORBIT_SPEED =
  0.1;

export const MERCURY_CURRENT_POSITION =
  new THREE.Vector3(
    MERCURY_POSITION[0],
    MERCURY_POSITION[1],
    MERCURY_POSITION[2]
  );

/*
  MARS
*/

export const MARS_ORBIT_RADIUS =
  Math.hypot(
    MARS_POSITION[0] -
      SUN_POSITION[0],
    MARS_POSITION[2] -
      SUN_POSITION[2]
  );

export const MARS_ORBIT_HEIGHT =
  MARS_POSITION[1] -
  SUN_POSITION[1];

export const MARS_INITIAL_ANGLE =
  Math.atan2(
    MARS_POSITION[2] -
      SUN_POSITION[2],
    MARS_POSITION[0] -
      SUN_POSITION[0]
  );

export const MARS_ORBIT_SPEED =
  0.035;

export const MARS_CURRENT_POSITION =
  new THREE.Vector3(
    MARS_POSITION[0],
    MARS_POSITION[1],
    MARS_POSITION[2]
  );