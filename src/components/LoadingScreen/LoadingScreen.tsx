import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const { gameFundamentals } = useGameStore();

  // ...existing hooks...

  // ▼▼▼ 로딩 점 애니메이션 상태 추가 ▼▼▼
  const [loadingDots, setLoadingDots] = useState('');

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 4; // 0,1,2,3 반복
      setLoadingDots('.'.repeat(count));
    }, 160);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {!gameFundamentals.isBGMLoaded && (
        <>
          <h1>Pikachu is on its way{loadingDots}</h1>
        </>
      )}
    </>
  );
};

export default LoadingScreen;
