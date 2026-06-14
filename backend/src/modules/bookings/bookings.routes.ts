import type { FastifyInstance } from "fastify"

import { requireAuth } from "../auth/auth.middleware"
import { BookingsController } from "./bookings.controller"
import type {
    ConfirmPaymentBody,
    CreatePendingBookingBody,
} from "./bookings.types"

const bookingsController = new BookingsController()

/**
 * Booking routes.
 *
 * GET /bookings/me:
 * Returns bookings belonging to the authenticated CLIENT.
 *
 * POST /bookings:
 * Creates a booking for the authenticated CLIENT.
 *
 * POST /bookings/confirm-payment:
 * Temporarily confirms payment.
 * Later this must be triggered by the payment provider webhook.
 */
export async function bookingsRoutes(app: FastifyInstance) {
    app.get(
        "/bookings/me",
        {
            preHandler: requireAuth(["CLIENT"]),
        },
        (request, reply) =>
            bookingsController.getMyBookings(request, reply),
    )

    app.post<{
        Body: CreatePendingBookingBody
    }>(
        "/bookings",
        {
            preHandler: requireAuth(["CLIENT"]),
        },
        (request, reply) =>
            bookingsController.createPendingBooking(request, reply),
    )

    /**
     * Temporary payment confirmation endpoint.
     *
     * Later this should be replaced by a payment provider webhook.
     * For now, only OWNER and ADMIN can manually confirm payments.
     */
    app.post<{
        Body: ConfirmPaymentBody
    }>(
        "/bookings/confirm-payment",
        {
            preHandler: requireAuth(["OWNER", "ADMIN"]),
        },
        (request, reply) =>
            bookingsController.confirmPayment(request, reply),
    )
}