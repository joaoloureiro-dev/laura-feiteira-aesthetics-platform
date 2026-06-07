import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import fastify from "fastify"

import { env } from "./config/env"
import { registerRoutes } from "./routes"

/**
 * Builds the Fastify application.
 *
 * This file is responsible for global app configuration:
 * - logger;
 * - security headers;
 * - CORS;
 * - route registry.
 *
 * Individual module routes should be registered only inside ./routes.
 */
export async function buildApp() {
    const app = fastify({
        logger: {
            level: env.NODE_ENV === "production" ? "info" : "debug",
        },
    })

    /**
     * Helmet adds useful security headers to API responses.
     */
    await app.register(helmet)

    /**
     * CORS controls which frontend is allowed to call this backend.
     *
     * In development:
     * FRONTEND_URL=http://localhost:5173
     *
     * In production:
     * FRONTEND_URL=https://your-vercel-domain.com
     */
    await app.register(cors, {
        origin: env.FRONTEND_URL,
        credentials: true,
    })

    /**
     * Register all application routes from the central route registry.
     *
     * Important:
     * Do not register authRoutes, servicesRoutes, bookingsRoutes, etc.
     * directly here, otherwise Fastify will throw duplicated route errors.
     */
    await app.register(registerRoutes)

    return app
}