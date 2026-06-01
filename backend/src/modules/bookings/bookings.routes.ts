import type { FastifyInstance } from "fastify"

/**
 * Booking routes.
 *
 * Future responsibilities:
 * - create bookings;
 * - list client bookings;
 * - list owner bookings;
 * - cancel or reschedule bookings;
 * - prevent double booking for the same date and time.
 */
export async function bookingsRoutes(app: FastifyInstance) {
    app.get("/bookings/status", async () => {
        return {
            module: "bookings",
            status: "ready",
        }
    })
}