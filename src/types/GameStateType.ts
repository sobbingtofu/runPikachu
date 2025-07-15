import type { ObstacleType } from './ObstacleType';

export interface GameStateType {
  isGameStarted: boolean;
  isGameOver: boolean;
  isJumping: boolean;
  score: number;
  obstacles: ObstacleType[]; // Now reusing the Obstacle type
  pikachuBottom: number;
}
