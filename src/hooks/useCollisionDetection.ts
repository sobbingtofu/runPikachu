import { useGameStore } from '../store/gameStore';

const useCollisionDetection = () => {
  const { gameFundamentals, pikachuState } = useGameStore();

  const pikachuHitbox = {
    x: pikachuState.pikachuValueX + 20, // 피카츄의 위치 + 여유 공간
    y: pikachuState.pikachuValueY,
    width: pikachuState.pikachuWidth ? pikachuState.pikachuWidth - 30 : 80,
    height: pikachuState.pikachuHeight || 53,
  };

  function isColliding(
    pikachuHitbox: { x: number; y: number; width: number; height: number },
    obstacle: { x: number; y: number; width: number; height: number },
  ) {
    const collision =
      pikachuHitbox.x < obstacle.x + obstacle.width &&
      pikachuHitbox.x + pikachuHitbox.width > obstacle.x &&
      pikachuHitbox.y < obstacle.y + obstacle.height &&
      pikachuHitbox.y + pikachuHitbox.height > obstacle.y;

    return collision;
  }

  // 장애물 충돌 여부 계산
  const isCollision = gameFundamentals.obstacles.some((obs) =>
    isColliding(pikachuHitbox, {
      x: obs.positionX,
      y: obs.positionY,
      width: obs.width,
      height: obs.height,
    }),
  );
  return { isCollision, pikachuHitbox };
};

export default useCollisionDetection;
