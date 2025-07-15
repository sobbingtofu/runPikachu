// src/hooks/useGameLogic.ts
import { useState, useEffect, useRef, useCallback } from 'react';

import type { ObstacleType } from '../types/ObstacleType';
import type { GameStateType } from '../types/GameStateType';

const INITIAL_PIKACHU_BOTTOM = 0; // 피카츄의 바닥 위치
const JUMP_HEIGHT = 100; // 최대 점프 높이
const JUMP_SPEED = 5; // 점프 속도 (픽셀/프레임)
const FALL_SPEED = 5; // 떨어지는 속도 (픽셀/프레임)

const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameStateType>({
    isGameStarted: false,
    isGameOver: false,
    isJumping: false,
    score: 0,
    obstacles: [],
    pikachuBottom: INITIAL_PIKACHU_BOTTOM,
  });

  const gameContainerRef = useRef<HTMLDivElement>(null); // 게임 컨테이너 Ref

  // requestAnimationFrame ID를 저장할 ref
  const animationFrameId = useRef<number | null>(null);

  // 현재 애니메이션 상태 (점프 중인지, 낙하 중인지 등)를 관리하는 ref
  // 이 ref는 렌더링을 유발하지 않으므로, 애니메이션 중 빠르게 변경되는 값들을 관리하기 좋습니다.
  const currentPikachuBottom = useRef(INITIAL_PIKACHU_BOTTOM);
  const isJumpingStateRef = useRef(false); // isJumping의 실제 상태를 동기화

  // 스페이스바를 눌렀을 때에 대한 처리
  const handleKeyDownSpaceBar = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();

        // 1. 게임 시작
        if (!gameState.isGameStarted && !gameState.isGameOver) {
          console.log('start game');
          setGameState((prev) => ({
            ...prev,
            isGameStarted: true,
            isGameOver: false,
          }));
        }

        // 2. 점프 시작: isJumping이 아닐 때만 점프 시작
        if (
          gameState.isGameStarted &&
          !gameState.isGameOver &&
          !isJumpingStateRef.current // useRef의 최신 값 사용
        ) {
          console.log('짬푸! (requestAnimationFrame 기반)');
          setGameState((prev) => ({
            ...prev,
            isJumping: true,
            // pikachuBottom: INITIAL_PIKACHU_BOTTOM, // 여기서는 isJumpingStateRef.current를 따라가므로 제거
          }));
          // isJumping 상태 동기화
          isJumpingStateRef.current = true;
        }

        // 3. 게임 재시작
        if (!gameState.isGameStarted && gameState.isGameOver) {
          console.log('게임 재시작');

          // 기존 requestAnimationFrame 루프 중단
          if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
          }

          setGameState({
            isGameStarted: true,
            isGameOver: false,
            isJumping: false,
            score: 0,
            obstacles: [],
            pikachuBottom: INITIAL_PIKACHU_BOTTOM,
          });
          currentPikachuBottom.current = INITIAL_PIKACHU_BOTTOM;
          isJumpingStateRef.current = false;
        }
      }
    },
    [
      gameState.isJumping, // 여전히 UI 업데이트를 위해 필요할 수 있지만, 로직은 ref를 따름
      gameState.isGameOver,
      gameState.isGameStarted,
      setGameState,
    ],
  );

  // 게임 시작 및 스페이스바 처리 (키다운 이벤트 리스너)
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDownSpaceBar);
    return () => {
      window.removeEventListener('keydown', handleKeyDownSpaceBar);
    };
  }, [handleKeyDownSpaceBar]);

  // 점프 애니메이션 및 중력 (requestAnimationFrame 기반)
  useEffect(() => {
    // 점프 상태가 아닐 경우 애니메이션 루프 종료 및 정리
    if (!gameState.isJumping) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      currentPikachuBottom.current = INITIAL_PIKACHU_BOTTOM; // 착지 후 높이 초기화
      return;
    }

    console.log('점프 애니메이션 루프 시작');

    let isRising = true; // 점프 중인지 (올라가는 중)
    currentPikachuBottom.current = INITIAL_PIKACHU_BOTTOM; // 애니메이션 시작 시 높이 강제 초기화

    const animateJump = () => {
      let newBottom;

      if (isRising) {
        newBottom = currentPikachuBottom.current + JUMP_SPEED;
        if (newBottom >= JUMP_HEIGHT) {
          newBottom = JUMP_HEIGHT; // 최대 높이 보정
          isRising = false; // 이제 낙하 시작
          console.log('최대 높이 도달, 낙하 시작');
        }
      } else {
        newBottom = currentPikachuBottom.current - FALL_SPEED;
        if (newBottom <= INITIAL_PIKACHU_BOTTOM) {
          newBottom = INITIAL_PIKACHU_BOTTOM; // 바닥 보정
          console.log('착지 완료');

          // 착지 완료 시
          setGameState((prev) => ({
            ...prev,
            isJumping: false, // 점프 상태 해제
          }));
          isJumpingStateRef.current = false; // ref 동기화

          if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current); // 애니메이션 루프 중단
            animationFrameId.current = null;
          }
          return; // 애니메이션 종료
        }
      }

      currentPikachuBottom.current = newBottom; // Ref 값 업데이트

      // setGameState를 호출하여 UI를 업데이트 (이 부분이 렌더링을 유발)
      setGameState((prev) => ({
        ...prev,
        pikachuBottom: currentPikachuBottom.current,
      }));

      // 다음 프레임 요청
      animationFrameId.current = requestAnimationFrame(animateJump);
    };

    // 애니메이션 루프 시작
    animationFrameId.current = requestAnimationFrame(animateJump);

    // useEffect 클린업: 컴포넌트 언마운트 또는 isJumping 변경 시 애니메이션 중단
    return () => {
      console.log('점프 이펙트 클린업 (requestAnimationFrame)');
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      isJumpingStateRef.current = false; // 혹시 모를 경우를 대비하여 isJumping 상태를 재설정
      // cleanup 시에는 pikachuBottom을 초기화하지 않습니다.
      // 왜냐하면 cleanup이 호출되는 시점은 isJumping이 false로 설정되기 직전 또는 직후일 수 있고,
      // pikachuBottom은 이미 애니메이션 루프 내에서 INITIAL_PIKACHU_BOTTOM으로 설정되었기 때문입니다.
    };
  }, [gameState.isJumping]); // gameState.isJumping이 true로 변할 때만 이 useEffect가 실행됨

  // 나머지 장애물 생성/이동/충돌 감지 로직은 그대로 유지 (주석 처리된 상태)

  return { gameState, gameContainerRef };
};

export default useGameLogic;
