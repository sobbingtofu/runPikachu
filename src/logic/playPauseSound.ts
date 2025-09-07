import { openDB, getBGM } from './manageBgmIdxDb';

export async function playPauseSound(
  bgmName: string,
  actionType: 'play' | 'pause' | 'stop',
  loopYN: boolean = true,
) {
  const db = await openDB();
  const bgmBlob = await getBGM(db, bgmName);

  if (!bgmBlob) {
    // console.log(bgmName + '이 존재안함');
    return;
  }

  let audio = document.getElementById(
    'bgm-' + bgmName,
  ) as HTMLAudioElement | null;
  if (!audio) {
    audio = document.createElement('audio');
    audio.id = 'bgm-' + bgmName;
    audio.src = URL.createObjectURL(bgmBlob);
    audio.loop = loopYN;
    audio.volume = 0.3;
    document.body.appendChild(audio);
  }

  if (actionType === 'play') {
    await audio.play();
  } else if (actionType === 'pause') {
    audio.pause();
  } else if (actionType === 'stop') {
    audio.pause();
    audio.currentTime = 0;
  }
}
