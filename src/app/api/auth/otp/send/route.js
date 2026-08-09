// ===== BACKEND: POST /api/auth/otp/send =====
// สร้าง OTP ใหม่ และ "ส่ง" (log ออก console ในตอน dev)

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { userId, type = 'LOGIN_2FA' } = await request.json();

    // อนุญาต userId จาก body หรือจาก pending cookie
    const cookieStore = await cookies();
    const pendingUserId = cookieStore.get('pending_user_id')?.value;
    const targetUserId = userId || pendingUserId;

    if (!targetUserId) {
      return NextResponse.json({ error: 'ไม่พบ session กรุณา login ใหม่' }, { status: 401 });
    }

    // ตรวจสอบ user มีอยู่จริง
    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้ในระบบ' }, { status: 404 });
    }

    // ยกเลิก OTP เก่าที่ยังไม่หมดอายุ
    await prisma.otp.updateMany({
      where: {
        userId: targetUserId,
        type: type,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      data: { isUsed: true },
    });

    // สร้าง OTP ใหม่ 6 หลัก (หมดอายุใน 2 นาที)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    const otp = await prisma.otp.create({
      data: {
        userId: targetUserId,
        code,
        type,
        expiresAt,
        isUsed: false,
      },
    });

    // DEV: log OTP ออก console (Production ส่ง Email จริง)
    console.log(`\n🔑 [OTP - ${type}] User: ${user.email} | Code: ${code} | Expires: ${expiresAt.toISOString()}\n`);

    return NextResponse.json({
      success: true,
      // ส่ง code กลับในตอน dev เพื่อแสดงบน UI (Demo)
      ...(process.env.NODE_ENV !== 'production' && { demoCode: code }),
    });
  } catch (error) {
    console.error('[OTP SEND ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
