import { useCallback } from 'react';
import {
  isSpacePressedRef,
  canJumpRef,
  isFastFallingRef,
  useGameStore,
} from '../store/gameStore';
import { useCloseBoard } from './useCloseBoard';
import { useRerunPikachu } from './useRerunPikachu';
import { useTriggerPikachuJump } from './useTriggerPikachuJump';
import { playPauseSound } from '../logic/playPauseSound';

export const useKeyboardHandlers = () => {
  const {
    gameFundamentals,
    setGameFundamentals,
    pikachuState,
    setPikachuState,
  } = useGameStore();

  const { closeBoard } = useCloseBoard();
  const { reRunPikachu } = useRerunPikachu();
  const { triggerPikachuJump } = useTriggerPikachuJump();

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

        if (gameFundamentals.isGameOverAnimationPlaying) {
          return;
        }

        if (
          !gameFundamentals.isBoardVisible &&
          !gameFundamentals.isPreGameScreen
        ) {
          // 1. 게임 시작
          if (!gameFundamentals.isGameStarted && !gameFundamentals.isGameOver) {
            playPauseSound('swift01', 'stopAndPlay', false);
            setGameFundamentals({
              isGameStarted: true,
              isGameOver: false,
            });
            canJumpRef.current = true;
          }

          // 2. 점프 시작 로직
          if (gameFundamentals.isGameStarted && !gameFundamentals.isGameOver) {
            playPauseSound('jump01', 'stopAndPlay', false);
            triggerPikachuJump();
          }

          // 3. 게임 재시작 로직
          if (!gameFundamentals.isGameStarted && gameFundamentals.isGameOver) {
            playPauseSound('swift01', 'stopAndPlay', false);
            reRunPikachu();
          }
        }
      }
    },
    [
      gameFundamentals.isGameOver,
      gameFundamentals.isGameStarted,
      gameFundamentals.isGameOverAnimationPlaying,
      gameFundamentals.isBoardVisible,
      gameFundamentals.isPreGameScreen,
      // gameFundamentals.
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
        playPauseSound('quickdrop01', 'stopAndPlay', false);
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
        playPauseSound('collision01', 'stopAndPlay', false);
        closeBoard();
      }
    }
  };

  // 엔터 키 눌림 이벤트 핸들러
  const handleKeyDownEnter = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      if (
        !gameFundamentals.isPreGameScreen &&
        !gameFundamentals.isBoardVisible &&
        !gameFundamentals.isGameStarted
      ) {
        playPauseSound('buttonSound01', 'stopAndPlay', false);
        setGameFundamentals({ isBoardVisible: true });
      }
      if (gameFundamentals.isBGMLoaded && gameFundamentals.isPreGameScreen) {
        playPauseSound('buttonSound01', 'stopAndPlay', false);
        setGameFundamentals({ isPreGameScreen: false, isSoundOn: true });
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
