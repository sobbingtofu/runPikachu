import { useGameStore } from '../../../store/gameStore';
import PixelButton from '../../PixelButton/PixelButton';
import PixelButtonWrapper from '../../PixelButtonWrapper/PixelButtonWrapper';
import './../UiSection.css';

const LowerUiSection = () => {
  const { gameFundamentals } = useGameStore();
  const rightButtonType =
    gameFundamentals.isGameStarted ||
    (gameFundamentals.isGameOverAnimationPlaying &&
      (gameFundamentals.isGameStarted ||
        gameFundamentals.isGameOverAnimationPlaying))
      ? 'Quick Drop'
      : 'Board';

  const leftButtonType =
    !gameFundamentals.isGameStarted && !gameFundamentals.isGameOver
      ? 'Run'
      : gameFundamentals.isGameStarted
        ? 'Jump'
        : !gameFundamentals.isGameStarted &&
            gameFundamentals.isGameOverAnimationPlaying
          ? 'Jump'
          : 'Run Again';
  return (
    <>
      <div className='button-container'>
        <PixelButtonWrapper className='lower'>
          <PixelButton type={leftButtonType} />
        </PixelButtonWrapper>
        <PixelButtonWrapper className='lower'>
          <PixelButton type={rightButtonType} />
        </PixelButtonWrapper>
      </div>
    </>
  );
};

export default LowerUiSection;
