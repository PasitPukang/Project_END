const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  const users = [
    {
      employeeId: 'EMP-001',
      name: 'ผู้ดูแลระบบ (Admin)',
      email: 'admin@ku.ac.th',
      password: '123',
      role: 'ADMIN',
      department: 'เทคโนโลยีสารสนเทศ',
      isFirstLogin: false,
    },
    {
      employeeId: 'EMP-002',
      name: 'หัวหน้าภาควิชา (Dept Head)',
      email: 'head@ku.ac.th',
      password: '123',
      role: 'DEPT_HEAD',
      department: 'วิทยาการคอมพิวเตอร์',
      isFirstLogin: false,
    },
    {
      employeeId: 'EMP-003',
      name: 'อาจารย์ผู้สอน (Lecturer)',
      email: 'lecturer@ku.ac.th',
      password: '123',
      role: 'LECTURER',
      department: 'วิทยาการคอมพิวเตอร์',
      isFirstLogin: false,
    },
    {
      employeeId: 'EMP-004',
      name: 'พนักงานทั่วไป (Staff)',
      email: 'employee@ku.ac.th',
      password: '123456',
      role: 'STAFF',
      department: 'บุคคล',
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

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
