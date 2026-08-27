// ===== BACKEND: GET /api/users  → ดึง user ทั้งหมด (Admin only) =====
//               POST /api/users → สร้าง user ใหม่ (Admin only)

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { INITIAL_USERS } from '@/lib/mockDatabase';

let localUsersStore = [...INITIAL_USERS];

async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_user_id')?.value;
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (user) return user;
  } catch (err) {}

  return localUsersStore.find((u) => u.id === userId) || null;
}

function generateEmployeeId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `EMP-${randomNum}`;
}

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

    let users = [];
    try {
      users = await prisma.user.findMany({
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
    } catch (dbErr) {
      users = localUsersStore.map(({ password, ...u }) => u);
    }

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

    const cleanEmail = email.trim().toLowerCase();

    // 1. ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือไม่ (ป้องกันอีเมลซ้ำ)
    let existingUser = null;
    try {
      existingUser = await prisma.user.findFirst({
        where: {
          email: { equals: cleanEmail, mode: 'insensitive' },
        },
      });
    } catch (err) {
      existingUser = localUsersStore.find((u) => u.email.toLowerCase() === cleanEmail);
    }

    if (existingUser) {
      return NextResponse.json(
        {
          error: `อีเมล "${cleanEmail}" นี้มีผู้ใช้งานในระบบแล้ว (${existingUser.name} - ${existingUser.employeeId}) ไม่สามารถใช้อีเมลซ้ำได้ กรุณาใช้อีเมลอื่น`,
        },
        { status: 400 }
      );
    }

    // 2. สร้าง employeeId แบบไม่ซ้ำ
    let employeeId = generateEmployeeId();
    try {
      let idCollision = await prisma.user.findUnique({ where: { employeeId } });
      while (idCollision) {
        employeeId = generateEmployeeId();
        idCollision = await prisma.user.findUnique({ where: { employeeId } });
      }
    } catch (e) {}

    const password = generatePassword();

    let newUser = {
      id: `usr_${Date.now()}`,
      employeeId,
      name: name.trim(),
      email: cleanEmail,
      password,
      role: role || 'STAFF',
      department: department || 'ทั่วไป',
      isFirstLogin: true,
      createdAt: new Date().toISOString(),
    };

    try {
      const created = await prisma.user.create({
        data: {
          employeeId,
          name: name.trim(),
          email: cleanEmail,
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
      newUser = { ...created, password };
    } catch (dbErr) {
      console.warn('[CREATE USER DB FALLBACK]', dbErr.message);
      localUsersStore.push(newUser);
    }

    // 1. Sync User to Supabase Cloud
    try {
      const { syncUserToSupabase } = await import('@/lib/supabase');
      await syncUserToSupabase(newUser);
    } catch (err) {}

    // 2. Send Real Email containing Employee ID & Temporary Password
    let emailResult = { success: false };
    try {
      const { sendEmployeeCredentialsEmail } = await import('@/lib/emailService');
      emailResult = await sendEmployeeCredentialsEmail(newUser.email, newUser.name, employeeId, password, {
        role: newUser.role,
        department: newUser.department,
      });
    } catch (err) {}

    const { password: _, ...safeUser } = newUser;

    return NextResponse.json({
      user: safeUser,
      credentials: { employeeId, password },
      emailStatus: emailResult
    }, { status: 201 });
  } catch (error) {
    console.error('[CREATE USER ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
