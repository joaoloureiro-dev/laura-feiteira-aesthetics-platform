import type { FastifyInstance } from "fastify"

/**
 * Authentication routes.
 *
 * Future responsibilities:
 * - register clients;
 * - login with email and password;
 * - login with Google OAuth;
 * - refresh JWT tokens;
 * - logout;
 * - recover password.
 */
export async function authRoutes(app: FastifyInstance) {
    app.get("/auth/status", async () => {
        return {
            module: "auth",
            status: "ready",
        }
    })
}