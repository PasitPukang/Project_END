const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding FLAS KPS KU organizational personnel data...');

  const users = [
    // Tier 1: Executives
    {
      employeeId: 'EMP-D01',
      name: 'รศ.ดร. ธนกฤต ชลพิทักษ์วงศ์',
      email: 'dean.flas@kps.ku.ac.th',
      password: 'password123',
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
      password: 'password123',
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
      password: 'password123',
      role: 'ADMIN',
      tierLevel: 1,
      positionTitle: 'รองคณบดีฝ่ายบริหารและวางแผน',
      department: 'สำนักงานคณบดี',
      division: 'สำนักงานคณบดี',
      isFirstLogin: false,
    },
    // Tier 2: Dept & Division Heads
    {
      employeeId: 'EMP-H01',
      name: 'ผศ.ดร. กิตติศักดิ์ ศรีวิวัฒน์',
      email: 'head.cs@kps.ku.ac.th',
      password: 'password123',
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
      password: 'password123',
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
      password: 'password123',
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
      password: 'password123',
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
      password: 'password123',
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
      password: 'password123',
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
      password: 'password123',
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
      password: 'password123',
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
      password: 'password123',
      role: 'STAFF',
      tierLevel: 4,
      positionTitle: 'เจ้าหน้าที่งานบริการการศึกษา',
      department: 'สำนักงานเลขานุการคณะ',
      division: 'สำนักงานเลขานุการคณะ',
      isFirstLogin: false,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  console.log('FLAS KPS KU Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
