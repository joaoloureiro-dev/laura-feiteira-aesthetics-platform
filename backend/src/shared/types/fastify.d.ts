import type { UserRole } from "@prisma/client"

declare module "fastify" {
    interface FastifyRequest {
        user?: {
            userId: string
            role: UserRole
            tokenVersion: number
        }
    }
}