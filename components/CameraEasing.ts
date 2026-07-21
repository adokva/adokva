function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

export function easeInOutCubic(
  value: number
) {
  const progress = clamp01(value);

  if (progress < 0.5) {
    return (
      4 *
      progress *
      progress *
      progress
    );
  }

  return (
    1 -
    Math.pow(
      -2 * progress + 2,
      3
    ) /
      2
  );
}

export function easeInOutSine(
  value: number
) {
  const progress = clamp01(value);

  return (
    -(Math.cos(Math.PI * progress) - 1) /
    2
  );
}

export function easeOutCubic(
  value: number
) {
  const progress = clamp01(value);

  return (
    1 -
    Math.pow(1 - progress, 3)
  );
}

export { clamp01 };