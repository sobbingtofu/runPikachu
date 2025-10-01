import {
  canJumpRef,
  currentPikachuYRef,
  elapsedTimeRef,
  INITIAL_GROUND_Y_VALUE,
  isSpacePressedRef,
  jumpAnimationFrameIdRef,
  jumpCountRef,
  useGameStore,
} from '../store/gameStore';

export const useRerunPikachu = () => {
  const { setGameFundamentals, setPikachuState, setLoadingStates } =
    useGameStore();

  const reRunPikachu = () => {
    if (jumpAnimationFrameIdRef.current) {
      cancelAnimationFrame(jumpAnimationFrameIdRef.current);
      jumpAnimationFrameIdRef.current = null;
    }
    setGameFundamentals({
      isGameStarted: true,
      isGameOver: false,
      score: 0,
      obstacles: [],
      isGameOverAnimationPlaying: false,
      isBoardVisible: false,
      LastScorePercentile: 0,
      isNameInputShown: false,
      currentNameInput: '',
      isCurrentScoreRegistered: false,
    });
    setPikachuState({
      isJumping: false,
      pikachuValueY: INITIAL_GROUND_Y_VALUE,
      isDead: false,
    });

    setLoadingStates({
      isScoreRegisterLoading: false,
      isScorePercentileLoading: false,
    });

    jumpCountRef.current = 0;

    currentPikachuYRef.current = INITIAL_GROUND_Y_VALUE;
    isSpacePressedRef.current = false;
    canJumpRef.current = true;
    elapsedTimeRef.current = 0;
  };

  return { reRunPikachu };
};
