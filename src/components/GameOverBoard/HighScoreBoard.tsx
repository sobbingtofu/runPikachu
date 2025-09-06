import { useCloseBoard } from '../../hooks/useCloseBoard';
import { useRerunPikachu } from '../../hooks/useRerunPikachu';
import { useGameStore } from '../../store/gameStore';
import BoardButton from '../BoardButton/BoardButton';
import ButtonContainer from '../ButtonContainer/ButtonContainer';
import './HighScoreBoard.css';

const HighScoreBoard = () => {
  const { closeBoard } = useCloseBoard();
  const { gameFundamentals } = useGameStore();
  const { reRunPikachu } = useRerunPikachu();

  const handleRegister = () => {
    // TODO: 내 점수 등록하기 로직 구현
    console.log('Registering score...');
  };

  return (
    <>
      {gameFundamentals.isBoardVisible && (
        <div className='board-backdrop'>
          <div className='board-modal'>
            <button className='close-button' onClick={closeBoard}>
              &times;
            </button>
            <h1>{gameFundamentals.isGameOver && 'Game Over'}</h1>
            <h2>High Score</h2>
            <p>하이스코어 목록 표시 예정</p>
            <p>현재 점수: {gameFundamentals.score}</p>

            <ButtonContainer>
              <BoardButton type='rerun' onClick={reRunPikachu}>
                다시 달리기
              </BoardButton>
              <BoardButton type='register' onClick={handleRegister}>
                내 점수 등록하기
              </BoardButton>
            </ButtonContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default HighScoreBoard;
