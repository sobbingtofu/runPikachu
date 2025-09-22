import { useEffect } from 'react';
import { useGameStore, obstaclePositions } from '../store/gameStore'; // 공유 위치 객체 import
import { checkCollision } from '../logic/collisionDetectionLogic';
import { playPauseSound } from '../logic/playPauseSound';

export const useHandleCollision = () => {
  const {
    gameFundamentals,
    pikachuState,
    setGameFundamentals,
    setPikachuState,
  } = useGameStore();

  const isCollision = checkCollision(
    gameFundamentals.obstacles,
    pikachuState,
    obstaclePositions.current, // 공유 위치 객체를 전달
  );

  // 충돌 시 게임 오버 처리
  useEffect(() => {
    if (isCollision && !gameFundamentals.isGameOver) {
      playPauseSound('collision01', 'play', false);
      playPauseSound('02-LakeValor', 'pause');

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
        playPauseSound('92-GameOver', 'play', false);

        setTimeout(() => {
          if (gameFundamentals.isSoundOn) {
            playPauseSound('02-LakeValor', 'play');
          }
        }, 4200);
      }, 700);

      return () => {
        clearTimeout(animationTimer);
      };
    }
  }, [isCollision, setGameFundamentals, setPikachuState]); // 의존성 배열에 setPikachuState 추가 권장
};
