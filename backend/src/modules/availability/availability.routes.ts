import type { FastifyInstance } from "fastify"

import { AvailabilityController } from "./availability.controller"
import type { ListAvailabilityQuery } from "./availability.types"

const availabilityController = new AvailabilityController()

/**
 * Availability routes.
 *
 * These endpoints are public for now because the booking page needs
 * to show available slots before the user completes the booking flow.
 *
 * Later, creating/editing slots will be protected for OWNER/ADMIN.
 */
export async function availabilityRoutes(app: FastifyInstance) {
    app.get<{
        Querystring: ListAvailabilityQuery
    }>("/availability", (request, reply) =>
        availabilityController.listAvailableSlots(request, reply),
    )
}