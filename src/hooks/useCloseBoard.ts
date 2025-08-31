import { useGameStore } from '../store/gameStore';

export const useCloseBoard = () => {
  const { setGameFundamentals } = useGameStore();
  const closeBoard = () => {
    setGameFundamentals((prev) => ({ ...prev, isBoardVisible: false }));
  };

  return { closeBoard };
};
