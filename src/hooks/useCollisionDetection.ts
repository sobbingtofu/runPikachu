import { useGameStore } from '../store/gameStore';

const useCollisionDetection = () => {
  const { gameFundamentals, pikachuState } = useGameStore();

  const pikachuHitbox = {
    x: pikachuState.pikachuValueX + 25, // 피카츄의 위치 + 여유 공간
    y: pikachuState.pikachuValueY + 10,
    width: pikachuState.pikachuWidth ? pikachuState.pikachuWidth - 30 : 80,
    height: pikachuState.pikachuHeight ? pikachuState.pikachuHeight - 30 : 53,
  };
  // 장애물 충돌 여부 계산 함수
  function isColliding(
    pikachuHitbox: { x: number; y: number; width: number; height: number },
    obstacle: {
      positionX: number;
      positionY: number;
      width: number;
      height: number;
      hitboxWidth: number;
      hitboxHeight: number;
      offsetX: number;
      offsetY: number;
    },
  ) {
    const obsHitbox = {
      positionX:
        obstacle.positionX +
        (obstacle.width - obstacle.hitboxWidth) / 2 +
        obstacle.offsetX,
      positionY:
        obstacle.positionY +
        (obstacle.height - obstacle.hitboxHeight) / 2 +
        obstacle.offsetY,
      width: obstacle.hitboxWidth,
      height: obstacle.hitboxHeight,
    };

    const collisionTF =
      pikachuHitbox.x < obsHitbox.positionX + obsHitbox.width &&
      pikachuHitbox.x + pikachuHitbox.width > obsHitbox.positionX &&
      pikachuHitbox.y < obsHitbox.positionY + obsHitbox.height &&
      pikachuHitbox.y + pikachuHitbox.height > obsHitbox.positionY;

    return collisionTF;
  }

  // 장애물 충돌 여부 계산 수행
  const isCollision = gameFundamentals.obstacles.some((obs) => {
    return isColliding(pikachuHitbox, obs);
  });

  return { isCollision, pikachuHitbox };
};

export default useCollisionDetection;
