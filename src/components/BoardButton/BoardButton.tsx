import { type PropsWithChildren } from 'react';
import './BoardButton.css';

interface BoardButtonProps {
  type: 'rerun' | 'register';
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
      {children}
    </button>
  );
};

export default BoardButton;
