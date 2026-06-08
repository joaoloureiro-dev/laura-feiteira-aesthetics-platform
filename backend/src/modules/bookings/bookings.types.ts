import type { AppointmentType } from "@prisma/client"

export type CreatePendingBookingBody = {
    userId: string
    serviceId: string
    serviceOptionId?: string | null
    professionalId: string
    availabilitySlotId: string
    appointmentType: AppointmentType
    clientNotes?: string
}

export type ConfirmPaymentBody = {
    bookingId: string
}