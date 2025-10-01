import type { PropsWithChildren } from 'react';

import PixelButton from '../../PixelButton/PixelButton';
import PixelButtonWrapper from '../../PixelButtonWrapper/PixelButtonWrapper';
import type { UiSectionProps } from '../UpperUiSection/UpperUiSection';
import './../UiSection.css';
import { useKeyboardHandlers } from '../../../hooks/useKeyboardHandlers';

const LowerUiSection = ({
  leftButtonType,
  rightButtonType,
  leftButtonText,
  rightButtonText,
}: PropsWithChildren<UiSectionProps>) => {
  const { keyDownSpaceBarLogic, keyDownArrowDownLogic, keyDownEnterLogic } =
    useKeyboardHandlers();

  return (
    <>
      <div className='lower-button-container'>
        <PixelButtonWrapper className='lower'>
          <PixelButton type={leftButtonType} />
          <p className='instruction-text'>{leftButtonText}</p>
        </PixelButtonWrapper>
        <PixelButtonWrapper className='lower'>
          <PixelButton type={rightButtonType} />
          <p className='instruction-text'>{rightButtonText}</p>
        </PixelButtonWrapper>
      </div>
    </>
  );
};

export default LowerUiSection;
