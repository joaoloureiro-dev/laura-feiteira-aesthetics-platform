import type { FastifyInstance } from "fastify"

import { requireAuth } from "../auth/auth.middleware"

/**
 * User routes.
 *
 * Responsibilities:
 * - manage client profiles;
 * - manage owner/admin accounts;
 * - update personal data;
 * - assign roles;
 * - protect role-based access.
 *
 * Security:
 * User management is an ADMIN-only area.
 */
export async function usersRoutes(app: FastifyInstance) {
    app.get(
        "/users/status",
        {
            preHandler: requireAuth(["ADMIN"]),
        },
        async () => {
            return {
                module: "users",
                status: "ready",
            }
        },
    )
}