import { type PropsWithChildren } from 'react';
import './PixelButton.css';

interface PixelButtonProps {
  type: 'spacebar' | 'arrowDown' | 'enter';
}

const imageMap: Record<PixelButtonProps['type'], string> = {
  spacebar: '/pixelButtons/spacebar-black.png',
  arrowDown: '/pixelButtons/arrowDown-black.png',
  enter: '/pixelButtons/enter-black.png',
};

const buttonHeight = 60;

const PixelButton = ({
  type = 'spacebar',
}: PropsWithChildren<PixelButtonProps>) => {
  const className = `button ${type}`;
  const imgSrc = imageMap[type];

  return (
    <div className={className}>
      <img
        src={imgSrc}
        alt={type}
        style={{
          height: `${buttonHeight}px`,
          width: 'auto',
          display: 'block',
        }}
      />
    </div>
  );
};

export default PixelButton;
