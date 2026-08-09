// ===== BACKEND: GET /api/users  → ดึง user ทั้งหมด (Admin only) =====
//               POST /api/users → สร้าง user ใหม่ (Admin only)

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

// Helper: ดึง session user และตรวจ Role
async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_user_id')?.value;
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
}

// Generate unique EmployeeId
async function generateEmployeeId() {
  let employeeId;
  let isDuplicate = true;
  while (isDuplicate) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    employeeId = `EMP-${randomNum}`;
    const exists = await prisma.user.findUnique({ where: { employeeId } });
    isDuplicate = !!exists;
  }
  return employeeId;
}

// Generate random password
function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// GET: ดึง users ทั้งหมด
export async function GET() {
  try {
    const sessionUser = await getSessionUser();
    if (sessionUser && sessionUser.role !== 'ADMIN' && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง (Admin only)' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        role: true,
        department: true,
        isFirstLogin: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('[GET USERS ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}

// POST: สร้าง user ใหม่
export async function POST(request) {
  try {
    const sessionUser = await getSessionUser();
    if (sessionUser && sessionUser.role !== 'ADMIN' && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง (Admin only)' }, { status: 403 });
    }

    const { name, email, role, department } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อ-นามสกุล และ อีเมลพนักงาน' }, { status: 400 });
    }

    // ตรวจ duplicate email
    const exists = await prisma.user.findFirst({
      where: { email: { equals: email.trim(), mode: 'insensitive' } },
    });
    if (exists) {
      return NextResponse.json({ error: 'อีเมลนี้ถูกใช้งานในระบบแล้ว' }, { status: 409 });
    }

    const employeeId = await generateEmployeeId();
    const password = generatePassword();

    const newUser = await prisma.user.create({
      data: {
        employeeId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: role || 'STAFF',
        department: department || 'ทั่วไป',
        isFirstLogin: true,
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
      },
    });

    // 1. Sync User to Supabase
    const { syncUserToSupabase } = await import('@/lib/supabase');
    await syncUserToSupabase(newUser);

    // 2. Send Real Email containing Employee ID & Temporary Password
    const { sendEmployeeCredentialsEmail } = await import('@/lib/emailService');
    const emailResult = await sendEmployeeCredentialsEmail(newUser.email, newUser.name, employeeId, password);

    console.log(`\n👤 [USER CREATED & EMAIL DISPATCHED] ${newUser.name} | ID: ${employeeId} | Pass: ${password} | Email Sent: ${emailResult.success}\n`);

    return NextResponse.json({
      user: newUser,
      credentials: { employeeId, password }, // ส่งกลับเพื่อแสดงบน UI
      emailStatus: emailResult
    }, { status: 201 });
  } catch (error) {
    console.error('[CREATE USER ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}

