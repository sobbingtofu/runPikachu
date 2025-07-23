import { useState, useEffect, useRef, useCallback } from 'react';

import type { GameFundamentalsType } from '../types/GameFundamentalsType';
import type { PikachuType } from '../types/PikachuType';

const INITIAL_GROUND_Y_VALUE = 0; // 지면 위치 고정 Y값
const GAME_AREA_WIDTH = 800; // 게임 영역의 너비 (px)

const useGameFundamentals = () => {
  const [gameFundamentals, setGameFundamentals] =
    useState<GameFundamentalsType>({
      isGameStarted: false,
      isGameOver: false,
      score: 0,
      obstacles: [],
      pikachuValueY: INITIAL_GROUND_Y_VALUE,
    });

  const [pikachuState, setPikachuState] = useState<PikachuType>({
    isJumping: false,
  });

  const jumpAnimationFrameIdRef = useRef<number | null>(null); // 점프 애니메이션 프레임 ID
  const currentPikachuYRef = useRef(INITIAL_GROUND_Y_VALUE); // 피카츄의 현재 Y값
  const canJumpRef = useRef(true); // 점프 가능 여부 (쿨타임 관리 용도)
  const isSpacePressedRef = useRef(false); // 스페이스바 눌림 상태 (스페이스바 키다운 방지)

  // 스페이스바 눌림 해제 추적 이벤트 핸들러
  const handleKeyUpSpaceBar = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      isSpacePressedRef.current = false; // 스페이스바 누름 해제 기록
    }
  }, []);

  // 스페이스바 눌림 추적 이벤트 핸들러
  const handleKeyDownSpaceBar = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();

        // 스페이스바가 이미 눌려있으면 auto-repeat 추가 동작 방지
        if (isSpacePressedRef.current) {
          return;
        }
        isSpacePressedRef.current = true; // 스페이스바 눌림 기록

        // 1. 게임 시작
        if (!gameFundamentals.isGameStarted && !gameFundamentals.isGameOver) {
          setGameFundamentals((prev) => ({
            ...prev,
            isGameStarted: true,
            isGameOver: false,
          }));
        }

        // 2. 점프 시작 로직
        // 게임 중, 게임 오버 아님, 현재 점프 중 아님, 점프 쿨타임  아님
        if (
          gameFundamentals.isGameStarted &&
          !gameFundamentals.isGameOver &&
          !pikachuState.isJumping &&
          canJumpRef.current
        ) {
          setPikachuState((prev) => ({
            ...prev,
            isJumping: true,
          }));
          canJumpRef.current = false; // 점프 시작 시 쿨다운 적용
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
            obstacles: [], // 장애물 초기화 시 추가 예정
            pikachuValueY: INITIAL_GROUND_Y_VALUE,
          });
          setPikachuState({ isJumping: false }); // 피카츄 상태 초기화
          currentPikachuYRef.current = INITIAL_GROUND_Y_VALUE;
          isSpacePressedRef.current = false; // 키 상태 초기화
          canJumpRef.current = true; // 점프 쿨타임 초기화
        }
      }
    },
    [
      gameFundamentals.isGameOver,
      gameFundamentals.isGameStarted,
      pikachuState.isJumping,
      setGameFundamentals,
    ],
  );

  // 전역 키보드 이벤트 리스너 할당
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDownSpaceBar);
    window.addEventListener('keyup', handleKeyUpSpaceBar);

    return () => {
      window.removeEventListener('keydown', handleKeyDownSpaceBar);
      window.removeEventListener('keyup', handleKeyUpSpaceBar);
    };
  }, [handleKeyDownSpaceBar, handleKeyUpSpaceBar]);

  return {
    GAME_AREA_WIDTH,
    INITIAL_GROUND_Y_VALUE,
    gameFundamentals,
    setGameFundamentals,
    pikachuState,
    setPikachuState,
    jumpAnimationFrameIdRef,
    currentPikachuYRef,
    canJumpRef,
  };
};

export default useGameFundamentals;
