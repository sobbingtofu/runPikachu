import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

const useGameTimer = () => {
  const { gameFundamentals, setGameFundamentals } = useGameStore();
  const rafId = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (gameFundamentals.isGameStarted && !gameFundamentals.isGameOver) {
      startTimeRef.current =
        performance.now() - (gameFundamentals.elapsedTime || 0);

      const tick = () => {
        const now = performance.now();
        const elapsed = now - startTimeRef.current;
        console.log('elapsedTime:', elapsed);
        setGameFundamentals((prev) => ({
          ...prev,
          elapsedTime: now - startTimeRef.current,
        }));
        rafId.current = requestAnimationFrame(tick);
      };
      rafId.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [gameFundamentals.isGameStarted, gameFundamentals.isGameOver]);
};

export default useGameTimer;
