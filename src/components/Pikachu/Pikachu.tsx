import React, { useState, useEffect } from 'react';
import './Pikachu.css';
import type { PikachuProps } from '../../types/PikachuType';

const Pikachu: React.FC<PikachuProps> = ({ isJumping }) => {
  const [frame, setFrame] = useState(0); // 애니메이션 프레임

  useEffect(() => {
    // 달리는 애니메이션 (isJumping 상태가 아닐 때만)
    let animationInterval: number;
    if (!isJumping) {
      animationInterval = setInterval(() => {
        // 지정된 시간 주기에 따라 반복 실행되는 동작 = interval을 생성
        setFrame((prevFrame) => (prevFrame + 1) % 4);
        // 4프레임 애니메이션 가정
      }, 200); // 200ms마다 프레임 변경
    }
    return () => clearInterval(animationInterval);
    // 클린업 함수
    // setInterval로 생성된 interval을 제거해 메모리 누수 방지
  }, [isJumping]);

  const pikachuClass = `pikachu pikachu-frame-${frame} ${isJumping ? 'jumping' : ''}`;

  return <div className={pikachuClass}></div>;
};

export default Pikachu;
