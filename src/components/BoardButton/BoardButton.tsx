import { type PropsWithChildren } from 'react';
import './BoardButton.css';

interface ButtonProps {
  type: 'rerun' | 'register';
  onClick: () => void;
}

const BoardButton = ({
  type,
  onClick,
  children,
}: PropsWithChildren<ButtonProps>) => {
  const className = `button ${type}`;

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default BoardButton;
