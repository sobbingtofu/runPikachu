import './App.css';
import Pikachu from './components/Pikachu/Pikachu';
import Obstacle from './components/Obstacle/Obstacle';
import { useGameStore } from './store/gameStore';
import useGameFundamentals from './hooks/useGameFundamentals';
import usePikachuJump from './hooks/usePikachuJump';

function App() {
  const { GAME_AREA_WIDTH, gameFundamentals, pikachuState } = useGameStore();

  useGameFundamentals(); // 키 이벤트 등 부가 로직 실행
  usePikachuJump(); // 점프 애니메이션 실행

  const gameAreaStyle = {
    width: `${GAME_AREA_WIDTH}px`,
    height: '200px',
    backgroundColor: '#87ceeb',
    position: 'relative' as 'relative',
    overflow: 'hidden' as 'hidden',
    border: '2px solid black',
  };

  return (
    <div className='App'>
      <h1>Run Pikachu!</h1>
      <p>{`게임시작: ${gameFundamentals.isGameStarted}`}</p>
      <p>{`게임오버: ${gameFundamentals.isGameOver}`}</p>
      <p>{`쩜프중: ${pikachuState.isJumping}`}</p>
      <div className='game-area' style={gameAreaStyle}>
        <Pikachu
          isJumping={pikachuState.isJumping}
          pikachuBottom={gameFundamentals.pikachuValueY}
        />
        {gameFundamentals.obstacles.map((obstacle) => (
          <Obstacle
            id={obstacle.id}
            key={obstacle.id}
            positionX={obstacle.positionX}
            positionY={obstacle.positionY}
            width={obstacle.width}
            height={obstacle.height}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
