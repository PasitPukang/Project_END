// ===== BACKEND: GET /api/documents/[id]/replies  → ดึง replies =====
//               POST /api/documents/[id]/replies → เพิ่ม reply

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { INITIAL_USERS } from '@/lib/mockDatabase';

let localRepliesStore = [];

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

// GET: ดึง replies ของเอกสาร
export async function GET(request, { params }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'กรุณา login ก่อน' }, { status: 401 });

    let replies = [];
    try {
      replies = await prisma.reply.findMany({
        where: { documentId: params.id },
        orderBy: { createdAt: 'asc' },
      });
    } catch (dbErr) {
      replies = localRepliesStore.filter((r) => r.documentId === params.id);
    }

    const safeReplies = replies.map((r) => ({ ...r, content: r.message }));

    return NextResponse.json({ replies: safeReplies });
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

    const { message, content, fileName, fileUrl, fileSize, isLeaveRequest } = await request.json();
    const replyText = message || content;

    if (!replyText || !replyText.trim()) {
      return NextResponse.json({ error: 'กรุณาพิมพ์ข้อความก่อนส่ง' }, { status: 400 });
    }

    let reply = {
      id: `rep_${Date.now()}`,
      documentId: params.id,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      message: replyText.trim(),
      fileName: fileName || null,
      fileUrl: fileUrl || null,
      fileSize: fileSize || null,
      isLeaveRequest: isLeaveRequest || false,
      createdAt: new Date().toISOString(),
    };

    try {
      reply = await prisma.reply.create({
        data: {
          documentId: params.id,
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          message: replyText.trim(),
          fileName: fileName || null,
          fileUrl: fileUrl || null,
          fileSize: fileSize || null,
          isLeaveRequest: isLeaveRequest || false,
        },
      });
    } catch (dbErr) {
      console.warn('[CREATE REPLY DB FALLBACK]', dbErr.message);
      localRepliesStore.push(reply);
    }

    const safeReply = { ...reply, content: reply.message };

    return NextResponse.json({ reply: safeReply }, { status: 201 });
  } catch (error) {
    console.error('[CREATE REPLY ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' }, { status: 500 });
  }
}
