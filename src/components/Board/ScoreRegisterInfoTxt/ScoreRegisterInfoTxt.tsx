import { useGameStore } from '../../../store/gameStore';
import './ScoreRegisterInfoTxt.css';

const ScoreRegisterInfoTxt = () => {
  const { gameFundamentals, loadingStates } = useGameStore();

  return (
    <>
      {loadingStates.isScoreRegisterLoading ? (
        <p className='score-register-text registering'>Score Registering...</p>
      ) : gameFundamentals.isCurrentScoreRegistered ? (
        <p className='score-register-text registered'>Score Registered!</p>
      ) : (
        <></>
      )}
    </>
  );
};

export default ScoreRegisterInfoTxt;
