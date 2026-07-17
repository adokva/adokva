import * as THREE from "three";

export function lerpVector(
  current: THREE.Vector3,
  target: THREE.Vector3,
  alpha = 0.08
) {
  current.lerp(target, alpha);
}

export function getCameraOffset(
  target: THREE.Vector3,
  distance = 6
) {
  return target
    .clone()
    .normalize()
    .multiplyScalar(distance);
}