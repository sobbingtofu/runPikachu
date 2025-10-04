import { useGameStore } from '../../../store/gameStore';
import './GameOverScoreInfos.css';

const GameOverScoreInfos = () => {
  const { gameFundamentals, loadingStates } = useGameStore();

  return (
    <>
      <p className='my-score-text'>
        {loadingStates.isScoreRecordLoading
          ? 'Loading...'
          : `My Score: ${gameFundamentals.score}`}
      </p>

      <p className='my-score-percentile-text'>
        {loadingStates.isScorePercentileLoading
          ? 'Loading...'
          : `Top ${gameFundamentals.LastScorePercentile}% of Players`}
      </p>
    </>
  );
};

export default GameOverScoreInfos;
