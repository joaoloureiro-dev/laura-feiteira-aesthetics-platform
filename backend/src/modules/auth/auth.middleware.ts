import type { UserRole } from "@prisma/client"
import type { FastifyReply, FastifyRequest } from "fastify"
import jwt from "jsonwebtoken"

import { env } from "../../config/env"
import { prisma } from "../../database/prisma"
import type { JwtPayload } from "./auth.types"

/**
 * Authentication middleware.
 *
 * Usage:
 * requireAuth()
 * requireAuth(["CLIENT"])
 * requireAuth(["OWNER"])
 * requireAuth(["ADMIN"])
 * requireAuth(["OWNER", "ADMIN"])
 */
export function requireAuth(allowedRoles?: UserRole[]) {
    return async function authMiddleware(
        request: FastifyRequest,
        reply: FastifyReply,
    ) {
        const authHeader = request.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return reply.status(401).send({
                error: {
                    code: "UNAUTHORIZED",
                    message: "Authentication token is required.",
                },
            })
        }

        const token = authHeader.replace("Bearer ", "")

        try {
            const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload

            const user = await prisma.user.findUnique({
                where: {
                    id: payload.userId,
                },
                select: {
                    id: true,
                    role: true,
                    tokenVersion: true,
                },
            })

            if (!user) {
                return reply.status(401).send({
                    error: {
                        code: "UNAUTHORIZED",
                        message: "User not found.",
                    },
                })
            }

            /**
             * Token versioning.
             *
             * If tokenVersion changes in DB, all old tokens become invalid.
             */
            if (user.tokenVersion !== payload.tokenVersion) {
                return reply.status(401).send({
                    error: {
                        code: "TOKEN_EXPIRED",
                        message: "Session is no longer valid.",
                    },
                })
            }

            if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
                return reply.status(403).send({
                    error: {
                        code: "FORBIDDEN",
                        message: "You do not have permission to access this resource.",
                    },
                })
            }

            request.user = {
                userId: user.id,
                role: user.role,
                tokenVersion: user.tokenVersion,
            }
        } catch {
            return reply.status(401).send({
                error: {
                    code: "UNAUTHORIZED",
                    message: "Invalid authentication token.",
                },
            })
        }
    }
}