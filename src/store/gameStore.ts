import { create } from 'zustand';
import type { ObstacleType } from '../types/ObstacleType';
import { getResponsiveSizeParams } from '../logic/getResponsiveSizeParams';

type GameFundamentalsType = {
  isGameStarted: boolean;
  isGameOver: boolean;
  score: number;
  obstacles: ObstacleType[];
  isGameOverAnimationPlaying: boolean;
  isBoardVisible: boolean;
  isSoundOn: boolean;
  isBGMLoaded: boolean;
  isPreGameScreen: boolean;
};

export type sizeParamsType = {
  gameAreaWidth: number;
  gameAreaHeight: number;
};

export type PikachuType = {
  pikachuWidth: number;
  pikachuHeight: number;
  isJumping: boolean;
  isDead: boolean;
  pikachuValueY: number;
  pikachuValueX: number;
  jumpTrigger: number;
  maxJumpHeight: number;
};

interface GameState {
  sizeParams: sizeParamsType;
  setSizeParams: (
    update:
      | Partial<sizeParamsType>
      | ((prev: sizeParamsType) => sizeParamsType),
  ) => void;
  gameFundamentals: GameFundamentalsType;
  setGameFundamentals: (
    update:
      | Partial<GameFundamentalsType>
      | ((prev: GameFundamentalsType) => GameFundamentalsType),
  ) => void;
  pikachuState: PikachuType;
  setPikachuState: (
    update: Partial<PikachuType> | ((prev: PikachuType) => PikachuType),
  ) => void;
}

export const initialSizeParams = {
  GAME_AREA_INIT_WIDTH: 1000,
  GAME_AREA_INIT_HEIGHT: 450,
  PIKACHU_INIT_WIDTH: 80,
  PIKACHU_INIT_HEIGHT: 53,
  PIKACHU_INIT_JUMP_HEIGHT: 170,
};

export const useGameStore = create<GameState>((set) => ({
  sizeParams: {
    gameAreaWidth: getResponsiveSizeParams(
      initialSizeParams.GAME_AREA_INIT_WIDTH,
    ),
    gameAreaHeight: getResponsiveSizeParams(
      initialSizeParams.GAME_AREA_INIT_HEIGHT,
    ),
  },

  setSizeParams: (update) =>
    set((state) => {
      const prev = state.sizeParams;
      const next =
        typeof update === 'function' ? update(prev) : { ...prev, ...update };
      return { sizeParams: next };
    }),

  gameFundamentals: {
    isGameStarted: false,
    isGameOver: false,
    score: 0,
    obstacles: [],
    isGameOverAnimationPlaying: false,
    isBoardVisible: false,
    isSoundOn: false,
    isBGMLoaded: false,
    isPreGameScreen: true,
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
    pikachuValueX: 50,
    isJumping: false,
    isDead: false,
    pikachuWidth: getResponsiveSizeParams(initialSizeParams.PIKACHU_INIT_WIDTH),
    pikachuHeight: getResponsiveSizeParams(
      initialSizeParams.PIKACHU_INIT_HEIGHT,
    ),
    jumpTrigger: 0,
    maxJumpHeight: getResponsiveSizeParams(
      initialSizeParams.PIKACHU_INIT_JUMP_HEIGHT,
    ),
  },

  setPikachuState: (update) =>
    set((state) => ({
      pikachuState: { ...state.pikachuState, ...update },
    })),
}));

export const obstaclePositions = {
  current: new Map<string, number>(),
};

export const jumpAnimationFrameIdRef = { current: null as number | null };
export const currentPikachuYRef = { current: 0 };
export const canJumpRef = { current: false };
export const isSpacePressedRef = { current: false };
export const isFastFallingRef = { current: false };
export const elapsedTimeRef = { current: 0 };

export const jumpCountRef = { current: 0 };

export const GAME_AREA_WIDTH = 1000;
export const INITIAL_GROUND_Y_VALUE = 0;
export const TARGET_FPS = 120;

export const BGM_NAMES: string[] = [
  '01-PalletTown',
  '02-LakeValor',
  '91-Collide',
  '92-GameOver',
];

export const OBSTACLE_SPEED_PHASES = [
  { start: 0, end: 5000, obstacleSpeed: 5 },
  { start: 5000, end: 7500, obstacleSpeed: 6 },
  { start: 7500, end: 10000, obstacleSpeed: 7 },
  { start: 10000, end: 12500, obstacleSpeed: 8 },
  { start: 12500, end: 15000, obstacleSpeed: 9 },
  { start: 15000, end: 17500, obstacleSpeed: 11 },
  { start: 17500, end: 20000, obstacleSpeed: 12 },
  { start: 20000, end: 22500, obstacleSpeed: 14 },
  { start: 22500, end: 25000, obstacleSpeed: 16 },
  { start: 25000, end: 27500, obstacleSpeed: 18 },
  { start: 27500, end: 100000, obstacleSpeed: 20 },
  { start: 100000, end: Infinity, obstacleSpeed: 23 },
];

export const OBSTACLE_GEN_INTERVAL_PHASES = [
  { start: 0, end: 5000, min: 800, max: 1300 },
  { start: 5000, end: 7500, min: 800, max: 1300 },
  { start: 7500, end: 10000, min: 700, max: 1200 },
  { start: 10000, end: 12500, min: 700, max: 1200 },
  { start: 12500, end: 15000, min: 700, max: 1000 },
  { start: 15000, end: 17500, min: 600, max: 1000 },
  { start: 17500, end: 20000, min: 600, max: 900 },
  { start: 20000, end: 22500, min: 600, max: 900 },
  { start: 22500, end: 25000, min: 600, max: 800 },
  { start: 25000, end: 27500, min: 500, max: 800 },
  { start: 27500, end: Infinity, min: 450, max: 700 },
];

export const RANDOM_OBSTACLE_TYPES = [
  {
    obstacleType: 'diglett01',
    width: 50,
    height: 43,
    weight: 5,
    positionY: 0,
    hitboxWidth: 20,
    hitboxHeight: 38,
    offsetX: -6,
    offsetY: -3,
  },
  {
    obstacleType: 'alolanExeggutor',
    width: 100,
    height: 100,
    weight: 2,
    positionY: 0,
    hitboxWidth: 75,
    hitboxHeight: 85,
    offsetX: -3,
    offsetY: 0,
  },
  // { obstacleType: 'C', width: 60, height: 100, weight: 2, positionY: 0 },
  // { obstacleType: 'D', width: 20, height: 100, weight: 5, positionY: 0 },
  // { obstacleType: 'E', width: 60, height: 160, weight: 1, positionY: 0 },
  // { obstacleType: 'F', width: 20, height: 160, weight: 2, positionY: 0 },
  // { obstacleType: 'X', width: 100, height: 300, weight: 4, positionY: 60 },
  // { obstacleType: 'Y', width: 150, height: 500, weight: 1, positionY: 60 },
  // { obstacleType: 'Z', width: 80, height: 60, weight: 3, positionY: 60 },
];

export const JUMP_PARAMS_PHASES = [
  {
    start: 0,
    end: 12500,
    gravity: 1.1,
    fastFallGravity: 2.8,
  },
  {
    start: 12500,
    end: 22500,
    gravity: 1.3,
    fastFallGravity: 2.9,
  },
  {
    start: 22500,
    end: Infinity,
    gravity: 1.6,
    fastFallGravity: 3.2,
  },
];
