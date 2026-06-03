import type { AppointmentType } from "@prisma/client"

/**
 * Body used to create a booking before payment.
 *
 * Important:
 * The booking is created as PENDING + UNPAID.
 * The availability slot is only closed after payment confirmation.
 */
export type CreatePendingBookingBody = {
    userId: string
    serviceId: string
    serviceOptionId?: string | null
    availabilitySlotId: string
    appointmentType: AppointmentType
    clientNotes?: string
}

/**
 * Body used to confirm a payment.
 *
 * Temporary:
 * Later this should be triggered by a real payment provider webhook.
 */
export type ConfirmPaymentBody = {
    bookingId: string
}