import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import fastify from "fastify"

import { env } from "./config/env"
import { healthRoutes } from "./routes/health.routes"

/**
 * Builds the Fastify application.
 *
 * Why we use a function:
 * This makes the app easier to test later, because tests can create
 * an app instance without starting the real HTTP server.
 */
export function buildApp() {
    const app = fastify({
        logger: {
            level: env.NODE_ENV === "production" ? "info" : "debug",
        },
    })

    /**
     * Helmet adds useful security headers to API responses.
     * This is a standard production security practice.
     */
    app.register(helmet)

    /**
     * CORS controls which frontend can access this backend.
     * Locally we allow http://localhost:5173.
     */
    app.register(cors, {
        origin: env.FRONTEND_URL,
        credentials: true,
    })

    /**
     * API routes.
     * Later we will register auth, users, bookings, services and emails here.
     */
    app.register(healthRoutes)

    return app
}