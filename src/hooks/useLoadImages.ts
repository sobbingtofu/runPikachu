import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

import { timerPromiseLogic } from '../logic/timerPromise';
// import { getImg, openImgDb, putImg } from '../logic/manageImgIdxDb';

export const useLoadImages = () => {
  const { loadingStates, setLoadingStates } = useGameStore();

  // useEffect(() => {
  //   if (!loadingStates.isImgsLoaded) {
  //     const loadAllImgs = async () => {
  //       const db = await openImgDb();

  //       for (const obstacle of RANDOM_OBSTACLE_TYPES) {
  //         const exists = await getImg(db, obstacle.obstacleType);
  //         // if (exists) console.log(`BGM "${bgmName}" exists in IndexedDB:`);
  //         if (!exists) {
  //           const res = await fetch(
  //             `/assets/obstacle/${obstacle.obstacleType}.png`,
  //           );
  //           // const res = await fetch(`/music/${obstacle.obstacleType}.mp3`);
  //           const blob = await res.blob();
  //           await putImg(db, obstacle.obstacleType, blob);
  //         }
  //       }

  //       const tempArr = ['0', '1', '2', '3', 'dead', 'stop'];
  //       for (const item of tempArr) {
  //         const exists = await getImg(db, 'runkachu-' + item);
  //         // if (exists) console.log(`BGM "${bgmName}" exists in IndexedDB:`);
  //         if (!exists) {
  //           const res = await fetch(`/assets/runkachu-${item}.png`);
  //           // const res = await fetch(`/music/${obstacle.obstacleType}.mp3`);
  //           const blob = await res.blob();
  //           await putImg(db, 'runkachu-' + item, blob);
  //         }
  //       }
  //     };

  //     const timerPromise = timerPromiseLogic(800);
  //     const imgPromise = loadAllImgs();

  //     Promise.all([timerPromise, imgPromise]).then(() => {
  //       setLoadingStates({ isImgsLoaded: true });
  //     });
  //   }
  // }, [setLoadingStates, loadingStates.isImgsLoaded]);

  useEffect(() => {
    if (!loadingStates.isImgsLoaded) {
      const preLoadImages = async () => {
        const obstacleImages = [
          '/assets/obstacles/diglett01.png',
          '/assets/obstacles/alolanExeggutor01.png',
          '/assets/obstacles/ABOMASNOW.png',
          '/assets/obstacles/AERODACTYL.png',
          '/assets/obstacles/XATU.png',
          '/assets/obstacles/SLOWPOKE.png',
          '/assets/obstacles/bird01.png',
          '/assets/obstacles/DRIFBLIM.png',
          '/assets/obstacles/OCTILLERY.png',
          '/assets/obstacles/GYARADOS.png',
          '/assets/runkachu-0.png',
          '/assets/runkachu-1.png',
          '/assets/runkachu-2.png',
          '/assets/runkachu-3.png',
          '/assets/runkachu-dead.png',
          '/assets/runkachu-stop.png',
          '/assets/bg/bg-12.png',
          '/assets/pixelButtons/arrowDown-black.png',
          '/assets/pixelButtons/enter-black.png.png',
          '/assets/pixelButtons/sound-off.png',
          '/assets/pixelButtons/sound-on.png',
          '/assets/pixelButtons/spacebar-black.png',
        ];

        obstacleImages.forEach((src) => {
          const img = new Image();
          img.src = src;
        });
      };

      const timerPromise = timerPromiseLogic(800);

      const preLoadImagesPromise = preLoadImages();

      Promise.all([timerPromise, preLoadImagesPromise]).then(() => {
        setLoadingStates({ isImgsLoaded: true });
      });
    }
  }, []);
};
