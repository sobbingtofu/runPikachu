import type { PropsWithChildren } from 'react';

import PixelButton from '../../PixelButton/PixelButton';
import PixelButtonWrapper from '../../PixelButtonWrapper/PixelButtonWrapper';
import type { UiSectionProps } from '../UpperUiSection/UpperUiSection';
import './../UiSection.css';
import { useKeyboardHandlers } from '../../../hooks/useKeyboardHandlers';
import { isFastFallingRef, isSpacePressedRef } from '../../../store/gameStore';

const LowerUiSection = ({
  leftButtonType,
  rightButtonType,
  leftButtonText,
  rightButtonText,
}: PropsWithChildren<UiSectionProps>) => {
  const { keyDownSpaceBarLogic, keyDownArrowDownLogic, keyDownEnterLogic } =
    useKeyboardHandlers();

  const clickSpaceBarBtn = () => {
    keyDownSpaceBarLogic();
    isSpacePressedRef.current = false;
  };

  const clickArrowDownBtn = () => {
    keyDownArrowDownLogic();
    // isFastFallingRef.current = false;
  };

  return (
    <>
      <div className='lower-button-container'>
        <PixelButtonWrapper className='lower'>
          <PixelButton
            type={leftButtonType}
            onClick={clickSpaceBarBtn}
            clickable
          />
          <p className='instruction-text'>{leftButtonText}</p>
        </PixelButtonWrapper>
        <PixelButtonWrapper className='lower'>
          <PixelButton
            type={rightButtonType}
            onClick={
              rightButtonType === 'arrowDown'
                ? clickArrowDownBtn
                : keyDownEnterLogic
            }
            clickable
          />
          <p className='instruction-text'>{rightButtonText}</p>
        </PixelButtonWrapper>
      </div>
    </>
  );
};

export default LowerUiSection;
