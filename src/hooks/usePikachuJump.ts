// 점프에 따른 상승 및 하강 애니메이션 - requestAnimationFrame 루프기반

import { useEffect } from 'react';
import useGameLogic from './useGameFundamnetals';

const usePikachuJump = ({
  INITIAL_GROUND_Y_VALUE,
  setGameFundamentals,
  pikachuState,
  setPikachuState,
  jumpAnimationFrameIdRef,
  currentPikachuYRef,
  canJumpRef,
}: ReturnType<typeof useGameLogic>) => {
  const JUMP_HEIGHT = 150; // 최대 점프 높이 (px)
  const JUMP_SPEED = 8; // 점프 시 프레임당 상승 속도 (px)
  const FALL_SPEED = 8; // 낙하 시 프레임당 하강 속도 (px)

  // useEffect 실행 시점은 초기 렌더링 시 + 스페이스바 클릭해 gameState.isJumping true가 될 때
  useEffect(() => {
    // 점프 상태가 아니면 상승/하강 애니메이션 루프 종료 및 정리
    if (!pikachuState.isJumping) {
      if (jumpAnimationFrameIdRef.current) {
        cancelAnimationFrame(jumpAnimationFrameIdRef.current);
        jumpAnimationFrameIdRef.current = null;
      }
      return; // 애니메이션 루프 종료
    }

    // 점프 상태라면 상승/ 하강 애니메이션 루프 시작
    let isRising = true; // 피카츄의 상승/하강 상태. 처음엔 상승하므로 true

    const animateJump = () => {
      console.log('Animating jump...');
      let newBottom: number;

      // 상승
      if (isRising) {
        newBottom = currentPikachuYRef.current + JUMP_SPEED;
        if (newBottom >= JUMP_HEIGHT) {
          newBottom = JUMP_HEIGHT; // 최대 높이 보정
          isRising = false; // 하강 트리거
        }
      }
      // 하강
      else {
        newBottom = currentPikachuYRef.current - FALL_SPEED;
        if (newBottom <= INITIAL_GROUND_Y_VALUE) {
          newBottom = INITIAL_GROUND_Y_VALUE; // 바닥 보정

          // 애니메이션 루프 중단
          if (jumpAnimationFrameIdRef.current) {
            cancelAnimationFrame(jumpAnimationFrameIdRef.current);
            jumpAnimationFrameIdRef.current = null;
          }
          console.log('Jump animation ended');
          // 착지 후 쿨타임 이후에 점프 상태를 해제하고 다시 점프 가능하도록
          setTimeout(() => {
            console.log('setPikachuState called');
            setPikachuState((prev) => ({
              ...prev,
              isJumping: false,
            }));
            canJumpRef.current = true;
          }, 120); // 점프 쿨타임 (ms)
          return; // 애니메이션 루프 종료
        }
      }

      currentPikachuYRef.current = newBottom; // 피카츄의 현재 위치 업데이트

      // UI 상태 업데이트 렌더링 트리거
      setGameFundamentals((prev) => ({
        ...prev,
        pikachuValueY: currentPikachuYRef.current,
      }));

      // 다음 애니메이션 프레임 요청
      jumpAnimationFrameIdRef.current = requestAnimationFrame(animateJump);
    };

    // 애니메이션 루프 시작
    jumpAnimationFrameIdRef.current = requestAnimationFrame(animateJump);

    // useEffect 클린업 함수
    return () => {
      if (jumpAnimationFrameIdRef.current) {
        cancelAnimationFrame(jumpAnimationFrameIdRef.current);
        jumpAnimationFrameIdRef.current = null;
      }
      canJumpRef.current = true; // 이펙트 클린업 시에도 점프 가능 상태로 다시 한번 설정
    };
  }, [pikachuState.isJumping, setGameFundamentals, setPikachuState]);
};

export default usePikachuJump;
