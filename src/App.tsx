import './App.css';
import Pikachu from './components/Pikachu/Pikachu';
import Obstacle from './components/Obstacle/Obstacle';
import { useGameStore, GAME_AREA_WIDTH } from './store/gameStore';
import useGameCore from './hooks/useGameCore';
import usePikachuJump from './hooks/usePikachuJump';
import useGameLoop from './hooks/useGameLoop';
import HighScoreBoard from './components/GameOverBoard/HighScoreBoard';
import ScrollingBackground from './components/ScrollingBackground/ScrollingBackground';
import UiSection from './components/UiSection/UiSection';
import { useLoadBgms } from './hooks/useLoadBgms';
import { useBgmControl } from './hooks/useBgmControl';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import PreGameScreen from './components/PreGameScreen/PreGameScreen';

function App() {
  const { gameFundamentals } = useGameStore();

  useGameCore();
  usePikachuJump();
  useGameLoop();
  useLoadBgms();
  useBgmControl();

  return (
    <div className='App'>
      <div style={{ maxWidth: GAME_AREA_WIDTH, width: GAME_AREA_WIDTH }}>
        <LoadingScreen />
        <PreGameScreen />
        {gameFundamentals.isBGMLoaded && !gameFundamentals.isPreGameScreen && (
          <>
            <HighScoreBoard />

            <UiSection />

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
          </>
        )}
      </div>
    </div>
  );
}

export default App;
