import { useKeyboardHandlers } from '../../hooks/useKeyboardHandlers';
import { useGameStore } from '../../store/gameStore';
import './PreGameScreen.css';

const PreGameScreen = () => {
  const { loadingStates, gameFundamentals } = useGameStore();
  const { keyDownEnterLogic } = useKeyboardHandlers();
  return (
    <>
      {loadingStates.isBGMLoaded &&
        loadingStates.isImgsLoaded &&
        gameFundamentals.isPreGameScreen && (
          <>
            <h1 className='pre-game-text desktop'>
              Press <span className='highlight'>Enter</span> to Start
            </h1>
            <h1 className='pre-game-text mobile'>
              <span className='highlight' onClick={keyDownEnterLogic}>
                Tap Here
              </span>
              {' to Start'}
            </h1>
          </>
        )}
    </>
  );
};

export default PreGameScreen;
