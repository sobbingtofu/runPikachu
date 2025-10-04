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
    handleKeyDownEsc,
    handleKeyDownEnter,
  } = useKeyboardHandlers();

  // 키보드 이벤트 핸들러 할당
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDownSpaceBar);
    window.addEventListener('keyup', handleKeyUpSpaceBar);

    window.addEventListener('keydown', handleKeyDownArrowDown);
    window.addEventListener('keyup', handleKeyUpArrowDown);

    window.addEventListener('keydown', handleKeyDownEsc);

    window.addEventListener('keydown', handleKeyDownEnter);

    return () => {
      window.removeEventListener('keydown', handleKeyDownSpaceBar);
      window.removeEventListener('keyup', handleKeyUpSpaceBar);
      window.removeEventListener('keydown', handleKeyDownArrowDown);
      window.removeEventListener('keyup', handleKeyUpArrowDown);
      window.removeEventListener('keydown', handleKeyDownEsc);
      window.removeEventListener('keydown', handleKeyDownEnter);
    };
  }, [
    handleKeyDownSpaceBar,
    handleKeyUpSpaceBar,
    handleKeyDownArrowDown,
    handleKeyUpArrowDown,
    handleKeyDownEsc,
  ]);
};

export default useGameCore;
