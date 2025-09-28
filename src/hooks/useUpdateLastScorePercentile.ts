import { useEffect } from 'react';
import { getScorePercentile } from '../logic/getScorePercentile';
import { useGameStore } from '../store/gameStore';

export const useUpdateLastScorePercentile = () => {
  const { setGameFundamentals, gameFundamentals } = useGameStore();
  useEffect(() => {
    if (gameFundamentals.isGameOver) {
      const fetchAndUpdatePercentile = async () => {
        const scorePercentile: number = await getScorePercentile(
          gameFundamentals.score,
        );
        console.log(scorePercentile);
        setGameFundamentals((prev) => ({
          ...prev,
          LastScorePercentile: scorePercentile || 0,
        }));
      };
      fetchAndUpdatePercentile();
    }
  }, [gameFundamentals.isGameOver]);
};
