import type { FastifyInstance } from "fastify"

/**
 * Analytics routes.
 *
 * Future responsibilities:
 * - expose owner dashboard analytics;
 * - show popular services;
 * - show booking conversion data;
 * - connect to Google Analytics data later.
 */
export async function analyticsRoutes(app: FastifyInstance) {
    app.get("/analytics/status", async () => {
        return {
            module: "analytics",
            status: "ready",
        }
    })
}