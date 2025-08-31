/**
 * 시간이 지남에 따라 점수 업데이트.
 * @param currentScore - 현재 점수
 * @param currentTime - 현재 시간
 * @param lastUpdateTime - 마지막 점수 업데이트 시간
 * @returns 업데이트된 점수
 */

export const updateScore = (
  currentScore: number,
  currentTime: number,
  lastUpdateTime: number,
): number => {
  // 100ms 마다 1점씩 증가
  if (currentTime - lastUpdateTime > 100) {
    return currentScore + 1;
  }
  return currentScore;
};
