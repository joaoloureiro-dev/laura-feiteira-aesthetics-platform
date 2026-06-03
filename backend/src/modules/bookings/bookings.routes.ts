import type { FastifyInstance } from "fastify"

import { BookingsController } from "./bookings.controller"
import type {
    ConfirmPaymentBody,
    CreatePendingBookingBody,
} from "./bookings.types"

const bookingsController = new BookingsController()

/**
 * Booking routes.
 *
 * POST /bookings:
 * Creates a PENDING + UNPAID booking and returns a temporary checkout URL.
 *
 * POST /bookings/confirm-payment:
 * Temporarily confirms payment.
 * Later this must be triggered by the payment provider webhook.
 */
export async function bookingsRoutes(app: FastifyInstance) {
    app.post<{
        Body: CreatePendingBookingBody
    }>("/bookings", (request, reply) =>
        bookingsController.createPendingBooking(request, reply),
    )

    app.post<{
        Body: ConfirmPaymentBody
    }>("/bookings/confirm-payment", (request, reply) =>
        bookingsController.confirmPayment(request, reply),
    )
}