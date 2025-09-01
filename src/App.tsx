import './App.css';
import Pikachu from './components/Pikachu/Pikachu';
import Obstacle from './components/Obstacle/Obstacle';
import { useGameStore, GAME_AREA_WIDTH } from './store/gameStore';
import useGameCore from './hooks/useGameCore';
import usePikachuJump from './hooks/usePikachuJump';
import useGameLoop from './hooks/useGameLoop';
import HighScoreBoard from './components/GameOverBoard/HighScoreBoard';

function App() {
  const { gameFundamentals } = useGameStore();

  useGameCore();
  usePikachuJump();
  useGameLoop();

  const gameAreaStyle = {
    width: `${GAME_AREA_WIDTH}px`,
    height: '450px',
    backgroundColor: '#87ceeb',
    position: 'relative' as 'relative',
    overflow: 'hidden' as 'hidden',
    border: '2px solid black',
  };

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

      <div className='game-area' style={gameAreaStyle}>
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
