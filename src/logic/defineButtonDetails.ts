import type { PixelButtonProps } from '../components/PixelButton/PixelButton';
import { type GameFundamentalsType } from '../store/gameStore';

export const defineButtonDetails = (
  gameFundamentals: GameFundamentalsType,
): {
  leftButtonType: PixelButtonProps['type'];
  rightButtonType: PixelButtonProps['type'];
  leftButtonText: string;
  rightButtonText: string;
} => {
  const leftButtonType: PixelButtonProps['type'] = 'spacebar';

  const rightButtonType: PixelButtonProps['type'] =
    gameFundamentals.isGameStarted ||
    gameFundamentals.isGameOverAnimationPlaying
      ? 'arrowDown'
      : 'enter';

  const leftButtonText =
    !gameFundamentals.isGameStarted && !gameFundamentals.isGameOver
      ? 'Run'
      : gameFundamentals.isGameStarted
        ? 'Jump'
        : !gameFundamentals.isGameStarted &&
            gameFundamentals.isGameOverAnimationPlaying
          ? 'Jump'
          : 'Run Again';

  const rightButtonText =
    gameFundamentals.isGameStarted ||
    gameFundamentals.isGameOverAnimationPlaying
      ? 'Quick Drop'
      : 'Score Board';

  return {
    leftButtonType,
    rightButtonType,
    leftButtonText,
    rightButtonText,
  };
};
