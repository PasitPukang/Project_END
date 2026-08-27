const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding E-office PostgreSQL Database (FLAS KPS KU)...');

  const users = [
    // 1. คณบดีคณะศิลปศาสตร์และวิทยาศาสตร์
    {
      employeeId: 'EMP-D01',
      name: 'รศ.ดร. ธนกฤต ชลพิทักษ์วงศ์',
      email: 'pasitpukang1234567@gmail.com',
      password: 'Flas#Dean2026!kps',
      role: 'ADMIN',
      tierLevel: 1,
      positionTitle: 'คณบดีคณะศิลปศาสตร์และวิทยาศาสตร์',
      department: 'สำนักงานคณบดี',
      division: 'สำนักงานคณบดี',
      isFirstLogin: false,
    },
    // 2. ผู้ดูแลระบบ IT (Admin)
    {
      employeeId: 'EMP-D007',
      name: 'นายพสิษฐ์ ภูฆัง',
      email: 'pasitpukang0@gmail.com',
      password: 'Flas#AdminBest2026!',
      role: 'ADMIN',
      tierLevel: 1,
      positionTitle: 'ผู้ดูแลระบบ IT (Admin)',
      department: 'สำนักงานคณบดี (ฝ่าย IT)',
      division: 'สำนักงานคณบดี',
      isFirstLogin: false,
    },
    // 3. หัวหน้าภาควิชาวิทยาการคอมพิวเตอร์และ IT
    {
      employeeId: 'EMP-H01',
      name: 'ผศ.ดร. กิตติศักดิ์ ศรีวิวัฒน์',
      email: 'bestpasit2547@gmail.com',
      password: 'Flas#HeadCS2026!kps',
      role: 'DEPT_HEAD',
      tierLevel: 2,
      positionTitle: 'หัวหน้าภาควิชาวิทยาการคอมพิวเตอร์และ IT',
      department: 'ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
      division: 'ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
      isFirstLogin: false,
    },
    // 4. อาจารย์ประจำภาควิชา
    {
      employeeId: 'EMP-L01',
      name: 'อ. วรวุฒิ สุวรรณโชติ',
      email: 'bgee7242@gmail.com',
      password: 'Flas#LcsWora2026!kps',
      role: 'LECTURER',
      tierLevel: 3,
      positionTitle: 'อาจารย์ประจำสาขาวิชาวิทยาการคอมพิวเตอร์',
      department: 'ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
      division: 'ภาควิชาวิทยาการคอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
      isFirstLogin: false,
    },
    // 5. บุคลากรสายสนับสนุน
    {
      employeeId: 'EMP-S01',
      name: 'คุณ ปรียาภรณ์ สารบรรณดี',
      email: 'pasit.pu@ku.th',
      password: 'Flas#StaffAdmin2026!',
      role: 'STAFF',
      tierLevel: 4,
      positionTitle: 'เจ้าหน้าที่งานบริหารและธุรการสารบรรณ',
      department: 'สำนักงานเลขานุการคณะ',
      division: 'สำนักงานเลขานุการคณะ',
      isFirstLogin: false,
    },
  ];

  console.log(`👤 Upserting ${users.length} organizational users...`);
  const createdUsers = [];
  for (const user of users) {
    const saved = await prisma.user.upsert({
      where: { employeeId: user.employeeId },
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
