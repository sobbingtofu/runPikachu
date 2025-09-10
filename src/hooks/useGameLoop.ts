import { useEffect, useRef } from 'react';
import {
  useGameStore,
  elapsedTimeRef,
  OBSTACLE_SPEED_PHASES,
  OBSTACLE_GEN_INTERVAL_PHASES,
  obstaclePositions,
} from '../store/gameStore';
import { updateScore } from '../logic/scoreLogic';
import { spawnObstacleIfNeeded } from '../logic/obstacleLogic';
import { getResponsiveSizeParams } from '../logic/getResponsiveSizeParams';

const useGameLoop = () => {
  const { gameFundamentals, setGameFundamentals, sizeParams } = useGameStore();

  const getCurrentObstacleSpeed = (elapsedTime: number): number => {
    for (const { start, end, obstacleSpeed } of OBSTACLE_SPEED_PHASES) {
      if (elapsedTime >= start && elapsedTime < end) {
        return getResponsiveSizeParams(obstacleSpeed);
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

  const lastObstacleGenTimeRef = useRef(0);
  const nextObstacleIntervalRef = useRef(0);
  const lastScoreUpdateTimeRef = useRef(0);

  useEffect(() => {
    // 게임 루프 시작 조건
    if (gameFundamentals.isGameStarted && !gameFundamentals.isGameOver) {
      const now = performance.now();
      lastFrameTimeRef.current = now;
      lastObstacleGenTimeRef.current = now;
      lastScoreUpdateTimeRef.current = now;
      elapsedTimeRef.current = 0;

      obstaclePositions.current.clear();
      gameFundamentals.obstacles.forEach((obs) => {
        obstaclePositions.current.set(obs.id, obs.positionX);
      });

      const { min, max } = getCurrentObstacleGenInterval(0);
      nextObstacleIntervalRef.current = Math.random() * (max - min) + min;

      const gameLoop = (currentTime: DOMHighResTimeStamp) => {
        const deltaTime = currentTime - lastFrameTimeRef.current;
        lastFrameTimeRef.current = currentTime;
        elapsedTimeRef.current += deltaTime;

        const obstacleSpeed = getCurrentObstacleSpeed(elapsedTimeRef.current);
        const speedFactor = deltaTime / 16.67;

        obstaclePositions.current.forEach((posX, id) => {
          const newPosX = posX - obstacleSpeed * speedFactor;
          obstaclePositions.current.set(id, newPosX);

          const element = document.getElementById(id);
          if (element) {
            element.style.transform = `translateX(${newPosX - element.offsetLeft}px)`;
          }
        });

        setGameFundamentals((prev) => {
          // 화면 밖으로 나간 장애물 제거
          const updatedObstacles = prev.obstacles.filter((obs) => {
            const currentPos = obstaclePositions.current.get(obs.id);
            if (currentPos !== undefined && currentPos + obs.width <= 0) {
              obstaclePositions.current.delete(obs.id); // 공유 객체에서도 제거
              return false;
            }
            return true;
          });

          // 장애물 생성
          const obstaclesAfterSpawn = spawnObstacleIfNeeded(
            updatedObstacles,
            currentTime,
            lastObstacleGenTimeRef.current,
            nextObstacleIntervalRef.current,
            sizeParams.gameAreaWidth,
          );

          if (obstaclesAfterSpawn.length > updatedObstacles.length) {
            const newObstacle =
              obstaclesAfterSpawn[obstaclesAfterSpawn.length - 1];
            // 새로 생성된 장애물도 공유 객체에 추가
            obstaclePositions.current.set(
              newObstacle.id,
              newObstacle.positionX,
            );
            lastObstacleGenTimeRef.current = currentTime;
            const { min, max } = getCurrentObstacleGenInterval(
              elapsedTimeRef.current,
            );
            nextObstacleIntervalRef.current = Math.random() * (max - min) + min;
          }

          // 점수 업데이트
          const updatedScore = updateScore(
            prev.score,
            currentTime,
            lastScoreUpdateTimeRef.current,
          );
          if (updatedScore > prev.score) {
            lastScoreUpdateTimeRef.current = currentTime;
          }

          return {
            ...prev,
            obstacles: obstaclesAfterSpawn,
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
