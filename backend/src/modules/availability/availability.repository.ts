import type { AppointmentType, Prisma } from "@prisma/client"

import { prisma } from "../../database/prisma"

type FindAvailableSlotsParams = {
    type?: AppointmentType
    from?: Date
    to?: Date
}

export class AvailabilityRepository {
    async findAvailableSlots({ type, from, to }: FindAvailableSlotsParams) {
        const where: Prisma.AvailabilitySlotWhereInput = {
            isOpen: true,
            startsAt: {
                gte: from ?? new Date(),
                ...(to ? { lte: to } : {}),
            },
            ...(type ? { appointmentType: type } : {}),
        }

        return prisma.availabilitySlot.findMany({
            where,
            orderBy: {
                startsAt: "asc",
            },
        })
    }
}