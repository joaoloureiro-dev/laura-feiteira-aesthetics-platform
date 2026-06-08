import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { Button } from "../components/ui/Button"
import { Container } from "../components/ui/Container"
import type {
    ApiResponse,
    AppointmentType,
    AvailabilitySlot,
    Service,
    ServiceProfessional,
} from "../features/services/types/services.types"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333"
const TEST_USER_ID = import.meta.env.VITE_TEST_USER_ID as string | undefined

type CreatePendingBookingResponse = {
    booking: {
        id: string
    }
    checkoutUrl?: string
}

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

function getAppointmentTypeLabel(appointmentType: AppointmentType) {
    if (appointmentType === "ONLINE_EVALUATION") {
        return "Avaliação por videochamada"
    }

    if (appointmentType === "IN_PERSON_EVALUATION") {
        return "Avaliação presencial"
    }

    return "Sessão/tratamento"
}

function isEvaluation(appointmentType: AppointmentType) {
    return (
        appointmentType === "ONLINE_EVALUATION" ||
        appointmentType === "IN_PERSON_EVALUATION"
    )
}

export function BookingPage() {
    const [searchParams] = useSearchParams()

    const serviceSlug = searchParams.get("service")
    const appointmentType = getValidAppointmentType(
        searchParams.get("appointmentType"),
    )

    const [service, setService] = useState<Service | null>(null)
    const [slots, setSlots] = useState<AvailabilitySlot[]>([])
    const [selectedProfessionalId, setSelectedProfessionalId] =
        useState<string | null>(null)
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)

    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function loadBookingData() {
            if (!serviceSlug) {
                setErrorMessage("Serviço não selecionado.")
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                setErrorMessage(null)

                const serviceResponse = await fetch(
                    `${API_BASE_URL}/services/${serviceSlug}`,
                )

                if (!serviceResponse.ok) {
                    throw new Error("Não foi possível carregar o serviço selecionado.")
                }

                const servicePayload =
                    (await serviceResponse.json()) as ApiResponse<Service>

                setService(servicePayload.data)

                /**
                 * If there is only one professional, select it automatically.
                 * For now, this should be Laura Feiteira.
                 */
                if (servicePayload.data.professionals.length === 1) {
                    setSelectedProfessionalId(servicePayload.data.professionals[0].id)
                }

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
                setIsLoading(false)
            }
        }

        loadBookingData()
    }, [serviceSlug, appointmentType])

    async function handleCreateBooking() {
        if (!service) {
            setErrorMessage("Serviço inválido.")
            return
        }

        if (!selectedProfessionalId) {
            setErrorMessage("Escolha uma profissional antes de continuar.")
            return
        }

        if (!selectedSlotId) {
            setErrorMessage("Escolha um horário antes de continuar.")
            return
        }

        if (!TEST_USER_ID) {
            setErrorMessage(
                "Ainda não existe utilizador autenticado. Para teste local, adiciona VITE_TEST_USER_ID no frontend/.env. Depois vamos substituir isto pelo JWT.",
            )
            return
        }

        try {
            setIsSubmitting(true)
            setErrorMessage(null)
            setSuccessMessage(null)

            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: TEST_USER_ID,
                    serviceId: service.id,
                    serviceOptionId: null,
                    professionalId: selectedProfessionalId,
                    availabilitySlotId: selectedSlotId,
                    appointmentType,
                }),
            })

            if (!response.ok) {
                throw new Error("Não foi possível criar a marcação.")
            }

            const payload =
                (await response.json()) as ApiResponse<CreatePendingBookingResponse>

            /**
             * Evaluations do not require payment.
             * They should be confirmed directly by the backend.
             */
            if (isEvaluation(appointmentType)) {
                setSuccessMessage(
                    "A sua avaliação foi marcada com sucesso. Receberá a confirmação por email.",
                )

                return
            }

            /**
             * Treatment sessions continue to payment.
             */
            if (payload.data.checkoutUrl) {
                window.location.href = payload.data.checkoutUrl
                return
            }

            setSuccessMessage("Marcação criada. Falta configurar o pagamento.")
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível criar a marcação."

            setErrorMessage(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <main className="min-h-screen bg-brand-ivory pt-32">
                <Container>
                    <div className="mx-auto max-w-4xl rounded-3xl bg-white/90 p-8 shadow-sm">
                        <div className="h-72 animate-pulse rounded-3xl bg-brand-ivory" />
                    </div>
                </Container>
            </main>
        )
    }

    const professionals = service?.professionals ?? []

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
                        Escolha a profissional e o horário disponível. As avaliações não
                        precisam de pagamento. As sessões/tratamentos seguem para pagamento
                        quando aplicável.
                    </p>

                    {errorMessage ? (
                        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    ) : null}

                    {successMessage ? (
                        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                            {successMessage}
                        </div>
                    ) : null}

                    <section className="mt-10">
                        <h2 className="text-xl font-semibold text-brand-charcoal">
                            Profissional
                        </h2>

                        <div className="mt-5 grid gap-4">
                            {professionals.length === 0 ? (
                                <p className="rounded-2xl bg-brand-ivory p-4 text-sm text-brand-gray">
                                    Nenhuma profissional disponível para este serviço.
                                </p>
                            ) : (
                                professionals.map((professional: ServiceProfessional) => {
                                    const isSelected =
                                        selectedProfessionalId === professional.id

                                    return (
                                        <button
                                            key={professional.id}
                                            type="button"
                                            className={`rounded-2xl border p-4 text-left transition ${isSelected
                                                    ? "border-brand-gold bg-brand-ivory"
                                                    : "border-brand-gold/10 bg-white hover:border-brand-gold/40"
                                                }`}
                                            onClick={() =>
                                                setSelectedProfessionalId(professional.id)
                                            }
                                        >
                                            <p className="font-semibold text-brand-charcoal">
                                                {professional.name}
                                            </p>

                                            <p className="mt-1 text-sm text-brand-gray">
                                                Profissional responsável pelo serviço.
                                            </p>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </section>

                    <section className="mt-10">
                        <h2 className="text-xl font-semibold text-brand-charcoal">
                            Horários disponíveis
                        </h2>

                        <div className="mt-5 grid gap-4">
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
                                            <p className="font-semibold capitalize text-brand-charcoal">
                                                {new Date(slot.startsAt).toLocaleDateString(
                                                    "pt-PT",
                                                    {
                                                        weekday: "long",
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    },
                                                )}
                                            </p>

                                            <p className="mt-1 text-sm text-brand-gray">
                                                {new Date(slot.startsAt).toLocaleTimeString(
                                                    "pt-PT",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    },
                                                )}{" "}
                                                -{" "}
                                                {new Date(slot.endsAt).toLocaleTimeString(
                                                    "pt-PT",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    },
                                                )}
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
                    </section>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button
                            type="button"
                            onClick={handleCreateBooking}
                            disabled={!selectedSlotId || !selectedProfessionalId || isSubmitting}
                        >
                            {isSubmitting
                                ? "A preparar marcação..."
                                : isEvaluation(appointmentType)
                                    ? "Confirmar avaliação"
                                    : "Continuar para pagamento"}
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