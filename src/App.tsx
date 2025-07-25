import './App.css';
import Pikachu from './components/Pikachu/Pikachu';
import Obstacle from './components/Obstacle/Obstacle';
import { useGameStore } from './store/gameStore';
import useGameFundamentals from './hooks/useGameFundamentals';
import usePikachuJump from './hooks/usePikachuJump';
import useGenerateObastacles from './hooks/useGenerateObastacles';

function App() {
  const { GAME_AREA_WIDTH, gameFundamentals, pikachuState } = useGameStore();

  useGameFundamentals(); // 키 이벤트 등 부가 로직 실행
  usePikachuJump(); // 점프 애니메이션 실행
  useGenerateObastacles(); // 장애물 생성 및 이동 로직 실행

  const gameAreaStyle = {
    width: `${GAME_AREA_WIDTH}px`,
    height: '300px',
    backgroundColor: '#87ceeb',
    position: 'relative' as 'relative',
    overflow: 'hidden' as 'hidden',
    border: '2px solid black',
  };

  const pikachuHitbox = {
    x: 70,
    y: gameFundamentals.pikachuValueY,
    width: 50,
    height: 53,
  };

  function isColliding(
    pikachuHitbox: { x: number; y: number; width: number; height: number },
    obstacle: { x: number; y: number; width: number; height: number },
  ) {
    const collision =
      pikachuHitbox.x < obstacle.x + obstacle.width &&
      pikachuHitbox.x + pikachuHitbox.width > obstacle.x &&
      pikachuHitbox.y < obstacle.y + obstacle.height &&
      pikachuHitbox.y + pikachuHitbox.height > obstacle.y;

    if (collision) {
      console.log('Collision detected!');
      console.log('Pikachu:', pikachuHitbox);
      console.log('Obstacle:', obstacle);
    }
    return collision;
  }

  // 장애물 충돌 여부 계산
  const isCollision = gameFundamentals.obstacles.some((obs) =>
    isColliding(pikachuHitbox, {
      x: obs.positionX,
      y: obs.positionY, // 장애물도 바닥 기준
      width: obs.width,
      height: obs.height,
    }),
  );
  return (
    <div className='App'>
      <h1>Run Pikachu!</h1>
      <p>{`게임시작: ${gameFundamentals.isGameStarted}`}</p>
      <p>{`게임오버: ${gameFundamentals.isGameOver}`}</p>
      <p>{`쩜프중: ${pikachuState.isJumping}`}</p>
      <p>{`충돌여부: ${isCollision ? '충돌!' : '안전'}`}</p>
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
