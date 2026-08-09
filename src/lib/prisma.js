// ===== BACKEND ONLY: Prisma Client Singleton =====
// ไฟล์นี้ใช้ได้บน Server Side เท่านั้น (API Routes)
// ห้ามนำไปใช้ใน Client Components โดยตรง

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
