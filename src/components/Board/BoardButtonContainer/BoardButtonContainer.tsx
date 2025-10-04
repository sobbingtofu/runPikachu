import { type PropsWithChildren } from 'react';
import './BoardButtonContainer.css';

const ButtonContainer = ({ children }: PropsWithChildren<{}>) => {
  return <div className='board-button-container'>{children}</div>;
};

export default ButtonContainer;
