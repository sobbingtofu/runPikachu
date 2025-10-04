import { useEffect } from 'react';
import { useGameStore, RANDOM_OBSTACLE_TYPES } from '../store/gameStore';

import { timerPromiseLogic } from '../logic/timerPromise';
import { getImg, openImgDb, putImg } from '../logic/manageImgIdxDb';

export const useLoadImages = () => {
  const { loadingStates, setLoadingStates } = useGameStore();

  useEffect(() => {
    if (!loadingStates.isImgsLoaded) {
      const loadAllImgs = async () => {
        const db = await openImgDb();

        for (const obstacle of RANDOM_OBSTACLE_TYPES) {
          const exists = await getImg(db, obstacle.obstacleType);
          // if (exists) console.log(`BGM "${bgmName}" exists in IndexedDB:`);
          if (!exists) {
            const res = await fetch(
              `/assets/obstacle/${obstacle.obstacleType}.png`,
            );
            // const res = await fetch(`/music/${obstacle.obstacleType}.mp3`);
            const blob = await res.blob();
            await putImg(db, obstacle.obstacleType, blob);
          }
        }
      };

      const timerPromise = timerPromiseLogic(800);
      const imgPromise = loadAllImgs();

      Promise.all([timerPromise, imgPromise]).then(() => {
        setLoadingStates({ isImgsLoaded: true });
      });
    }
  }, [setLoadingStates, loadingStates.isImgsLoaded]);
};
