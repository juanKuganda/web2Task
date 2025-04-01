import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://rbuqmnhadlqtaxfebjzj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getUserRole = async () => {
    try {
        const { data: users, error } = await supabase.from('users').select('role').single();
        if (error) {
            console.error('Error fetching user role:', error);
            return 'user'; // Default role on error
        }
        return users?.role || 'user';
    } catch (error) {
        console.error('Error fetching user role:', error);
        return 'user'; // Default role on exception
    }
};

export { supabase };
export default supabase;
