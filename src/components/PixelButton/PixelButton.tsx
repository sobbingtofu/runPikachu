import { type PropsWithChildren } from 'react';
import './PixelButton.css';

export interface PixelButtonProps {
  type:
    | 'spacebar'
    | 'arrowDown'
    | 'enter'
    | 'Run'
    | 'Jump'
    | 'Board'
    | 'Quick Drop'
    | 'Run Again';
}

const imageMap: Record<PixelButtonProps['type'], string> = {
  spacebar: '/pixelButtons/spacebar-black.png',
  arrowDown: '/pixelButtons/arrowDown-black.png',
  enter: '/pixelButtons/enter-black.png',
  Run: '/pixelButtons/run-black.png',
  Jump: '/pixelButtons/jump-black.png',
  Board: '/pixelButtons/board-black.png',
  'Quick Drop': '/pixelButtons/quickDrop-black.png',
  'Run Again': '/pixelButtons/runAgain-black.png',
};

const buttonHeight = 45;

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
