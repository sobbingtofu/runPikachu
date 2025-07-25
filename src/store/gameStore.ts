import { create } from 'zustand';
import type { ObstacleType } from '../types/ObstacleType';

type GameFundamentalsType = {
  isGameStarted: boolean;
  isGameOver: boolean;
  score: number;
  obstacles: ObstacleType[];
};

type PikachuType = {
  pikachuWidth?: number;
  pikachuHeight?: number;
  isJumping: boolean;
  pikachuValueY: number;
  pikachuValueX: number;
};

interface GameState {
  GAME_AREA_WIDTH: number;
  INITIAL_GROUND_Y_VALUE: number;
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
  GAME_AREA_WIDTH: 800,
  INITIAL_GROUND_Y_VALUE: 0,
  gameFundamentals: {
    isGameStarted: false,
    isGameOver: false,
    score: 0,
    obstacles: [],
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
