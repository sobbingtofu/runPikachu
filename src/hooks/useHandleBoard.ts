import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export const useHandleBoard = () => {
  const { gameFundamentals } = useGameStore();
  useEffect(() => {
    if (gameFundamentals.isBoardVisible) {
      // 게임 보드가 보일 때 실행되는 로직
    }
  }, [gameFundamentals.isBoardVisible]);
};
