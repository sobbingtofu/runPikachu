import { useCallback } from 'react';
import {
  isSpacePressedRef,
  canJumpRef,
  jumpCountRef,
  jumpAnimationFrameIdRef,
  isFastFallingRef,
  useGameStore,
} from '../store/gameStore';
import { useCloseBoard } from './useCloseBoard';
// import { useRerunPikachu } from './useRerunPikachu';

export const useKeyboardHandlers = () => {
  const {
    gameFundamentals,
    setGameFundamentals,
    pikachuState,
    setPikachuState,
  } = useGameStore();

  const { closeBoard } = useCloseBoard();
  // const { reRunPikachu } = useRerunPikachu();

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

        if (gameFundamentals.isGameOverAnimationPlaying) {
          return;
        }

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
        // if (!gameFundamentals.isGameStarted && gameFundamentals.isGameOver) {
        //   reRunPikachu();
        // }
      }
    },
    [
      gameFundamentals.isGameOver,
      gameFundamentals.isGameStarted,
      gameFundamentals.isGameOverAnimationPlaying,
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

  // ESC 눌림 이벤트 핸들러
  const handleKeyDownEsc = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      e.preventDefault();
      if (gameFundamentals.isBoardVisible) {
        closeBoard();
      }
    }
  };

  // 엔터 키 눌림 이벤트 핸들러
  const handleKeyDownEnter = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      if (!gameFundamentals.isBoardVisible && !gameFundamentals.isGameStarted) {
        setGameFundamentals({ isBoardVisible: true });
      }
    }
  };

  return {
    handleKeyUpSpaceBar,
    handleKeyDownSpaceBar,
    handleKeyDownArrowDown,
    handleKeyUpArrowDown,
    handleKeyDownEsc,
    handleKeyDownEnter,
  };
};
