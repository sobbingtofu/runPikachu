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
  elapsedTimeRef,
  gameOverAnimationPlayingRef,
} from '../store/gameStore';
import useCollisionDetection from './useCollisionDetection';

const useGameCore = () => {
  const {
    gameFundamentals,
    setGameFundamentals,
    pikachuState,
    setPikachuState,
  } = useGameStore();

  const { isCollision } = useCollisionDetection();
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
            isDead: false,
          });
          jumpCountRef.current = 0;
          gameOverAnimationPlayingRef.current = false;

          currentPikachuYRef.current = INITIAL_GROUND_Y_VALUE;
          isSpacePressedRef.current = false;
          canJumpRef.current = true;
          elapsedTimeRef.current = 0;
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

  // 아래방향키 눌림 추적 이벤트 핸들러
  const handleKeyDownArrowDown = (e: KeyboardEvent) => {
    if (e.code === 'ArrowDown') {
      e.preventDefault();
      if (pikachuState.isJumping) {
        isFastFallingRef.current = true;
      }
    }
  };

  // 아래방향키 눌림 해제 추적 이벤트 핸들러
  const handleKeyUpArrowDown = (e: KeyboardEvent) => {
    if (e.code === 'ArrowDown') isFastFallingRef.current = false;
  };

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
