import { useEffect, useRef } from 'react';
import {
  useGameStore,
  elapsedTimeRef,
  currentPikachuYRef,
  INITIAL_GROUND_Y_VALUE,
  GAME_AREA_WIDTH,
  OBSTACLE_SPEED_PHASES,
  OBSTACLE_GEN_INTERVAL_PHASES,
  RANDOM_OBSTACLE_TYPES,
  TARGET_FPS,
} from '../store/gameStore';
import type { ObstacleType } from '../types/ObstacleType';

const FRAME_DURATION = 1000 / TARGET_FPS;

const useObstacleSpawner = () => {
  const { gameFundamentals, setGameFundamentals } = useGameStore();

  const getCurrentObstacleSpeed = (elapsedTime: number): number => {
    for (const { start, end, obstacleSpeed } of OBSTACLE_SPEED_PHASES) {
      if (elapsedTime >= start && elapsedTime < end) {
        return obstacleSpeed;
      }
    }
    return 0;
  };

  const getCurrentObstacleGenInterval = (
    elapsedTime: number,
  ): { min: number; max: number } => {
    for (const { start, end, min, max } of OBSTACLE_GEN_INTERVAL_PHASES) {
      if (elapsedTime >= start && elapsedTime < end) {
        return { min, max };
      }
    }
    return { min: 0, max: 0 };
  };

  // 장애물 생성 타이밍 Ref들
  const lastObstacleTime = useRef(0);
  const obstacleAnimationFrameId = useRef<number | null>(null);
  const nextObstacleInterval = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());

  useEffect(() => {
    if (gameFundamentals.isGameStarted && !gameFundamentals.isGameOver) {
      // 최초 lastObstacleTime, nextObstacleInterval 초기화 (동적으로)
      const { min, max } = getCurrentObstacleGenInterval(
        elapsedTimeRef.current,
      );
      lastObstacleTime.current = performance.now();
      nextObstacleInterval.current = Math.random() * (max - min) + min;
      lastFrameTimeRef.current = performance.now();

      const generateObstacles = (currentTime: DOMHighResTimeStamp) => {
        if (currentTime - lastFrameTimeRef.current < FRAME_DURATION) {
          obstacleAnimationFrameId.current =
            requestAnimationFrame(generateObstacles);
          return;
        }
        lastFrameTimeRef.current = currentTime;

        const obstacleSpeed = getCurrentObstacleSpeed(elapsedTimeRef.current);
        const { min, max } = getCurrentObstacleGenInterval(
          elapsedTimeRef.current,
        );

        function pickWeightedRandomObstacle(
          obstacles: typeof RANDOM_OBSTACLE_TYPES,
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
              positionY: obs.positionY,
            }))
            .filter((obs) => obs.positionX + obs.width > 0);

          // 장애물 생성
          if (
            currentTime - lastObstacleTime.current >=
            nextObstacleInterval.current
          ) {
            // RANDOM_OBSTACLE_TYPES 중 하나를 랜덤 선택
            const randomObstacle = pickWeightedRandomObstacle(
              RANDOM_OBSTACLE_TYPES,
            );

            const newObstacle: ObstacleType = {
              id: `obstacle-${Date.now()}-${Math.random()}`,
              positionX: GAME_AREA_WIDTH,
              positionY: randomObstacle.positionY ?? INITIAL_GROUND_Y_VALUE,
              width: randomObstacle.width,
              height: randomObstacle.height,
              obstacleType: randomObstacle.obstacleType,
              hitboxWidth: randomObstacle.hitboxWidth,
              hitboxHeight: randomObstacle.hitboxHeight,
              offsetX: randomObstacle.offsetX,
              offsetY: randomObstacle.offsetY,
            };
            updatedObstacles = [...updatedObstacles, newObstacle];
            lastObstacleTime.current = currentTime;

            nextObstacleInterval.current = Math.random() * (max - min) + min;
          }

          return {
            ...prev,
            obstacles: updatedObstacles,
          };
        });

        obstacleAnimationFrameId.current =
          requestAnimationFrame(generateObstacles);
      };

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
