// src/components/Pikachu/Pikachu.tsx
import { useState, useEffect, useRef } from 'react';
import './Pikachu.css';
import { useGameStore } from '../../store/gameStore';
import { getPikachuHitbox } from '../../logic/collisionDetectionLogic';

const Pikachu = () => {
  const { pikachuState, gameFundamentals } = useGameStore();
  const [frame, setFrame] = useState(0); // 달리는 피카츄 애니메이션 프레임
  const animationFrameId = useRef<number | null>(null); // requestAnimationFrame ID 저장 ref
  const lastFrameTime = useRef(0); // 마지막 프레임이 업데이트된 시간 저장 ref
  const frameDurationRun = 90; // 각 프레임이 유지될 시간 (ms)
  const frameDurationJump = 125;

  const showHitbox = true;
  const hitbox = getPikachuHitbox(pikachuState);
  const hitboxStyle = {
    position: 'absolute' as const,
    left: `${hitbox.x - pikachuState.pikachuValueX}px`, // (절대 X 위치) - (부모의 X 위치)
    bottom: `${hitbox.y - pikachuState.pikachuValueY}px`, // (절대 Y 위치) - (부모의 Y 위치)
    width: `${hitbox.width}px`,
    height: `${hitbox.height}px`,
    border: '2px solid green',
  };

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

  const pikachuClass = `pikachu 
    ${
      pikachuState.isJumping
        ? 'jumping'
        : ` pikachu-frame-${frame}
        ${
          (gameFundamentals.isGameOver || !gameFundamentals.isGameStarted) &&
          pikachuState.isDead
            ? 'dead'
            : ''
        }
        ${
          (gameFundamentals.isGameOver || !gameFundamentals.isGameStarted) &&
          !pikachuState.isDead
            ? 'stopped'
            : ''
        }`
    }
  `;

  return (
    <div
      className={pikachuClass}
      style={{
        bottom: `${pikachuState.pikachuValueY}px`,
        width: `${pikachuState.pikachuWidth}px`,
        height: `${pikachuState.pikachuHeight}px`,
        left: `${pikachuState.pikachuValueX}px`,
      }}
    >
      {showHitbox && <div style={hitboxStyle} />}
    </div>
  );
};

export default Pikachu;
