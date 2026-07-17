import * as THREE from "three";

export function createEarthMaterial() {
  return new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(
      "/textures/earth.jpg"
    ),

    normalMap: new THREE.TextureLoader().load(
      "/textures/earth_normals.jpg"
    ),

    specularMap: new THREE.TextureLoader().load(
      "/textures/specular.jpg"
    ),

    shininess: 20,
  });
}