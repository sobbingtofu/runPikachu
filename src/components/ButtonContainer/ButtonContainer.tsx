import { type PropsWithChildren } from 'react';
import './ButtonContainer.css';

const ButtonContainer = ({ children }: PropsWithChildren<{}>) => {
  return <div className='button-container'>{children}</div>;
};

export default ButtonContainer;
