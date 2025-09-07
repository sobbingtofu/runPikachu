import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { playPauseBgms } from '../logic/playPauseBgm';

export const useBgmControl = () => {
  const { gameFundamentals, setGameFundamentals } = useGameStore();

  useEffect(() => {
    if (gameFundamentals.isBGMLoaded && !gameFundamentals.isGameStarted) {
      if (gameFundamentals.isSoundOn) {
        playPauseBgms('01-PalletTown', 'play');
      } else {
        playPauseBgms('01-PalletTown', 'pause');
      }
    }
  }, [
    gameFundamentals.isBGMLoaded,
    gameFundamentals.isSoundOn,
    setGameFundamentals,
  ]);
};
