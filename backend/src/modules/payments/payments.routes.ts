import type { FastifyInstance } from "fastify"

import { requireAuth } from "../auth/auth.middleware"

/**
 * Payment routes.
 *
 * Responsibilities:
 * - create payment sessions;
 * - confirm payments;
 * - store payment status;
 * - connect bookings with paid reservations.
 *
 * Security:
 * Payment management/status routes are visible only to OWNER and ADMIN.
 *
 * Later:
 * Payment provider webhooks should have their own signature validation
 * instead of normal JWT authentication.
 */
export async function paymentsRoutes(app: FastifyInstance) {
    app.get(
        "/payments/status",
        {
            preHandler: requireAuth(["OWNER", "ADMIN"]),
        },
        async () => {
            return {
                module: "payments",
                status: "ready",
            }
        },
    )
}