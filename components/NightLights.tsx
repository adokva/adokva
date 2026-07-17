"use client";


import { useLoader } from "@react-three/fiber";
import * as THREE from "three";


export default function NightLights(){

const texture = useLoader(
  THREE.TextureLoader,
  "/textures/night.jpg"
);

texture.colorSpace = THREE.SRGBColorSpace;
texture.rotation = Math.PI;
texture.center.set(0.5, 0.5);


return (

<mesh>

<sphereGeometry
 args={[2.012,256,256]}
/>


<meshBasicMaterial

 map={texture}

 transparent

 opacity={0.75}

 blending={THREE.AdditiveBlending}

 depthWrite={false}

/>


</mesh>


);

}