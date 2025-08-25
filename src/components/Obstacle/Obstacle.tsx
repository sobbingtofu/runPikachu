// src/components/Obstacle/Obstacle.tsx
import React from 'react';
import './Obstacle.css';
import type { ObstacleType } from '../../types/ObstacleType';

const Obstacle: React.FC<ObstacleType> = ({
  positionX,
  positionY,
  width,
  height,
  obstacleType,
  hitboxWidth,
  hitboxHeight,
}) => {
  const obstacleClass = `obstacle ${obstacleType}`;
  const showHitbox = false; // 디버깅용
  return (
    <div
      className={obstacleClass}
      style={{
        left: `${positionX}px`,
        bottom: `${positionY}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {showHitbox && (
        <div
          style={{
            position: 'absolute',
            left: `${(width - (hitboxWidth ?? width)) / 2}px`,
            bottom: `${(height - (hitboxHeight ?? height)) / 2}px`,
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

export default Obstacle;
