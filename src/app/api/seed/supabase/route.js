import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey || supabaseUrl.includes('placeholder')) {
      return NextResponse.json({ error: 'Supabase credentials missing or invalid in .env' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();

    // Fetch all users from Prisma DB
    const users = await prisma.user.findMany();
    const formattedUsers = users.map((u) => ({
      id: u.id,
      employee_id: u.employeeId,
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department,
      tier_level: u.tierLevel,
      position_title: u.positionTitle,
      division: u.division,
      is_first_login: u.isFirstLogin,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await admin.from('users').upsert(formattedUsers, { onConflict: 'id' });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        hint: 'Please make sure to run the SQL Table Schema creation script in Supabase Dashboard SQL Editor first!',
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${formattedUsers.length} users to Supabase Cloud Database!`,
      data,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
