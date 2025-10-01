import { supabase } from '../../supabaseClient';

export const fetchSupabaseScores = async () => {
  const { data, error } = await supabase
    .from('TB_RECORD_MASTER')
    .select('*')
    .order('score', { ascending: false });

  return { data, error };
};

export const registerScore = async (name: String, score: Number) => {
  const { data, error } = await supabase
    .from('TB_RECORD_MASTER')
    .insert([{ playerName: name, score: score }])
    .select();

  if (error) {
    console.error('Error inserting score:', error);
    return;
  } else {
    console.log('Score inserted successfully:', data);
  }
};
