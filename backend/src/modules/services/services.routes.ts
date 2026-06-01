import type { FastifyInstance } from "fastify"

/**
 * Services routes.
 *
 * Future responsibilities:
 * - list aesthetic services;
 * - get service details;
 * - create and update services from owner dashboard;
 * - manage prices;
 * - manage promotions.
 */
export async function servicesRoutes(app: FastifyInstance) {
    app.get("/services/status", async () => {
        return {
            module: "services",
            status: "ready",
        }
    })
}