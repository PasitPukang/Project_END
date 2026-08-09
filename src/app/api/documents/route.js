// ===== BACKEND: GET /api/documents  → ดึงเอกสารตามสิทธิ์ user =====
//               POST /api/documents → สร้างเอกสารใหม่

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('session_user_id')?.value;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

// GET: ดึงเอกสารที่ user มีสิทธิ์ดู
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'กรุณา login ก่อน' }, { status: 401 });
    }

    // ดึงทุก document แล้ว filter ตาม targetScope ฝั่ง application
    // (ตาม logic เดิมใน mockDatabase)
    const documents = await prisma.document.findMany({
      include: {
        readLogs: {
          select: { userId: true, userName: true, userRole: true, readAt: true },
        },
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter ตาม role และ targetScope
    const accessible = documents.filter((doc) => {
      // Admin เห็นทุกอย่าง
      if (user.role === 'ADMIN') return true;

      const targetIds = JSON.parse(doc.targetIds || '[]');

      switch (doc.targetScope) {
        case 'FACULTY':
          return true; // ทุกคนในคณะเห็น
        case 'DEPARTMENT':
          return targetIds.includes(user.department);
        case 'HIERARCHICAL':
          // DEPT_HEAD ขึ้นไปเห็น หรือ อยู่ใน targetIds
          return ['ADMIN', 'DEPT_HEAD'].includes(user.role) || targetIds.includes(user.id);
        case 'INDIVIDUAL':
          return doc.authorId === user.id || targetIds.includes(user.id);
        default:
          return false;
      }
    });

    return NextResponse.json({ documents: accessible });
  } catch (error) {
    console.error('[GET DOCUMENTS ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}

// POST: สร้างเอกสารใหม่
export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'กรุณา login ก่อน' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, priority, boardType, targetScope, targetIds, fileName, fileUrl, fileSize } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'กรุณากรอก Title และ Content' }, { status: 400 });
    }

    const newDoc = await prisma.document.create({
      data: {
        title,
        content,
        priority: priority || 'NORMAL',
        boardType: boardType || 'GLOBAL',
        targetScope: targetScope || 'FACULTY',
        targetIds: JSON.stringify(targetIds || []),
        authorId: user.id,
        authorName: user.name,
        authorRole: user.role,
        isEdited: false,
        fileName: fileName || null,
        fileUrl: fileUrl || null,
        fileSize: fileSize || null,
      },
    });

    return NextResponse.json({ document: newDoc }, { status: 201 });
  } catch (error) {
    console.error('[CREATE DOCUMENT ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
