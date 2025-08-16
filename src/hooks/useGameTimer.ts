import { useEffect, useRef } from 'react';
import { useGameStore, elapsedTimeRef } from '../store/gameStore';

const useGameTimer = () => {
  const { gameFundamentals } = useGameStore();
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (gameFundamentals.isGameStarted && !gameFundamentals.isGameOver) {
      startTimeRef.current = Date.now() - (elapsedTimeRef.current || 0);

      intervalId.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        console.log('Game elapsed time:', elapsed);
        elapsedTimeRef.current = elapsed;
      }, 1000);
    }

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [gameFundamentals.isGameStarted, gameFundamentals.isGameOver]);
};

export default useGameTimer;
