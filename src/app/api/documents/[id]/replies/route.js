// ===== BACKEND: GET /api/documents/[id]/replies  → ดึง replies =====
//               POST /api/documents/[id]/replies → เพิ่ม reply

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_user_id')?.value;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

// GET: ดึง replies ของเอกสาร
export async function GET(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'กรุณา login ก่อน' }, { status: 401 });

    const replies = await prisma.reply.findMany({
      where: { documentId: params.id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ replies });
  } catch (error) {
    console.error('[GET REPLIES ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}

// POST: เพิ่ม reply ใหม่
export async function POST(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'กรุณา login ก่อน' }, { status: 401 });

    const { message, fileName, fileUrl, fileSize, isLeaveRequest } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'กรุณาพิมพ์ข้อความก่อนส่ง' }, { status: 400 });
    }

    const reply = await prisma.reply.create({
      data: {
        documentId: params.id,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        message: message.trim(),
        fileName: fileName || null,
        fileUrl: fileUrl || null,
        fileSize: fileSize || null,
        isLeaveRequest: isLeaveRequest || false,
      },
    });

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error('[CREATE REPLY ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
