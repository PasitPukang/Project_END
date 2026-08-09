// ===== BACKEND: POST /api/auth/logout =====
// ลบ session cookies ทั้งหมด

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session_user_id');
    cookieStore.delete('pending_user_id');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[LOGOUT ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}
