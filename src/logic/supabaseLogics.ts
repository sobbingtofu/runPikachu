import { supabase } from '../../supabaseClient';
import { ITEMS_PER_BOARD_PAGE } from '../store/gameStore';

export const fetchSupabaseScores = async () => {
  const { data, error } = await supabase
    .from('TB_RECORD_MASTER')
    .select('*')
    .order('score', { ascending: false })
    .limit(ITEMS_PER_BOARD_PAGE * 20);
  return { data, error };
};

export const registerScore = async (name: String, score: Number) => {
  const { data, error } = await supabase
    .from('TB_RECORD_MASTER')
    .insert([{ playerName: name, score: score }])
    .select();

  if (error) {
    console.error('Error inserting score:', error, 'data:', data);
    return;
  } else {
    // console.log('Score inserted successfully:', data);
  }
};
