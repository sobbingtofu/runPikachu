import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { playPauseBgms } from '../logic/playPauseBgm';

export const useBgmControl = () => {
  const { gameFundamentals, setGameFundamentals } = useGameStore();

  useEffect(() => {
    if (gameFundamentals.isBGMLoaded && !gameFundamentals.isGameStarted) {
      if (gameFundamentals.isSoundOn) {
        playPauseBgms('02-LakeValor', 'play');
      } else {
        playPauseBgms('02-LakeValor', 'pause');
      }
    }
  }, [
    gameFundamentals.isBGMLoaded,
    gameFundamentals.isSoundOn,
    setGameFundamentals,
  ]);
};
