import type { PropsWithChildren } from 'react';

import './../UiSection.css';
import PixelButtonWrapper from '../../PixelButtonWrapper/PixelButtonWrapper';
import PixelButton from '../../PixelButton/PixelButton';
import { useGameStore } from '../../../store/gameStore';
import MuteToggleBtn from '../../SoundButton/MuteToggleBtn';

const UpperUiSection = ({}: PropsWithChildren<{}>) => {
  const { gameFundamentals } = useGameStore();
  const rightButtonType =
    gameFundamentals.isGameStarted ||
    gameFundamentals.isGameOverAnimationPlaying
      ? 'arrowDown'
      : 'enter';

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
      <div className='run-pikachu-container'>
        <h1 className='run-pikachu'>Run</h1>
        <h1 className='run-pikachu'>Pikachu!</h1>
      </div>
      <div className='score-buttons-container'>
        <p className='score-text'>Score: {gameFundamentals.score}</p>
        <div className='button-container'>
          <PixelButtonWrapper className='upper'>
            <PixelButton type='spacebar' />
            <p className='instruction-text'>{leftButtonType}</p>
          </PixelButtonWrapper>
          <PixelButtonWrapper className='upper'>
            <PixelButton type={rightButtonType} />
            <p className='instruction-text'>
              {gameFundamentals.isGameStarted ||
              gameFundamentals.isGameOverAnimationPlaying
                ? 'Quick Drop'
                : 'Board'}
            </p>
          </PixelButtonWrapper>
        </div>
        <MuteToggleBtn />
      </div>
    </>
  );
};

export default UpperUiSection;
