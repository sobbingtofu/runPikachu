export function getCurrentObstacleSpeed(
  elapsedTimeMs: number,
  SPEED_PHASES: { from: number; to: number; duration: number }[],
) {
  let speed = 4;
  let elapsed = elapsedTimeMs / 1000;
  let accTime = 0;

  for (const phase of SPEED_PHASES) {
    if (elapsed < accTime + phase.duration) {
      const t = (elapsed - accTime) / phase.duration;
      return phase.from + (phase.to - phase.from) * t;
    }
    accTime += phase.duration;
    speed = phase.to;
  }
  return speed;
}
