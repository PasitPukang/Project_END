const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding E-office PostgreSQL Database (FLAS KPS KU)...');

  const users = [
    // Tier 1: Executives
    {
      employeeId: 'EMP-D01',
      name: 'รศ.ดร. ธนกฤต ชลพิทักษ์วงศ์',
      email: 'dean.flas@kps.ku.ac.th',
      password: 'Flas#Dean2026!kps',
      role: 'ADMIN',
      tierLevel: 1,
      positionTitle: 'คณบดีคณะศิลปศาสตร์และวิทยาศาสตร์',
      department: 'สำนักงานคณบดี',
      division: 'สำนักงานคณบดี',
      isFirstLogin: false,
    },
    {
      employeeId: 'EMP-D02',
      name: 'ผศ.ดร. อรพินท์ กิจพัฒนา',
      email: 'vdean.academic@kps.ku.ac.th',
      password: 'Flas#VdeanAcad2026!',
      role: 'ADMIN',
      tierLevel: 1,
      positionTitle: 'รองคณบดีฝ่ายวิชาการและประกันคุณภาพ',
      department: 'สำนักงานคณบดี',
      division: 'สำนักงานคณบดี',
      isFirstLogin: false,
    },
    {
      employeeId: 'EMP-D03',
      name: 'ดร. พงศกร บุญยเกียรติ',
      email: 'vdean.admin@kps.ku.ac.th',
      password: 'Flas#VdeanAdmin2026!',
      role: 'ADMIN',
      tierLevel: 1,
      positionTitle: 'รองคณบดีฝ่ายบริหารและวางแผน',
      department: 'สำนักงานคณบดี',
      division: 'สำนักงานคณบดี',
      isFirstLogin: false,
    },
    {
      employeeId: 'EMP-D007',
      name: 'นายพสิษฐ์ ภูฆัง',
      email: 'pasit.pu@ku.th',
      password: 'Flas#AdminBest2026!',
      role: 'ADMIN',
      tierLevel: 1,
      positionTitle: 'แอดมิน',
      department: 'IT',
      division: 'IT',
      isFirstLogin: false,
    },

    // Tier 2: Dept & Division Heads
    {
      employeeId: 'EMP-H01',
      name: 'ผศ.ดร. กิตติศักดิ์ ศรีวิวัฒน์',
      email: 'head.cs@kps.ku.ac.th',
      password: 'Flas#HeadCS2026!kps',
      role: 'DEPT_HEAD',
      tierLevel: 2,
      positionTitle: 'หัวหน้าภาควิชาวิทยาการคอมพิวเตอร์และ IT',
      department: 'ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
      division: 'ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
      isFirstLogin: false,
    },
    {
      employeeId: 'EMP-H02',
      name: 'รศ.ดร. สุวรรณี วงศ์ปัญญา',
      email: 'head.sci@kps.ku.ac.th',
      password: 'Flas#HeadSci2026!kps',
      role: 'DEPT_HEAD',
      tierLevel: 2,
      positionTitle: 'หัวหน้าภาควิชาวิทยาศาสตร์กายภาพและสิ่งแวดล้อม',
      department: 'ภาควิชาวิทยาศาสตร์กายภาพและสิ่งแวดล้อม',
      division: 'ภาควิชาวิทยาศาสตร์กายภาพและสิ่งแวดล้อม',
      isFirstLogin: false,
    },
    {
      employeeId: 'EMP-H03',
      name: 'คุณ ภานุวัฒน์ ประเสริฐสุข',
      email: 'head.office@kps.ku.ac.th',
      password: 'Flas#HeadOffice2026!',
      role: 'DEPT_HEAD',
      tierLevel: 2,
      positionTitle: 'หัวหน้าสำนักงานเลขานุการคณะ',
      department: 'สำนักงานเลขานุการคณะ',
      division: 'สำนักงานเลขานุการคณะ',
      isFirstLogin: false,
    },
    // Tier 3: Lecturers
    {
      employeeId: 'EMP-L01',
      name: 'อ. วรวุฒิ สุวรรณโชติ',
      email: 'worawoot.s@kps.ku.ac.th',
      password: 'Flas#LcsWora2026!kps',
      role: 'LECTURER',
      tierLevel: 3,
      positionTitle: 'อาจารย์ประจำสาขาวิชาวิทยาการคอมพิวเตอร์',
      department: 'ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
      division: 'ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
      isFirstLogin: false,
    },
    {
      employeeId: 'EMP-L02',
      name: 'ดร. ณัฐพงษ์ ซอฟต์แวร์อนันต์',
      email: 'nattapong.a@kps.ku.ac.th',
      password: 'Flas#LitNatta2026!kps',
      role: 'LECTURER',
      tierLevel: 3,
      positionTitle: 'อาจารย์ประจำสาขาวิชาเทคโนโลยีสารสนเทศ',
      department: 'ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
      division: 'ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
      isFirstLogin: false,
    },
    {
      employeeId: 'EMP-L03',
      name: 'ดร. พรชัย เคมีพัฒนา',
      email: 'pornchai.p@kps.ku.ac.th',
      password: 'Flas#LsciPorn2026!kps',
      role: 'LECTURER',
      tierLevel: 3,
      positionTitle: 'อาจารย์ประจำภาควิชาวิทยาศาสตร์กายภาพ',
      department: 'ภาควิชาวิทยาศาสตร์กายภาพและสิ่งแวดล้อม',
      division: 'ภาควิชาวิทยาศาสตร์กายภาพและสิ่งแวดล้อม',
      isFirstLogin: false,
    },
    // Tier 4: Support Staff
    {
      employeeId: 'EMP-S01',
      name: 'คุณ ปรียาภรณ์ สารบรรณดี',
      email: 'staff.admin@kps.ku.ac.th',
      password: 'Flas#StaffAdmin2026!',
      role: 'STAFF',
      tierLevel: 4,
      positionTitle: 'เจ้าหน้าที่งานบริหารและธุรการสารบรรณ',
      department: 'สำนักงานเลขานุการคณะ',
      division: 'สำนักงานเลขานุการคณะ',
      isFirstLogin: false,
    },
    {
      employeeId: 'EMP-S02',
      name: 'คุณ สมศักดิ์ การเงินรัตน์',
      email: 'staff.finance@kps.ku.ac.th',
      password: 'Flas#StaffFin2026!',
      role: 'STAFF',
      tierLevel: 4,
      positionTitle: 'เจ้าหน้าที่งานการเงินและพัสดุ',
      department: 'สำนักงานเลขานุการคณะ',
      division: 'สำนักงานเลขานุการคณะ',
      isFirstLogin: false,
    },
    {
      employeeId: 'EMP-S03',
      name: 'คุณ ศิริพร บริการศึกษา',
      email: 'staff.academic@kps.ku.ac.th',
      password: 'Flas#StaffAcad2026!',
      role: 'STAFF',
      tierLevel: 4,
      positionTitle: 'เจ้าหน้าที่งานบริการการศึกษา',
      department: 'สำนักงานเลขานุการคณะ',
      division: 'สำนักงานเลขานุการคณะ',
      isFirstLogin: false,
    },
  ];

  console.log(`👤 Upserting ${users.length} organizational users...`);
  const createdUsers = [];
  for (const user of users) {
    const saved = await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
    createdUsers.push(saved);
  }

  // Seed sample documents if empty
  const docCount = await prisma.document.count();
  if (docCount === 0 && createdUsers.length > 0) {
    const dean = createdUsers.find((u) => u.employeeId === 'EMP-D01') || createdUsers[0];
    const headCs = createdUsers.find((u) => u.employeeId === 'EMP-H01') || createdUsers[0];
    const lecCs = createdUsers.find((u) => u.employeeId === 'EMP-L01') || createdUsers[0];

    console.log('📄 Creating initial circular letters and documents...');
    await prisma.document.createMany({
      data: [
        {
          title: 'ประกาศกำหนดการประชุมคณะกรรมการประจำคณะฯ ประจำเดือนสิงหาคม 2569',
          content: 'เรียนกรรมการประจำคณะทุกท่าน ขอเชิญเข้าร่วมประชุมในวันศุกร์นี้ เวลา 09.30 น. ณ ห้องประชุมหลวงทรงสำนักงานคณบดี',
          priority: 'URGENT',
          boardType: 'GLOBAL',
          targetScope: 'FACULTY',
          targetIds: '[]',
          authorId: dean.id,
          authorName: dean.name,
          authorRole: dean.role,
        },
        {
          title: 'บันทึกข้อความด่วนที่สุด: รายงานผลการประเมินประกันคุณภาพการศึกษา AUN-QA',
          content: 'ขอให้อาจารย์ผู้รับผิดชอบหลักสูตรภาควิชาวิทยาการคอมพิวเตอร์และ IT จัดส่งเอกสารรายงาน มคอ.7 ภายในวันศุกร์นี้',
          priority: 'VERY_URGENT',
          boardType: 'DEPARTMENT',
          targetScope: 'DEPARTMENT',
          targetIds: JSON.stringify(['ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ']),
          authorId: headCs.id,
          authorName: headCs.name,
          authorRole: headCs.role,
        },
        {
          title: 'คำร้องขออนุมัติเดินทางไปราชการเสนอผลงานวิจัยระดับชาติ NCIT 2026',
          content: 'ข้าพเจ้ามีความประสงค์ขออนุมัติเดินทางไปเสนอผลงานวิจัย ณ มหาวิทยาลัยเชียงใหม่ ระหว่างวันที่ 5-7 สิงหาคม 2569',
          priority: 'NORMAL',
          boardType: 'PERSONAL',
          targetScope: 'INDIVIDUAL',
          targetIds: JSON.stringify([headCs.id]),
          authorId: lecCs.id,
          authorName: lecCs.name,
          authorRole: lecCs.role,
        },
      ],
    });
  }

  console.log('✅ FLAS KPS KU E-office Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
