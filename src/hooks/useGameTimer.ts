import { useEffect, useRef } from 'react';
import { useGameStore, elapsedTimeRef } from '../store/gameStore';

const useGameTimer = () => {
  const { gameFundamentals, setGameFundamentals } = useGameStore();
  const gameTimerIntervalId = useRef<NodeJS.Timeout | null>(null);
  const scoreIntervalId = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (gameFundamentals.isGameStarted && !gameFundamentals.isGameOver) {
      startTimeRef.current = Date.now() - (elapsedTimeRef.current || 0);

      gameTimerIntervalId.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        console.log('Game elapsed time:', elapsed);
        elapsedTimeRef.current = elapsed;
      }, 1000);

      scoreIntervalId.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        console.log('Game elapsed time:', elapsed);
        setGameFundamentals((prev) => ({
          ...prev,
          score: prev.score + 1,
        }));
        elapsedTimeRef.current = elapsed;
      }, 500);
    }

    return () => {
      if (gameTimerIntervalId.current)
        clearInterval(gameTimerIntervalId.current);
      if (scoreIntervalId.current) clearInterval(scoreIntervalId.current);
    };
  }, [gameFundamentals.isGameStarted, gameFundamentals.isGameOver]);
};

export default useGameTimer;
