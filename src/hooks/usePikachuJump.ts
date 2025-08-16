import { useEffect, useRef } from 'react';
import {
  useGameStore,
  currentPikachuYRef,
  canJumpRef,
  isFastFallingRef,
  INITIAL_GROUND_Y_VALUE,
  jumpCountRef,
  JUMP_PARAMS_PHASES,
  elapsedTimeRef,
} from '../store/gameStore';

const usePikachuJump = () => {
  const { pikachuState, setPikachuState } = useGameStore();

  const getCurrentJumpParams = (elapsedTime: number) => {
    for (const { start, end, gravity, fastFallGravity } of JUMP_PARAMS_PHASES) {
      if (elapsedTime >= start && elapsedTime < end) {
        return { gravity, fastFallGravity };
      }
    }
    return { gravity: 0, fastFallGravity: 0 };
  };

  const MAX_JUMP_HEIGHT = 170;

  const jumpTriggerYRef = useRef(0);
  const velocityRef = useRef(0);
  const lastJumpTriggerRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    if (!pikachuState.isJumping) return;

    let animationFrameId: number;

    const animateJump = (now: number) => {
      const { gravity, fastFallGravity } = getCurrentJumpParams(
        elapsedTimeRef.current,
      );
      const deltaTime = (now - lastTimeRef.current) / 16.67;
      lastTimeRef.current = now;

      // 점프 트리거가 바뀌면 velocity 리셋 + jumpStartY 저장
      if (pikachuState.jumpTrigger !== lastJumpTriggerRef.current) {
        velocityRef.current = Math.sqrt(2 * gravity * MAX_JUMP_HEIGHT);
        lastJumpTriggerRef.current = pikachuState.jumpTrigger;
        jumpTriggerYRef.current = currentPikachuYRef.current; // 점프 시작 위치 저장
      }

      const appliedGravity = isFastFallingRef.current
        ? fastFallGravity
        : gravity;
      velocityRef.current -= appliedGravity * deltaTime;
      let newBottom = currentPikachuYRef.current + velocityRef.current;

      // 최고점 제한 (점프 시작 위치 기준)
      if (newBottom > jumpTriggerYRef.current + MAX_JUMP_HEIGHT) {
        newBottom = jumpTriggerYRef.current + MAX_JUMP_HEIGHT;
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
        canJumpRef.current = true;
        isFastFallingRef.current = false;
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
    INITIAL_GROUND_Y_VALUE,
  ]);
};

export default usePikachuJump;
