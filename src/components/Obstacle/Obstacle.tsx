// src/components/Obstacle/Obstacle.tsx
import React, { useEffect, useRef } from 'react';
import './Obstacle.css';
import type { ObstacleType } from '../../types/ObstacleType';

// positionX를 props에서 제외합니다. 이 값은 이제 내부적으로 관리됩니다.
type ObstacleProps = Omit<ObstacleType, 'positionX'> & {
  initialPositionX: number;
};

const Obstacle: React.FC<ObstacleProps> = ({
  id,
  initialPositionX,
  positionY,
  width,
  height,
  obstacleType,
  hitboxWidth,
  hitboxHeight,
  offsetX,
  offsetY,
}) => {
  const obstacleRef = useRef<HTMLDivElement>(null);
  const obstacleClass = `obstacle ${obstacleType}`;
  // const showHitbox = true;

  useEffect(() => {
    if (obstacleRef.current) {
      // 컴포넌트가 처음 마운트될 때 초기 위치를 설정
      obstacleRef.current.style.left = `${initialPositionX}px`;
    }
  }, [initialPositionX]);

  const calcHitboxLeft = () => (width - hitboxWidth) / 2 + (offsetX || 0);
  const calcHitboxBottom = () => (height - hitboxHeight) / 2 + (offsetY || 0);

  return (
    <div
      ref={obstacleRef}
      id={id} // id를 DOM 요소에 직접 부여 >> useGameLoop에서 식별 가능
      className={obstacleClass}
      style={{
        // border: '2px solid blue',
        bottom: `${positionY}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {showHitbox && (
        <div
          style={{
            position: 'absolute',
            left: `${calcHitboxLeft()}px`,
            bottom: `${calcHitboxBottom()}px`,
            width: `${hitboxWidth}px`,
            height: `${hitboxHeight}px`,
            border: '2px solid red',
            pointerEvents: 'none',
            boxSizing: 'border-box',
          }}
        />
      )}
    </div>
  );
};

export default React.memo(Obstacle);
