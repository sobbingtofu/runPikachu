import { useCloseBoard } from '../../hooks/useCloseBoard';
import { useGameStore } from '../../store/gameStore';
import './HighScoreBoard.css';

const HighScoreBoard = () => {
  const { closeBoard } = useCloseBoard();
  const { gameFundamentals } = useGameStore();
  return (
    <div className='board-backdrop'>
      <div className='board-modal'>
        <button className='close-button' onClick={closeBoard}>
          &times;
        </button>
        <h1>{gameFundamentals.isGameOver && 'Game Over'}</h1>
        <h2>High Score</h2>
        <p>하이스코어 목록 표시 예정</p>
        <p>현재 점수: {gameFundamentals.score}</p>
        <div className='button-container'>
          <button className='rerun button' onClick={closeBoard}>
            다시 달리기
          </button>
          <button className='register button' onClick={() => {}}>
            내 점수 등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighScoreBoard;
