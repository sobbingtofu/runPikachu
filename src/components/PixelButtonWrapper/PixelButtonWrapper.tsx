import type { PropsWithChildren } from 'react';
import './PixelButtonWrapper.css';

interface PixelButtonWrapperProps {
  className?: string;
}

const PixelButtonWrapper = ({
  children,
  className,
}: PropsWithChildren<PixelButtonWrapperProps>) => {
  return (
    <div className={`pixel-button-wrapper ${className ? className : ''}`}>
      {children}
    </div>
  );
};

export default PixelButtonWrapper;
