import { useEffect } from 'react';
import { initialSizeParams, useGameStore } from '../store/gameStore';
import { getResponsiveSizeParams } from '../logic/getResponsiveSizeParams';

export const useGameSizeControl = () => {
  const {
    setSizeParams,
    setPikachuState,
    setGameFundamentals,
    gameFundamentals,
  } = useGameStore();

  useEffect(() => {
    const handleResize = () => {
      if (!gameFundamentals.isGameStarted) {
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

        setGameFundamentals((prev) => ({
          ...prev,
          obstacles: prev.obstacles.map((obs) => ({
            ...obs,
            width: getResponsiveSizeParams(obs.originalWidth || 0),
            height: getResponsiveSizeParams(obs.originalHeight || 0),
            hitboxWidth: getResponsiveSizeParams(obs.originalHitboxWidth || 0),
            hitboxHeight: getResponsiveSizeParams(
              obs.originalHitboxHeight || 0,
            ),
          })),
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [
    gameFundamentals.isGameStarted,
    setGameFundamentals,
    setPikachuState,
    setSizeParams,
  ]);
};
