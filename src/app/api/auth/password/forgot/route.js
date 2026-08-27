// ===== BACKEND: POST /api/auth/password/forgot =====
// Step 1: ค้นหา user จาก email และส่ง OTP เข้า Real Email (No Demo Code)

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'กรุณากรอก Email' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { email: email.trim() },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ไม่พบอีเมลนี้ในระบบ กรุณาตรวจสอบอีเมลอีกครั้ง' },
        { status: 404 }
      );
    }

    // ยกเลิก OTP เดิม
    await prisma.otp.updateMany({
      where: {
        userId: user.id,
        type: 'FORGOT_PASSWORD',
        isUsed: false,
      },
      data: { isUsed: true },
    });

    // สร้าง OTP ใหม่ 6 หลัก
    const randomInt = crypto.randomInt(100000, 1000000);
    const code = randomInt.toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await prisma.otp.create({
      data: { userId: user.id, code, type: 'FORGOT_PASSWORD', expiresAt, isUsed: false },
    });

    // ส่ง Real Email OTP
    const { sendOtpEmail } = await import('@/lib/emailService');
    const emailResult = await sendOtpEmail(user.email, code, 'FORGOT_PASSWORD', user);

    return NextResponse.json({
      success: true,
      userId: user.id,
      message: 'รหัสยืนยัน OTP ถูกส่งไปยังอีเมลของคุณแล้ว',
      email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
    });
  } catch (error) {
    console.error('[FORGOT PASSWORD ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการส่งรหัสรีเซ็ต' }, { status: 500 });
  }
}
