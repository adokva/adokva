"use client";

import * as THREE from "three";

export type WorldObjectId =
  | "earth"
  | "sun"
  | "moon"
  | "mercury"
  | "mars";

type WorldObjectRegistry =
  Partial<
    Record<
      WorldObjectId,
      THREE.Object3D
    >
  >;

const worldObjects: WorldObjectRegistry =
  {};

export function registerWorldObject(
  id: WorldObjectId,
  object: THREE.Object3D
) {
  worldObjects[id] = object;
}

export function unregisterWorldObject(
  id: WorldObjectId,
  object?: THREE.Object3D
) {
  if (
    object &&
    worldObjects[id] !== object
  ) {
    return;
  }

  delete worldObjects[id];
}

export function getWorldObject(
  id: WorldObjectId
) {
  return worldObjects[id] ?? null;
}

export function getWorldPosition(
  id: WorldObjectId,
  target = new THREE.Vector3()
) {
  const object = worldObjects[id];

  if (!object) {
    return null;
  }

  object.getWorldPosition(target);

  return target;
}

export function hasWorldObject(
  id: WorldObjectId
) {
  return Boolean(worldObjects[id]);
}