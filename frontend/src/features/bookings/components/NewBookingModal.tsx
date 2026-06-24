import { useEffect, useMemo, useState } from "react"

import { Button } from "../../../components/ui/Button"
import { useAuth } from "../../auth/services/AuthContext"

import {
    getPublicServiceBySlug,
    getPublicServiceCatalog,
} from "../../services/services.api"
import type {
    ApiResponse,
    AppointmentType,
    AvailabilitySlot,
    Service,
    ServiceCategory,
} from "../../services/types/services.types"
import { useToast } from "../../toast/services/ToastContext"
import { BookingCalendar } from "./BookingCalendar"

const API_BASE_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:3333"

type NewBookingModalProps = {
    isOpen: boolean
    onClose: () => void
    onBookingCreated?: () => void
}

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

function getDateKey(dateValue: string) {
    return new Date(dateValue).toISOString().split("T")[0]
}


function formatFullDate(dateKey: string) {
    return new Date(`${dateKey}T00:00:00`).toLocaleDateString(
        "pt-PT",
        {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        },
    )
}

function formatTime(dateValue: string) {
    return new Date(dateValue).toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
    })
}

function getAppointmentTypeLabel(type: AppointmentType) {
    if (type === "ONLINE_EVALUATION") {
        return "Avaliação por videochamada"
    }

    if (type === "IN_PERSON_EVALUATION") {
        return "Avaliação presencial"
    }

    return "Sessão de tratamento"
}

async function getApiError(response: Response) {
    const payload = (await response.json().catch(() => null)) as
        | ApiErrorPayload
        | null

    return {
        code: payload?.error?.code ?? "API_REQUEST_FAILED",
        message:
            payload?.error?.message ??
            "Não foi possível concluir o pedido.",
    }
}

function ModalSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="h-8 w-64 rounded-xl bg-brand-ivory" />
            <div className="mt-4 h-4 w-full rounded-full bg-brand-ivory" />

            <div className="mt-8 grid gap-5 md:grid-cols-2">
                <div className="h-14 rounded-2xl bg-brand-ivory" />
                <div className="h-14 rounded-2xl bg-brand-ivory" />
                <div className="h-14 rounded-2xl bg-brand-ivory" />
                <div className="h-14 rounded-2xl bg-brand-ivory" />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-20 rounded-2xl bg-brand-ivory"
                    />
                ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-20 rounded-2xl bg-brand-ivory"
                    />
                ))}
            </div>
        </div>
    )
}

export function NewBookingModal({
    isOpen,
    onClose,
    onBookingCreated,
}: NewBookingModalProps) {
    const { token } = useAuth()
    const { showToast } = useToast()

    const [categories, setCategories] = useState<ServiceCategory[]>([])
    const [service, setService] = useState<Service | null>(null)
    const [slots, setSlots] = useState<AvailabilitySlot[]>([])

    const [selectedCategoryId, setSelectedCategoryId] = useState("")
    const [selectedServiceSlug, setSelectedServiceSlug] = useState("")
    const [selectedServiceOptionId, setSelectedServiceOptionId] =
        useState("")
    const [selectedProfessionalId, setSelectedProfessionalId] =
        useState("")
    const [selectedAppointmentType, setSelectedAppointmentType] =
        useState<AppointmentType>("TREATMENT_SESSION")
    const [selectedDateKey, setSelectedDateKey] = useState("")
    const [selectedSlotId, setSelectedSlotId] = useState("")

    const [isCatalogLoading, setIsCatalogLoading] = useState(false)
    const [isServiceLoading, setIsServiceLoading] = useState(false)
    const [isAvailabilityLoading, setIsAvailabilityLoading] =
        useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(
        null,
    )

    const selectedCategory = categories.find(
        (category) => category.id === selectedCategoryId,
    )

    const availableServices = selectedCategory?.services ?? []

    const slotsByDate = useMemo(() => {
        return slots.reduce<Record<string, AvailabilitySlot[]>>(
            (accumulator, slot) => {
                const dateKey = getDateKey(slot.startsAt)

                if (!accumulator[dateKey]) {
                    accumulator[dateKey] = []
                }

                accumulator[dateKey].push(slot)

                return accumulator
            },
            {},
        )
    }, [slots])

    const availableDateKeys = useMemo(
        () => Object.keys(slotsByDate).sort(),
        [slotsByDate],
    )

    const selectedDateSlots = selectedDateKey
        ? slotsByDate[selectedDateKey] ?? []
        : []

    useEffect(() => {
        if (!isOpen) {
            return
        }

        async function loadCatalog() {
            try {
                setIsCatalogLoading(true)
                setErrorMessage(null)

                const catalog = await getPublicServiceCatalog()

                setCategories(catalog)

                const firstCategory = catalog[0]

                if (firstCategory) {
                    setSelectedCategoryId(firstCategory.id)
                }
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar os serviços."

                setErrorMessage(message)

                showToast({
                    type: "error",
                    title: "Erro ao carregar serviços",
                    message,
                })
            } finally {
                setIsCatalogLoading(false)
            }
        }

        loadCatalog()
    }, [isOpen, showToast])

    useEffect(() => {
        setSelectedServiceSlug("")
        setService(null)
        setSelectedServiceOptionId("")
        setSelectedProfessionalId("")
        setSlots([])
        setSelectedDateKey("")
        setSelectedSlotId("")
    }, [selectedCategoryId])

    useEffect(() => {
        if (!selectedServiceSlug) {
            setService(null)
            setSlots([])
            setSelectedDateKey("")
            setSelectedSlotId("")
            return
        }

        async function loadService() {
            try {
                setIsServiceLoading(true)
                setErrorMessage(null)

                const serviceData =
                    await getPublicServiceBySlug(selectedServiceSlug)

                setService(serviceData)

                if (serviceData.options.length === 1) {
                    setSelectedServiceOptionId(
                        serviceData.options[0].id,
                    )
                } else {
                    setSelectedServiceOptionId("")
                }

                if (serviceData.professionals.length === 1) {
                    setSelectedProfessionalId(
                        serviceData.professionals[0].id,
                    )
                } else {
                    setSelectedProfessionalId("")
                }
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar o serviço."

                setErrorMessage(message)
            } finally {
                setIsServiceLoading(false)
            }
        }

        loadService()
    }, [selectedServiceSlug])

    useEffect(() => {
        if (!selectedServiceSlug) {
            return
        }

        async function loadAvailability() {
            try {
                setIsAvailabilityLoading(true)
                setErrorMessage(null)
                setSelectedDateKey("")
                setSelectedSlotId("")

                const query = new URLSearchParams({
                    type: selectedAppointmentType,
                    serviceSlug: selectedServiceSlug,
                })

                const response = await fetch(
                    `${API_BASE_URL}/availability?${query.toString()}`,
                )

                if (!response.ok) {
                    throw new Error(
                        "Não foi possível carregar a disponibilidade.",
                    )
                }

                const payload =
                    (await response.json()) as ApiResponse<
                        AvailabilitySlot[]
                    >

                setSlots(payload.data)

                const firstDate = payload.data[0]
                    ? getDateKey(payload.data[0].startsAt)
                    : ""

                setSelectedDateKey(firstDate)
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar as vagas."

                setSlots([])
                setErrorMessage(message)
            } finally {
                setIsAvailabilityLoading(false)
            }
        }

        loadAvailability()
    }, [selectedServiceSlug, selectedAppointmentType])

    useEffect(() => {
        if (!isOpen) {
            setCategories([])
            setService(null)
            setSlots([])
            setSelectedCategoryId("")
            setSelectedServiceSlug("")
            setSelectedServiceOptionId("")
            setSelectedProfessionalId("")
            setSelectedAppointmentType("TREATMENT_SESSION")
            setSelectedDateKey("")
            setSelectedSlotId("")
            setErrorMessage(null)
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape" && !isSubmitting) {
                onClose()
            }
        }

        document.addEventListener("keydown", handleEscape)
        document.body.style.overflow = "hidden"

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = ""
        }
    }, [isOpen, isSubmitting, onClose])

    async function handleCreateBooking() {
        if (!token) {
            showToast({
                type: "error",
                title: "Sessão inválida",
                message:
                    "Inicie sessão novamente para concluir a marcação.",
            })
            return
        }

        if (!service) {
            setErrorMessage("Selecione um serviço.")
            return
        }

        if (
            service.options.length > 0 &&
            !selectedServiceOptionId
        ) {
            setErrorMessage("Selecione uma opção do serviço.")
            return
        }

        if (!selectedProfessionalId) {
            setErrorMessage("Selecione uma profissional.")
            return
        }

        if (!selectedSlotId) {
            setErrorMessage("Selecione uma vaga disponível.")
            return
        }

        try {
            setIsSubmitting(true)
            setErrorMessage(null)

            const response = await fetch(
                `${API_BASE_URL}/bookings`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        serviceId: service.id,
                        serviceOptionId:
                            selectedServiceOptionId || null,
                        professionalId: selectedProfessionalId,
                        availabilitySlotId: selectedSlotId,
                        appointmentType:
                            selectedAppointmentType,
                    }),
                },
            )

            if (!response.ok) {
                const apiError = await getApiError(response)

                throw new ApiRequestError(
                    apiError.code,
                    apiError.message,
                )
            }

            const payload =
                (await response.json()) as ApiResponse<CreateBookingResponse>

            setSlots((currentSlots) =>
                currentSlots.filter(
                    (slot) => slot.id !== selectedSlotId,
                ),
            )

            setSelectedSlotId("")

            if (
                payload.data.requiresPayment &&
                payload.data.checkoutUrl
            ) {
                showToast({
                    type: "success",
                    title: "Marcação criada",
                    message:
                        "Vamos redirecionar para o pagamento.",
                })

                window.location.href = payload.data.checkoutUrl
                return
            }

            showToast({
                type: "success",
                title: "Marcação confirmada",
                message:
                    "A marcação foi adicionada à sua agenda.",
            })

            onBookingCreated?.()
            onClose()
        } catch (error) {
            if (
                error instanceof ApiRequestError &&
                error.code ===
                "AVAILABILITY_SLOT_NOT_AVAILABLE"
            ) {
                setSlots((currentSlots) =>
                    currentSlots.filter(
                        (slot) => slot.id !== selectedSlotId,
                    ),
                )

                setSelectedSlotId("")

                setErrorMessage(
                    "Esta vaga já foi reservada. Escolha outro horário.",
                )

                showToast({
                    type: "warning",
                    title: "Vaga indisponível",
                    message:
                        "Esta vaga acabou de ser reservada por outro cliente.",
                })

                return
            }

            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível criar a marcação."

            setErrorMessage(message)

            showToast({
                type: "error",
                title: "Erro ao criar marcação",
                message,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) {
        return null
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-booking-title"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !isSubmitting
                ) {
                    onClose()
                }
            }}
        >
            <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
                <div className="flex items-start justify-between gap-6">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark-gold">
                            Nova marcação
                        </p>

                        <h2
                            id="new-booking-title"
                            className="mt-3 text-3xl font-semibold text-brand-charcoal"
                        >
                            Escolha o serviço e uma vaga
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-gray">
                            Selecione o tratamento, o tipo de marcação,
                            a profissional, o dia e a hora disponíveis.
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="Fechar modal"
                        disabled={isSubmitting}
                        onClick={onClose}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/20 text-xl text-brand-charcoal transition hover:bg-brand-ivory disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        ×
                    </button>
                </div>

                {isCatalogLoading ? (
                    <div className="mt-8">
                        <ModalSkeleton />
                    </div>
                ) : (
                    <>
                        {errorMessage ? (
                            <div
                                className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                                role="alert"
                            >
                                {errorMessage}
                            </div>
                        ) : null}

                        <section className="mt-8 grid gap-5 md:grid-cols-2">
                            <label className="grid gap-2 text-sm font-semibold text-brand-charcoal">
                                Categoria
                                <select
                                    value={selectedCategoryId}
                                    onChange={(event) =>
                                        setSelectedCategoryId(
                                            event.target.value,
                                        )
                                    }
                                    className="h-14 rounded-2xl border border-brand-gold/20 bg-white px-4 font-normal text-brand-charcoal outline-none transition focus:border-brand-gold"
                                >
                                    <option value="">
                                        Selecione uma categoria
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="grid gap-2 text-sm font-semibold text-brand-charcoal">
                                Serviço
                                <select
                                    value={selectedServiceSlug}
                                    disabled={!selectedCategoryId}
                                    onChange={(event) =>
                                        setSelectedServiceSlug(
                                            event.target.value,
                                        )
                                    }
                                    className="h-14 rounded-2xl border border-brand-gold/20 bg-white px-4 font-normal text-brand-charcoal outline-none transition focus:border-brand-gold disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">
                                        Selecione um serviço
                                    </option>

                                    {availableServices.map(
                                        (availableService) => (
                                            <option
                                                key={
                                                    availableService.id
                                                }
                                                value={
                                                    availableService.slug
                                                }
                                            >
                                                {
                                                    availableService.name
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>
                            </label>

                            <label className="grid gap-2 text-sm font-semibold text-brand-charcoal">
                                Tipo de marcação
                                <select
                                    value={selectedAppointmentType}
                                    disabled={!selectedServiceSlug}
                                    onChange={(event) =>
                                        setSelectedAppointmentType(
                                            event.target
                                                .value as AppointmentType,
                                        )
                                    }
                                    className="h-14 rounded-2xl border border-brand-gold/20 bg-white px-4 font-normal text-brand-charcoal outline-none transition focus:border-brand-gold disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="TREATMENT_SESSION">
                                        Sessão de tratamento
                                    </option>
                                    <option value="ONLINE_EVALUATION">
                                        Avaliação por videochamada
                                    </option>
                                    <option value="IN_PERSON_EVALUATION">
                                        Avaliação presencial
                                    </option>
                                </select>
                            </label>

                            <label className="grid gap-2 text-sm font-semibold text-brand-charcoal">
                                Opção do serviço
                                <select
                                    value={selectedServiceOptionId}
                                    disabled={
                                        !service ||
                                        service.options.length === 0
                                    }
                                    onChange={(event) =>
                                        setSelectedServiceOptionId(
                                            event.target.value,
                                        )
                                    }
                                    className="h-14 rounded-2xl border border-brand-gold/20 bg-white px-4 font-normal text-brand-charcoal outline-none transition focus:border-brand-gold disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">
                                        {service?.options.length
                                            ? "Selecione uma opção"
                                            : "Sem opções disponíveis"}
                                    </option>

                                    {service?.options.map((option) => (
                                        <option
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </section>

                        {isServiceLoading ? (
                            <div className="mt-8 h-24 animate-pulse rounded-2xl bg-brand-ivory" />
                        ) : null}

                        {service ? (
                            <section className="mt-8">
                                <h3 className="text-xl font-semibold text-brand-charcoal">
                                    Profissional
                                </h3>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {service.professionals.length ===
                                        0 ? (
                                        <p className="rounded-2xl bg-brand-ivory p-4 text-sm text-brand-gray">
                                            Nenhuma profissional está
                                            associada a este serviço.
                                        </p>
                                    ) : (
                                        service.professionals.map(
                                            (professional) => {
                                                const isSelected =
                                                    selectedProfessionalId ===
                                                    professional.id

                                                return (
                                                    <button
                                                        key={
                                                            professional.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedProfessionalId(
                                                                professional.id,
                                                            )
                                                        }
                                                        className={`rounded-2xl border p-4 text-left transition ${isSelected
                                                            ? "border-brand-gold bg-brand-ivory"
                                                            : "border-brand-gold/10 bg-white hover:border-brand-gold/40"
                                                            }`}
                                                    >
                                                        <p className="font-semibold text-brand-charcoal">
                                                            {
                                                                professional.name
                                                            }
                                                        </p>
                                                    </button>
                                                )
                                            },
                                        )
                                    )}
                                </div>
                            </section>
                        ) : null}

                        {selectedServiceSlug ? (
                            <section className="mt-8">
                                <h3 className="text-xl font-semibold text-brand-charcoal">
                                    Calendário e vagas disponíveis
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-brand-gray">
                                    Escolha primeiro o dia e depois a hora.
                                </p>

                                {isAvailabilityLoading ? (
                                    <div className="mt-5 animate-pulse rounded-3xl border border-brand-gold/10 bg-white p-5">
                                        <div className="mx-auto h-7 w-48 rounded-xl bg-brand-ivory" />

                                        <div className="mt-6 grid grid-cols-7 gap-2">
                                            {Array.from({ length: 35 }).map((_, index) => (
                                                <div
                                                    key={index}
                                                    className="aspect-square rounded-2xl bg-brand-ivory"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : availableDateKeys.length === 0 ? (
                                    <div className="mt-5">
                                        <BookingCalendar
                                            slots={[]}
                                            selectedDateKey=""
                                            onSelectDate={() => undefined}
                                        />

                                        <p className="mt-4 rounded-2xl bg-brand-ivory p-5 text-center text-sm text-brand-gray">
                                            Não existem vagas disponíveis para este serviço e tipo de
                                            marcação.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mt-5">
                                            <BookingCalendar
                                                slots={slots}
                                                selectedDateKey={selectedDateKey}
                                                onSelectDate={(dateKey) => {
                                                    setSelectedDateKey(dateKey)
                                                    setSelectedSlotId("")
                                                }}
                                            />
                                        </div>

                                        {selectedDateKey ? (
                                            <div className="mt-6 rounded-3xl border border-brand-gold/10 bg-white p-5">
                                                <p className="text-sm font-semibold capitalize text-brand-charcoal">
                                                    {formatFullDate(selectedDateKey)}
                                                </p>

                                                {selectedDateSlots.length === 0 ? (
                                                    <p className="mt-4 rounded-2xl bg-brand-ivory p-4 text-sm text-brand-gray">
                                                        Não existem horários disponíveis neste dia.
                                                    </p>
                                                ) : (
                                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                                                                            ? "border-brand-gold bg-brand-ivory shadow-sm"
                                                                            : "border-brand-gold/10 bg-white hover:border-brand-gold/40"
                                                                        }`}
                                                                >
                                                                    <p className="font-semibold text-brand-charcoal">
                                                                        {formatTime(slot.startsAt)} –{" "}
                                                                        {formatTime(slot.endsAt)}
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-brand-gray">
                                                                        {getAppointmentTypeLabel(
                                                                            slot.appointmentType,
                                                                        )}
                                                                    </p>

                                                                    {slot.note ? (
                                                                        <p className="mt-2 text-xs leading-5 text-brand-gray">
                                                                            {slot.note}
                                                                        </p>
                                                                    ) : null}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </>
                                )}
                            </section>
                        ) : null}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="button"
                                onClick={handleCreateBooking}
                                disabled={
                                    !service ||
                                    !selectedProfessionalId ||
                                    !selectedSlotId ||
                                    isSubmitting
                                }
                            >
                                {isSubmitting
                                    ? "A confirmar..."
                                    : selectedAppointmentType ===
                                        "TREATMENT_SESSION"
                                        ? "Confirmar e continuar"
                                        : "Confirmar avaliação"}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}