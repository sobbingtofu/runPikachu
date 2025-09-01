import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { checkCollision } from '../logic/collisionDetectionLogic';

export const useHandleCollision = () => {
  const {
    gameFundamentals,
    pikachuState,
    setGameFundamentals,
    setPikachuState,
  } = useGameStore();

  const isCollision = checkCollision(gameFundamentals.obstacles, pikachuState);

  // 충돌 시 게임 오버 처리
  useEffect(() => {
    if (isCollision) {
      setGameFundamentals((prev) => ({
        ...prev,
        isGameOver: true,
        isGameStarted: false,
        isGameOverAnimationPlaying: true,
      }));
      setPikachuState({
        isJumping: false,
        isDead: true,
      });

      const animationTimer = setTimeout(() => {
        setGameFundamentals((prev) => ({
          ...prev,
          isGameOverAnimationPlaying: false,
          isBoardVisible: true,
        }));
        console.log('사망 애니메이션 시간 지남');
      }, 500);

      return () => {
        clearTimeout(animationTimer);
      };
    }
  }, [isCollision]);
};
