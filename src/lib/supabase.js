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
      persistSession: false,
    },
  });
}

/**
 * Synchronize User Identity to Supabase Auth (Cloud Authentication Store)
 * Stores ONLY minimal identity: email, password, role metadata
 * Confidential data (documents, personal records) stays strictly on Local PostgreSQL
 */
export async function syncUserToSupabaseAuth(userData) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      return { success: true, isMock: true, authUserId: null };
    }

    const admin = getSupabaseAdmin();
    
    // Check if user already exists in Supabase Auth
    const { data: userList, error: listError } = await admin.auth.admin.listUsers();
    let existingAuthUser = null;
    if (!listError && userList?.users) {
      existingAuthUser = userList.users.find(
        (u) => u.email?.toLowerCase() === userData.email?.toLowerCase()
      );
    }

    let authUserId = null;

    if (existingAuthUser) {
      authUserId = existingAuthUser.id;
      // Update password & user_metadata
      const { error: updateError } = await admin.auth.admin.updateUserById(authUserId, {
        password: userData.password,
        user_metadata: {
          employeeId: userData.employeeId,
          role: userData.role,
          name: userData.name,
        },
      });
      if (updateError) {
        console.warn(`[Supabase Auth Update Warning] (${userData.email}):`, updateError.message);
      }
    } else {
      // Create new user in Supabase Auth
      const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          employeeId: userData.employeeId,
          role: userData.role,
          name: userData.name,
        },
      });

      if (createError) {
        console.warn(`[Supabase Auth Create Warning] (${userData.email}):`, createError.message);
      } else if (newUser?.user) {
        authUserId = newUser.user.id;
      }
    }

    return { success: true, authUserId };
  } catch (err) {
    console.error('❌ [Supabase Auth Sync Error]:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Verify a Supabase JWT Access Token from Client Request
 */
export async function verifySupabaseToken(accessToken) {
  try {
    if (!accessToken) return null;
    const admin = getSupabaseAdmin();
    const { data: { user }, error } = await admin.auth.getUser(accessToken);
    if (error || !user) return null;
    return user;
  } catch (err) {
    console.error('❌ [Supabase Token Verify Error]:', err.message);
    return null;
  }
}
