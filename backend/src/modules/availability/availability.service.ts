import type { AppointmentType } from "@prisma/client"

import { AvailabilityRepository } from "./availability.repository"
import type {
    ListAvailabilityQuery,
    PublicAvailabilitySlot,
} from "./availability.types"

const availabilityRepository = new AvailabilityRepository()

const allowedAppointmentTypes: AppointmentType[] = [
    "ONLINE_EVALUATION",
    "IN_PERSON_EVALUATION",
    "TREATMENT_SESSION",
]

/**
 * Converts a string into a valid AppointmentType.
 *
 * We validate manually here because query params arrive as strings.
 * Later we can replace this with Zod schemas if needed.
 */
function parseAppointmentType(type: unknown): AppointmentType | undefined {
    if (typeof type !== "string") {
        return undefined
    }

    if (allowedAppointmentTypes.includes(type as AppointmentType)) {
        return type as AppointmentType
    }

    throw new Error("INVALID_APPOINTMENT_TYPE")
}

/**
 * Converts a date string into a Date.
 */
function parseOptionalDate(value: unknown): Date | undefined {
    if (typeof value !== "string" || value.trim() === "") {
        return undefined
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        throw new Error("INVALID_DATE")
    }

    return date
}

/**
 * Business layer for availability.
 *
 * This prepares clean data for the frontend booking page.
 */
export class AvailabilityService {
    async listAvailableSlots(
        query: ListAvailabilityQuery,
    ): Promise<PublicAvailabilitySlot[]> {
        const type = parseAppointmentType(query.type)
        const from = parseOptionalDate(query.from)
        const to = parseOptionalDate(query.to)

        const slots = await availabilityRepository.findAvailableSlots({
            type,
            from,
            to,
        })

        return slots.map((slot) => ({
            id: slot.id,
            startsAt: slot.startsAt.toISOString(),
            endsAt: slot.endsAt.toISOString(),
            appointmentType: slot.appointmentType,
            isOpen: slot.isOpen,
            note: slot.note,
        }))
    }
}