import type { AppointmentType } from "@prisma/client"

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
 * Business layer for booking logic.
 *
 * Rules:
 * - Online/presential evaluations are free and confirmed immediately.
 * - Treatment sessions stay PENDING until payment.
 * - A slot can only be used by the professional assigned to it.
 * - A professional must be assigned to the selected service.
 */
export class BookingsService {
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
         * The slot will only close after payment confirmation.
         */
        const booking = await bookingsRepository.createPendingTreatmentBooking(data)

        const checkoutUrl = `${env.FRONTEND_URL}/payment/checkout?booking=${booking.id}`

        return {
            booking,
            checkoutUrl,
            requiresPayment: true,
        }
    }

    async confirmPayment(data: ConfirmPaymentBody) {
        const booking = await bookingsRepository.confirmPaidBooking(data.bookingId)

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