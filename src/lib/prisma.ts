/**
 * Prisma Client Singleton
 * 
 * This file creates a single instance of Prisma Client to be used throughout the application.
 * In development, it prevents multiple instances from being created during hot reloading.
 */

import { PrismaClient } from '@prisma/client';
import { app } from './env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: app.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
  });

if (app.isDevelopment) globalForPrisma.prisma = prisma;

