import { useEffect } from 'react';
import { initialSizeParams, useGameStore } from '../store/gameStore';
import { getResponsiveSizeParams } from '../logic/getResponsiveSizeParams';

export const useGameSizeControl = () => {
  const { setSizeParams, setPikachuState } = useGameStore();

  useEffect(() => {
    const handleResize = () => {
      const newWidth = getResponsiveSizeParams(
        initialSizeParams.GAME_AREA_INIT_WIDTH,
      );
      const newHeight = getResponsiveSizeParams(
        initialSizeParams.GAME_AREA_INIT_HEIGHT,
      );

      const newPikachuWidth = getResponsiveSizeParams(
        initialSizeParams.PIKACHU_INIT_WIDTH,
      );
      const newPikachuHeight = getResponsiveSizeParams(
        initialSizeParams.PIKACHU_INIT_HEIGHT,
      );

      setSizeParams({
        gameAreaWidth: newWidth,
        gameAreaHeight: newHeight,
      });

      setPikachuState({
        maxJumpHeight: getResponsiveSizeParams(
          initialSizeParams.PIKACHU_INIT_JUMP_HEIGHT,
        ),
        pikachuWidth: newPikachuWidth,
        pikachuHeight: newPikachuHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
};
