import type { AppointmentType } from "@prisma/client"

/**
 * Query params accepted by GET /availability.
 *
 * Example:
 * /availability?type=ONLINE_EVALUATION
 * /availability?type=IN_PERSON_EVALUATION
 * /availability?type=TREATMENT_SESSION
 */
export type ListAvailabilityQuery = {
    type?: AppointmentType
    from?: string
    to?: string
}

/**
 * Public availability slot returned to the frontend.
 *
 * The database field is called "type", but the frontend receives
 * "appointmentType" for clarity.
 */
export type PublicAvailabilitySlot = {
    id: string
    startsAt: string
    endsAt: string
    appointmentType: AppointmentType
    isOpen: boolean
    note: string | null
}