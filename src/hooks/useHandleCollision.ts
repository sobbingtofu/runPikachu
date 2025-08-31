import { useEffect } from 'react';
import useCollisionDetection from './useCollisionDetection';
import { useGameStore } from '../store/gameStore';

export const useHandleCollision = () => {
  const { setGameFundamentals, setPikachuState } = useGameStore();

  const { isCollision } = useCollisionDetection();

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
