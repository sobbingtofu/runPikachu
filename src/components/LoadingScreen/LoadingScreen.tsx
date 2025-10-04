import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const { loadingStates } = useGameStore();

  const [loadingDots, setLoadingDots] = useState('');

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 4;
      setLoadingDots('.'.repeat(count));
    }, 160);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {(!loadingStates.isBGMLoaded || !loadingStates.isImgsLoaded) && (
        <>
          <h1 className='loading-text'>Pikachu is on its way{loadingDots}</h1>
        </>
      )}
    </>
  );
};

export default LoadingScreen;
