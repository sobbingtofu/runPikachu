import { create } from 'zustand';
import type { ObstacleType } from '../types/ObstacleType';

type GameFundamentalsType = {
  isGameStarted: boolean;
  isGameOver: boolean;
  score: number;
  obstacles: ObstacleType[];
  elapsedTime?: number; // ms 단위
};

type PikachuType = {
  pikachuWidth?: number;
  pikachuHeight?: number;
  isJumping: boolean;
  pikachuValueY: number;
  pikachuValueX: number;
};

interface GameState {
  gameFundamentals: GameFundamentalsType;
  setGameFundamentals: (
    update:
      | Partial<GameFundamentalsType>
      | ((prev: GameFundamentalsType) => GameFundamentalsType),
  ) => void;
  pikachuState: PikachuType;
  setPikachuState: (update: Partial<PikachuType>) => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameFundamentals: {
    isGameStarted: false,
    isGameOver: false,
    score: 0,
    obstacles: [],
    elapsedTime: 0, // ms 단위
  },

  setGameFundamentals: (update) =>
    set((state) => {
      const prev = state.gameFundamentals;
      const next =
        typeof update === 'function' ? update(prev) : { ...prev, ...update };
      return { gameFundamentals: next };
    }),

  pikachuState: {
    pikachuValueY: 0,
    pikachuValueX: 50, // 기본값
    isJumping: false,
    pikachuWidth: 80, // 기본값
    pikachuHeight: 53, // 기본값
  },
  setPikachuState: (update) =>
    set((state) => ({
      pikachuState: { ...state.pikachuState, ...update },
    })),
}));

export const jumpAnimationFrameIdRef = { current: null as number | null };
export const currentPikachuYRef = { current: 0 };
export const canJumpRef = { current: false };
export const isSpacePressedRef = { current: false };
export const isFastFallingRef = { current: false };
export const elapsedTimeRef = { current: 0 };

export const GAME_AREA_WIDTH = 800;
export const INITIAL_GROUND_Y_VALUE = 0;

export const OBSTACLE_PHASES = [
  { start: 0, end: 5000, obstacleSpeed: 5 },
  { start: 5000, end: 7500, obstacleSpeed: 6 },
  { start: 7500, end: 10000, obstacleSpeed: 7 },
  { start: 10000, end: 12500, obstacleSpeed: 8 },
  { start: 12500, end: 15000, obstacleSpeed: 9 },
  { start: 15000, end: 17500, obstacleSpeed: 10 },
  { start: 17500, end: 20000, obstacleSpeed: 12 },
  { start: 20000, end: 22500, obstacleSpeed: 14 },
  { start: 22500, end: 25000, obstacleSpeed: 16 },
  { start: 25000, end: 27500, obstacleSpeed: 18 },
  { start: 27500, end: Infinity, obstacleSpeed: 22 },
];

export const RANDOM_OBSTACLES = [
  { obstacleType: 'A', width: 20, height: 40, weight: 5 }, // default
  { obstacleType: 'B', width: 40, height: 120, weight: 2 },
  { obstacleType: 'C', width: 60, height: 40, weight: 2 },
  { obstacleType: 'D', width: 20, height: 120, weight: 4 },
];
