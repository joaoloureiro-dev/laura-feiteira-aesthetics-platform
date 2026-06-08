import type { FastifyInstance } from "fastify"

import { requireAuth } from "../auth/auth.middleware"

/**
 * Analytics routes.
 *
 * Responsibilities:
 * - expose owner dashboard analytics;
 * - show popular services;
 * - show booking conversion data;
 * - connect to Google Analytics data later.
 *
 * Security:
 * Analytics are visible only to OWNER and ADMIN.
 */
export async function analyticsRoutes(app: FastifyInstance) {
    app.get(
        "/analytics/status",
        {
            preHandler: requireAuth(["OWNER", "ADMIN"]),
        },
        async () => {
            return {
                module: "analytics",
                status: "ready",
            }
        },
    )
}