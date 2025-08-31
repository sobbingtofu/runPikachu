import { useGameStore } from '../store/gameStore';

export const useCloseBoard = () => {
  const { setGameFundamentals } = useGameStore();
  const closeBoard = () => {
    setGameFundamentals({ isBoardVisible: false });
  };

  return { closeBoard };
};
