import { useCloseBoard } from '../../hooks/useCloseBoard';
import { useRerunPikachu } from '../../hooks/useRerunPikachu';
import { useGameStore } from '../../store/gameStore';
import BoardButton from '../BoardButton/BoardButton';
import ButtonContainer from '../ButtonContainer/ButtonContainer';
import './Board.css';

const Board = () => {
  const { closeBoard } = useCloseBoard();
  const { gameFundamentals } = useGameStore();
  const { reRunPikachu } = useRerunPikachu();

  const handleRegister = () => {
    // TODO: 내 점수 등록하기 로직 구현
    console.log('Registering score...');
  };

  let scoreItemCount = 0;

  return (
    <>
      {gameFundamentals.isBoardVisible && (
        <div className='board-backdrop'>
          <div className='board-modal'>
            <button className='close-button' onClick={closeBoard}>
              &times;
            </button>
            <h1>{gameFundamentals.isGameOver && 'Game Over'}</h1>
            <p className='my-score-text'>
              {gameFundamentals.isGameOver &&
                `My Score: ${gameFundamentals.score}`}
            </p>
            <h2>High Scores</h2>
            <div className='score-list'>
              {gameFundamentals.scoreArray.map((record, index) => {
                if (scoreItemCount++ >= 5) return null;
                return (
                  <div className='score-item' key={index}>
                    {index + 1}. {record.playerName} - {record.score}
                  </div>
                );
              })}
            </div>
            {gameFundamentals.isGameOver && (
              <ButtonContainer>
                <BoardButton type='rerun' onClick={reRunPikachu}>
                  Run Again
                </BoardButton>
                <BoardButton type='register' onClick={handleRegister}>
                  Register My Score
                </BoardButton>
              </ButtonContainer>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Board;
