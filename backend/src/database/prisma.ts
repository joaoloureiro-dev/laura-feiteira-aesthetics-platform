import { PrismaClient } from "@prisma/client"

/**
 * Prisma client instance.
 *
 * Why this exists:
 * We centralize Prisma access in one file so modules do not create
 * multiple database connections by accident.
 *
 * With Prisma 6, the generated client is imported from "@prisma/client".
 */
export const prisma = new PrismaClient()