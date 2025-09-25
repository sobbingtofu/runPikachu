import type { PropsWithChildren } from 'react';

import './../UiSection.css';
import PixelButtonWrapper from '../../PixelButtonWrapper/PixelButtonWrapper';
import PixelButton, {
  type PixelButtonProps,
} from '../../PixelButton/PixelButton';
import { useGameStore } from '../../../store/gameStore';
import MuteToggleBtn from '../../SoundButton/MuteToggleBtn';

export interface UiSectionProps {
  leftButtonType: PixelButtonProps['type'];
  rightButtonType: PixelButtonProps['type'];
  leftButtonText: string;
  rightButtonText: string;
}

const UpperUiSection = ({
  leftButtonType,
  rightButtonType,
  leftButtonText,
  rightButtonText,
}: PropsWithChildren<UiSectionProps>) => {
  const { gameFundamentals } = useGameStore();

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
            <PixelButton type={leftButtonType} />
            <p className='instruction-text'>{leftButtonText}</p>
          </PixelButtonWrapper>
          <PixelButtonWrapper className='upper'>
            <PixelButton type={rightButtonType} />
            <p className='instruction-text'>{rightButtonText}</p>
          </PixelButtonWrapper>
        </div>
        <MuteToggleBtn />
      </div>
    </>
  );
};

export default UpperUiSection;
