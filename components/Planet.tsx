"use client";

import {
  useEffect,
  useRef,
} from "react";

import {
  useTexture,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

import type {
  PlanetConfig,
} from "../data/planets";

import PlanetOrbit from "./PlanetOrbit";

type Props = {
  config: PlanetConfig;

  onSelect?: () => void;
};

export default function Planet({
  config,
  onSelect,
}: Props) {
  const planetGroupRef =
    useRef<THREE.Group>(null);

  const planetMeshRef =
    useRef<THREE.Mesh>(null);

  const orbitAngle =
    useRef(
      config.orbit
        ?.initialAngle ?? 0
    );

  const planetTexture =
    useTexture(
      config.texturePath
    );

  useEffect(() => {
    planetTexture.colorSpace =
      THREE.SRGBColorSpace;

    planetTexture.wrapS =
      config.texture?.wrapS ??
      THREE.ClampToEdgeWrapping;

    planetTexture.wrapT =
      config.texture?.wrapT ??
      THREE.ClampToEdgeWrapping;

    planetTexture.anisotropy =
      config.texture
        ?.anisotropy ?? 16;

    planetTexture.needsUpdate =
      true;
  }, [
    config.texture?.anisotropy,
    config.texture?.wrapS,
    config.texture?.wrapT,
    planetTexture,
  ]);

  useEffect(() => {
    return () => {
      document.body.style.cursor =
        "default";
    };
  }, []);

  useFrame((_, delta) => {
    const planetGroup =
      planetGroupRef.current;

    const planetMesh =
      planetMeshRef.current;

    if (
      !planetGroup ||
      !planetMesh
    ) {
      return;
    }

    const safeDelta =
      Math.min(delta, 0.05);

    if (config.orbit) {
      orbitAngle.current +=
        safeDelta *
        config.orbit.speed;

      const positionX =
        config.orbit.center[0] +
        Math.cos(
          orbitAngle.current
        ) *
          config.orbit.radius;

      const positionY =
        config.orbit.center[1] +
        config.orbit.height;

      const positionZ =
        config.orbit.center[2] +
        Math.sin(
          orbitAngle.current
        ) *
          config.orbit.radius;

      planetGroup.position.set(
        positionX,
        positionY,
        positionZ
      );

      config.currentPosition.set(
        positionX,
        positionY,
        positionZ
      );
    }

    planetMesh.rotation.y +=
      safeDelta *
      config.rotationSpeed;
  }, -1);

  const handleSelect = (
    event: {
      stopPropagation: () => void;
    }
  ) => {
    event.stopPropagation();

    onSelect?.();
  };

  const handlePointerOver = (
    event: {
      stopPropagation: () => void;
    }
  ) => {
    event.stopPropagation();

    document.body.style.cursor =
      "pointer";
  };

  const handlePointerOut = (
    event: {
      stopPropagation: () => void;
    }
  ) => {
    event.stopPropagation();

    document.body.style.cursor =
      "default";
  };

  return (
    <>
      {config.orbit && (
        <PlanetOrbit
          orbit={config.orbit}
        />
      )}

      <group
        ref={planetGroupRef}
        position={
          config.currentPosition
        }
      >
        <mesh
          ref={planetMeshRef}
          rotation={[
            0,
            config.initialRotationY ??
              0,
            0,
          ]}
          castShadow
          receiveShadow
          raycast={
            config.interactionRadius
              ? () => null
              : undefined
          }
          onPointerDown={
            config.interactionRadius
              ? undefined
              : handleSelect
          }
          onPointerOver={
            config.interactionRadius
              ? undefined
              : handlePointerOver
          }
          onPointerOut={
            config.interactionRadius
              ? undefined
              : handlePointerOut
          }
        >
          <sphereGeometry
            args={[
              config.radius,
              config.geometrySegments,
              config.geometrySegments,
            ]}
          />

          <meshStandardMaterial
            map={planetTexture}
            bumpMap={
              planetTexture
            }
            bumpScale={
              config.material
                .bumpScale
            }
            color={
              config.material
                .color
            }
            roughness={
              config.material
                .roughness
            }
            metalness={
              config.material
                .metalness
            }
          />
        </mesh>

        {config.glow && (
          <mesh
            scale={
              config.glow.scale
            }
            raycast={() => null}
          >
            <sphereGeometry
              args={[
                config.radius,
                config.glow
                  .geometrySegments,
                config.glow
                  .geometrySegments,
              ]}
            />

            <meshBasicMaterial
              color={
                config.glow.color
              }
              transparent
              opacity={
                config.glow.opacity
              }
              depthWrite={false}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {config.interactionRadius && (
          <mesh
            onPointerDown={
              handleSelect
            }
            onPointerOver={
              handlePointerOver
            }
            onPointerOut={
              handlePointerOut
            }
          >
            <sphereGeometry
              args={[
                config.interactionRadius,
                32,
                32,
              ]}
            />

            <meshBasicMaterial
              transparent
              opacity={0.001}
              depthWrite={false}
              colorWrite={false}
            />
          </mesh>
        )}
      </group>
    </>
  );
}