import { useGameStore } from '../../../store/gameStore';
import './BoardNavigation.css';

const BoardNavigation = () => {
  const { gameFundamentals, setGameFundamentals } = useGameStore();
  const moveToPreviousPage = () => {
    if (gameFundamentals.currentBoardPage > 1) {
      setGameFundamentals((prev) => ({
        ...prev,
        currentBoardPage: prev.currentBoardPage - 1,
      }));
    }
  };

  const moveToNextPage = () => {
    if (
      gameFundamentals.currentBoardPage <
      gameFundamentals.serverScoreRecordArray.length / 7
    ) {
      setGameFundamentals((prev) => ({
        ...prev,
        currentBoardPage: prev.currentBoardPage + 1,
      }));
    }
  };

  const moveToFirstPage = () => {
    setGameFundamentals((prev) => ({
      ...prev,
      currentBoardPage: 1,
    }));
  };

  const moveToLastPage = () => {
    setGameFundamentals((prev) => ({
      ...prev,
      currentBoardPage: Math.ceil(prev.serverScoreRecordArray.length / 7),
    }));
  };

  return (
    <div className='board-navi-container'>
      <h3 className='navi-buttons' onClick={moveToFirstPage}>
        {'<<<'}
      </h3>
      <h3 className='navi-buttons' onClick={moveToPreviousPage}>
        {'<'}
      </h3>
      <h2 className='navi-header'>High Scores</h2>
      <h3 className='navi-buttons' onClick={moveToNextPage}>
        {'>'}
      </h3>
      <h3 className='navi-buttons' onClick={moveToLastPage}>
        {'>>>'}
      </h3>
    </div>
  );
};

export default BoardNavigation;
