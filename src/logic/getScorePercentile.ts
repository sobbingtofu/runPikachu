import { supabase } from '../../supabaseClient';

export const getScorePercentile = async (score: number) => {
  const { data, error } = await supabase.rpc('get_score_percentile', {
    scoreparam: score,
  });
  if (error) console.error(error);
  else return data;
};
