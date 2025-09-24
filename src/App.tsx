import './App.css';
import Pikachu from './components/Pikachu/Pikachu';
import Obstacle from './components/Obstacle/Obstacle';
import { useGameStore } from './store/gameStore';
import useGameCore from './hooks/useGameCore';
import usePikachuJump from './hooks/usePikachuJump';
import useGameLoop from './hooks/useGameLoop';
import Board from './components/Board/Board';
import ScrollingBackground from './components/ScrollingBackground/ScrollingBackground';
import UpperUiSection from './components/UiSection/UpperUiSection/UpperUiSection';
import { useLoadBgms } from './hooks/useLoadBgms';
import { useBgmControl } from './hooks/useBgmControl';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import PreGameScreen from './components/PreGameScreen/PreGameScreen';
import { useGameSizeControl } from './hooks/useGameSizeControl';
import LowerUiSection from './components/UiSection/LowerUiSection/LowerUiSection';
import { useLoadScores } from './hooks/useLoadScores';

function App() {
  const { gameFundamentals, sizeParams } = useGameStore();

  useGameCore();
  usePikachuJump();
  useGameLoop();
  useLoadBgms();
  useBgmControl();
  useGameSizeControl();
  useLoadScores();

  return (
    <div className='App'>
      <div
        style={{
          width: sizeParams.gameAreaWidth,
          height: sizeParams.gameAreaHeight,
        }}
        className='game-container'
      >
        <LoadingScreen />
        <PreGameScreen />
        {gameFundamentals.isBGMLoaded && !gameFundamentals.isPreGameScreen && (
          <>
            <Board />

            <UpperUiSection />

            <div className={`game-area`}>
              <ScrollingBackground
                src='/bg/bg-12.png'
                speed={0.1}
                isGameStarted={
                  gameFundamentals.isGameStarted &&
                  !gameFundamentals.isGameOver &&
                  !gameFundamentals.isBoardVisible
                }
              />
              <Pikachu />
              {gameFundamentals.obstacles.map((obstacle) => (
                <Obstacle
                  key={obstacle.id}
                  id={obstacle.id}
                  initialPositionX={obstacle.positionX}
                  positionY={obstacle.positionY}
                  width={obstacle.width}
                  height={obstacle.height}
                  obstacleType={obstacle.obstacleType}
                  hitboxWidth={obstacle.hitboxWidth}
                  hitboxHeight={obstacle.hitboxHeight}
                  offsetX={obstacle.offsetX}
                  offsetY={obstacle.offsetY}
                />
              ))}
            </div>

            <LowerUiSection />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
