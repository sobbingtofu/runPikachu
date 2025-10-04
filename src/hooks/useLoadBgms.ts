import { useEffect } from 'react';
import {
  useGameStore,
  BGM_NAMES,
  SOUND_EFFECT_NAMES,
} from '../store/gameStore';
import { getBGM, openBgmDb, putBGM } from '../logic/manageBgmIdxDb';
import { timerPromiseLogic } from '../logic/timerPromise';

export const useLoadBgms = () => {
  const { loadingStates, setLoadingStates } = useGameStore();

  useEffect(() => {
    if (!loadingStates.isBGMLoaded) {
      const loadAllBgms = async () => {
        const db = await openBgmDb();

        for (const bgmName of BGM_NAMES) {
          const exists = await getBGM(db, bgmName);
          // if (exists) console.log(`BGM "${bgmName}" exists in IndexedDB:`);
          if (!exists) {
            const res = await fetch(`/music/${bgmName}.mp3`);
            const blob = await res.blob();
            await putBGM(db, bgmName, blob);
          }
        }

        for (const sfx of SOUND_EFFECT_NAMES) {
          const exists = await getBGM(db, sfx);
          // if (exists) console.log(`Sound Effect "${sfx}" exists in IndexedDB:`);
          if (!exists) {
            const res = await fetch(`/music/sfx/${sfx}.mp3`);

            if (!res.ok) {
              console.log(`Failed to fetch /sfx/${sfx}.mp3`);
            }
            const blob = await res.blob();
            await putBGM(db, sfx, blob);
          }
        }
      };

      const timerPromise = timerPromiseLogic(800);
      const bgmPromise = loadAllBgms();

      Promise.all([timerPromise, bgmPromise]).then(() => {
        setLoadingStates({ isBGMLoaded: true });
      });
    }
  }, [setLoadingStates, loadingStates.isBGMLoaded]);
};
