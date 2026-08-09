// ===== BACKEND: GET /api/documents/[id]    → ดูเอกสาร + บันทึก ReadLog =====
//               PUT /api/documents/[id]    → แก้ไขเอกสาร (author หรือ Admin)
//               DELETE /api/documents/[id] → ลบเอกสาร (author หรือ Admin)

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { INITIAL_DOCUMENTS, INITIAL_USERS } from '@/lib/mockDatabase';

let localDocStore = [...INITIAL_DOCUMENTS];

async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_user_id')?.value;
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) return user;
  } catch (err) {}

  return INITIAL_USERS.find((u) => u.id === userId) || null;
}

// GET: ดูเอกสาร + auto mark as read
export async function GET(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'กรุณา login ก่อน' }, { status: 401 });

    let doc = null;
    try {
      doc = await prisma.document.findUnique({
        where: { id: params.id },
        include: {
          readLogs: { select: { userId: true, userName: true, userRole: true, readAt: true } },
          replies: { orderBy: { createdAt: 'asc' } },
        },
      });
    } catch (dbErr) {
      console.warn('[GET DOC DB FALLBACK]', dbErr.message);
    }

    if (!doc) {
      doc = localDocStore.find((d) => d.id === params.id) || INITIAL_DOCUMENTS.find((d) => d.id === params.id);
      if (doc) {
        doc = {
          ...doc,
          readLogs: doc.readLogs || [],
          replies: doc.replies || [],
        };
      }
    }

    if (!doc) return NextResponse.json({ error: 'ไม่พบเอกสาร' }, { status: 404 });

    // Auto mark read
    const readLogs = doc.readLogs || [];
    const alreadyRead = readLogs.some((l) => l.userId === user.id);
    if (!alreadyRead) {
      const newReadLog = {
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        readAt: new Date().toISOString(),
      };
      try {
        await prisma.readLog.create({
          data: {
            documentId: doc.id,
            userId: user.id,
            userName: user.name,
            userRole: user.role,
          },
        });
      } catch (err) {}
      doc.readLogs = [...readLogs, newReadLog];
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

    let doc = null;
    try {
      doc = await prisma.document.findUnique({ where: { id: params.id } });
    } catch (dbErr) {
      console.warn('[PUT DOC DB FALLBACK]', dbErr.message);
    }

    if (!doc) {
      doc = localDocStore.find((d) => d.id === params.id) || INITIAL_DOCUMENTS.find((d) => d.id === params.id);
    }

    if (!doc) return NextResponse.json({ error: 'ไม่พบเอกสาร' }, { status: 404 });

    if (doc.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์แก้ไขเอกสารนี้' }, { status: 403 });
    }

    const body = await request.json();
    let updated = {
      ...doc,
      ...body,
      isEdited: true,
      targetIds: body.targetIds ? (Array.isArray(body.targetIds) ? JSON.stringify(body.targetIds) : body.targetIds) : doc.targetIds,
      updatedAt: new Date().toISOString(),
    };

    try {
      updated = await prisma.document.update({
        where: { id: params.id },
        data: {
          ...body,
          targetIds: body.targetIds ? JSON.stringify(body.targetIds) : undefined,
          isEdited: true,
        },
      });
    } catch (dbErr) {
      console.warn('[UPDATE DOC DB FALLBACK]', dbErr.message);
      const idx = localDocStore.findIndex((d) => d.id === params.id);
      if (idx !== -1) {
        localDocStore[idx] = updated;
      }
    }

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

    let doc = null;
    try {
      doc = await prisma.document.findUnique({ where: { id: params.id } });
    } catch (dbErr) {}

    if (!doc) {
      doc = localDocStore.find((d) => d.id === params.id) || INITIAL_DOCUMENTS.find((d) => d.id === params.id);
    }

    if (!doc) return NextResponse.json({ error: 'ไม่พบเอกสาร' }, { status: 404 });

    if (doc.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์ลบเอกสารนี้' }, { status: 403 });
    }

    try {
      await prisma.document.delete({ where: { id: params.id } });
    } catch (dbErr) {
      localDocStore = localDocStore.filter((d) => d.id !== params.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE DOCUMENT ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
