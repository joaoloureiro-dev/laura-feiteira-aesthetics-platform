import type { PrismaClient } from "@prisma/client"

/**
 * Creates a Date object for tomorrow with a specific hour and minute.
 *
 * This keeps test availability slots always in the future when we run the seed.
 */
function createTomorrowDate(hour: number, minute: number) {
    const date = new Date()

    date.setDate(date.getDate() + 1)
    date.setHours(hour, minute, 0, 0)

    return date
}

/**
 * Seeds development/test availability slots.
 *
 * These slots are only for local testing.
 * Later, Laura will manage availability from the owner dashboard.
 */
export async function seedAvailabilitySlots(
    prisma: PrismaClient,
    professionalId: string,
) {
    const slots = [
        {
            professionalId,
            startsAt: createTomorrowDate(10, 0),
            endsAt: createTomorrowDate(10, 30),
            appointmentType: "ONLINE_EVALUATION" as const,
            isOpen: true,
            note: "Avaliação online",
        },
        {
            professionalId,
            startsAt: createTomorrowDate(11, 0),
            endsAt: createTomorrowDate(11, 30),
            appointmentType: "IN_PERSON_EVALUATION" as const,
            isOpen: true,
            note: "Avaliação presencial",
        },
        {
            professionalId,
            startsAt: createTomorrowDate(14, 0),
            endsAt: createTomorrowDate(15, 0),
            appointmentType: "TREATMENT_SESSION" as const,
            isOpen: true,
            note: "Sessão/tratamento",
        },
    ]

    for (const slot of slots) {
        const existingSlot = await prisma.availabilitySlot.findFirst({
            where: {
                professionalId: slot.professionalId,
                startsAt: slot.startsAt,
            },
        })

        if (existingSlot) {
            await prisma.availabilitySlot.update({
                where: {
                    id: existingSlot.id,
                },
                data: {
                    endsAt: slot.endsAt,
                    appointmentType: slot.appointmentType,
                    isOpen: slot.isOpen,
                    note: slot.note,
                },
            })

            continue
        }

        await prisma.availabilitySlot.create({
            data: slot,
        })
    }
}