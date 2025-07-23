import { create } from 'zustand';

type GameFundamentalsType = {
  isGameStarted: boolean;
  isGameOver: boolean;
  score: number;
  obstacles: any[];
  pikachuValueY: number;
};

type PikachuType = {
  isJumping: boolean;
};

interface GameState {
  GAME_AREA_WIDTH: number;
  INITIAL_GROUND_Y_VALUE: number;
  gameFundamentals: GameFundamentalsType;
  setGameFundamentals: (update: Partial<GameFundamentalsType>) => void;
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
    pikachuValueY: 0,
  },
  setGameFundamentals: (update) =>
    set((state) => ({
      gameFundamentals: { ...state.gameFundamentals, ...update },
    })),
  pikachuState: {
    isJumping: false,
  },
  setPikachuState: (update) =>
    set((state) => ({
      pikachuState: { ...state.pikachuState, ...update },
    })),
}));
