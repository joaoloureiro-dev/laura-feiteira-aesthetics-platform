import { prisma } from "../../database/prisma"

import type { CreatePendingBookingBody } from "./bookings.types"

/**
 * Repository responsible for booking database operations.
 *
 * Rules:
 * - Repositories talk to Prisma.
 * - Business rules stay in the service layer.
 */
export class BookingsRepository {
    async findAvailabilitySlotById(id: string) {
        return prisma.availabilitySlot.findUnique({
            where: {
                id,
            },
        })
    }

    async createPendingBooking(data: CreatePendingBookingBody) {
        return prisma.booking.create({
            data: {
                userId: data.userId,
                serviceId: data.serviceId,
                serviceOptionId: data.serviceOptionId ?? null,
                availabilitySlotId: data.availabilitySlotId,
                appointmentType: data.appointmentType,
                status: "PENDING",
                paymentStatus: "UNPAID",
                clientNotes: data.clientNotes,
            },
        })
    }

    /**
     * Confirms a paid booking and closes the selected slot.
     *
     * This must happen in one transaction because we do not want:
     * - booking confirmed but slot still open;
     * - slot closed but booking not confirmed.
     */
    async confirmPaidBooking(bookingId: string) {
        return prisma.$transaction(async (tx) => {
            const booking = await tx.booking.update({
                where: {
                    id: bookingId,
                },
                data: {
                    status: "CONFIRMED",
                    paymentStatus: "PAID",
                },
                include: {
                    user: true,
                    service: true,
                    serviceOption: true,
                    availabilitySlot: true,
                },
            })

            await tx.availabilitySlot.update({
                where: {
                    id: booking.availabilitySlotId,
                },
                data: {
                    isOpen: false,
                },
            })

            return booking
        })
    }
}