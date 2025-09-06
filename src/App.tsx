import './App.css';
import Pikachu from './components/Pikachu/Pikachu';
import Obstacle from './components/Obstacle/Obstacle';
import { useGameStore, GAME_AREA_WIDTH } from './store/gameStore';
import useGameCore from './hooks/useGameCore';
import usePikachuJump from './hooks/usePikachuJump';
import useGameLoop from './hooks/useGameLoop';
import HighScoreBoard from './components/GameOverBoard/HighScoreBoard';
import ScrollingBackground from './components/ScrollingBackground/ScrollingBackground';

function App() {
  const { gameFundamentals } = useGameStore();

  useGameCore();
  usePikachuJump();
  useGameLoop();

  return (
    <div className='App'>
      {gameFundamentals.isBoardVisible && <HighScoreBoard />}

      <h1>Run Pikachu!</h1>
      {gameFundamentals.isGameOver &&
      !gameFundamentals.isGameOverAnimationPlaying ? (
        <p>Press Spacebar to restart the game</p>
      ) : (
        <p>Press Spacebar to start the game or jump</p>
      )}

      {gameFundamentals.isGameStarted ||
      gameFundamentals.isGameOverAnimationPlaying ? (
        <p>Press ↓ to fast-fall while jumping</p>
      ) : (
        <p>Press Enter to open the Highscore Board</p>
      )}
      <p>Score: {gameFundamentals.score}</p>

      <div className={`game-area`} style={{ width: GAME_AREA_WIDTH }}>
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
    </div>
  );
}

export default App;
