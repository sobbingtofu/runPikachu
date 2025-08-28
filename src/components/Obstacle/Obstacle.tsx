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
  offsetX,
  offsetY,
}) => {
  const obstacleClass = `obstacle ${obstacleType}`;
  const showHitbox = true; // 디버깅용
  const calcHitboxLeft = () => (width - hitboxWidth) / 2 + (offsetX || 0);
  const calcHitboxBottom = () => (height - hitboxHeight) / 2 + (offsetY || 0);
  return (
    <div
      className={obstacleClass}
      style={{
        left: `${positionX}px`,
        bottom: `${positionY}px`,
        width: `${width}px`,
        height: `${height}px`,
        border: '2px solid blue',
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

export default Obstacle;
