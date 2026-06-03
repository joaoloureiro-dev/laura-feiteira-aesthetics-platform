import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { Button } from "../components/ui/Button"
import { Container } from "../components/ui/Container"
import type {
    ApiResponse,
    AvailabilitySlot,
    Service,
} from "../features/services/types/services.types"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333"

type AppointmentType =
    | "ONLINE_EVALUATION"
    | "IN_PERSON_EVALUATION"
    | "TREATMENT_SESSION"

type CreatePendingBookingResponse = {
    booking: {
        id: string
    }
    checkoutUrl: string
}

/**
 * Converts appointment type into readable text.
 */
function getAppointmentTypeLabel(appointmentType: string | null) {
    if (appointmentType === "ONLINE_EVALUATION") {
        return "Avaliação por videochamada"
    }

    if (appointmentType === "IN_PERSON_EVALUATION") {
        return "Avaliação presencial"
    }

    if (appointmentType === "TREATMENT_SESSION") {
        return "Sessão/tratamento"
    }

    return "Tipo de marcação não selecionado"
}

/**
 * Validates appointment type from URL.
 *
 * If the URL does not include appointmentType, we default to TREATMENT_SESSION.
 * Example:
 * /booking?service=drenagem-linfatica
 */
function getValidAppointmentType(value: string | null): AppointmentType {
    if (
        value === "ONLINE_EVALUATION" ||
        value === "IN_PERSON_EVALUATION" ||
        value === "TREATMENT_SESSION"
    ) {
        return value
    }

    return "TREATMENT_SESSION"
}

/**
 * Temporary local user id.
 *
 * Important:
 * The real production flow must use the authenticated user id from JWT.
 * For now, this is only to let us test the booking endpoint locally.
 *
 * Add this to frontend/.env only for local tests:
 * VITE_TEST_USER_ID=your_test_user_id_from_neon
 */
const TEST_USER_ID = import.meta.env.VITE_TEST_USER_ID

export function BookingPage() {
    const [searchParams] = useSearchParams()

    const serviceSlug = searchParams.get("service")
    const appointmentType = getValidAppointmentType(
        searchParams.get("appointmentType"),
    )

    const [service, setService] = useState<Service | null>(null)
    const [slots, setSlots] = useState<AvailabilitySlot[]>([])
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function loadBookingData() {
            if (!serviceSlug) {
                setErrorMessage("Serviço não selecionado.")
                setLoading(false)
                return
            }

            try {
                const serviceResponse = await fetch(
                    `${API_BASE_URL}/services/${serviceSlug}`,
                )

                if (!serviceResponse.ok) {
                    throw new Error("Não foi possível carregar o serviço.")
                }

                const servicePayload =
                    (await serviceResponse.json()) as ApiResponse<Service>

                setService(servicePayload.data)

                const availabilityResponse = await fetch(
                    `${API_BASE_URL}/availability?type=${appointmentType}&serviceSlug=${serviceSlug}`,
                )

                if (!availabilityResponse.ok) {
                    throw new Error("Não foi possível carregar a disponibilidade.")
                }

                const availabilityPayload =
                    (await availabilityResponse.json()) as ApiResponse<AvailabilitySlot[]>

                setSlots(availabilityPayload.data)
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar os dados da marcação."

                setErrorMessage(message)
            } finally {
                setLoading(false)
            }
        }

        loadBookingData()
    }, [serviceSlug, appointmentType])

    async function handleCreatePendingBooking() {
        if (!service) {
            setErrorMessage("Serviço inválido.")
            return
        }

        if (!selectedSlotId) {
            setErrorMessage("Escolha um horário antes de continuar.")
            return
        }

        if (!TEST_USER_ID) {
            setErrorMessage(
                "Ainda não existe utilizador autenticado. Para teste local, adiciona VITE_TEST_USER_ID no frontend/.env. Em produção, este valor virá do JWT.",
            )
            return
        }

        try {
            setIsSubmitting(true)
            setErrorMessage(null)

            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: TEST_USER_ID,
                    serviceId: service.id,
                    serviceOptionId: null,
                    availabilitySlotId: selectedSlotId,
                    appointmentType,
                }),
            })

            if (!response.ok) {
                throw new Error("Não foi possível criar a reserva.")
            }

            const payload =
                (await response.json()) as ApiResponse<CreatePendingBookingResponse>

            /**
             * Temporary payment redirect.
             *
             * Later, checkoutUrl will come from Stripe/PayPal.
             * After successful payment, the backend will:
             * - confirm the booking;
             * - close the slot;
             * - send the confirmation email.
             */
            window.location.href = payload.data.checkoutUrl
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível criar a reserva."

            setErrorMessage(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-brand-ivory pt-32">
                <Container>
                    <div className="mx-auto max-w-4xl rounded-3xl bg-white/90 p-8 shadow-sm">
                        <div className="h-64 animate-pulse rounded-3xl bg-brand-ivory" />
                    </div>
                </Container>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-brand-ivory pb-24 pt-32">
            <Container>
                <div className="mx-auto max-w-4xl rounded-3xl bg-white/90 p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark-gold">
                        {getAppointmentTypeLabel(appointmentType)}
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold text-brand-charcoal">
                        {service ? `Marcação: ${service.name}` : "Agenda de marcação"}
                    </h1>

                    <p className="mt-5 leading-8 text-brand-gray">
                        Escolha um horário disponível. A vaga fica pendente até ao
                        pagamento. Após o pagamento, a marcação será confirmada, a vaga será
                        fechada na agenda e o cliente receberá um email automático de
                        confirmação.
                    </p>

                    {errorMessage ? (
                        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    ) : null}

                    <div className="mt-8 grid gap-4">
                        {slots.length === 0 ? (
                            <p className="rounded-2xl bg-brand-ivory p-4 text-center text-sm text-brand-gray">
                                Nenhum horário disponível para este tipo de marcação.
                            </p>
                        ) : (
                            slots.map((slot) => {
                                const isSelected = selectedSlotId === slot.id

                                return (
                                    <button
                                        key={slot.id}
                                        type="button"
                                        className={`rounded-2xl border p-4 text-left transition ${isSelected
                                                ? "border-brand-gold bg-brand-ivory"
                                                : "border-brand-gold/10 bg-white hover:border-brand-gold/40"
                                            }`}
                                        onClick={() => setSelectedSlotId(slot.id)}
                                    >
                                        <p className="font-semibold text-brand-charcoal">
                                            {new Date(slot.startsAt).toLocaleDateString("pt-PT", {
                                                weekday: "long",
                                                day: "2-digit",
                                                month: "long",
                                            })}
                                        </p>

                                        <p className="mt-1 text-sm text-brand-gray">
                                            {new Date(slot.startsAt).toLocaleTimeString("pt-PT", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}{" "}
                                            -{" "}
                                            {new Date(slot.endsAt).toLocaleTimeString("pt-PT", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>

                                        {slot.note ? (
                                            <p className="mt-2 text-xs text-brand-gray">
                                                {slot.note}
                                            </p>
                                        ) : null}
                                    </button>
                                )
                            })
                        )}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button
                            type="button"
                            onClick={handleCreatePendingBooking}
                            disabled={!selectedSlotId || isSubmitting}
                        >
                            {isSubmitting ? "A preparar pagamento..." : "Continuar para pagamento"}
                        </Button>

                        <Button href="/" variant="secondary">
                            Voltar
                        </Button>
                    </div>
                </div>
            </Container>
        </main>
    )
}