import type { FastifyInstance } from "fastify"

import { AuthController } from "./auth.controller"
import { requireAuth } from "./auth.middleware"
import type { LoginBody, RegisterBody } from "./auth.types"

const authController = new AuthController()

/**
 * Auth routes.
 *
 * Public:
 * - POST /auth/register
 * - POST /auth/login
 *
 * Protected:
 * - GET /auth/me
 */
export async function authRoutes(app: FastifyInstance) {
    app.post<{
        Body: RegisterBody
    }>("/auth/register", (request, reply) =>
        authController.register(request, reply),
    )

    app.post<{
        Body: LoginBody
    }>("/auth/login", (request, reply) =>
        authController.login(request, reply),
    )

    app.get("/auth/me", {
        preHandler: requireAuth(),
        handler: (request, reply) => authController.me(request, reply),
    })
}