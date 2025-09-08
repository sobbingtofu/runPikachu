import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { getGameAreaSize, getPikachuSize } from '../logic/getSizeParams';

export const useGameSizeControl = () => {
  const { setSizeParams, setPikachuState } = useGameStore();

  useEffect(() => {
    const handleResize = () => {
      const { width: newWidth, height: newHeight } = getGameAreaSize();
      setSizeParams({
        gameAreaWidth: newWidth,
        gameAreaHeight: newHeight,
      });
      const { pikachuWidth, pikachuHeight } = getPikachuSize();
      setPikachuState({
        pikachuWidth: pikachuWidth,
        pikachuHeight: pikachuHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
};
