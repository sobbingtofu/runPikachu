import type { PropsWithChildren } from 'react';
import './PixelButtonWrapper.css';

const PixelButtonWrapper = ({ children }: PropsWithChildren<{}>) => {
  return <div className='pixel-button-wrapper'>{children}</div>;
};

export default PixelButtonWrapper;
