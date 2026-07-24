"use client";

import {
  type ReactNode,
  useLayoutEffect,
  useRef,
} from "react";

import type {
  ThreeElements,
} from "@react-three/fiber";

import * as THREE from "three";

import {
  registerWorldObject,
  unregisterWorldObject,
  type WorldObjectId,
} from "../lib/worldRegistry";

type Props = {
  id: WorldObjectId;
  children: ReactNode;

  position?: ThreeElements[
    "group"
  ]["position"];

  rotation?: ThreeElements[
    "group"
  ]["rotation"];

  scale?: ThreeElements[
    "group"
  ]["scale"];

  visible?: boolean;
};

export default function WorldObject({
  id,
  children,
  position,
  rotation,
  scale,
  visible = true,
}: Props) {
  const groupRef =
    useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const object =
      groupRef.current;

    if (!object) {
      return;
    }

    registerWorldObject(
      id,
      object
    );

    return () => {
      unregisterWorldObject(
        id,
        object
      );
    };
  }, [id]);

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      visible={visible}
    >
      {children}
    </group>
  );
}