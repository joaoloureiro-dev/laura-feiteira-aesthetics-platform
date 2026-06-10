import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { Button } from "../components/ui/Button"
import { Container } from "../components/ui/Container"
import { useAuth } from "../features/auth/services/AuthContext"
import type {
    ApiResponse,
    AppointmentType,
    AvailabilitySlot,
    Service,
    ServiceProfessional,
} from "../features/services/types/services.types"
import { useToast } from "../features/toast/services/ToastContext"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333"

type CreateBookingResponse = {
    booking: {
        id: string
    }
    checkoutUrl: string | null
    requiresPayment: boolean
}

type ApiErrorPayload = {
    error?: {
        code?: string
        message?: string
    }
}

class ApiRequestError extends Error {
    code: string

    constructor(code: string, message: string) {
        super(message)
        this.code = code
    }
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

async function getApiError(response: Response) {
    const payload = (await response.json().catch(() => null)) as
        | ApiErrorPayload
        | null

    return {
        code: payload?.error?.code ?? "API_REQUEST_FAILED",
        message: payload?.error?.message ?? "Não foi possível concluir o pedido.",
    }
}

export function BookingPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { token, isAuthenticated, isLoading: isAuthLoading } = useAuth()
    const { showToast } = useToast()

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
                    (await availabilityResponse.json()) as ApiResponse<
                        AvailabilitySlot[]
                    >

                setSlots(availabilityPayload.data)
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar os dados da marcação."

                setErrorMessage(message)

                showToast({
                    type: "error",
                    title: "Erro ao carregar marcação",
                    message,
                })
            } finally {
                setIsLoading(false)
            }
        }

        loadBookingData()
    }, [serviceSlug, appointmentType, showToast])

    function redirectToLogin() {
        showToast({
            type: "warning",
            title: "Inicie sessão para reservar",
            message: "Para concluir a marcação, precisa de entrar na sua conta.",
        })

        navigate("/login", {
            state: {
                from: {
                    pathname: "/booking",
                    search: searchParams.toString()
                        ? `?${searchParams.toString()}`
                        : "",
                },
            },
        })
    }

    async function handleCreateBooking() {
        if (isAuthLoading) {
            showToast({
                type: "info",
                title: "A validar sessão",
                message: "Aguarde enquanto confirmamos o seu acesso.",
            })
            return
        }

        if (!isAuthenticated || !token) {
            redirectToLogin()
            return
        }

        if (!service) {
            setErrorMessage("Serviço inválido.")

            showToast({
                type: "error",
                title: "Serviço inválido",
                message: "Volte à página de serviços e selecione novamente.",
            })

            return
        }

        if (!selectedProfessionalId) {
            setErrorMessage("Escolha uma profissional antes de continuar.")

            showToast({
                type: "warning",
                title: "Escolha uma profissional",
                message: "Selecione a profissional responsável pela marcação.",
            })

            return
        }

        if (!selectedSlotId) {
            setErrorMessage("Escolha um horário antes de continuar.")

            showToast({
                type: "warning",
                title: "Escolha um horário",
                message: "Selecione uma vaga disponível para continuar.",
            })

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
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    serviceId: service.id,
                    serviceOptionId: null,
                    professionalId: selectedProfessionalId,
                    availabilitySlotId: selectedSlotId,
                    appointmentType,
                }),
            })

            if (!response.ok) {
                const apiError = await getApiError(response)

                throw new ApiRequestError(apiError.code, apiError.message)
            }

            const payload =
                (await response.json()) as ApiResponse<CreateBookingResponse>

            if (!payload.data.requiresPayment) {
                const message =
                    "A sua avaliação foi marcada com sucesso. Receberá a confirmação por email."

                setSuccessMessage(message)

                showToast({
                    type: "success",
                    title: "Avaliação confirmada",
                    message,
                })

                setSlots((currentSlots) =>
                    currentSlots.filter((slot) => slot.id !== selectedSlotId),
                )
                setSelectedSlotId(null)

                return
            }

            if (payload.data.checkoutUrl) {
                showToast({
                    type: "success",
                    title: "Marcação criada",
                    message: "Vamos redirecionar para o pagamento.",
                })

                window.location.href = payload.data.checkoutUrl
                return
            }

            const message = "Marcação criada. Falta configurar o pagamento."

            setSuccessMessage(message)

            showToast({
                type: "info",
                title: "Marcação criada",
                message,
            })
        } catch (error) {
            if (
                error instanceof ApiRequestError &&
                error.code === "AVAILABILITY_SLOT_NOT_AVAILABLE"
            ) {
                const message =
                    "Esta vaga já foi reservada. Por favor selecione outro horário."

                setErrorMessage(message)
                setSelectedSlotId(null)

                setSlots((currentSlots) =>
                    currentSlots.filter((slot) => slot.id !== selectedSlotId),
                )

                showToast({
                    type: "warning",
                    title: "Esta vaga já foi reservada",
                    message: "Por favor selecione outro horário disponível.",
                })

                return
            }

            if (
                error instanceof ApiRequestError &&
                error.code === "FORBIDDEN"
            ) {
                const message =
                    "A sua conta não tem permissão para criar esta marcação."

                setErrorMessage(message)

                showToast({
                    type: "error",
                    title: "Sem permissão",
                    message,
                })

                return
            }

            if (
                error instanceof ApiRequestError &&
                error.code === "UNAUTHORIZED"
            ) {
                redirectToLogin()
                return
            }

            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível criar a marcação."

            setErrorMessage(message)

            showToast({
                type: "error",
                title: "Não foi possível criar a marcação",
                message: "Tente novamente ou escolha outro horário.",
            })
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

                    {!isAuthLoading && !isAuthenticated ? (
                        <div className="mt-8 rounded-2xl border border-brand-gold/20 bg-brand-ivory p-4 text-sm leading-7 text-brand-gray">
                            Para concluir a marcação, precisa de iniciar sessão na sua
                            conta.
                        </div>
                    ) : null}

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
                            disabled={
                                !selectedSlotId ||
                                !selectedProfessionalId ||
                                isSubmitting ||
                                isAuthLoading
                            }
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