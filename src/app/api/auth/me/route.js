// ===== BACKEND: GET /api/auth/me =====
// ดึงข้อมูล user ปัจจุบันจาก session cookie

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { INITIAL_USERS } from '@/lib/mockDatabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('session_user_id')?.value;

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          employeeId: true,
          name: true,
          email: true,
          role: true,
          department: true,
          isFirstLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (dbErr) {
      console.warn('[ME DB FALLBACK]', dbErr.message);
    }

    if (!user) {
      user = INITIAL_USERS.find((u) => u.id === userId);
    }

    if (!user) {
      // Cookie มีแต่ไม่พบ user → ลบ cookie
      cookieStore.delete('session_user_id');
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('[ME ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
