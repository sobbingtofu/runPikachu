import { useEffect } from 'react';
import { useGameStore, gameOverAnimationPlayingRef } from '../store/gameStore';
import useCollisionDetection from './useCollisionDetection';
import {
  handleKeyUpSpaceBar,
  handleKeyDownSpaceBar,
  handleKeyDownArrowDown,
  handleKeyUpArrowDown,
} from '../utils/keyboardPressUtils';

const useGameCore = () => {
  const { setGameFundamentals, setPikachuState } = useGameStore();

  const { isCollision } = useCollisionDetection();

  // 키보드 이벤트 핸들러 할당
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDownSpaceBar);
    window.addEventListener('keyup', handleKeyUpSpaceBar);

    window.addEventListener('keydown', handleKeyDownArrowDown);
    window.addEventListener('keyup', handleKeyUpArrowDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDownSpaceBar);
      window.removeEventListener('keyup', handleKeyUpSpaceBar);
      window.removeEventListener('keydown', handleKeyDownArrowDown);
      window.removeEventListener('keyup', handleKeyUpArrowDown);
    };
  }, [handleKeyDownSpaceBar, handleKeyUpSpaceBar]);

  // 충돌 시 게임 오버 처리
  useEffect(() => {
    if (isCollision) {
      gameOverAnimationPlayingRef.current = true;
      setGameFundamentals((prev) => ({
        ...prev,
        isGameOver: true,
        isGameStarted: false,
      }));
      setPikachuState({
        isJumping: false,
      });
    }
  }, [isCollision]);
};

export default useGameCore;
