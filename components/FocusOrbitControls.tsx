"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import {
  OrbitControls,
} from "@react-three/drei";

import {
  OrbitControls as OrbitControlsImpl,
} from "three-stdlib";

import * as THREE from "three";

type Props = {
  enabled: boolean;
  selected: boolean;
};

const WORLD_RETURN_DURATION =
  2.3;

export default function FocusOrbitControls({
  enabled,
  selected,
}: Props) {
  const controls =
    useRef<OrbitControlsImpl>(null);

  const { camera } = useThree();

  const initialized =
    useRef(false);

  const hasBeenEnabled =
    useRef(false);

  const previousEnabled =
    useRef(enabled);

  const previousSelected =
    useRef(selected);

  const animationActive =
    useRef(false);

  const elapsed =
    useRef(0);

  const returnDelayElapsed =
    useRef(0);

  const waitingForWorldReturn =
    useRef(false);

  const startPosition =
    useRef(
      new THREE.Vector3()
    );

  const endPosition =
    useRef(
      new THREE.Vector3()
    );

  const [
    animating,
    setAnimating,
  ] = useState(false);

  const [
    controlsReady,
    setControlsReady,
  ] = useState(enabled);

  /*
    Когда пользователь улетает
    к Луне или Солнцу,
    OrbitControls полностью
    отключаются и удаляются.

    При возвращении к Земле
    они включаются только после
    завершения полёта камеры.

    Поэтому две системы больше
    не двигают камеру одновременно.
  */

  useEffect(() => {
    const wasEnabled =
      previousEnabled.current;

    previousEnabled.current =
      enabled;

    if (!enabled) {
      initialized.current = false;

      animationActive.current =
        false;

      waitingForWorldReturn.current =
        false;

      returnDelayElapsed.current = 0;

      setAnimating(false);
      setControlsReady(false);

      return;
    }

    /*
      Первый запуск после Welcome Screen
      не требует задержки.

      Задержка нужна только после
      возвращения от другого мира.
    */

    if (!hasBeenEnabled.current) {
      hasBeenEnabled.current = true;

      setControlsReady(true);

      return;
    }

    if (!wasEnabled && enabled) {
      initialized.current = false;

      animationActive.current =
        false;

      setAnimating(false);
      setControlsReady(false);

      returnDelayElapsed.current = 0;

      waitingForWorldReturn.current =
        true;
    }
  }, [enabled]);

  /*
    Отсчитываем время возврата
    камеры к Земле.

    После окончания полёта
    создаются совершенно новые
    OrbitControls без старой инерции.
  */

  useFrame((_, delta) => {
    if (
      !enabled ||
      !waitingForWorldReturn.current
    ) {
      return;
    }

    returnDelayElapsed.current +=
      Math.min(
        delta,
        0.05
      );

    if (
      returnDelayElapsed.current <
      WORLD_RETURN_DURATION
    ) {
      return;
    }

    waitingForWorldReturn.current =
      false;

    returnDelayElapsed.current = 0;

    setControlsReady(true);
  });

  /*
    Инициализация новых Controls
    после первого запуска или
    после завершения возврата.
  */

  useEffect(() => {
    if (
      !enabled ||
      !controlsReady
    ) {
      return;
    }

    initialized.current = true;

    previousSelected.current =
      selected;

    animationActive.current =
      false;

    setAnimating(false);

    if (controls.current) {
      controls.current.target.set(
        0,
        0,
        0
      );

      controls.current.update();
    }

    camera.lookAt(
      0,
      0,
      0
    );
  }, [
    camera,
    controlsReady,
    enabled,
    selected,
  ]);

  /*
    Фокус камеры на выбранном
    человеке или возврат от него
    к обычной дистанции Земли.
  */

  useEffect(() => {
    if (
      !enabled ||
      !controlsReady ||
      !initialized.current
    ) {
      return;
    }

    if (
      previousSelected.current ===
      selected
    ) {
      return;
    }

    previousSelected.current =
      selected;

    startPosition.current.copy(
      camera.position
    );

    const direction =
      camera.position
        .clone();

    if (
      direction.lengthSq() <
      0.0001
    ) {
      direction.set(
        0,
        0,
        1
      );
    }

    direction.normalize();

    const targetDistance =
      selected
        ? 5.75
        : 8;

    endPosition.current.copy(
      direction.multiplyScalar(
        targetDistance
      )
    );

    elapsed.current = 0;

    animationActive.current =
      true;

    setAnimating(true);
  }, [
    camera,
    controlsReady,
    enabled,
    selected,
  ]);

  /*
    Плавное приближение Земли
    при выборе человека.
  */

  useFrame((_, delta) => {
    if (
      !enabled ||
      !controlsReady ||
      !animationActive.current
    ) {
      return;
    }

    elapsed.current +=
      Math.min(
        delta,
        0.05
      );

    const duration = 1.3;

    const progress =
      Math.min(
        elapsed.current /
          duration,
        1
      );

    /*
      Smoothstep:
      плавное начало и
      плавная остановка.
    */

    const eased =
      progress *
      progress *
      (3 - 2 * progress);

    camera.position.lerpVectors(
      startPosition.current,
      endPosition.current,
      eased
    );

    camera.lookAt(
      0,
      0,
      0
    );

    if (progress < 1) {
      return;
    }

    camera.position.copy(
      endPosition.current
    );

    camera.lookAt(
      0,
      0,
      0
    );

    animationActive.current =
      false;

    setAnimating(false);

    if (controls.current) {
      controls.current.target.set(
        0,
        0,
        0
      );

      controls.current.update();
    }
  });

  /*
    Пока камера возвращается
    от Луны или Солнца,
    OrbitControls вообще
    не существуют в сцене.

    Это также полностью удаляет
    старую инерцию вращения.
  */

  if (
    !enabled ||
    !controlsReady
  ) {
    return null;
  }

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={!animating}
      enablePan={false}
      enableZoom
      enableRotate
      minDistance={4.4}
      maxDistance={12}
      rotateSpeed={0.45}
      zoomSpeed={0.72}
      enableDamping
      dampingFactor={0.055}
      autoRotate={
        !selected &&
        !animating
      }
      autoRotateSpeed={0.24}
      touches={{
        ONE:
          THREE.TOUCH.ROTATE,

        TWO:
          THREE.TOUCH.DOLLY_PAN,
      }}
    />
  );
}