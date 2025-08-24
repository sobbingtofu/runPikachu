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
}) => {
  return (
    <div
      className='obstacle'
      style={{
        left: `${positionX}px`,
        bottom: `${positionY}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {obstacleType}
    </div>
  );
};

export default Obstacle;
