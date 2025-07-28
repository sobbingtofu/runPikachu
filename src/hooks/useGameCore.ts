import { useRef, useCallback, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

const useGameCore = () => {
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
  const canDuckRef = useRef(false);
  const isSpacePressedRef = useRef(false);
  const isArrowDownPressedRef = useRef(false);

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
          canDuckRef.current = true;
        }

        // 2. 점프 시작 로직
        if (
          gameFundamentals.isGameStarted &&
          !gameFundamentals.isGameOver &&
          !pikachuState.isJumping &&
          canJumpRef.current
        ) {
          canJumpRef.current = false;
          canDuckRef.current = false;
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
          canDuckRef.current = true;
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

  // 화살표 아래 키 눌림 해제 이벤트 핸들러
  const handleKeyUpArrowDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        isArrowDownPressedRef.current = false;
        console.log('ArrowDown key released');
        if (pikachuState.isDuckDown) {
          canDuckRef.current = true;
          setPikachuState({ isDuckDown: false });
          console.log('Pikachu is now standing up');
        }
      }
    },
    [pikachuState.isDuckDown, setPikachuState],
  );

  // 화살표 아래 키를 눌렀을 때의 이벤트 핸들러
  const handleKeyDownArrowDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        e.preventDefault();

        if (isArrowDownPressedRef.current) {
          return;
        }
        isArrowDownPressedRef.current = true;
        console.log('ArrowDown key pressed');

        if (canDuckRef.current) {
          canDuckRef.current = false;
        }

        setPikachuState({ isDuckDown: true });
        console.log('Pikachu is now ducking down');
      }
    },
    [pikachuState.isDuckDown, setPikachuState],
  );

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
  }, [
    handleKeyDownSpaceBar,
    handleKeyUpSpaceBar,
    handleKeyDownArrowDown,
    handleKeyUpArrowDown,
  ]);

  return {
    canJumpRef,
    canDuckRef,
    jumpAnimationFrameIdRef,
    currentPikachuYRef,
  };
};

export default useGameCore;
