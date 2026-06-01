import "dotenv/config"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"

/**
 * Prisma PostgreSQL adapter.
 *
 * Prisma 7 requires a driver adapter for database connections.
 * For PostgreSQL, we use @prisma/adapter-pg.
 */
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

/**
 * Prisma client instance.
 *
 * Why this exists:
 * We centralize Prisma access in one file so modules do not create
 * multiple database connections by accident.
 *
 * The adapter is passed to PrismaClient because Prisma 7 no longer
 * creates the PostgreSQL connection internally by default.
 */
export const prisma = new PrismaClient({
    adapter,
})