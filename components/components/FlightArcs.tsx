"use client";

import { Line } from "@react-three/drei";
import * as THREE from "three";
import { locations } from "../../data/locations";
import { routes } from "../../data/routes";

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function FlightArcs() {
  return (
    <>
      {routes.map((route, index) => {
        const from = locations.find((c) => c.name === route.from);
        const to = locations.find((c) => c.name === route.to);

        if (!from || !to) return null;

        const start = latLonToVector3(from.lat, from.lon, 2.02);
        const end = latLonToVector3(to.lat, to.lon, 2.02);

        // Поднимаем дугу совсем немного над Землей
        const mid = start
          .clone()
          .add(end)
          .multiplyScalar(0.5)
          .normalize()
          .multiplyScalar(2.18);

        return (
          <Line
            key={index}
            points={[
              start.toArray(),
              mid.toArray(),
              end.toArray(),
            ]}
            color="#00ffff"
            lineWidth={1.2}
          />
        );
      })}
    </>
  );
}