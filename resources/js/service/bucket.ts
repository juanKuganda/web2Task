import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://rbuqmnhadlqtaxfebjzj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY; 

const supabase = createClient(supabaseUrl, supabaseAnonKey);

let userRole = "guest"; // Default role

(async () => {
  let { data: users } = await supabase.from('users').select('role').single();
  userRole = users?.role || "guest";
})();

export { supabase, userRole };
export default supabase;
