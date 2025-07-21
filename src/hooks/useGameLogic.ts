// src/hooks/useGameLogic.ts
import { useState, useEffect, useRef, useCallback } from 'react';

import type { ObstacleType } from '../types/ObstacleType';
import type { GameStateType } from '../types/GameStateType';

const INITIAL_PIKACHU_Y_VALUE = 0; // 피카츄의 초기 Y값
const JUMP_HEIGHT = 100; // 최대 점프 높이 (px)
const JUMP_SPEED = 8; // 점프 시 프레임당 상승 속도 (px)
const FALL_SPEED = 8; // 낙하 시 프레임당 하강 속도 (px)

const GAME_AREA_WIDTH = 800; // 게임 영역의 너비 (px)

const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameStateType>({
    isGameStarted: false,
    isGameOver: false,
    isJumping: false,
    score: 0,
    obstacles: [],
    pikachuBottom: INITIAL_PIKACHU_Y_VALUE,
  });

  const jumpAnimationFrameId = useRef<number | null>(null); // 점프 애니메이션 프레임 ID
  const currentPikachuYValue = useRef(INITIAL_PIKACHU_Y_VALUE); // 피카츄의 현재 Y값 (Ref로 관리)
  const canJump = useRef(true); // 점프 가능 여부 (쿨타임 관리 용도)
  const isSpacePressed = useRef(false); // 스페이스바 눌림 상태 (스페이스바 키다운 방지)

  // 스페이스바를 keyUp 추적 이벤트 핸들러
  const handleKeyUpSpaceBar = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      isSpacePressed.current = false; // 스페이스바가 떼어졌음을 기록
    }
  }, []);

  // 스페이스바를 누르는 이벤트 핸들러
  const handleKeyDownSpaceBar = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();

        // 스페이스바가 이미 눌려있으면 auto-repeat 추가 동작 방지
        if (isSpacePressed.current) {
          return;
        }
        isSpacePressed.current = true; // 스페이스바 눌림 상태로 변경

        // 1. 게임 시작
        if (!gameState.isGameStarted && !gameState.isGameOver) {
          setGameState((prev) => ({
            ...prev,
            isGameStarted: true,
            isGameOver: false,
          }));
        }

        // 2. 점프 시작 로직
        // 게임 중, 게임 오버 아님, 현재 점프 중 아님, 점프 쿨타임  아님
        if (
          gameState.isGameStarted &&
          !gameState.isGameOver &&
          !gameState.isJumping &&
          canJump.current
        ) {
          setGameState((prev) => ({
            ...prev,
            isJumping: true,
          }));
          canJump.current = false; // 점프 시작 시 쿨다운 적용
        }

        // 3. 게임 재시작 로직
        if (!gameState.isGameStarted && gameState.isGameOver) {
          if (jumpAnimationFrameId.current) {
            cancelAnimationFrame(jumpAnimationFrameId.current);
            jumpAnimationFrameId.current = null;
          }
          setGameState({
            isGameStarted: true,
            isGameOver: false,
            isJumping: false,
            score: 0,
            obstacles: [], // 장애물 초기화 시 추가 예정
            pikachuBottom: INITIAL_PIKACHU_Y_VALUE,
          });
          currentPikachuYValue.current = INITIAL_PIKACHU_Y_VALUE;
          isSpacePressed.current = false; // 키 상태 초기화
          canJump.current = true; // 점프 쿨타임 초기화
        }
      }
    },
    [
      gameState.isGameOver,
      gameState.isGameStarted,
      gameState.isJumping,
      setGameState,
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

  // 점프에 따른 상승 및 하강 애니메이션 - requestAnimationFrame 루프기반
  // useEffect 실행 시점은 초기 렌더링 시 + 스페이스바 클릭해 gameState.isJumping true가 될 때
  useEffect(() => {
    // 점프 상태가 아니면 상승/하강 애니메이션 루프 종료 및 정리
    if (!gameState.isJumping) {
      if (jumpAnimationFrameId.current) {
        cancelAnimationFrame(jumpAnimationFrameId.current);
        jumpAnimationFrameId.current = null;
      }
      setGameState((prev) => ({
        ...prev,
        pikachuBottom: INITIAL_PIKACHU_Y_VALUE,
      }));
      return;
    }

    // 점프 상태라면 상승/ 하강 애니메이션 루프 시작

    let isRising = true; // 피카츄의 상승/하강 상태. 처음엔 상승하므로 true

    const animateJump = () => {
      let newBottom: number;

      // 상승
      if (isRising) {
        newBottom = currentPikachuYValue.current + JUMP_SPEED;
        if (newBottom >= JUMP_HEIGHT) {
          newBottom = JUMP_HEIGHT; // 최대 높이 보정
          isRising = false; // 하강 트리거
        }
      }
      // 하강
      else {
        newBottom = currentPikachuYValue.current - FALL_SPEED;
        if (newBottom <= INITIAL_PIKACHU_Y_VALUE) {
          newBottom = INITIAL_PIKACHU_Y_VALUE; // 바닥 보정

          // 애니메이션 루프 중단
          if (jumpAnimationFrameId.current) {
            cancelAnimationFrame(jumpAnimationFrameId.current);
            jumpAnimationFrameId.current = null;
          }

          // 착지 후 쿨타임 이후에 점프 상태를 해제하고 다시 점프 가능하도록
          setTimeout(() => {
            setGameState((prev) => ({
              ...prev,
              isJumping: false, // 점프 상태 해제
            }));
            canJump.current = true; // 쿨타임 후 점프 가능
          }, 120); // 점프 쿨타임 (ms)
          return; // 애니메이션 루프 종료
        }
      }

      currentPikachuYValue.current = newBottom; // 피카츄의 현재 위치 업데이트

      // UI 상태 업데이트 렌더링 트리거
      setGameState((prev) => ({
        ...prev,
        pikachuBottom: currentPikachuYValue.current,
      }));

      // 다음 애니메이션 프레임 요청
      jumpAnimationFrameId.current = requestAnimationFrame(animateJump);
    };

    // 애니메이션 루프 시작
    jumpAnimationFrameId.current = requestAnimationFrame(animateJump);

    // useEffect 클린업 함수
    return () => {
      if (jumpAnimationFrameId.current) {
        cancelAnimationFrame(jumpAnimationFrameId.current);
        jumpAnimationFrameId.current = null;
      }
      canJump.current = true; // 이펙트 클린업 시에도 점프 가능 상태로 다시 한번 설정
    };
  }, [gameState.isJumping, setGameState]);

  return { gameState, GAME_AREA_WIDTH };
};

export default useGameLogic;
