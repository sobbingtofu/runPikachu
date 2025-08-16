import { useCallback, useEffect } from 'react';
import {
  useGameStore,
  jumpAnimationFrameIdRef,
  currentPikachuYRef,
  canJumpRef,
  isSpacePressedRef,
  isFastFallingRef,
  INITIAL_GROUND_Y_VALUE,
  jumpCountRef,
} from '../store/gameStore';

const useGameCore = () => {
  const {
    gameFundamentals,
    setGameFundamentals,
    pikachuState,
    setPikachuState,
  } = useGameStore();

  // 스페이스바 눌림 해제 추적 이벤트 핸들러
  const handleKeyUpSpaceBar = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      isSpacePressedRef.current = false;
    }
  }, []);

  // 스페이스바 눌림 추적 이벤트 핸들러
  const handleKeyDownSpaceBar = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();

        if (isSpacePressedRef.current) {
          return;
        }
        isSpacePressedRef.current = true;

        // 1. 게임 시작
        if (!gameFundamentals.isGameStarted && !gameFundamentals.isGameOver) {
          setGameFundamentals({
            isGameStarted: true,
            isGameOver: false,
          });
          canJumpRef.current = true;
        }

        // 2. 점프 시작 로직
        if (
          gameFundamentals.isGameStarted &&
          !gameFundamentals.isGameOver &&
          canJumpRef.current &&
          jumpCountRef.current < 2
        ) {
          if (jumpCountRef.current >= 1) {
            canJumpRef.current = false;
          }
          if (jumpAnimationFrameIdRef.current) {
            cancelAnimationFrame(jumpAnimationFrameIdRef.current);
            jumpAnimationFrameIdRef.current = null;
          }
          jumpCountRef.current += 1;
          setPikachuState({
            isJumping: true,
            jumpTrigger: Date.now(), // 매번 새로운 값
          });
        }

        // 3. 게임 재시작 로직
        if (!gameFundamentals.isGameStarted && gameFundamentals.isGameOver) {
          if (jumpAnimationFrameIdRef.current) {
            cancelAnimationFrame(jumpAnimationFrameIdRef.current);
            jumpAnimationFrameIdRef.current = null;
          }
          setGameFundamentals({
            isGameStarted: true,
            isGameOver: false,
            score: 0,
            obstacles: [],
          });
          setPikachuState({
            isJumping: false,
            pikachuValueY: INITIAL_GROUND_Y_VALUE,
          });
          currentPikachuYRef.current = INITIAL_GROUND_Y_VALUE;
          isSpacePressedRef.current = false;
          canJumpRef.current = true;
        }
      }
    },
    [
      gameFundamentals.isGameOver,
      gameFundamentals.isGameStarted,
      pikachuState.isJumping,
      setGameFundamentals,
      setPikachuState,
    ],
  );

  const handleKeyDownArrowDown = (e: KeyboardEvent) => {
    if (e.code === 'ArrowDown') {
      e.preventDefault();
      if (pikachuState.isJumping) {
        isFastFallingRef.current = true;
      }
    }
  };
  const handleKeyUpArrowDown = (e: KeyboardEvent) => {
    if (e.code === 'ArrowDown') isFastFallingRef.current = false;
  };

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
};

export default useGameCore;
