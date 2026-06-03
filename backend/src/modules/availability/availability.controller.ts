import type { FastifyReply, FastifyRequest } from "fastify"

import { AvailabilityService } from "./availability.service"
import type { ListAvailabilityQuery } from "./availability.types"

const availabilityService = new AvailabilityService()

/**
 * HTTP controller for availability endpoints.
 */
export class AvailabilityController {
    /**
     * GET /availability
     *
     * Returns public open slots.
     */
    async listAvailableSlots(
        request: FastifyRequest<{
            Querystring: ListAvailabilityQuery
        }>,
        reply: FastifyReply,
    ) {
        try {
            const slots = await availabilityService.listAvailableSlots(request.query)

            return reply.status(200).send({
                data: slots,
            })
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "AVAILABILITY_FETCH_FAILED"

            if (message === "INVALID_APPOINTMENT_TYPE" || message === "INVALID_DATE") {
                return reply.status(400).send({
                    error: {
                        code: message,
                        message: "Invalid availability query.",
                    },
                })
            }

            return reply.status(500).send({
                error: {
                    code: "AVAILABILITY_FETCH_FAILED",
                    message: "Could not fetch availability slots.",
                },
            })
        }
    }
}