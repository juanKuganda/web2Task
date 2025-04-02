import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://rbuqmnhadlqtaxfebjzj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
export default supabase;
