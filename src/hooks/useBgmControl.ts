import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { playPauseSound } from '../logic/playPauseSound';

export const useBgmControl = () => {
  const { gameFundamentals, setGameFundamentals } = useGameStore();

  useEffect(() => {
    if (gameFundamentals.isBGMLoaded && !gameFundamentals.isGameStarted) {
      if (gameFundamentals.isSoundOn) {
        playPauseSound('02-LakeValor', 'play');
      } else {
        playPauseSound('02-LakeValor', 'pause');
      }
    }
  }, [
    gameFundamentals.isBGMLoaded,
    gameFundamentals.isSoundOn,
    setGameFundamentals,
  ]);
};
