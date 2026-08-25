// ===== BACKEND: POST /api/auth/login =====
// รับ email/employeeId + password → ตรวจสอบกับ DB / Fallback → ตั้ง session cookie

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_USERS } from '@/lib/mockDatabase';

export async function POST(request) {
  try {
    const { userId, password } = await request.json();

    if (!userId || !password) {
      return NextResponse.json({ error: 'กรุณากรอก ID และรหัสผ่าน' }, { status: 400 });
    }

    const cleanInput = userId.trim();
    let user = null;

    try {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: cleanInput.toLowerCase() },
            { employeeId: cleanInput.toUpperCase() },
            { email: cleanInput },
            { employeeId: cleanInput },
          ],
          password: password,
        },
      });
    } catch (dbError) {
      console.warn('[LOGIN DB FALLBACK]', dbError.message);
    }

    // Fallback to in-memory INITIAL_USERS for Vercel Serverless environment
    if (!user) {
      user = INITIAL_USERS.find(
        (u) =>
          (u.email.toLowerCase() === cleanInput.toLowerCase() ||
            u.employeeId.toUpperCase() === cleanInput.toUpperCase() ||
            u.email === cleanInput ||
            u.employeeId === cleanInput) &&
          u.password === password
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'รหัสผ่านหรือชื่อผู้ใช้ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง' },
        { status: 401 }
      );
    }

    // ส่งข้อมูล user กลับ (ไม่รวม password) พร้อมตั้ง Cookie
    const { password: _, ...safeUser } = user;
    const response = NextResponse.json({ user: safeUser });

    response.cookies.set('pending_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 นาที (รอ OTP)
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
