import type { FastifyInstance } from "fastify"

/**
 * User routes.
 *
 * Future responsibilities:
 * - manage client profiles;
 * - manage owner/admin accounts;
 * - update personal data;
 * - assign roles;
 * - protect role-based access.
 */
export async function usersRoutes(app: FastifyInstance) {
    app.get("/users/status", async () => {
        return {
            module: "users",
            status: "ready",
        }
    })
}