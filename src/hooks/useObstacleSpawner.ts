import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import type { ObstacleType } from '../types/ObstacleType';
import useGameCore from './useGameCore';
import { getCurrentObstacleSpeed } from '../utils/obstacleSpeedUtils'; // 위 함수 분리 추천

const useObstacleSpawner = () => {
  const { currentPikachuYRef } = useGameCore();
  const {
    gameFundamentals,
    setGameFundamentals,
    INITIAL_GROUND_Y_VALUE,
    GAME_AREA_WIDTH,
    SPEED_PHASES,
  } = useGameStore();

  // 장애물 관련 상수
  const OBSTACLE_WIDTH = 20;
  const OBSTACLE_HEIGHT = 40;
  const obstacleSpeed = getCurrentObstacleSpeed(
    gameFundamentals.elapsedTime || 0,
    SPEED_PHASES,
  );
  const OBSTACLE_MIN_INTERVAL = 1000; // ms
  const OBSTACLE_MAX_INTERVAL = 2000; // ms

  // 장애물 생성 타이밍 Ref들
  const lastObstacleTime = useRef(0);
  const obstacleAnimationFrameId = useRef<number | null>(null);
  const nextObstacleInterval = useRef(
    Math.random() * (OBSTACLE_MAX_INTERVAL - OBSTACLE_MIN_INTERVAL) +
      OBSTACLE_MIN_INTERVAL,
  );

  useEffect(() => {
    if (gameFundamentals.isGameStarted && !gameFundamentals.isGameOver) {
      const generateObstacles = (currentTime: DOMHighResTimeStamp) => {
        setGameFundamentals((prev) => {
          let updatedObstacles = prev.obstacles
            .map((obs) => ({
              ...obs,
              positionX: obs.positionX - obstacleSpeed,
            }))
            .filter((obs) => obs.positionX + obs.width > 0);

          // 장애물 생성
          if (
            currentTime - lastObstacleTime.current >=
            nextObstacleInterval.current
          ) {
            const newObstacle: ObstacleType = {
              id: `obstacle-${Date.now()}-${Math.random()}`,
              positionX: GAME_AREA_WIDTH,
              positionY: INITIAL_GROUND_Y_VALUE,
              width: OBSTACLE_WIDTH,
              height: OBSTACLE_HEIGHT,
            };
            updatedObstacles = [...updatedObstacles, newObstacle];
            lastObstacleTime.current = currentTime;
            nextObstacleInterval.current =
              Math.random() * (OBSTACLE_MAX_INTERVAL - OBSTACLE_MIN_INTERVAL) +
              OBSTACLE_MIN_INTERVAL;
          }

          return {
            ...prev,
            obstacles: updatedObstacles,
          };
        });

        obstacleAnimationFrameId.current =
          requestAnimationFrame(generateObstacles);
      };

      // 최초 lastObstacleTime, nextObstacleInterval 초기화
      lastObstacleTime.current = performance.now();
      nextObstacleInterval.current =
        Math.random() * (OBSTACLE_MAX_INTERVAL - OBSTACLE_MIN_INTERVAL) +
        OBSTACLE_MIN_INTERVAL;

      obstacleAnimationFrameId.current =
        requestAnimationFrame(generateObstacles);
    }

    return () => {
      if (obstacleAnimationFrameId.current) {
        cancelAnimationFrame(obstacleAnimationFrameId.current);
        obstacleAnimationFrameId.current = null;
      }
      currentPikachuYRef.current = INITIAL_GROUND_Y_VALUE;
      lastObstacleTime.current = 0;
      nextObstacleInterval.current = 0;
    };
  }, [gameFundamentals.isGameStarted, gameFundamentals.isGameOver]);
};

export default useObstacleSpawner;
