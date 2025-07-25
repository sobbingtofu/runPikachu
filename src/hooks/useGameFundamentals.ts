import { useRef, useCallback, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

const useGameFundamentals = () => {
  const {
    INITIAL_GROUND_Y_VALUE,
    gameFundamentals,
    setGameFundamentals,
    pikachuState,
    setPikachuState,
  } = useGameStore();

  const jumpAnimationFrameIdRef = useRef<number | null>(null);
  const currentPikachuYRef = useRef(INITIAL_GROUND_Y_VALUE);
  const canJumpRef = useRef(false);
  const isSpacePressedRef = useRef(false);

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
          !pikachuState.isJumping &&
          canJumpRef.current
        ) {
          canJumpRef.current = false;
          if (jumpAnimationFrameIdRef.current) {
            cancelAnimationFrame(jumpAnimationFrameIdRef.current);
            jumpAnimationFrameIdRef.current = null;
          }
          currentPikachuYRef.current = INITIAL_GROUND_Y_VALUE; // 항상 초기화
          setPikachuState({
            isJumping: true,
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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDownSpaceBar);
    window.addEventListener('keyup', handleKeyUpSpaceBar);

    return () => {
      window.removeEventListener('keydown', handleKeyDownSpaceBar);
      window.removeEventListener('keyup', handleKeyUpSpaceBar);
    };
  }, [handleKeyDownSpaceBar, handleKeyUpSpaceBar]);

  return {
    canJumpRef,
    jumpAnimationFrameIdRef,
    currentPikachuYRef,
  };
};

export default useGameFundamentals;
