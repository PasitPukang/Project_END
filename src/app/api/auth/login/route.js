// ===== BACKEND: POST /api/auth/login =====
// รับ email/employeeId + password → ตรวจสอบกับ DB → ตั้ง session cookie

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { userId, password } = await request.json();

    if (!userId || !password) {
      return NextResponse.json({ error: 'กรุณากรอก ID และรหัสผ่าน' }, { status: 400 });
    }

    // ค้นหา user จาก email หรือ employeeId
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: userId.trim(), mode: 'insensitive' } },
          { employeeId: { equals: userId.trim(), mode: 'insensitive' } },
        ],
        password: password, // NOTE: Production ควรใช้ bcrypt
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'INCORRECT PASSWORD. PLEASE TRY AGAIN.' },
        { status: 401 }
      );
    }

    // บันทึก pending session (ยังไม่ complete เพราะต้องผ่าน OTP ก่อน)
    const cookieStore = await cookies();
    cookieStore.set('pending_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 นาที (รอ OTP)
      path: '/',
    });

    // ส่งข้อมูล user กลับ (ไม่รวม password)
    const { password: _, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
