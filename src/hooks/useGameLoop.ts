import { useEffect, useRef } from 'react';
import {
  useGameStore,
  elapsedTimeRef,
  OBSTACLE_SPEED_PHASES,
  OBSTACLE_GEN_INTERVAL_PHASES,
} from '../store/gameStore';
import { updateScore } from '../logic/scoreLogic';
import { moveObstacles, spawnObstacleIfNeeded } from '../logic/obstacleLogic';

const useGameLoop = () => {
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

  const gameLoopIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(performance.now());

  // 각 로직에 필요한 시간 관련 Ref
  const lastObstacleGenTimeRef = useRef(0);
  const nextObstacleIntervalRef = useRef(0);
  const lastScoreUpdateTimeRef = useRef(0);

  useEffect(() => {
    if (gameFundamentals.isGameStarted && !gameFundamentals.isGameOver) {
      const now = performance.now();
      lastFrameTimeRef.current = now;
      lastObstacleGenTimeRef.current = now;
      lastScoreUpdateTimeRef.current = now;
      elapsedTimeRef.current = 0;

      const { min, max } = getCurrentObstacleGenInterval(0);
      nextObstacleIntervalRef.current = Math.random() * (max - min) + min;

      const gameLoop = (currentTime: DOMHighResTimeStamp) => {
        const deltaTime = currentTime - lastFrameTimeRef.current;
        lastFrameTimeRef.current = currentTime;
        elapsedTimeRef.current += deltaTime;

        const obstacleSpeed = getCurrentObstacleSpeed(elapsedTimeRef.current);

        setGameFundamentals((prev) => {
          // 1. 장애물 이동
          let updatedObstacles = moveObstacles(
            prev.obstacles,
            obstacleSpeed,
            deltaTime,
          );

          // 2. 장애물 생성
          const obstaclesAfterSpawn = spawnObstacleIfNeeded(
            updatedObstacles,
            currentTime,
            lastObstacleGenTimeRef.current,
            nextObstacleIntervalRef.current,
          );

          // 생성 로직이 실행되었다면 시간과 다음 간격을 업데이트
          if (obstaclesAfterSpawn.length > updatedObstacles.length) {
            lastObstacleGenTimeRef.current = currentTime;
            const { min, max } = getCurrentObstacleGenInterval(
              elapsedTimeRef.current,
            );
            nextObstacleIntervalRef.current = Math.random() * (max - min) + min;
          }
          updatedObstacles = obstaclesAfterSpawn;

          // 3. 점수 업데이트
          const updatedScore = updateScore(
            prev.score,
            currentTime,
            lastScoreUpdateTimeRef.current,
          );
          if (updatedScore > prev.score) {
            lastScoreUpdateTimeRef.current = currentTime;
          }

          // 4. 최종 상태 반환
          return {
            ...prev,
            obstacles: updatedObstacles,
            score: updatedScore,
          };
        });

        gameLoopIdRef.current = requestAnimationFrame(gameLoop);
      };

      gameLoopIdRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopIdRef.current) {
        cancelAnimationFrame(gameLoopIdRef.current);
      }
    };
  }, [
    gameFundamentals.isGameStarted,
    gameFundamentals.isGameOver,
    setGameFundamentals,
  ]);
};

export default useGameLoop;
