import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { playPauseSound } from '../logic/playPauseSound';

export const useBgmControl = () => {
  const { gameFundamentals, loadingStates } = useGameStore();

  useEffect(() => {
    if (loadingStates.isBGMLoaded) {
      if (gameFundamentals.isSoundOn) {
        playPauseSound('02-LakeValor', 'play');
      } else {
        playPauseSound('02-LakeValor', 'pause');
      }
    }
  }, [loadingStates.isBGMLoaded, gameFundamentals.isSoundOn]);
};
