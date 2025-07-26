// 점프에 따른 상승 및 하강 애니메이션 - requestAnimationFrame 루프기반

import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import useGameCore from './useGameCore';

const usePikachuJump = (maxJumpHeight: number = 160) => {
  const {
    INITIAL_GROUND_Y_VALUE,
    setGameFundamentals,
    pikachuState,
    setPikachuState,
  } = useGameStore();

  const { canJumpRef, jumpAnimationFrameIdRef, currentPikachuYRef } =
    useGameCore();

  const GRAVITY = 0.2; // 중력 가속도 (값이 클수록 더 빠르게 떨어짐)
  const JUMP_VELOCITY = Math.sqrt(2 * GRAVITY * maxJumpHeight); // 등가속도 운동 공식

  useEffect(() => {
    if (!pikachuState.isJumping) return;

    let velocity = JUMP_VELOCITY;

    const animateJump = () => {
      velocity -= GRAVITY; // 프레임마다 속도 감소(상승→최고점→하강)
      let newBottom = currentPikachuYRef.current + velocity;

      // 최고점 이상으로 올라가지 않도록 제한
      if (newBottom - INITIAL_GROUND_Y_VALUE > maxJumpHeight && velocity > 0) {
        newBottom = INITIAL_GROUND_Y_VALUE + maxJumpHeight;
        velocity = 0; // 최고점에서 속도 0으로 전환(자연스럽게 하강)
      }

      // 바닥에 닿으면 점프 종료
      if (newBottom <= INITIAL_GROUND_Y_VALUE) {
        newBottom = INITIAL_GROUND_Y_VALUE;
        currentPikachuYRef.current = newBottom;
        setPikachuState({ pikachuValueY: newBottom });
        if (jumpAnimationFrameIdRef.current) {
          cancelAnimationFrame(jumpAnimationFrameIdRef.current);
          jumpAnimationFrameIdRef.current = null;
        }
        setTimeout(() => {
          canJumpRef.current = true;
          setPikachuState({ isJumping: false });
        }, 10);
        return;
      }

      currentPikachuYRef.current = newBottom;
      setPikachuState({ pikachuValueY: newBottom });
      jumpAnimationFrameIdRef.current = requestAnimationFrame(animateJump);
    };

    jumpAnimationFrameIdRef.current = requestAnimationFrame(animateJump);

    return () => {
      currentPikachuYRef.current = INITIAL_GROUND_Y_VALUE;
      setPikachuState({ pikachuValueY: INITIAL_GROUND_Y_VALUE });
      if (jumpAnimationFrameIdRef.current) {
        cancelAnimationFrame(jumpAnimationFrameIdRef.current);
        jumpAnimationFrameIdRef.current = null;
      }
      canJumpRef.current = true;
    };
  }, [
    pikachuState.isJumping,
    setGameFundamentals,
    setPikachuState,
    maxJumpHeight,
    INITIAL_GROUND_Y_VALUE,
  ]);

  return {
    canJumpRef,
    currentPikachuYRef,
    jumpAnimationFrameIdRef,
  };
};

export default usePikachuJump;
