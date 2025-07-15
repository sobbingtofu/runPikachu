import React from 'react';
import './App.css';
import Pikachu from './components/Pikachu/Pikachu';
import useGameLogic from './hooks/useGameLogic';

function App() {
  const { gameState, gameContainerRef } = useGameLogic(); // 커스텀 훅 임포트
  const {
    isGameStarted,
    isGameOver,
    isJumping,
    score,
    obstacles,
    pikachuBottom,
  } = gameState;

  return (
    <div className='App'>
      <h1>Run Pikachu!</h1>
      <p>{`게임시작: ${isGameStarted}`}</p>
      <p>{`게임오버: ${isGameOver}`}</p>
      <p>{`쩜프중: ${isJumping}`}</p>
      <div className='game-container'>
        <Pikachu isJumping={isJumping} pikachuBottom={pikachuBottom} />
      </div>
    </div>
  );
}

export default App;
