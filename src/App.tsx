import './App.css';
import Pikachu from './components/Pikachu/Pikachu';
import Obstacle from './components/Obstacle/Obstacle';
import { useGameStore } from './store/gameStore';
import useGameCore from './hooks/useGameCore';
import usePikachuJump from './hooks/usePikachuJump';
import useGameLoop from './hooks/useGameLoop';
import HighScoreBoard from './components/GameOverBoard/HighScoreBoard';
import ScrollingBackground from './components/ScrollingBackground/ScrollingBackground';
import UpperUiSection from './components/UiSection/UpperUiSection/UpperUiSection';
import { useLoadBgms } from './hooks/useLoadBgms';
import { useBgmControl } from './hooks/useBgmControl';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import PreGameScreen from './components/PreGameScreen/PreGameScreen';
import { useGameSizeControl } from './hooks/useGameSizeControl';
import LowerUiSection from './components/UiSection/LowerUiSection/LowerUiSection';
import { supabase } from './store/supabaseClient';
import { useEffect } from 'react';

function App() {
  const { gameFundamentals, sizeParams } = useGameStore();

  useGameCore();
  usePikachuJump();
  useGameLoop();
  useLoadBgms();
  useBgmControl();
  useGameSizeControl();

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('TB_RECORD_MASTER')
        .select('*');

      if (error) {
        throw error;
      }
      console.log('데이터:', data);
      console.log(typeof data);
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            <HighScoreBoard />

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
