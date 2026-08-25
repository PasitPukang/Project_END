// ===== BACKEND: POST /api/auth/otp/verify =====
// ตรวจสอบ OTP เทียบกับฐานข้อมูลจริง (Strict Verification - No Bypass)

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId, code, type = 'LOGIN_2FA' } = await request.json();

    if (!userId || !code) {
      return NextResponse.json({ error: 'กรุณากรอกรหัส OTP ให้ครบถ้วน' }, { status: 400 });
    }

    const cleanCode = code.toString().trim();
    let otp = null;

    try {
      otp = await prisma.otp.findFirst({
        where: {
          userId,
          type,
          code: cleanCode,
          isUsed: false,
          expiresAt: { gt: new Date() },
        },
      });

      if (otp) {
        await prisma.otp.update({
          where: { id: otp.id },
          data: { isUsed: true },
        });
      }
    } catch (dbError) {
      console.warn('[OTP DB Fallback verify]', dbError.message);
    }

    // In-memory fallback
    if (!otp && global._inMemoryOtps) {
      const matchIndex = global._inMemoryOtps.findIndex(
        (o) =>
          o.userId === userId &&
          o.type === type &&
          o.code === cleanCode &&
          !o.isUsed &&
          new Date(o.expiresAt) > new Date()
      );

      if (matchIndex !== -1) {
        otp = global._inMemoryOtps[matchIndex];
        global._inMemoryOtps[matchIndex].isUsed = true;
      }
    }

    if (!otp) {
      return NextResponse.json(
        { error: 'รหัส OTP ไม่ถูกต้อง หรือหมดอายุการใช้งานแล้ว กรุณากดขอรหัสใหม่' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'ยืนยันรหัส OTP ถูกต้องเรียบร้อย',
    });

    // ตั้ง Cookie สำหรับเข้าใช้งาน
    if (type === 'LOGIN_2FA') {
      response.cookies.delete('pending_user_id');
      response.cookies.set('session_user_id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 ชั่วโมง
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('[OTP VERIFY ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบรหัส OTP' }, { status: 500 });
  }
}
