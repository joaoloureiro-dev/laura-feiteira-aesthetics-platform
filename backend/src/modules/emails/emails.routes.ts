import type { FastifyInstance } from "fastify"

/**
 * Email routes.
 *
 * Future responsibilities:
 * - send booking confirmations;
 * - send booking reminders;
 * - send 30-day treatment follow-up emails;
 * - send Google review request emails;
 * - support owner quick email actions.
 *
 * Email delivery will be implemented with Nodemailer.
 */
export async function emailsRoutes(app: FastifyInstance) {
    app.get("/emails/status", async () => {
        return {
            module: "emails",
            status: "ready",
            provider: "nodemailer",
        }
    })
}