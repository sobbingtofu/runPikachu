// src/components/Pikachu/Pikachu.tsx
import { useState, useEffect, useRef } from 'react';
import './Pikachu.css';
import {
  gameOverAnimationPlayingRef,
  useGameStore,
} from '../../store/gameStore';

const Pikachu = () => {
  const {
    pikachuState,
    gameFundamentals,
    setGameFundamentals,
    setPikachuState,
  } = useGameStore();
  const [frame, setFrame] = useState(0); // 달리는 피카츄 애니메이션 프레임
  const animationFrameId = useRef<number | null>(null); // requestAnimationFrame ID 저장 ref
  const lastFrameTime = useRef(0); // 마지막 프레임이 업데이트된 시간 저장 ref
  const frameDurationRun = 90; // 각 프레임이 유지될 시간 (ms)
  const frameDurationJump = 125;

  useEffect(() => {
    if (gameFundamentals.isGameStarted) {
      const animateRun = (currentTime: DOMHighResTimeStamp) => {
        const frameDuration = pikachuState.isJumping
          ? frameDurationJump
          : frameDurationRun;

        if (currentTime - lastFrameTime.current >= frameDuration) {
          setFrame((prevFrame) => (prevFrame + 1) % 4);
          lastFrameTime.current = currentTime;
        }

        // 다음 애니메이션 프레임 요청
        animationFrameId.current = requestAnimationFrame(animateRun);
      };

      // 애니메이션 루프 시작
      lastFrameTime.current = performance.now(); // 최초 시작 시간 설정
      animationFrameId.current = requestAnimationFrame(animateRun);
    }

    // 클린업 함수
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [gameFundamentals.isGameStarted]);

  useEffect(() => {
    if (gameOverAnimationPlayingRef.current) {
      setPikachuState((prev) => ({
        ...prev,
        isDead: true,
      }));
    }
  }, [gameOverAnimationPlayingRef]);

  useEffect(() => {
    if (pikachuState.isDead) {
      if (pikachuState.isDead) {
        const animationTimer = setTimeout(() => {
          // 1초 후, 게임 오버 애니메이션이 끝났음을 알립니다.
          setGameFundamentals((prev) => ({
            ...prev,
            isGameOverAnimationPlaying: false,
          }));
        }, 200); // 200ms

        // 클린업 함수: 컴포넌트가 언마운트되거나 isDead 상태가 바뀌면 타이머를 취소합니다.
        return () => {
          clearTimeout(animationTimer);
        };
      }
    }
  }, [pikachuState.isDead]);

  const pikachuClass = `pikachu pikachu-frame-${frame}
    ${pikachuState.isJumping ? 'jumping' : ''}
    ${
      (gameFundamentals.isGameOver || !gameFundamentals.isGameStarted) &&
      gameOverAnimationPlayingRef.current
        ? 'dead'
        : ''
    }
        ${
          (gameFundamentals.isGameOver || !gameFundamentals.isGameStarted) &&
          !gameOverAnimationPlayingRef.current
            ? 'stopped'
            : ''
        }`;

  return (
    <div
      className={pikachuClass}
      style={{
        bottom: `${pikachuState.pikachuValueY}px`,
        width: `${pikachuState.pikachuWidth}px`,
        height: `${pikachuState.pikachuHeight}px`,
        left: `${pikachuState.pikachuValueX}px`,
      }}
    ></div>
  );
};

export default Pikachu;
