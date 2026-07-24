"use client";

import {
  useRef,
} from "react";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

import PlanetLabel from "./PlanetLabel";

import {
  getWorldPosition,
  type WorldObjectId,
} from "../lib/worldRegistry";

import {
  SUN_POSITION,
} from "../lib/space";

import {
  MOON_POSITION,
} from "./Moon";

type Props = {
  visible: boolean;
};

type LiveWorldLabelProps = {
  id: WorldObjectId;
  name: string;
  height: number;

  fallbackPosition: [
    number,
    number,
    number,
  ];
};

function LiveWorldLabel({
  id,
  name,
  height,
  fallbackPosition,
}: LiveWorldLabelProps) {
  const labelGroupRef =
    useRef<THREE.Group>(null);

  const worldPosition =
    useRef(
      new THREE.Vector3()
    );

  useFrame(() => {
    const labelGroup =
      labelGroupRef.current;

    if (!labelGroup) {
      return;
    }

    const currentPosition =
      getWorldPosition(
        id,
        worldPosition.current
      );

    if (currentPosition) {
      labelGroup.position.copy(
        currentPosition
      );

      return;
    }

    labelGroup.position.set(
      fallbackPosition[0],
      fallbackPosition[1],
      fallbackPosition[2]
    );
  });

  return (
    <group
      ref={labelGroupRef}
      position={
        fallbackPosition
      }
    >
      <PlanetLabel
        name={name}
        position={[
          0,
          height,
          0,
        ]}
      />
    </group>
  );
}

export default function LabelsLayer({
  visible,
}: Props) {
  if (!visible) {
    return null;
  }

  return (
    <>
      <LiveWorldLabel
        id="earth"
        name="EARTH"
        height={1.9}
        fallbackPosition={[
          0,
          0,
          0,
        ]}
      />

      <LiveWorldLabel
        id="sun"
        name="SUN"
        height={2}
        fallbackPosition={[
          SUN_POSITION[0],
          SUN_POSITION[1],
          SUN_POSITION[2],
        ]}
      />

      <LiveWorldLabel
        id="moon"
        name="MOON"
        height={0.7}
        fallbackPosition={[
          MOON_POSITION[0],
          MOON_POSITION[1],
          MOON_POSITION[2],
        ]}
      />

      <LiveWorldLabel
        id="mercury"
        name="MERCURY"
        height={0.97}
        fallbackPosition={[
          6,
          0,
          0,
        ]}
      />

      <LiveWorldLabel
        id="mars"
        name="MARS"
        height={1.3}
        fallbackPosition={[
          11,
          0,
          0,
        ]}
      />
    </>
  );
}