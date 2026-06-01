import type { FastifyInstance } from "fastify"

/**
 * Availability routes.
 *
 * Future responsibilities:
 * - define open time slots;
 * - block unavailable dates and hours;
 * - automatically close booked slots;
 * - allow the owner to manage the agenda.
 */
export async function availabilityRoutes(app: FastifyInstance) {
    app.get("/availability/status", async () => {
        return {
            module: "availability",
            status: "ready",
        }
    })
}