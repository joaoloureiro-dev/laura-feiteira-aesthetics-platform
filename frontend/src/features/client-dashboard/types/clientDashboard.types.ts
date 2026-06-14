export type ClientBookingStatus =
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED"
    | string

export type ClientPaymentStatus =
    | "UNPAID"
    | "PAID"
    | "REFUNDED"
    | "FAILED"
    | string

export type ClientAppointmentType =
    | "ONLINE_EVALUATION"
    | "IN_PERSON_EVALUATION"
    | "TREATMENT_SESSION"

export type ClientBooking = {
    id: string
    appointmentType: ClientAppointmentType
    status: ClientBookingStatus
    paymentStatus: ClientPaymentStatus
    clientNotes: string | null
    createdAt: string
    updatedAt: string

    service: {
        id: string
        name: string
        slug: string
    }

    serviceOption: {
        id: string
        name: string
        priceCents: number | null
        priceLabel: string | null
        durationMinutes: number | null
    } | null

    professional: {
        id: string
        name: string
        slug: string
    }

    availabilitySlot: {
        id: string
        startsAt: string
        endsAt: string
        appointmentType: ClientAppointmentType
    }
}

export type ApiResponse<T> = {
    data: T
}