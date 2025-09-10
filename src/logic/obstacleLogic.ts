import type { ObstacleType } from '../types/ObstacleType';
import { GAME_AREA_WIDTH, RANDOM_OBSTACLE_TYPES } from '../store/gameStore';
import { getResponsiveSizeParams } from './getResponsiveSizeParams';

// 장애물을 이동시키고 화면 밖으로 나간 장애물을 제거
//  obstacles - 현재 장애물 배열
//  speed - 현재 장애물 속도
//  deltaTime - 프레임 간 시간 간격 (ms)
//  returns : 업데이트된 장애물 배열
export const moveObstacles = (
  obstacles: ObstacleType[],
  speed: number,
  deltaTime: number,
): ObstacleType[] => {
  const speedFactor = deltaTime / 16.67; // 60fps 기준 속도 보정
  return obstacles
    .map((obs) => ({
      ...obs,
      positionX: obs.positionX - speed * speedFactor,
    }))
    .filter((obs) => obs.positionX + obs.width > 0);
};

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
    positionX: GAME_AREA_WIDTH,
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
