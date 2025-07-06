import type { ObstacleType } from './ObstacleType';

export interface GameStateType {
  isGameStarted: boolean;
  isGameOver: boolean;
  isJumping: boolean;
  score: number;
  pikachuBottom: number;
  obstacles: ObstacleType[]; // Now reusing the Obstacle type
}
