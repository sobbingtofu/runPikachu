import { useRef, useCallback, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

const useGameFundamentals = () => {
  // Zustand 스토어에서 상태와 setter 가져오기
  const {
    INITIAL_GROUND_Y_VALUE,
    gameFundamentals,
    setGameFundamentals,
    pikachuState,
    setPikachuState,
  } = useGameStore();

  const jumpAnimationFrameIdRef = useRef<number | null>(null);
  const currentPikachuYRef = useRef(INITIAL_GROUND_Y_VALUE);
  const canJumpRef = useRef(true);
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
        console.log('스페이스바 눌림');
        console.log('canJumpRef:', canJumpRef.current);
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
        }

        // 2. 점프 시작 로직
        if (
          gameFundamentals.isGameStarted &&
          !gameFundamentals.isGameOver &&
          !pikachuState.isJumping &&
          canJumpRef.current
        ) {
          setPikachuState({
            isJumping: true,
          });
          canJumpRef.current = false;
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
            pikachuValueY: INITIAL_GROUND_Y_VALUE,
          });
          setPikachuState({ isJumping: false });
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
  };
};

export default useGameFundamentals;
