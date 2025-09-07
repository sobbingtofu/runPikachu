import { useGameStore } from '../../store/gameStore';
import './PreGameScreen.css';

const PreGameScreen = () => {
  const { gameFundamentals } = useGameStore();
  return (
    <>
      {gameFundamentals.isBGMLoaded && gameFundamentals.isPreGameScreen && (
        <>
          <h1>
            Press <span className='highlight'>Enter</span> to Start
          </h1>
        </>
      )}
    </>
  );
};

export default PreGameScreen;
