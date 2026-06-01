import type { FastifyInstance } from "fastify"

/**
 * Health routes.
 *
 * Why this exists:
 * A health check endpoint is useful for:
 * - local testing;
 * - Railway/Render monitoring;
 * - future uptime checks;
 * - confirming the API is alive.
 */
export async function healthRoutes(app: FastifyInstance) {
    app.get("/health", async () => {
        return {
            status: "ok",
            service: "laura-feiteira-api",
            timestamp: new Date().toISOString(),
        }
    })
}