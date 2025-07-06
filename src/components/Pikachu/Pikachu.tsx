// src/components/Pikachu.tsx
import React, { useState, useEffect } from 'react';
import './Pikachu.css'; // 피카츄 스타일
import type { PikachuProps } from './PikachuType';

const Pikachu: React.FC<PikachuProps> = ({ isJumping }) => {
  const [frame, setFrame] = useState(0); // 애니메이션 프레임

  useEffect(() => {
    // 달리는 애니메이션 (isJumping 상태가 아닐 때만)
    let animationInterval: number;
    if (!isJumping) {
      animationInterval = setInterval(() => {
        setFrame((prevFrame) => (prevFrame + 1) % 4); // 2프레임 애니메이션 가정
      }, 200); // 150ms마다 프레임 변경
    }
    return () => clearInterval(animationInterval);
  }, [isJumping]);

  const pikachuClass = `pikachu pikachu-frame-${frame} ${isJumping ? 'jumping' : ''}`;

  return <div className={pikachuClass}></div>;
};

export default Pikachu;
