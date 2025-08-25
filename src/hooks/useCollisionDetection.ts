import { useGameStore } from '../store/gameStore';

const useCollisionDetection = () => {
  const { gameFundamentals, pikachuState } = useGameStore();

  const pikachuHitbox = {
    x: pikachuState.pikachuValueX + 25, // 피카츄의 위치 + 여유 공간
    y: pikachuState.pikachuValueY + 10,
    width: pikachuState.pikachuWidth ? pikachuState.pikachuWidth - 30 : 80,
    height: pikachuState.pikachuHeight ? pikachuState.pikachuHeight - 30 : 53,
  };

  function isColliding(
    pikachuHitbox: { x: number; y: number; width: number; height: number },
    obstacle: {
      x: number;
      y: number;
      hitboxWidth: number;
      hitboxHeight: number;
    },
  ) {
    const collision =
      pikachuHitbox.x < obstacle.x + obstacle.hitboxWidth &&
      pikachuHitbox.x + pikachuHitbox.width > obstacle.x &&
      pikachuHitbox.y < obstacle.y + obstacle.hitboxHeight &&
      pikachuHitbox.y + pikachuHitbox.height > obstacle.y;

    return collision;
  }

  // 장애물 충돌 여부 계산
  const isCollision = gameFundamentals.obstacles.some((obs) => {
    const obsHitboxWidth = obs.hitboxWidth ?? obs.width;
    const obsHitboxHeight = obs.hitboxHeight ?? obs.height;
    const obsHitbox = {
      x: obs.positionX + (obs.width - obsHitboxWidth) / 2,
      y: obs.positionY + (obs.height - obsHitboxHeight) / 2,
      hitboxWidth: obsHitboxWidth,
      hitboxHeight: obsHitboxHeight,
    };
    return isColliding(pikachuHitbox, obsHitbox);
  });
  return { isCollision, pikachuHitbox };
};

export default useCollisionDetection;
