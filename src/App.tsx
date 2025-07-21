// src/App.tsx
import React from 'react';
import './App.css';
import Pikachu from './components/Pikachu/Pikachu';
import useGameLogic from './hooks/useGameLogic';
import Obstacle from './components/Obstacle/Obstacle';

function App() {
  const { gameState, GAME_AREA_WIDTH } = useGameLogic();

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
      <p>{`게임시작: ${gameState.isGameStarted}`}</p>
      <p>{`게임오버: ${gameState.isGameOver}`}</p>
      <p>{`쩜프중: ${gameState.isJumping}`}</p>
      <div className='game-area' style={gameAreaStyle}>
        <Pikachu
          isJumping={gameState.isJumping}
          pikachuBottom={gameState.pikachuBottom}
        />

        {gameState.obstacles.map((obstacle) => (
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
