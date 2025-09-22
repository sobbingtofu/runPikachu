import { playPauseSound } from '../logic/playPauseSound';
import {
  canJumpRef,
  jumpAnimationFrameIdRef,
  jumpCountRef,
  useGameStore,
} from '../store/gameStore';

export const useTriggerPikachuJump = () => {
  const { setPikachuState } = useGameStore();
  const triggerPikachuJump = () => {
    if (canJumpRef.current && jumpCountRef.current < 2) {
      if (jumpCountRef.current >= 1) {
        canJumpRef.current = false;
      }
      if (jumpAnimationFrameIdRef.current) {
        cancelAnimationFrame(jumpAnimationFrameIdRef.current);
        jumpAnimationFrameIdRef.current = null;
      }
      jumpCountRef.current += 1;
      playPauseSound('jump01', 'stopAndPlay', false);
      setPikachuState({
        isJumping: true,
        jumpTrigger: Date.now(), // 매번 새로운 값
      });
    }
  };

  return {
    triggerPikachuJump,
  };
};
