import { useEffect, useMemo, useState } from "react"
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

function getDateKey(dateValue: string) {
    return new Date(dateValue).toISOString().split("T")[0]
}

function formatDayLabel(dateKey: string) {
    return new Date(`${dateKey}T00:00:00`).toLocaleDateString("pt-PT", {
        weekday: "short",
        day: "2-digit",
        month: "short",
    })
}

function formatFullDate(dateKey: string) {
    return new Date(`${dateKey}T00:00:00`).toLocaleDateString("pt-PT", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function formatTime(dateValue: string) {
    return new Date(dateValue).toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
    })
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

function BookingPageSkeleton() {
    return (
        <main className="min-h-screen bg-brand-ivory pb-24 pt-32">
            <Container>
                <div className="mx-auto max-w-4xl rounded-3xl bg-white/90 p-8 shadow-sm">
                    <div className="h-4 w-48 animate-pulse rounded-full bg-brand-gold/20" />
                    <div className="mt-5 h-10 w-3/4 animate-pulse rounded-2xl bg-brand-ivory" />
                    <div className="mt-5 h-4 w-full animate-pulse rounded-full bg-brand-ivory" />
                    <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-brand-ivory" />

                    <section className="mt-10">
                        <div className="h-7 w-40 animate-pulse rounded-xl bg-brand-ivory" />
                        <div className="mt-5 grid gap-4">
                            <div className="h-24 animate-pulse rounded-2xl bg-brand-ivory" />
                        </div>
                    </section>

                    <section className="mt-10">
                        <div className="h-7 w-56 animate-pulse rounded-xl bg-brand-ivory" />

                        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-20 animate-pulse rounded-2xl bg-brand-ivory"
                                />
                            ))}
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-20 animate-pulse rounded-2xl bg-brand-ivory"
                                />
                            ))}
                        </div>
                    </section>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <div className="h-14 flex-1 animate-pulse rounded-full bg-brand-gold/20" />
                        <div className="h-14 flex-1 animate-pulse rounded-full bg-brand-ivory" />
                    </div>
                </div>
            </Container>
        </main>
    )
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
    const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)

    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const slotsByDate = useMemo(() => {
        return slots.reduce<Record<string, AvailabilitySlot[]>>((acc, slot) => {
            const dateKey = getDateKey(slot.startsAt)

            if (!acc[dateKey]) {
                acc[dateKey] = []
            }

            acc[dateKey].push(slot)

            return acc
        }, {})
    }, [slots])

    const availableDateKeys = useMemo(() => {
        return Object.keys(slotsByDate).sort()
    }, [slotsByDate])

    const selectedDateSlots = selectedDateKey
        ? slotsByDate[selectedDateKey] ?? []
        : []

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

                const firstDateKey = availabilityPayload.data[0]
                    ? getDateKey(availabilityPayload.data[0].startsAt)
                    : null

                setSelectedDateKey(firstDateKey)
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

            if (error instanceof ApiRequestError && error.code === "FORBIDDEN") {
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

            if (error instanceof ApiRequestError && error.code === "UNAUTHORIZED") {
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
        return <BookingPageSkeleton />
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
                        Escolha a profissional, selecione o dia e depois escolha uma hora
                        disponível. As avaliações não precisam de pagamento. As
                        sessões/tratamentos seguem para pagamento quando aplicável.
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
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-brand-charcoal">
                                    Calendário disponível
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-brand-gray">
                                    Selecione primeiro o dia e depois escolha a hora.
                                </p>
                            </div>
                        </div>

                        {availableDateKeys.length === 0 ? (
                            <p className="mt-5 rounded-2xl bg-brand-ivory p-4 text-center text-sm text-brand-gray">
                                Nenhum horário disponível para este tipo de marcação.
                            </p>
                        ) : (
                            <>
                                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {availableDateKeys.map((dateKey) => {
                                        const isSelected = selectedDateKey === dateKey
                                        const totalSlots = slotsByDate[dateKey]?.length ?? 0

                                        return (
                                            <button
                                                key={dateKey}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedDateKey(dateKey)
                                                    setSelectedSlotId(null)
                                                }}
                                                className={`rounded-2xl border p-4 text-left transition ${isSelected
                                                        ? "border-brand-gold bg-brand-ivory shadow-sm"
                                                        : "border-brand-gold/10 bg-white hover:border-brand-gold/40"
                                                    }`}
                                            >
                                                <p className="font-semibold capitalize text-brand-charcoal">
                                                    {formatDayLabel(dateKey)}
                                                </p>

                                                <p className="mt-2 text-xs text-brand-gray">
                                                    {totalSlots}{" "}
                                                    {totalSlots === 1
                                                        ? "horário disponível"
                                                        : "horários disponíveis"}
                                                </p>
                                            </button>
                                        )
                                    })}
                                </div>

                                {selectedDateKey ? (
                                    <div className="mt-8 rounded-3xl border border-brand-gold/10 bg-white p-5">
                                        <p className="text-sm font-semibold capitalize text-brand-charcoal">
                                            {formatFullDate(selectedDateKey)}
                                        </p>

                                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                            {selectedDateSlots.map((slot) => {
                                                const isSelected =
                                                    selectedSlotId === slot.id

                                                return (
                                                    <button
                                                        key={slot.id}
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedSlotId(slot.id)
                                                        }
                                                        className={`rounded-2xl border p-4 text-left transition ${isSelected
                                                                ? "border-brand-gold bg-brand-ivory"
                                                                : "border-brand-gold/10 bg-white hover:border-brand-gold/40"
                                                            }`}
                                                    >
                                                        <p className="font-semibold text-brand-charcoal">
                                                            {formatTime(slot.startsAt)} -{" "}
                                                            {formatTime(slot.endsAt)}
                                                        </p>

                                                        <p className="mt-1 text-sm text-brand-gray">
                                                            {getAppointmentTypeLabel(
                                                                slot.appointmentType,
                                                            )}
                                                        </p>

                                                        {slot.note ? (
                                                            <p className="mt-2 text-xs text-brand-gray">
                                                                {slot.note}
                                                            </p>
                                                        ) : null}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : null}
                            </>
                        )}
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