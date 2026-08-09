// ===== BACKEND: POST /api/auth/otp/send =====
// สร้าง OTP ใหม่ และส่งเข้า Real Email

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { INITIAL_USERS } from '@/lib/mockDatabase';

export async function POST(request) {
  try {
    const { userId, type = 'LOGIN_2FA' } = await request.json();

    const cookieStore = await cookies();
    const pendingUserId = cookieStore.get('pending_user_id')?.value;
    const targetUserId = userId || pendingUserId;

    if (!targetUserId) {
      return NextResponse.json({ error: 'ไม่พบ session กรุณา login ใหม่' }, { status: 401 });
    }

    let user = null;
    try {
      user = await prisma.user.findUnique({ where: { id: targetUserId } });
    } catch (dbErr) {
      console.warn('[OTP SEND DB FALLBACK]', dbErr.message);
    }

    if (!user) {
      user = INITIAL_USERS.find((u) => u.id === targetUserId);
    }

    if (!user) {
      return NextResponse.json({ error: 'ไม่พบผู้ใช้ในระบบ' }, { status: 404 });
    }

    // Try DB cleanup and creation, wrap in try/catch for serverless
    try {
      await prisma.otp.updateMany({
        where: {
          userId: targetUserId,
          type: type,
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
        data: { isUsed: true },
      });
    } catch (err) {}

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    try {
      await prisma.otp.create({
        data: {
          userId: targetUserId,
          code,
          type,
          expiresAt,
          isUsed: false,
        },
      });
    } catch (err) {}

    // Send Real Email OTP
    const { sendOtpEmail } = await import('@/lib/emailService');
    const emailResult = await sendOtpEmail(user.email, code, type);

    console.log(`\n🔑 [OTP - ${type}] User: ${user.email} | Code: ${code} | Email Sent: ${emailResult.success}\n`);

    return NextResponse.json({
      success: true,
      emailStatus: emailResult,
      demoCode: code, // Always return demoCode for easy testing
    });
  } catch (error) {
    console.error('[OTP SEND ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
