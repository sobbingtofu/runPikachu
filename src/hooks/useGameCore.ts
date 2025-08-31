import { useEffect } from 'react';

import { useKeyboardHandlers } from './useKeyboardHandlers';
import { useHandleCollision } from './useHandleCollision';

const useGameCore = () => {
  useHandleCollision();

  const {
    handleKeyUpSpaceBar,
    handleKeyDownSpaceBar,
    handleKeyDownArrowDown,
    handleKeyUpArrowDown,
  } = useKeyboardHandlers();

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

  // useEffect(() => {
  //   if (
  //     pikachuState.isDead &&
  //     gameFundamentals.isGameOver &&
  //     !gameFundamentals.isGameStarted &&
  //     !gameFundamentals.isGameOverAnimationPlaying
  //   ) {
  //     console.log('하이스코어 보드 출력');
  //   }
  // }, [
  //   gameFundamentals.isGameOverAnimationPlaying,
  //   gameFundamentals.isGameOver,
  //   gameFundamentals.isGameStarted,
  //   pikachuState.isDead,
  // ]);
};

export default useGameCore;
