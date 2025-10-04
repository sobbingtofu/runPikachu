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

  // 1-1. 스페이스바 눌림 해제 추적 로직
  const keyUpSpaceBarLogic = () => {
    isSpacePressedRef.current = false;
  };

  // 1-2. 스페이스바 눌림 해제 추적 이벤트 핸들러
  const handleKeyUpSpaceBar = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      keyUpSpaceBarLogic();
    }
  }, []);

  // 2-1. 스페이스바 눌림 추적 로직
  const keyDownSpaceBarLogic = () => {
    if (isSpacePressedRef.current) {
      return;
    }
    isSpacePressedRef.current = true;

    if (gameFundamentals.isGameOverAnimationPlaying) {
      return;
    }

    if (!gameFundamentals.isBoardVisible && !gameFundamentals.isPreGameScreen) {
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
        triggerPikachuJump();
      }

      // 3. 게임 재시작 로직
      if (!gameFundamentals.isGameStarted && gameFundamentals.isGameOver) {
        playPauseSound('swift01', 'stopAndPlay', false);
        reRunPikachu();
      }
    }
  };

  // 2-2. 스페이스바 눌림 추적 이벤트 핸들러
  const handleKeyDownSpaceBar = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        keyDownSpaceBarLogic();
      }
    },
    [
      gameFundamentals.isGameOver,
      gameFundamentals.isGameStarted,
      gameFundamentals.isGameOverAnimationPlaying,
      gameFundamentals.isBoardVisible,
      gameFundamentals.isPreGameScreen,
      pikachuState.isJumping,
      setGameFundamentals,
      setPikachuState,
    ],
  );

  // 3-1. 아래방향키 눌림 추적 로직
  const keyDownArrowDownLogic = () => {
    if (pikachuState.isJumping) {
      playPauseSound('quickdrop02', 'stopAndPlay', false);
      isFastFallingRef.current = true;
    }
  };

  // 3-2. 아래방향키 눌림 추적 이벤트 핸들러
  const handleKeyDownArrowDown = (e: KeyboardEvent) => {
    if (e.code === 'ArrowDown') {
      e.preventDefault();
      keyDownArrowDownLogic();
    }
  };

  // 4-1. 아래방향키 눌림 해제 추적 로직
  const keyUpArrowDownLogic = () => {
    isFastFallingRef.current = false;
  };

  // 4-2. 아래방향키 눌림 해제 추적 이벤트 핸들러
  const handleKeyUpArrowDown = (e: KeyboardEvent) => {
    if (e.code === 'ArrowDown') keyUpArrowDownLogic();
  };

  // 5. ESC 눌림 이벤트 핸들러
  const handleKeyDownEsc = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      e.preventDefault();
      if (gameFundamentals.isBoardVisible) {
        playPauseSound('boardClose01', 'stopAndPlay', false);
        closeBoard();
      }
    }
  };

  // 6-1. 엔터 키 눌림 로직
  const keyDownEnterLogic = () => {
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
      // setGameFundamentals({ isPreGameScreen: false, isSoundOn: true });
      setGameFundamentals({ isPreGameScreen: false });
    }
  };

  // 6-2. 엔터 키 눌림 이벤트 핸들러
  const handleKeyDownEnter = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      keyDownEnterLogic();
    }
  };

  return {
    keyDownSpaceBarLogic,
    keyDownArrowDownLogic,
    keyDownEnterLogic,

    keyUpSpaceBarLogic,
    keyUpArrowDownLogic,

    handleKeyUpSpaceBar,
    handleKeyDownSpaceBar,
    handleKeyDownArrowDown,
    handleKeyUpArrowDown,
    handleKeyDownEsc,
    handleKeyDownEnter,
  };
};
