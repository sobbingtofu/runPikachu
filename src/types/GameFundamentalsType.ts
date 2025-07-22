import type { ObstacleType } from './ObstacleType';

export interface GameFundamentalsType {
  isGameStarted: boolean;
  isGameOver: boolean;
  score: number;
  obstacles: ObstacleType[]; // Now reusing the Obstacle type
  pikachuValueY: number;
}
