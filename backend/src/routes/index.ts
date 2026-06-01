import type { FastifyInstance } from "fastify"

import { analyticsRoutes } from "../modules/analytics/analytics.routes"
import { authRoutes } from "../modules/auth/auth.routes"
import { availabilityRoutes } from "../modules/availability/availability.routes"
import { bookingsRoutes } from "../modules/bookings/bookings.routes"
import { emailsRoutes } from "../modules/emails/emails.routes"
import { paymentsRoutes } from "../modules/payments/payments.routes"
import { servicesRoutes } from "../modules/services/services.routes"
import { usersRoutes } from "../modules/users/users.routes"
import { healthRoutes } from "./health.routes"

/**
 * Registers all API routes in one place.
 *
 * Why this exists:
 * app.ts should stay clean and focused on app configuration.
 * This file becomes the route registry for the backend.
 */
export async function registerRoutes(app: FastifyInstance) {
    app.register(healthRoutes)

    /**
     * Business modules.
     * Each module owns its routes and, later, its services, schemas and repositories.
     */
    app.register(authRoutes)
    app.register(usersRoutes)
    app.register(servicesRoutes)
    app.register(bookingsRoutes)
    app.register(availabilityRoutes)
    app.register(emailsRoutes)
    app.register(paymentsRoutes)
    app.register(analyticsRoutes)
}