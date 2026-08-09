// d:\HR_project\src\app\api\admin\stats\route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalDocuments = await prisma.document.count();
    const totalReadLogs = await prisma.readLog.count();
    const totalReplies = await prisma.reply.count();

    // Group users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    // Group documents by priority
    const docsByPriority = await prisma.document.groupBy({
      by: ['priority'],
      _count: { priority: true },
    });

    // Recent 5 documents
    const recentDocs = await prisma.document.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        priority: true,
        authorName: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalDocuments,
        totalReadLogs,
        totalReplies,
      },
      usersByRole,
      docsByPriority,
      recentDocs,
      dbStatus: 'Connected (PostgreSQL / Prisma)',
    });
  } catch (error) {
    console.error('[ADMIN STATS ERROR]', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติระบบ' }, { status: 500 });
  }
}
