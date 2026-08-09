// ===== BACKEND: POST /api/auth/password/forgot =====
// Step 1: ค้นหา user จาก email และส่ง OTP
// Step 2: ยืนยัน OTP (ใช้ /api/auth/otp/verify)
// Step 3: POST /api/auth/password/reset → ตั้ง password ใหม่

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // ยกเลิก OTP เก่า
    await prisma.otp.updateMany({
      where: {
        userId: user.id,
        type: 'FORGOT_PASSWORD',
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      data: { isUsed: true },
    });

    // สร้าง OTP ใหม่
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    const otp = await prisma.otp.create({
      data: { userId: user.id, code, type: 'FORGOT_PASSWORD', expiresAt, isUsed: false },
    });

    // ส่ง Real Email OTP สำหรับลืมรหัสผ่าน
    const { sendOtpEmail } = await import('@/lib/emailService');
    const emailResult = await sendOtpEmail(user.email, code, 'FORGOT_PASSWORD');

    console.log(`\n🔑 [FORGOT_PASSWORD OTP SENT] Email: ${user.email} | Code: ${code} | Email Sent: ${emailResult.success}\n`);

    return NextResponse.json({
      success: true,
      userId: user.id,
      emailStatus: emailResult,
      ...(process.env.NODE_ENV !== 'production' && { demoCode: code }),
    });
  } catch (error) {
    console.error('[FORGOT PASSWORD ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
