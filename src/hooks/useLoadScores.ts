import { fetchSupabaseScores } from '../logic/supabaseLogics';
import { useGameStore } from '../store/gameStore';

export const useLoadScores = (reloadYN: boolean) => {
  const { setGameFundamentals, setLoadingStates } = useGameStore();
  const loadScores = async () => {
    if (reloadYN) {
      setLoadingStates({ isScoreRecordLoading: true });
    }
    const fetchResult = await fetchSupabaseScores();

    if (fetchResult?.error) {
      setGameFundamentals((prev) => ({
        ...prev,
        isScoreLoaded: false,
        serverScoreRecordArray: [],
      }));
      if (reloadYN) {
        setLoadingStates({ isScoreRecordLoading: false });
      }
      console.error('점수 데이터 가져오는 중 오류 발생:', fetchResult.error);
    } else if (fetchResult?.data) {
      setGameFundamentals((prev) => ({
        ...prev,
        serverScoreRecordArray: fetchResult.data || [],
      }));
      if (reloadYN) {
        setLoadingStates({ isScoreRecordLoading: false });
      }
    }
  };
  return { loadScores };
};
