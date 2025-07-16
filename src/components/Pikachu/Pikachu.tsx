// src/components/Pikachu/Pikachu.tsx
import React, { useState, useEffect, useRef } from 'react';
import './Pikachu.css';
import type { PikachuProps } from '../../types/PikachuType';

const Pikachu: React.FC<PikachuProps> = ({ isJumping, pikachuBottom }) => {
  const [frame, setFrame] = useState(0); // 달리는 피카츄 애니메이션 프레임
  const animationFrameId = useRef<number | null>(null); // requestAnimationFrame ID 저장 ref
  const lastFrameTime = useRef(0); // 마지막 프레임이 업데이트된 시간 저장 ref
  const frameDurationRun = 90; // 각 프레임이 유지될 시간 (ms)
  const frameDurationJump = 125;

  // 최초렌더링 + isJumping 상태가 변경될 때마다 useEffect 재실행
  useEffect(() => {
    const animateRun = (currentTime: DOMHighResTimeStamp) => {
      const frameDuration = isJumping ? frameDurationJump : frameDurationRun;

      if (currentTime - lastFrameTime.current >= frameDuration) {
        setFrame((prevFrame) => (prevFrame + 1) % 4); // 4프레임 애니메이션
        lastFrameTime.current = currentTime; // 마지막 프레임 업데이트 시간 갱신
      }

      // 다음 애니메이션 프레임 요청
      animationFrameId.current = requestAnimationFrame(animateRun);
    };

    // 애니메이션 루프 시작
    lastFrameTime.current = performance.now(); // 최초 시작 시간 설정
    animationFrameId.current = requestAnimationFrame(animateRun);

    // 클린업 함수
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [isJumping]);

  const pikachuClass = `pikachu pikachu-frame-${frame} ${isJumping ? 'jumping' : ''}`;

  return (
    <div
      className={pikachuClass}
      style={{ bottom: `${pikachuBottom}px` }}
    ></div>
  );
};

export default Pikachu;
