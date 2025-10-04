import { openBgmDb, getBGM } from './manageBgmIdxDb';

export async function playPauseSound(
  bgmName: string,
  actionType: 'play' | 'pause' | 'stop' | 'stopAndPlay',
  loopYN: boolean = true,
) {
  const db = await openBgmDb();
  const bgmBlob = await getBGM(db, bgmName);

  if (!bgmBlob) {
    console.error(bgmName + '가져오기 실패');
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
  } else if (actionType === 'stopAndPlay') {
    audio.pause();
    audio.currentTime = 0;
    await audio.play();
  }
}
