import './App.css';
import Pikachu from './components/Pikachu/Pikachu';
import Obstacle from './components/Obstacle/Obstacle';
import { useGameStore, GAME_AREA_WIDTH } from './store/gameStore';
import useGameCore from './hooks/useGameCore';
import usePikachuJump from './hooks/usePikachuJump';
import useObstacleSpawner from './hooks/useObstacleSpawner';
import useCollisionDetection from './hooks/useCollisionDetection';
import useGameTimer from './hooks/useGameTimer';

function App() {
  const { gameFundamentals } = useGameStore();
  // const { pikachuState } = useGameStore();
  useGameTimer(); // 게임 타이머 훅 호출
  useGameCore(); // 키 이벤트 등 부가 로직 실행
  usePikachuJump(); // 점프 애니메이션 실행
  useObstacleSpawner(); // 장애물 생성 및 이동 로직 실행

  const { pikachuHitbox } = useCollisionDetection();
  // const { isCollision } = useCollisionDetection();

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
      <h1>Run Pikachu!</h1>
      <p>Press 'Spacebar' to start the game or Jump</p>
      <p>Press '↓' to fast-fall while jumping</p>
      <p>Score: {gameFundamentals.score}</p>
      {/* <p>{`게임시작: ${gameFundamentals.isGameStarted}`}</p>
      <p>{`게임오버: ${gameFundamentals.isGameOver}`}</p>
      <p>{`쩜프중: ${pikachuState.isJumping}`}</p>
      <p>{`충돌여부: ${isCollision ? '충돌!' : '안전'}`}</p> */}
      <div className='game-area' style={gameAreaStyle}>
        <div
          style={{
            position: 'absolute',
            left: pikachuHitbox.x,
            bottom: pikachuHitbox.y,
            width: pikachuHitbox.width,
            height: pikachuHitbox.height,
            backgroundColor: 'purple',
            opacity: 0.5,
            pointerEvents: 'none',
            zIndex: 100,
          }}
        />
        <Pikachu />
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
