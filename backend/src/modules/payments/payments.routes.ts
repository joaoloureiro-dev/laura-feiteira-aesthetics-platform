import type { FastifyInstance } from "fastify"

/**
 * Payment routes.
 *
 * Future responsibilities:
 * - create payment sessions;
 * - confirm payments;
 * - store payment status;
 * - connect bookings with paid reservations.
 */
export async function paymentsRoutes(app: FastifyInstance) {
    app.get("/payments/status", async () => {
        return {
            module: "payments",
            status: "ready",
        }
    })
}