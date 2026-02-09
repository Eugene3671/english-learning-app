import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

if (!globalForPrisma.prisma) {
  // Створюємо стандартний пул підключень Node.js
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  // Створюємо адаптер, який Prisma 7 тепер вимагає для PostgreSQL
  const adapter = new PrismaPg(pool);

  globalForPrisma.prisma = new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma;
