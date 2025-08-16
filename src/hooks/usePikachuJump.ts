// 점프에 따른 상승 및 하강 애니메이션 - requestAnimationFrame 루프기반

import { useEffect, useRef } from 'react';
import {
  useGameStore,
  currentPikachuYRef,
  canJumpRef,
  isFastFallingRef,
  INITIAL_GROUND_Y_VALUE,
  jumpCountRef,
} from '../store/gameStore';

const usePikachuJump = () => {
  const jumpStartYRef = useRef(0);
  const maxJumpHeight = 170;
  const { pikachuState, setPikachuState } = useGameStore();

  const GRAVITY = 1.1;
  const FAST_FALL_GRAVITY = 2.8;

  const velocityRef = useRef(0);
  const lastJumpTriggerRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!pikachuState.isJumping) return;

    let animationFrameId: number;

    const animateJump = (now: number) => {
      const deltaTime = (now - lastTimeRef.current) / 16.67;
      lastTimeRef.current = now;

      // 점프 트리거가 바뀌면 velocity 리셋 + jumpStartY 저장
      if (pikachuState.jumpTrigger !== lastJumpTriggerRef.current) {
        velocityRef.current = Math.sqrt(2 * GRAVITY * maxJumpHeight);
        lastJumpTriggerRef.current = pikachuState.jumpTrigger;
        jumpStartYRef.current = currentPikachuYRef.current; // 점프 시작 위치 저장
      }

      const gravity = isFastFallingRef.current ? FAST_FALL_GRAVITY : GRAVITY;
      velocityRef.current -= gravity * deltaTime;
      let newBottom = currentPikachuYRef.current + velocityRef.current;

      // 최고점 제한 (점프 시작 위치 기준)
      if (
        newBottom > jumpStartYRef.current + maxJumpHeight &&
        velocityRef.current > 0
      ) {
        newBottom = jumpStartYRef.current + maxJumpHeight;
        velocityRef.current = 0;
      }

      // 바닥에 닿으면 점프 종료
      if (newBottom <= INITIAL_GROUND_Y_VALUE) {
        newBottom = INITIAL_GROUND_Y_VALUE;
        currentPikachuYRef.current = newBottom;
        setPikachuState({
          pikachuValueY: newBottom,
          isJumping: false,
        });
        jumpCountRef.current = 0;
        isFastFallingRef.current = false;
        canJumpRef.current = true;
        cancelAnimationFrame(animationFrameId);
        return;
      }

      currentPikachuYRef.current = newBottom;
      setPikachuState({ pikachuValueY: newBottom });
      animationFrameId = requestAnimationFrame(animateJump);
    };

    lastTimeRef.current = performance.now();
    animationFrameId = requestAnimationFrame(animateJump);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canJumpRef.current = true;
    };
  }, [
    pikachuState.isJumping,
    pikachuState.jumpTrigger,
    setPikachuState,
    maxJumpHeight,
    INITIAL_GROUND_Y_VALUE,
  ]);
};

export default usePikachuJump;
