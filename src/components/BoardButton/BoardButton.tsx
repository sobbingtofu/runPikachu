import { type PropsWithChildren } from 'react';
import './BoardButton.css';

interface BoardButtonProps {
  type: 'left' | 'right';
  onClick: () => void;
}

const BoardButton = ({
  type,
  onClick,
  children,
}: PropsWithChildren<BoardButtonProps>) => {
  const className = `board-button ${type}`;

  return (
    <button className={className} onClick={onClick}>
      <p className='board-button-text'>{children}</p>
    </button>
  );
};

export default BoardButton;
