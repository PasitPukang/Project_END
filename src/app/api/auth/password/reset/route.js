// ===== BACKEND: POST /api/auth/password/reset =====
// ตั้งรหัสผ่านใหม่หลังจาก forgot password OTP ถูกยืนยันแล้ว

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId, newPassword } = await request.json();

    if (!userId || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบถ้วน หรือรหัสผ่านสั้นเกินไป (ต้องการอย่างน้อย 6 ตัวอักษร)' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword, isFirstLogin: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[RESET PASSWORD ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
