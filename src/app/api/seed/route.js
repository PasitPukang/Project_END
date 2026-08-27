// ===== BACKEND: POST /api/seed =====
// Seed ข้อมูลเริ่มต้น 5 ผู้ใช้งานหลัก (FLAS KPS KU) จาก mockDatabase ไปยัง PostgreSQL
// ใช้ใน Development เท่านั้น

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  INITIAL_USERS,
  INITIAL_DOCUMENTS,
  INITIAL_READ_LOGS,
  INITIAL_REPLIES,
} from '@/lib/mockDatabase';

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'ไม่อนุญาตใน Production' }, { status: 403 });
  }

  try {
    // ล้างข้อมูลเก่า (ตามลำดับ FK)
    await prisma.reply.deleteMany();
    await prisma.readLog.deleteMany();
    await prisma.otp.deleteMany();
    await prisma.document.deleteMany();
    await prisma.user.deleteMany();

    // 1. Seed Users (5 บัญชีหลักตาม 5 เมลที่ผู้ใช้กำหนด)
    for (const user of INITIAL_USERS) {
      await prisma.user.create({
        data: {
          id: user.id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          tierLevel: user.tierLevel,
          positionTitle: user.positionTitle,
          department: user.department,
          division: user.division,
          isFirstLogin: user.isFirstLogin,
          createdAt: new Date(user.createdAt),
        },
      });
    }

    // 2. Seed Documents
    for (const doc of INITIAL_DOCUMENTS) {
      await prisma.document.create({
        data: {
          id: doc.id,
          title: doc.title,
          content: doc.content,
          priority: doc.priority,
          boardType: doc.boardType,
          targetScope: doc.targetScope,
          targetIds: JSON.stringify(doc.targetIds || []),
          authorId: doc.authorId,
          authorName: doc.authorName,
          authorRole: doc.authorRole,
          isEdited: doc.isEdited || false,
          fileUrl: doc.fileUrl,
          fileName: doc.fileName,
          fileSize: doc.fileSize,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt),
        },
      });
    }

    // 3. Seed initial Read Logs
    for (const log of INITIAL_READ_LOGS) {
      await prisma.readLog.create({
        data: {
          id: log.id,
          documentId: log.documentId,
          userId: log.userId,
          userName: log.userName,
          userRole: log.userRole,
          readAt: new Date(log.readAt),
        },
      });
    }

    // 4. Seed initial Replies
    for (const rep of INITIAL_REPLIES) {
      await prisma.reply.create({
        data: {
          id: rep.id,
          documentId: rep.documentId,
          userId: rep.userId,
          userName: rep.userName,
          userRole: rep.userRole,
          message: rep.message,
          fileName: rep.fileName,
          fileUrl: rep.fileUrl,
          fileSize: rep.fileSize,
          isLeaveRequest: rep.isLeaveRequest || false,
          createdAt: new Date(rep.createdAt),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Seed สำเร็จ! ฐานข้อมูลมี 5 บัญชีตามที่กำหนดเรียบร้อยแล้ว',
      counts: {
        users: INITIAL_USERS.length,
        documents: INITIAL_DOCUMENTS.length,
        readLogs: INITIAL_READ_LOGS.length,
        replies: INITIAL_REPLIES.length,
      },
    });
  } catch (error) {
    console.error('[SEED ERROR]', error);
    return NextResponse.json({ error: error.message || 'Seed ล้มเหลว' }, { status: 500 });
  }
}
