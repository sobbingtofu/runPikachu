import type { PikachuType } from '../store/gameStore';
import type { ObstacleType } from '../types/ObstacleType';

// 피카츄 히트박스 계산
const getPikachuHitbox = (pikachuState: PikachuType) => {
  return {
    x: pikachuState.pikachuValueX + 25, // 피카츄의 위치 + 여유 공간
    y: pikachuState.pikachuValueY + 10,
    width: pikachuState.pikachuWidth ? pikachuState.pikachuWidth - 30 : 80,
    height: pikachuState.pikachuHeight ? pikachuState.pikachuHeight - 30 : 53,
  };
};

const getObstacleHitbox = (obstacle: ObstacleType) => {
  return {
    x:
      obstacle.positionX +
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

export const checkCollision = (
  obstacles: ObstacleType[],
  pikachu: PikachuType,
) => {
  const pikachuHitbox = getPikachuHitbox(pikachu);
  const collisionTF = obstacles.some((obstacle) => {
    const obstacleHitbox = getObstacleHitbox(obstacle);
    return isCollision(pikachuHitbox, obstacleHitbox);
  });
  return collisionTF;
};
