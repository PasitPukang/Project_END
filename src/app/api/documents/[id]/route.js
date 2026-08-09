// ===== BACKEND: GET /api/documents/[id]    → ดูเอกสาร + บันทึก ReadLog =====
//               PUT /api/documents/[id]    → แก้ไขเอกสาร (author เท่านั้น)
//               DELETE /api/documents/[id] → ลบเอกสาร (author หรือ Admin)

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_user_id')?.value;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

// GET: ดูเอกสาร + auto mark as read
export async function GET(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'กรุณา login ก่อน' }, { status: 401 });

    const doc = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        readLogs: { select: { userId: true, userName: true, userRole: true, readAt: true } },
        replies: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!doc) return NextResponse.json({ error: 'ไม่พบเอกสาร' }, { status: 404 });

    // บันทึก read log (ถ้ายังไม่เคยอ่าน)
    const alreadyRead = doc.readLogs.some((l) => l.userId === user.id);
    if (!alreadyRead) {
      await prisma.readLog.create({
        data: {
          documentId: doc.id,
          userId: user.id,
          userName: user.name,
          userRole: user.role,
        },
      });
    }

    return NextResponse.json({ document: doc });
  } catch (error) {
    console.error('[GET DOCUMENT ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}

// PUT: แก้ไขเอกสาร
export async function PUT(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'กรุณา login ก่อน' }, { status: 401 });

    const doc = await prisma.document.findUnique({ where: { id: params.id } });
    if (!doc) return NextResponse.json({ error: 'ไม่พบเอกสาร' }, { status: 404 });

    // เฉพาะ author หรือ Admin เท่านั้น
    if (doc.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์แก้ไขเอกสารนี้' }, { status: 403 });
    }

    const body = await request.json();
    const updated = await prisma.document.update({
      where: { id: params.id },
      data: {
        ...body,
        targetIds: body.targetIds ? JSON.stringify(body.targetIds) : undefined,
        isEdited: true,
      },
    });

    return NextResponse.json({ document: updated });
  } catch (error) {
    console.error('[UPDATE DOCUMENT ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}

// DELETE: ลบเอกสาร
export async function DELETE(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'กรุณา login ก่อน' }, { status: 401 });

    const doc = await prisma.document.findUnique({ where: { id: params.id } });
    if (!doc) return NextResponse.json({ error: 'ไม่พบเอกสาร' }, { status: 404 });

    if (doc.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ลบเอกสารนี้' }, { status: 403 });
    }

    await prisma.document.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE DOCUMENT ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
