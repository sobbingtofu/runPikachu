// src/components/Pikachu/Pikachu.tsx
import React, { useState, useEffect, useRef } from 'react';
import './Pikachu.css';
import type { PikachuProps } from '../../types/PikachuType';

const Pikachu: React.FC<PikachuProps> = ({ isJumping, pikachuBottom }) => {
  const [frame, setFrame] = useState(0); // 애니메이션 프레임
  const animationFrameId = useRef<number | null>(null); // requestAnimationFrame ID를 저장할 ref
  const lastFrameTime = useRef(0); // 마지막 프레임이 업데이트된 시간 저장
  const frameDuration = 100; // 각 프레임이 유지될 시간 (밀리초). 이 값을 조절하여 속도 변경!

  useEffect(() => {
    // 점프 중이 아닐 때만 달리는 애니메이션 시작
    if (!isJumping) {
      const animateRun = (currentTime: DOMHighResTimeStamp) => {
        // `currentTime`은 requestAnimationFrame 콜백이 호출된 시간입니다.

        // `frameDuration`이 지나야만 프레임을 업데이트합니다.
        if (currentTime - lastFrameTime.current >= frameDuration) {
          setFrame((prevFrame) => (prevFrame + 1) % 4); // 4프레임 애니메이션 가정
          lastFrameTime.current = currentTime; // 마지막 프레임 업데이트 시간 갱신
        }

        // 다음 애니메이션 프레임 요청
        animationFrameId.current = requestAnimationFrame(animateRun);
      };

      // 애니메이션 루프 시작
      lastFrameTime.current = performance.now(); // 최초 시작 시간 설정
      animationFrameId.current = requestAnimationFrame(animateRun);
    } else {
      // isJumping이 true가 되면 (점프 중) 애니메이션 중단
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      setFrame(0); // 점프 시 첫 번째 프레임으로 고정
    }

    // 클린업 함수: 컴포넌트 언마운트 또는 isJumping 상태 변경 시 애니메이션 중단
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [isJumping]); // isJumping 상태가 변경될 때마다 useEffect 재실행

  const pikachuClass = `pikachu pikachu-frame-${frame} ${isJumping ? 'jumping' : ''}`;

  return (
    <div
      className={pikachuClass}
      style={{ bottom: `${pikachuBottom}px` }}
    ></div>
  );
};

export default Pikachu;
