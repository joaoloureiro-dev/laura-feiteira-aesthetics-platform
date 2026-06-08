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
 *
 * Business rules stay inside bookings.service.ts.
 */
export class BookingsController {
    /**
     * POST /bookings
     *
     * Creates a booking.
     *
     * Rules:
     * - ONLINE_EVALUATION and IN_PERSON_EVALUATION are confirmed immediately.
     * - TREATMENT_SESSION stays pending until payment.
     */
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
                message === "INVALID_APPOINTMENT_TYPE_FOR_SLOT" ||
                message === "INVALID_PROFESSIONAL_FOR_SLOT" ||
                message === "PROFESSIONAL_DOES_NOT_PROVIDE_SERVICE"
            ) {
                return reply.status(409).send({
                    error: {
                        code: message,
                        message: "The selected booking option is not available.",
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

    /**
     * POST /bookings/confirm-payment
     *
     * Temporary endpoint for confirming payment.
     *
     * Later this should be called by the payment provider webhook,
     * not manually from the frontend.
     */
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