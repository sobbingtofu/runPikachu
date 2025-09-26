import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { supabase } from '../../supabaseClient';

export const useLoadScores = () => {
  const { gameFundamentals, setGameFundamentals } = useGameStore();

  const fetchData = async () => {
    if (!gameFundamentals.isScoreLoaded) {
      try {
        const { data, error } = await supabase
          .from('TB_RECORD_MASTER')
          .select('*')
          .order('score', { ascending: false });

        if (error) {
          throw error;
        } else if (data.length === 0) {
          console.log('데이터가 없습니다.');
        } else {
          setGameFundamentals((prev) => ({
            ...prev,
            isScoreLoaded: true,
            scoreArray: data || [],
          }));
          console.log('점수 데이터 호출 완료:', data);
        }
      } catch (error) {
        setGameFundamentals((prev) => ({
          ...prev,
          isScoreLoaded: false,
          scoreArray: [],
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
