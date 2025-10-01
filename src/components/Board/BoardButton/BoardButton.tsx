import { type PropsWithChildren } from 'react';
import './BoardButton.css';
import { useGameStore } from '../../../store/gameStore';

interface BoardButtonProps {
  type: 'left' | 'right';
  onClick: () => void;
}

const BoardButton = ({
  type,
  onClick,
  children,
}: PropsWithChildren<BoardButtonProps>) => {
  const { loadingStates } = useGameStore();
  const className = !loadingStates.isScoreRegisterLoading
    ? `board-button ${type}`
    : `board-button disabled`;

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={loadingStates.isScoreRegisterLoading}
    >
      <p className='board-button-text'>{children}</p>
    </button>
  );
};

export default BoardButton;
