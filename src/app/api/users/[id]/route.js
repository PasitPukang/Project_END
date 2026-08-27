import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { INITIAL_USERS } from '@/lib/mockDatabase';

let localUsersStore = [...INITIAL_USERS];

async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_user_id')?.value;
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, employeeId: true },
    });
    if (user) return user;
  } catch (err) {}

  return localUsersStore.find((u) => u.id === userId) || null;
}

// DELETE /api/users/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ไม่พบ ID ผู้ใช้งานที่ต้องการลบ' }, { status: 400 });
    }

    // 1. ตรวจสอบสิทธิ์ (Admin only)
    const sessionUser = await getSessionUser();
    if (sessionUser && sessionUser.role !== 'ADMIN' && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง (Admin only)' }, { status: 403 });
    }

    // 2. ตรวจสอบว่าผู้ใช้ที่จะลบมีอยู่จริงหรือไม่
    let targetUser = null;
    try {
      targetUser = await prisma.user.findUnique({
        where: { id },
      });
    } catch (e) {
      targetUser = localUsersStore.find((u) => u.id === id);
    }

    if (!targetUser) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลผู้ใช้งานนี้ในระบบ' }, { status: 404 });
    }

    // 3. ป้องกันการลบ Master Admin (EMP-D007)
    if (targetUser.employeeId === 'EMP-D007') {
      return NextResponse.json({ error: 'ไม่อนุญาตให้ลบบัญชีผู้ดูแลระบบหลัก (Master Admin)' }, { status: 403 });
    }

    // 4. ป้องกันการลบบัญชีตัวเองที่กำลังล็อกอินอยู่
    if (sessionUser && sessionUser.id === targetUser.id) {
      return NextResponse.json({ error: 'ไม่สามารถลบบัญชีที่คุณกำลังใช้งานอยู่ในขณะนี้ได้' }, { status: 400 });
    }

    // 5. ลบจาก PostgreSQL (Prisma จะ Cascade ลบ Otp, Document, ReadLog, Reply ให้โดยอัตโนมัติ)
    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn('[DELETE USER DB FALLBACK]', dbErr.message);
      const idx = localUsersStore.findIndex((u) => u.id === id);
      if (idx !== -1) localUsersStore.splice(idx, 1);
    }

    // 6. ลบจาก Supabase Cloud (ถ้าเชื่อมต่อไว้)
    try {
      const { getSupabaseClient } = await import('@/lib/supabase');
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.from('User').delete().eq('id', id);
      }
    } catch (err) {
      console.warn('[SUPABASE DELETE USER ERROR]', err.message);
    }

    return NextResponse.json({
      success: true,
      message: `ลบผู้ใช้งาน ${targetUser.name} (${targetUser.employeeId}) เรียบร้อยแล้ว`,
      deletedId: id,
    });
  } catch (error) {
    console.error('[DELETE USER ERROR]', error);
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้' }, { status: 500 });
  }
}
