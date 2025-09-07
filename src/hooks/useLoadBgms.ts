import { useEffect } from 'react';
import { useGameStore, BGM_NAMES } from '../store/gameStore';
import { getBGM, openDB, putBGM } from '../logic/manageBgmIdxDb';

export const useLoadBgms = () => {
  const { gameFundamentals, setGameFundamentals } = useGameStore();

  useEffect(() => {
    if (!gameFundamentals.isBGMLoaded) {
      const loadAllBgms = async () => {
        const db = await openDB();

        for (const bgmName of BGM_NAMES) {
          const exists = await getBGM(db, bgmName);
          if (exists) console.log(`BGM "${bgmName}" exists in IndexedDB:`);
          if (!exists) {
            console.log(
              `BGM "${bgmName}" does not exist in IndexedDB. Fetching...`,
            );
            const res = await fetch(`/music/${bgmName}.mp3`);
            const blob = await res.blob();
            await putBGM(db, bgmName, blob);
          }
        }

        setGameFundamentals({ isBGMLoaded: true });
      };

      loadAllBgms();
    }
  }, [setGameFundamentals]);
};
