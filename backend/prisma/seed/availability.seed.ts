import { addDays, setHours, setMinutes, setSeconds, setMilliseconds } from "date-fns"
import type { PrismaClient } from "@prisma/client"

/**
 * Creates a date for tomorrow with a specific hour/minute.
 *
 * Why this exists:
 * We want test availability slots to always be created for "tomorrow",
 * instead of hardcoding a fixed date that becomes outdated.
 */
function createTomorrowDate(hour: number, minute: number) {
    const tomorrow = addDays(new Date(), 1)

    return setMilliseconds(
        setSeconds(setMinutes(setHours(tomorrow, hour), minute), 0),
        0,
    )
}

/**
 * Seeds test availability slots.
 *
 * Important:
 * These slots are only for local/dev testing.
 * Later, the owner dashboard will create and manage availability.
 */
export async function seedAvailabilitySlots(prisma: PrismaClient) {
    const slots = [
        {
            startsAt: createTomorrowDate(10, 0),
            endsAt: createTomorrowDate(10, 30),
            type: "ONLINE_EVALUATION" as const,
            isOpen: true,
            note: "Avaliação online",
        },
        {
            startsAt: createTomorrowDate(11, 0),
            endsAt: createTomorrowDate(11, 30),
            type: "IN_PERSON_EVALUATION" as const,
            isOpen: true,
            note: "Avaliação presencial",
        },
        {
            startsAt: createTomorrowDate(14, 0),
            endsAt: createTomorrowDate(15, 0),
            type: "TREATMENT_SESSION" as const,
            isOpen: true,
            note: "Sessão/tratamento",
        },
    ]

    for (const slot of slots) {
        await prisma.availabilitySlot.upsert({
            where: {
                startsAt_type: {
                    startsAt: slot.startsAt,
                    type: slot.type,
                },
            },
            update: {
                endsAt: slot.endsAt,
                isOpen: slot.isOpen,
                note: slot.note,
            },
            create: slot,
        })
    }
}