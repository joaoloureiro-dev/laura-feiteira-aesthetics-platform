import type { FastifyReply, FastifyRequest } from "fastify"

import { BookingsService } from "./bookings.service"
import type {
    ConfirmPaymentBody,
    CreatePendingBookingBody,
} from "./bookings.types"

const bookingsService = new BookingsService()

/**
 * HTTP controller for booking endpoints.
 *
 * Controllers handle:
 * - request body;
 * - response status;
 * - error response shape.
 */
export class BookingsController {
    async createPendingBooking(
        request: FastifyRequest<{
            Body: CreatePendingBookingBody
        }>,
        reply: FastifyReply,
    ) {
        try {
            const result = await bookingsService.createPendingBooking(request.body)

            return reply.status(201).send({
                data: result,
            })
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "BOOKING_CREATION_FAILED"

            if (
                message === "AVAILABILITY_SLOT_NOT_AVAILABLE" ||
                message === "INVALID_APPOINTMENT_TYPE_FOR_SLOT"
            ) {
                return reply.status(409).send({
                    error: {
                        code: message,
                        message: "The selected slot is not available for this booking.",
                    },
                })
            }

            return reply.status(500).send({
                error: {
                    code: "BOOKING_CREATION_FAILED",
                    message: "Could not create booking.",
                },
            })
        }
    }

    async confirmPayment(
        request: FastifyRequest<{
            Body: ConfirmPaymentBody
        }>,
        reply: FastifyReply,
    ) {
        try {
            const booking = await bookingsService.confirmPayment(request.body)

            return reply.status(200).send({
                data: booking,
            })
        } catch {
            return reply.status(500).send({
                error: {
                    code: "PAYMENT_CONFIRMATION_FAILED",
                    message: "Could not confirm payment.",
                },
            })
        }
    }
}