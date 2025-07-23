// 점프에 따른 상승 및 하강 애니메이션 - requestAnimationFrame 루프기반

import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import useGameFundamentals from './useGameFundamentals';

const JUMP_HEIGHT = 150; // 최대 점프 높이 (px)
const JUMP_SPEED = 8; // 점프 시 프레임당 상승 속도 (px)
const FALL_SPEED = 8; // 낙하 시 프레임당 하강 속도 (px)

const usePikachuJump = () => {
  const {
    INITIAL_GROUND_Y_VALUE,
    setGameFundamentals,
    pikachuState,
    setPikachuState,
  } = useGameStore();

  const { canJumpRef, jumpAnimationFrameIdRef, currentPikachuYRef } =
    useGameFundamentals();

  useEffect(() => {
    // 점프 상태가 아니면 상승/하강 애니메이션 루프 종료 및 정리
    if (!pikachuState.isJumping) {
      return;
    }

    let isRising = true;

    const animateJump = () => {
      let newBottom: number;

      // 상승
      if (isRising) {
        newBottom = currentPikachuYRef.current + JUMP_SPEED;
        if (newBottom >= JUMP_HEIGHT) {
          newBottom = JUMP_HEIGHT;
          isRising = false;
        }
      }
      // 하강
      else {
        newBottom = currentPikachuYRef.current - FALL_SPEED;

        if (newBottom <= INITIAL_GROUND_Y_VALUE) {
          newBottom = INITIAL_GROUND_Y_VALUE;

          if (jumpAnimationFrameIdRef.current) {
            cancelAnimationFrame(jumpAnimationFrameIdRef.current);
            jumpAnimationFrameIdRef.current = null;
            setTimeout(() => {
              canJumpRef.current = true;
              setPikachuState({ isJumping: false });
            }, 80);
          }
        }
      }

      currentPikachuYRef.current = newBottom;

      // UI 상태 업데이트
      setGameFundamentals({ pikachuValueY: currentPikachuYRef.current });

      jumpAnimationFrameIdRef.current = requestAnimationFrame(animateJump);
    };

    jumpAnimationFrameIdRef.current = requestAnimationFrame(animateJump);

    return () => {
      currentPikachuYRef.current = INITIAL_GROUND_Y_VALUE;
      setGameFundamentals({ pikachuValueY: INITIAL_GROUND_Y_VALUE });
      if (jumpAnimationFrameIdRef.current) {
        cancelAnimationFrame(jumpAnimationFrameIdRef.current);
        jumpAnimationFrameIdRef.current = null;
      }
      canJumpRef.current = true;
    };
  }, [pikachuState.isJumping, setGameFundamentals, setPikachuState]);

  return {
    canJumpRef,
    currentPikachuYRef,
    jumpAnimationFrameIdRef,
  };
};

export default usePikachuJump;
