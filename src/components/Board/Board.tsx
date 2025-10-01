import { useCloseBoard } from '../../hooks/useCloseBoard';
import { useRerunPikachu } from '../../hooks/useRerunPikachu';
import { useGameStore } from '../../store/gameStore';
import BoardButton from '../BoardButton/BoardButton';
import ButtonContainer from '../ButtonContainer/ButtonContainer';
import NameInput from '../NameInput/NameInput';
import './Board.css';

const Board = () => {
  const { closeBoard } = useCloseBoard();
  const { gameFundamentals, setGameFundamentals, loadingStates } =
    useGameStore();

  const { reRunPikachu } = useRerunPikachu();

  const handleRegisterBtnClick = () => {
    setGameFundamentals({ isNameInputShown: true });
  };

  const exitScoreInput = () => {
    setGameFundamentals({ isNameInputShown: false });
  };

  let scoreItemCount = 0;

  return (
    <>
      {gameFundamentals.isBoardVisible && (
        <div className='board-backdrop'>
          <div className={`board-modal`}>
            <button className='close-button' onClick={closeBoard}>
              &times;
            </button>
            <h1>{gameFundamentals.isGameOver && 'Game Over'}</h1>

            <h2>High Scores</h2>
            {loadingStates.isScoreRecordLoading ? (
              <p className='my-score-text'>Loading...</p>
            ) : (
              <div className='score-list'>
                {gameFundamentals.serverScoreRecordArray.map(
                  (record, index) => {
                    if (scoreItemCount++ >= 5) return null;
                    return (
                      <div className='score-item' key={index}>
                        <span className='player-rank'>{index + 1}</span>
                        <span className='player-name'>{record.playerName}</span>
                        <span className='player-score'>{record.score}</span>
                      </div>
                    );
                  },
                )}
              </div>
            )}

            {gameFundamentals.isGameOver && (
              <p className='my-score-text'>
                {loadingStates.isScoreRecordLoading
                  ? 'Loading...'
                  : `My Score: ${gameFundamentals.score}`}
              </p>
            )}
            {gameFundamentals.isGameOver && (
              <p className='my-score-percentile-text'>
                {loadingStates.isScorePercentileLoading
                  ? 'Loading...'
                  : `Top ${gameFundamentals.LastScorePercentile}% of Players`}
              </p>
            )}

            {gameFundamentals.isGameOver &&
              gameFundamentals.isNameInputShown && <NameInput />}
            {gameFundamentals.isGameOver && (
              <ButtonContainer>
                <BoardButton
                  type='left'
                  onClick={
                    gameFundamentals.isNameInputShown
                      ? exitScoreInput
                      : reRunPikachu
                  }
                >
                  {gameFundamentals.isNameInputShown ? 'Exit' : 'Run Again'}
                </BoardButton>
                <BoardButton type='right' onClick={handleRegisterBtnClick}>
                  {gameFundamentals.isNameInputShown
                    ? 'Register!'
                    : 'Register My Score'}
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
