// ===== BACKEND: POST /api/seed =====
// Seed ข้อมูลเริ่มต้นจาก mockDatabase ไปยัง PostgreSQL
// ใช้ใน Development เท่านั้น

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const INITIAL_USERS = [
  {
    id: 'usr_admin01',
    employeeId: 'ADM-001',
    name: 'ดร. สมศักดิ์ ผู้ดูแลระบบ',
    email: 'admin@university.ac.th',
    password: 'password123',
    role: 'ADMIN',
    department: 'สำนักงานคณบดี',
    isFirstLogin: false,
  },
  {
    id: 'usr_head01',
    employeeId: 'DHD-101',
    name: 'ผศ.ดร. อรพรรณ หัวหน้าสาขา',
    email: 'head.cs@university.ac.th',
    password: 'password123',
    role: 'DEPT_HEAD',
    department: 'สาขาวิชาวิทยาการคอมพิวเตอร์',
    isFirstLogin: false,
  },
  {
    id: 'usr_lec01',
    employeeId: 'LEC-201',
    name: 'อ. วรวุฒิ วิทยาการข้อมูล',
    email: 'lecturer1@university.ac.th',
    password: 'password123',
    role: 'LECTURER',
    department: 'สาขาวิชาวิทยาการคอมพิวเตอร์',
    isFirstLogin: false,
  },
  {
    id: 'usr_lec02',
    employeeId: 'LEC-202',
    name: 'ดร. ณัฐพงษ์ ซอฟต์แวร์',
    email: 'lecturer2@university.ac.th',
    password: 'password123',
    role: 'LECTURER',
    department: 'สาขาวิชาวิศวกรรมซอฟต์แวร์',
    isFirstLogin: true,
  },
  {
    id: 'usr_stf01',
    employeeId: 'STF-301',
    name: 'คุณ ปรียาภรณ์ สารบรรณ',
    email: 'staff.hr@university.ac.th',
    password: 'password123',
    role: 'STAFF',
    department: 'งานสารบรรณและบริหารทั่วไป',
    isFirstLogin: false,
  },
];

const INITIAL_DOCUMENTS = [
  {
    id: 'doc_001',
    title: 'ประกาศกำหนดการประชุมสภาคณะประจำภาคการศึกษา 1/2569',
    content:
      'เรียนอาจารย์และบุคลากรทุกท่าน ขอเชิญเข้าร่วมการประชุมสภาคณะฯ ในวันศุกร์ที่ 30 กรกฎาคม 2569 เวลา 09.30 น. ณ ห้องประชุมคณะ 1',
    priority: 'URGENT',
    boardType: 'GLOBAL',
    targetScope: 'FACULTY',
    targetIds: '[]',
    authorId: 'usr_admin01',
    authorName: 'ดร. สมศักดิ์ ผู้ดูแลระบบ',
    authorRole: 'ADMIN',
    isEdited: false,
    fileName: 'Agenda_Faculty_1_2569.pdf',
    fileUrl: '#',
    fileSize: '2.4 MB',
    createdAt: new Date('2026-07-20T08:30:00.000Z'),
    updatedAt: new Date('2026-07-20T08:30:00.000Z'),
  },
  {
    id: 'doc_002',
    title: 'บันทึกข้อความด่วนที่สุด: คำสั่งส่งรายงานผลการประเมินประกันคุณภาพการศึกษา (AUN-QA)',
    content:
      'ตามที่คณะได้ดำเนินงานประกันคุณภาพการศึกษา ขอให้หัวหน้าสาขาและอาจารย์ผู้รับผิดชอบหลักสูตรจัดส่งเอกสาร มคอ.7 ภายในวันจันทร์นี้',
    priority: 'VERY_URGENT',
    boardType: 'DEPARTMENT',
    targetScope: 'DEPARTMENT',
    targetIds: '["สาขาวิชาวิทยาการคอมพิวเตอร์"]',
    authorId: 'usr_head01',
    authorName: 'ผศ.ดร. อรพรรณ หัวหน้าสาขา',
    authorRole: 'DEPT_HEAD',
    isEdited: true,
    fileName: 'AUNQA_Report_Template_2026.docx',
    fileUrl: '#',
    fileSize: '1.8 MB',
    createdAt: new Date('2026-07-21T09:15:00.000Z'),
    updatedAt: new Date('2026-07-22T10:00:00.000Z'),
  },
  {
    id: 'doc_003',
    title: 'คำร้องขออนุมัติเดินทางไปราชการเข้าร่วมประชุมวิชาการระดับชาติ NCIT 2026',
    content:
      'ข้าพเจ้า อ. วรวุฒิ มีความประสงค์ขออนุมัติเดินทางไปเสนอผลงานวิจัย ณ มหาวิทยาลัยเชียงใหม่ ระหว่างวันที่ 5-7 สิงหาคม 2569',
    priority: 'NORMAL',
    boardType: 'PERSONAL',
    targetScope: 'INDIVIDUAL',
    targetIds: '["usr_head01"]',
    authorId: 'usr_lec01',
    authorName: 'อ. วรวุฒิ วิทยาการข้อมูล',
    authorRole: 'LECTURER',
    isEdited: false,
    fileName: 'NCIT2026_Acceptance_Letter.pdf',
    fileUrl: '#',
    fileSize: '850 KB',
    createdAt: new Date('2026-07-22T14:00:00.000Z'),
    updatedAt: new Date('2026-07-22T14:00:00.000Z'),
  },
];

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

    // Seed Users
    for (const user of INITIAL_USERS) {
      await prisma.user.create({ data: user });
    }

    // Seed Documents
    for (const doc of INITIAL_DOCUMENTS) {
      await prisma.document.create({ data: doc });
    }

    // Seed initial Read Logs
    await prisma.readLog.createMany({
      data: [
        { id: 'rl_001', documentId: 'doc_001', userId: 'usr_head01', userName: 'ผศ.ดร. อรพรรณ หัวหน้าสาขา', userRole: 'DEPT_HEAD', readAt: new Date('2026-07-20T09:00:00.000Z') },
        { id: 'rl_002', documentId: 'doc_001', userId: 'usr_lec01', userName: 'อ. วรวุฒิ วิทยาการข้อมูล', userRole: 'LECTURER', readAt: new Date('2026-07-20T10:15:00.000Z') },
        { id: 'rl_003', documentId: 'doc_002', userId: 'usr_lec01', userName: 'อ. วรวุฒิ วิทยาการข้อมูล', userRole: 'LECTURER', readAt: new Date('2026-07-21T11:30:00.000Z') },
      ],
    });

    // Seed initial Replies
    await prisma.reply.createMany({
      data: [
        {
          id: 'rep_001',
          documentId: 'doc_002',
          userId: 'usr_lec01',
          userName: 'อ. วรวุฒิ วิทยาการข้อมูล',
          userRole: 'LECTURER',
          message: 'รับทราบคำสั่งครับ กำลังเร่งรวบรวมเล่ม มคอ.7 จะจัดส่งภายในวันศุกร์นี้ครับ',
          fileName: 'Draft_TQF7_CS.pdf',
          fileUrl: '#',
          fileSize: '4.1 MB',
          isLeaveRequest: false,
          createdAt: new Date('2026-07-21T11:35:00.000Z'),
        },
        {
          id: 'rep_002',
          documentId: 'doc_003',
          userId: 'usr_head01',
          userName: 'ผศ.ดร. อรพรรณ หัวหน้าสาขา',
          userRole: 'DEPT_HEAD',
          message: 'อนุมัติในหลักการและเห็นควรเสนอคณบดีเพื่อพิจารณาอนุมัติงบประมาณตามระเบียบต่อไป',
          isLeaveRequest: false,
          createdAt: new Date('2026-07-22T15:20:00.000Z'),
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: 'Seed สำเร็จ! ข้อมูลจาก mockDatabase ถูก import ไปยัง PostgreSQL แล้ว',
      counts: {
        users: INITIAL_USERS.length,
        documents: INITIAL_DOCUMENTS.length,
        readLogs: 3,
        replies: 2,
      },
    });
  } catch (error) {
    console.error('[SEED ERROR]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
