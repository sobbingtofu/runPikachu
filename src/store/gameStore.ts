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

type SpeedPhase = { from: number; to: number; duration: number };

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
  SPEED_PHASES: SpeedPhase[];
  setSpeedPhases: (phases: SpeedPhase[]) => void;
}

export const useGameStore = create<GameState>((set) => ({
  GAME_AREA_WIDTH: 800,
  SPEED_PHASES: [
    { from: 4, to: 20, duration: 5 },
    { from: 20, to: 40, duration: 10 },
    { from: 40, to: 60, duration: 15 },
  ],
  setSpeedPhases: (phases) => set(() => ({ SPEED_PHASES: phases })),
  INITIAL_GROUND_Y_VALUE: 0,
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
