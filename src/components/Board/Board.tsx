import { useCloseBoard } from '../../hooks/useCloseBoard';
import { useLoadScores } from '../../hooks/useLoadScores';
import { useRerunPikachu } from '../../hooks/useRerunPikachu';
import { registerScore } from '../../logic/supbaseLogics';
import { timerPromiseLogic } from '../../logic/timerPromise';
import { useGameStore } from '../../store/gameStore';
import BoardButton from './BoardButton/BoardButton';
import ButtonContainer from './BoardButtonContainer/BoardButtonContainer';
import NameInput from '../NameInput/NameInput';
import './Board.css';
import GameOverScoreInfos from './GameOverInfos/GameOverScoreInfos';
import ScoreRegisterInfoTxt from './ScoreRegisterInfoTxt/ScoreRegisterInfoTxt';

const Board = () => {
  const { closeBoard } = useCloseBoard();
  const {
    gameFundamentals,
    setGameFundamentals,
    loadingStates,
    setLoadingStates,
  } = useGameStore();

  const { loadScores } = useLoadScores(false);

  const { reRunPikachu } = useRerunPikachu();

  const handleRegisterBtnClick01 = () => {
    setGameFundamentals({ isNameInputShown: true });
  };

  const exitScoreInput = () => {
    setGameFundamentals({ isNameInputShown: false });
  };

  const handleRegisterBtnClick02 = () => {
    if (gameFundamentals.currentNameInput.length === 0) {
      alert('Please enter your name.');
      return;
    }

    setLoadingStates({ isScoreRegisterLoading: true });

    const timerPromise = timerPromiseLogic(800);

    Promise.all([
      timerPromise,
      registerScore(gameFundamentals.currentNameInput, gameFundamentals.score),
    ]).then(() => {
      setGameFundamentals({
        isNameInputShown: false,
        isCurrentScoreRegistered: true,
      });
      setLoadingStates({ isScoreRegisterLoading: false });
      loadScores();
    });
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
                    if (scoreItemCount++ >= 7) return null;
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
              <>
                <GameOverScoreInfos />

                <ScoreRegisterInfoTxt />

                {gameFundamentals.isNameInputShown && <NameInput />}

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
                  {(!gameFundamentals.isCurrentScoreRegistered ||
                    loadingStates.isScoreRegisterLoading) && (
                    <BoardButton
                      type='right'
                      onClick={
                        !gameFundamentals.isNameInputShown
                          ? handleRegisterBtnClick01
                          : handleRegisterBtnClick02
                      }
                    >
                      {gameFundamentals.isNameInputShown
                        ? 'Register!'
                        : 'Register My Score'}
                    </BoardButton>
                  )}
                </ButtonContainer>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Board;
