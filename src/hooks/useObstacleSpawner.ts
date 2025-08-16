import { useEffect, useRef } from 'react';
import {
  useGameStore,
  elapsedTimeRef,
  currentPikachuYRef,
  INITIAL_GROUND_Y_VALUE,
  GAME_AREA_WIDTH,
  OBSTACLE_PHASES,
  RANDOM_OBSTACLES,
} from '../store/gameStore';
import type { ObstacleType } from '../types/ObstacleType';

const useObstacleSpawner = () => {
  const { gameFundamentals, setGameFundamentals } = useGameStore();

  const getCurrentObstacleSpeed = (elapsedTime: number): number => {
    for (const { start, end, obstacleSpeed } of OBSTACLE_PHASES) {
      if (elapsedTime >= start && elapsedTime < end) {
        return obstacleSpeed;
      }
    }
    return 0;
  };

  const OBSTACLE_MIN_INTERVAL = 800; // ms
  const OBSTACLE_MAX_INTERVAL = 1500; // ms

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
        const obstacleSpeed = getCurrentObstacleSpeed(elapsedTimeRef.current);

        function pickWeightedRandomObstacle(
          obstacles: typeof RANDOM_OBSTACLES,
        ) {
          const totalWeight = obstacles.reduce(
            (sum, obs) => sum + (obs.weight ?? 1),
            0,
          );
          let rand = Math.random() * totalWeight;
          for (const obs of obstacles) {
            rand -= obs.weight ?? 1;
            if (rand < 0) return obs;
          }
          return obstacles[obstacles.length - 1]; // fallback
        }

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
            // RANDOM_OBSTACLES 중 하나를 랜덤 선택
            const randomObstacle = pickWeightedRandomObstacle(RANDOM_OBSTACLES);

            const newObstacle: ObstacleType = {
              id: `obstacle-${Date.now()}-${Math.random()}`,
              positionX: GAME_AREA_WIDTH,
              positionY: INITIAL_GROUND_Y_VALUE,
              width: randomObstacle.width,
              height: randomObstacle.height,
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
