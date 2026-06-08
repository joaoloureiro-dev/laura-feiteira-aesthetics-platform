import { prisma } from "../../database/prisma"
import type { CreatePendingBookingBody } from "./bookings.types"

/**
 * Repository responsible for booking database operations.
 *
 * Repositories only talk to Prisma.
 * Business rules stay in bookings.service.ts.
 */
export class BookingsRepository {
    async findAvailabilitySlotById(id: string) {
        return prisma.availabilitySlot.findUnique({
            where: {
                id,
            },
        })
    }

    async findServiceProfessional(serviceId: string, professionalId: string) {
        return prisma.serviceProfessional.findUnique({
            where: {
                serviceId_professionalId: {
                    serviceId,
                    professionalId,
                },
            },
        })
    }

    /**
     * Creates a treatment session booking before payment.
     *
     * Treatment sessions are PENDING + UNPAID until payment is confirmed.
     */
    async createPendingTreatmentBooking(data: CreatePendingBookingBody) {
        return prisma.booking.create({
            data: {
                userId: data.userId,
                serviceId: data.serviceId,
                serviceOptionId: data.serviceOptionId ?? null,
                professionalId: data.professionalId,
                availabilitySlotId: data.availabilitySlotId,
                appointmentType: data.appointmentType,
                status: "PENDING",
                paymentStatus: "UNPAID",
                clientNotes: data.clientNotes,
            },
        })
    }

    /**
     * Creates a free evaluation booking and closes the slot immediately.
     *
     * Evaluations do not require payment.
     */
    async createConfirmedEvaluationBooking(data: CreatePendingBookingBody) {
        return prisma.$transaction(async (tx) => {
            const booking = await tx.booking.create({
                data: {
                    userId: data.userId,
                    serviceId: data.serviceId,
                    serviceOptionId: data.serviceOptionId ?? null,
                    professionalId: data.professionalId,
                    availabilitySlotId: data.availabilitySlotId,
                    appointmentType: data.appointmentType,
                    status: "CONFIRMED",
                    paymentStatus: "UNPAID",
                    clientNotes: data.clientNotes,
                },
                include: {
                    user: true,
                    service: true,
                    serviceOption: true,
                    professional: true,
                    availabilitySlot: true,
                },
            })

            await tx.availabilitySlot.update({
                where: {
                    id: data.availabilitySlotId,
                },
                data: {
                    isOpen: false,
                },
            })

            return booking
        })
    }

    /**
     * Confirms a paid treatment booking and closes the selected slot.
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
                    professional: true,
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