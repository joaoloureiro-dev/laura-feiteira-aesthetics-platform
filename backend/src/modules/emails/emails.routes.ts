import type { FastifyInstance } from "fastify"

import { requireAuth } from "../auth/auth.middleware"

/**
 * Email routes.
 *
 * Responsibilities:
 * - send booking confirmations;
 * - send booking reminders;
 * - send 30-day treatment follow-up emails;
 * - send Google review request emails;
 * - support owner quick email actions.
 *
 * Email delivery will be implemented with Nodemailer.
 *
 * Security:
 * Email operations are visible only to OWNER and ADMIN.
 */
export async function emailsRoutes(app: FastifyInstance) {
    app.get(
        "/emails/status",
        {
            preHandler: requireAuth(["OWNER", "ADMIN"]),
        },
        async () => {
            return {
                module: "emails",
                status: "ready",
                provider: "nodemailer",
            }
        },
    )
}