import type { ObstacleType } from '../types/ObstacleType';
import { RANDOM_OBSTACLE_TYPES } from '../store/gameStore';
import { getResponsiveSizeParams } from './getResponsiveSizeParams';

// 새로운 장애물을 생성할 시간인지 확인하며 생성.
// param obstacles - 현재 장애물 배열
// param currentTime - 현재 시간
// param lastGenTime - 마지막 생성 시간
// param nextGenInterval - 다음 생성까지의 간격
// returns : 새로운 장애물이 포함된 배열

export const spawnObstacleIfNeeded = (
  obstacles: ObstacleType[],
  currentTime: number,
  lastGenTime: number,
  nextGenInterval: number,
  gameAreaWidth: number,
): ObstacleType[] => {
  if (currentTime - lastGenTime < nextGenInterval) {
    return obstacles; // 아직 생성할 때가 아님
  }

  // 가중치 기반 랜덤 장애물 선택
  const pickWeightedRandomObstacle = () => {
    const totalWeight = RANDOM_OBSTACLE_TYPES.reduce(
      (sum, obs) => sum + (obs.weight ?? 1),
      0,
    );
    let rand = Math.random() * totalWeight;
    for (const obs of RANDOM_OBSTACLE_TYPES) {
      rand -= obs.weight ?? 1;
      if (rand < 0) return obs;
    }
    return RANDOM_OBSTACLE_TYPES[RANDOM_OBSTACLE_TYPES.length - 1];
  };

  const randomObstacle = pickWeightedRandomObstacle();

  const responsiveWidth = getResponsiveSizeParams(randomObstacle.width);
  const responsiveHeight = getResponsiveSizeParams(randomObstacle.height);
  const responsiveHitboxWidth = getResponsiveSizeParams(
    randomObstacle.hitboxWidth,
  );
  const responsiveHitboxHeight = getResponsiveSizeParams(
    randomObstacle.hitboxHeight,
  );

  const newObstacle: ObstacleType = {
    id: `obstacle-${Date.now()}-${Math.random()}`,
    positionX: gameAreaWidth,
    positionY: randomObstacle.positionY ?? 0,
    originalWidth: randomObstacle.width,
    originalHeight: randomObstacle.height,
    originalHitboxWidth: randomObstacle.hitboxWidth,
    originalHitboxHeight: randomObstacle.hitboxHeight,
    width: responsiveWidth,
    height: responsiveHeight,
    hitboxWidth: responsiveHitboxWidth,
    hitboxHeight: responsiveHitboxHeight,
    obstacleType: randomObstacle.obstacleType,
    offsetX: randomObstacle.offsetX,
    offsetY: randomObstacle.offsetY,
  };

  return [...obstacles, newObstacle];
};
