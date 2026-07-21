import * as THREE from "three";

export const EARTH_RADIUS = 1.5;

export const CAMERA_DISTANCE = 5;

export const EARTH_CENTER = new THREE.Vector3(
  0,
  0,
  0
);

export const WORLD_NORTH = new THREE.Vector3(
  0,
  1,
  0
);

export function latLonToDirection(
  lat: number,
  lon: number
) {
  const phi = THREE.MathUtils.degToRad(
    90 - lat
  );

  const theta = THREE.MathUtils.degToRad(
    lon + 180
  );

  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta)
  ).normalize();
}

export function getCameraPosition(
  lat: number,
  lon: number,
  distance = CAMERA_DISTANCE
) {
  return latLonToDirection(
    lat,
    lon
  ).multiplyScalar(distance);
}