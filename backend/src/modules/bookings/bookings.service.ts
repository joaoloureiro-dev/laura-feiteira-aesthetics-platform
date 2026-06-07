import { env } from "../../config/env"
import { EmailsService } from "../emails/emails.service"
import { BookingsRepository } from "./bookings.repository"
import type {
    ConfirmPaymentBody,
    CreatePendingBookingBody,
} from "./bookings.types"

const bookingsRepository = new BookingsRepository()
const emailsService = new EmailsService()

/**
 * Business layer for booking logic.
 *
 * Important business rule:
 * A booking only becomes CONFIRMED after payment.
 * The availability slot only closes after payment confirmation.
 */
export class BookingsService {
    /**
     * Creates a booking before payment.
     *
     * The slot is checked, but it is not closed yet.
     * Later, when payment is confirmed, we close the slot.
     */
    async createPendingBooking(data: CreatePendingBookingBody) {
        const slot = await bookingsRepository.findAvailabilitySlotById(
            data.availabilitySlotId,
        )

        if (!slot || !slot.isOpen) {
            throw new Error("AVAILABILITY_SLOT_NOT_AVAILABLE")
        }

        if (slot.appointmentType !== data.appointmentType) {
            throw new Error("INVALID_APPOINTMENT_TYPE_FOR_SLOT")
        }

        const booking = await bookingsRepository.createPendingBooking({
            ...data,
            professionalId: slot.professionalId,
        })

        /**
         * Temporary checkout URL.
         *
         * Later:
         * This URL must come from Stripe/PayPal/another payment provider.
         */
        const checkoutUrl = `${env.FRONTEND_URL}/payment/checkout?booking=${booking.id}`

        return {
            booking,
            checkoutUrl,
        }
    }

    /**
     * Confirms payment.
     *
     * After payment:
     * - booking becomes CONFIRMED;
     * - paymentStatus becomes PAID;
     * - availability slot is closed;
     * - client receives automatic confirmation email.
     */
    async confirmPayment(data: ConfirmPaymentBody) {
        const booking = await bookingsRepository.confirmPaidBooking(data.bookingId)

        await emailsService.sendBookingConfirmationEmail({
            to: booking.user.email,
            clientName: booking.user.name,
            serviceName: booking.service.name,
            appointmentType: booking.appointmentType,
            startsAt: booking.availabilitySlot.startsAt,
            endsAt: booking.availabilitySlot.endsAt,
        })

        return booking
    }
}