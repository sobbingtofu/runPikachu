import type { PikachuType } from '../store/gameStore';
import type { ObstacleType } from '../types/ObstacleType';

// 피카츄 히트박스 계산
export const getPikachuHitbox = (pikachuState: PikachuType) => {
  return {
    x: pikachuState.pikachuValueX + 30, // 피카츄의 위치 + 여유 공간
    y: pikachuState.pikachuValueY + 6,
    width: pikachuState.pikachuWidth ? pikachuState.pikachuWidth - 40 : 80,
    height: pikachuState.pikachuHeight ? pikachuState.pikachuHeight - 37 : 53,
  };
};

// getObstacleHitbox가 실시간 X위치를 인자로 받도록 수정
const getObstacleHitbox = (obstacle: ObstacleType, realTimePosX: number) => {
  return {
    x:
      realTimePosX + // Zustand의 positionX는 리렌더링 때문에 미세한 차이 발생... 대신 실시간 위치 사용
      (obstacle.width - obstacle.hitboxWidth) / 2 +
      obstacle.offsetX,
    y:
      obstacle.positionY +
      (obstacle.height - obstacle.hitboxHeight) / 2 +
      obstacle.offsetY,
    width: obstacle.hitboxWidth,
    height: obstacle.hitboxHeight,
  };
};

const isCollision = (
  pikachuHitbox: { x: number; y: number; width: number; height: number },
  obstacleHitbox: { x: number; y: number; width: number; height: number },
) => {
  return (
    pikachuHitbox.x < obstacleHitbox.x + obstacleHitbox.width &&
    pikachuHitbox.x + pikachuHitbox.width > obstacleHitbox.x &&
    pikachuHitbox.y < obstacleHitbox.y + obstacleHitbox.height &&
    pikachuHitbox.y + pikachuHitbox.height > obstacleHitbox.y
  );
};

// checkCollision 함수가 장애물들의 실시간 위치 Map을 인자로 받음
export const checkCollision = (
  obstacles: ObstacleType[],
  pikachu: PikachuType,
  obstaclePositions: Map<string, number>,
) => {
  const pikachuHitbox = getPikachuHitbox(pikachu);

  return obstacles.some((obstacle) => {
    const realTimePosX = obstaclePositions.get(obstacle.id);

    // 해당 장애물의 실시간 위치가 존재할 경우에만 충돌 검사
    if (realTimePosX !== undefined) {
      const obstacleHitbox = getObstacleHitbox(obstacle, realTimePosX);
      return isCollision(pikachuHitbox, obstacleHitbox);
    }
    return false;
  });
};
