// ===== BACKEND: POST /api/auth/password/change =====
// เปลี่ยนรหัสผ่านครั้งแรก (isFirstLogin = true → false)

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const userId = cookieStore.get('session_user_id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'กรุณา login ก่อน' }, { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: newPassword, // NOTE: Production ควรใช้ bcrypt
        isFirstLogin: false,
      },
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

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('[CHANGE PASSWORD ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
