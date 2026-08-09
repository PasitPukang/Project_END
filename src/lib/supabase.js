import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Client for Frontend & Public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin Client for Server-Side API Routes (Bypasses RLS)
export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Sync user profile to Supabase 'users' table
 */
export async function syncUserToSupabase(userData) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      console.log('ℹ️ [Supabase] Skipping remote sync (Placeholder keys in use)');
      return { success: true, isMock: true };
    }
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.from('users').upsert({
      id: userData.id,
      employee_id: userData.employeeId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      updated_at: new Date().toISOString()
    });

    if (error) {
      console.warn('⚠️ [Supabase Sync Warning]:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.error('❌ [Supabase Sync Error]:', err.message);
    return { success: false, error: err.message };
  }
}
