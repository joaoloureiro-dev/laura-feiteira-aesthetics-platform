import { Prisma, type AppointmentType } from "@prisma/client"

import { env } from "../../config/env"
import { EmailsService } from "../emails/emails.service"
import { BookingsRepository } from "./bookings.repository"
import type {
    ConfirmPaymentBody,
    CreatePendingBookingBody,
} from "./bookings.types"

const bookingsRepository = new BookingsRepository()
const emailsService = new EmailsService()

function isEvaluation(appointmentType: AppointmentType) {
    return (
        appointmentType === "ONLINE_EVALUATION" ||
        appointmentType === "IN_PERSON_EVALUATION"
    )
}

/**
 * Checks whether Prisma rejected a booking because the selected
 * availability slot already belongs to another booking.
 */
function isUniqueConstraintError(error: unknown) {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
    )
}

/**
 * Business layer for booking logic.
 *
 * Rules:
 * - Online and presential evaluations are free and confirmed immediately.
 * - Treatment sessions stay PENDING until payment.
 * - A slot can only be used by the professional assigned to it.
 * - A professional must be assigned to the selected service.
 * - A client can only access bookings associated with their JWT userId.
 */
export class BookingsService {
    /**
     * Returns all bookings belonging to the authenticated client.
     */
    async getClientBookings(userId: string) {
        const bookings = await bookingsRepository.findBookingsByUserId(userId)

        return bookings.sort(
            (firstBooking, secondBooking) =>
                firstBooking.availabilitySlot.startsAt.getTime() -
                secondBooking.availabilitySlot.startsAt.getTime(),
        )
    }

    async createPendingBooking(data: CreatePendingBookingBody) {
        const slot = await bookingsRepository.findAvailabilitySlotById(
            data.availabilitySlotId,
        )

        if (!slot || !slot.isOpen) {
            throw new Error("AVAILABILITY_SLOT_NOT_AVAILABLE")
        }

        if (slot.appointmentType !== data.appointmentType) {
            throw new Error("INVALID_APPOINTMENT_TYPE_FOR_SLOT")
        }

        if (slot.professionalId !== data.professionalId) {
            throw new Error("INVALID_PROFESSIONAL_FOR_SLOT")
        }

        const serviceProfessional =
            await bookingsRepository.findServiceProfessional(
                data.serviceId,
                data.professionalId,
            )

        if (!serviceProfessional) {
            throw new Error("PROFESSIONAL_DOES_NOT_PROVIDE_SERVICE")
        }

        try {
            /**
             * Evaluations do not require payment.
             * They are confirmed immediately and the slot closes immediately.
             */
            if (isEvaluation(data.appointmentType)) {
                const booking =
                    await bookingsRepository.createConfirmedEvaluationBooking(data)

                await emailsService.sendBookingConfirmationEmail({
                    to: booking.user.email,
                    clientName: booking.user.name,
                    serviceName: booking.service.name,
                    appointmentType: booking.appointmentType,
                    startsAt: booking.availabilitySlot.startsAt,
                    endsAt: booking.availabilitySlot.endsAt,
                })

                return {
                    booking,
                    checkoutUrl: null,
                    requiresPayment: false,
                }
            }

            /**
             * Treatment sessions require payment.
             *
             * The unique availabilitySlotId constraint prevents two clients
             * from creating bookings for the same slot at the same time.
             */
            const booking =
                await bookingsRepository.createPendingTreatmentBooking(data)

            const checkoutUrl =
                `${env.FRONTEND_URL}/payment/checkout?booking=${booking.id}`

            return {
                booking,
                checkoutUrl,
                requiresPayment: true,
            }
        } catch (error) {
            if (isUniqueConstraintError(error)) {
                throw new Error("AVAILABILITY_SLOT_NOT_AVAILABLE")
            }

            throw error
        }
    }

    async confirmPayment(data: ConfirmPaymentBody) {
        const booking = await bookingsRepository.confirmPaidBooking(
            data.bookingId,
        )

        await emailsService.sendBookingConfirmationEmail({
            to: booking.user.email,
            clientName: booking.user.name,
            serviceName: booking.service.name,
            appointmentType: booking.appointmentType,
            startsAt: booking.availabilitySlot.startsAt,
            endsAt: booking.availabilitySlot.endsAt,
        })

        return booking
    }
}