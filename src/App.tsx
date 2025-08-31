import './App.css';
import Pikachu from './components/Pikachu/Pikachu';
import Obstacle from './components/Obstacle/Obstacle';
import { useGameStore, GAME_AREA_WIDTH } from './store/gameStore';
import useGameCore from './hooks/useGameCore';
import usePikachuJump from './hooks/usePikachuJump';
import useObstacleSpawner from './hooks/useObstacleSpawner';
import useGameTimer from './hooks/useGameTimer';
import HighScoreBoard from './components/GameOverBoard/HighScoreBoard';

function App() {
  const { gameFundamentals } = useGameStore();

  useGameTimer();
  useGameCore();
  usePikachuJump();
  useObstacleSpawner();

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
        <>
          <p>Press Spacebar to restart the game</p>
          <p>Press Enter to reopen the Highscore Board</p>
        </>
      ) : (
        <>
          <p>Press Spacebar to start the game or jump</p>
          <p>Press Enter to open the Highscore Board</p>
        </>
      )}
      <p>Press ↓ to fast-fall while jumping</p>
      <p>Score: {gameFundamentals.score}</p>
      {/* <p>{`게임시작: ${gameFundamentals.isGameStarted}`}</p> */}
      {/* <p>{`게임오버: ${gameFundamentals.isGameOver}`}</p> */}
      {/* <p>{`쩜프중: ${pikachuState.isJumping}`}</p> */}
      <div className='game-area' style={gameAreaStyle}>
        <Pikachu />
        {gameFundamentals.obstacles.map((obstacle) => (
          <Obstacle
            id={obstacle.id}
            key={obstacle.id}
            positionX={obstacle.positionX}
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
