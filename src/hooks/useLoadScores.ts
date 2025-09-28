import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { supabase } from '../../supabaseClient';

export const useLoadScores = () => {
  const {
    gameFundamentals,
    setGameFundamentals,
    setLoadingStates: setIsLoading,
  } = useGameStore();

  const fetchData = async () => {
    if (!gameFundamentals.isScoreLoaded) {
      try {
        setIsLoading((prev) => ({ ...prev, isScoreRecordLoading: true }));
        const { data, error } = await supabase
          .from('TB_RECORD_MASTER')
          .select('*')
          .order('score', { ascending: false });

        if (error) {
          throw error;
        } else if (data.length === 0) {
          console.log('데이터가 없습니다.');
        } else {
          setIsLoading((prev) => ({ ...prev, isScoreRecordLoading: false }));
          setGameFundamentals((prev) => ({
            ...prev,
            isScoreLoaded: true,
            serverScoreRecordArray: data || [],
          }));
          console.log('점수 데이터 호출 완료:', data);
        }
      } catch (error) {
        setGameFundamentals((prev) => ({
          ...prev,
          isScoreLoaded: false,
          serverScoreRecordArray: [],
        }));
        console.error('점수 데이터 가져오는 중 오류 발생:', error);
      } finally {
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
};
