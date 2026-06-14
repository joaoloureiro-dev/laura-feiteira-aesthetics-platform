import { useEffect, useMemo, useState } from "react"

import { Button } from "../../../components/ui/Button"
import { DashboardCard } from "../../../components/ui/DashboardCard"
import { useAuth } from "../../auth/services/AuthContext"
import { useToast } from "../../toast/services/ToastContext"
import { getMyBookings } from "../services/clientDashboard.api"
import type {
    ClientAppointmentType,
    ClientBooking,
} from "../types/clientDashboard.types"

function formatBookingDate(dateValue: string) {
    return new Date(dateValue).toLocaleDateString("pt-PT", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

function formatBookingTime(dateValue: string) {
    return new Date(dateValue).toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
    })
}

function getAppointmentTypeLabel(type: ClientAppointmentType) {
    if (type === "ONLINE_EVALUATION") {
        return "Avaliação por videochamada"
    }

    if (type === "IN_PERSON_EVALUATION") {
        return "Avaliação presencial"
    }

    return "Sessão de tratamento"
}

function getBookingStatusLabel(status: string) {
    if (status === "CONFIRMED") {
        return "Confirmada"
    }

    if (status === "COMPLETED") {
        return "Concluída"
    }

    if (status === "CANCELLED") {
        return "Cancelada"
    }

    return "Pendente"
}

function getPaymentStatusLabel(status: string) {
    if (status === "PAID") {
        return "Pago"
    }

    if (status === "REFUNDED") {
        return "Reembolsado"
    }

    if (status === "FAILED") {
        return "Falhou"
    }

    return "Pendente"
}

function ClientDashboardSkeleton() {
    return (
        <section>
            <div className="animate-pulse">
                <div className="h-4 w-48 rounded-full bg-brand-gold/20" />

                <div className="mt-5 h-10 w-72 rounded-2xl bg-white/80" />

                <div className="mt-4 h-4 max-w-2xl rounded-full bg-white/80" />

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-44 rounded-3xl bg-white/80"
                        />
                    ))}
                </div>

                <div className="mt-8 h-80 rounded-3xl bg-white/80" />
            </div>
        </section>
    )
}

export function ClientDashboardPage() {
    const { user, token } = useAuth()
    const { showToast } = useToast()

    const [bookings, setBookings] = useState<ClientBooking[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function loadBookings() {
            if (!token) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                setErrorMessage(null)

                const result = await getMyBookings(token)

                setBookings(result)
            } catch {
                const message =
                    "Não foi possível carregar as suas marcações."

                setErrorMessage(message)

                showToast({
                    type: "error",
                    title: "Erro ao carregar dashboard",
                    message,
                })
            } finally {
                setIsLoading(false)
            }
        }

        loadBookings()
    }, [token, showToast])

    const now = new Date()

    const upcomingBookings = useMemo(
        () =>
            bookings
                .filter(
                    (booking) =>
                        new Date(booking.availabilitySlot.startsAt) >= now &&
                        booking.status !== "CANCELLED",
                )
                .sort(
                    (firstBooking, secondBooking) =>
                        new Date(
                            firstBooking.availabilitySlot.startsAt,
                        ).getTime() -
                        new Date(
                            secondBooking.availabilitySlot.startsAt,
                        ).getTime(),
                ),
        [bookings],
    )

    const completedBookings = useMemo(
        () =>
            bookings.filter(
                (booking) =>
                    booking.status === "COMPLETED" ||
                    new Date(booking.availabilitySlot.endsAt) < now,
            ),
        [bookings],
    )

    const pendingPayments = useMemo(
        () =>
            bookings.filter(
                (booking) =>
                    booking.appointmentType === "TREATMENT_SESSION" &&
                    booking.paymentStatus === "UNPAID" &&
                    booking.status !== "CANCELLED",
            ),
        [bookings],
    )

    const nextBooking = upcomingBookings[0] ?? null

    if (isLoading) {
        return <ClientDashboardSkeleton />
    }

    return (
        <section>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-dark-gold">
                        Área de cliente
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold text-brand-charcoal">
                        {user?.name
                            ? `Bem-vinda, ${user.name}`
                            : "Bem-vinda à sua área de cliente"}
                    </h1>

                    <p className="mt-4 max-w-2xl leading-8 text-brand-gray">
                        Consulte as suas próximas marcações, avaliações,
                        tratamentos e pagamentos.
                    </p>
                </div>

                <Button href="/">Nova marcação</Button>
            </div>

            {errorMessage ? (
                <div
                    className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    role="alert"
                >
                    {errorMessage}
                </div>
            ) : null}

            <div className="mt-10 grid gap-6 md:grid-cols-3">
                <DashboardCard
                    title="Próxima marcação"
                    value={
                        nextBooking
                            ? new Date(
                                nextBooking.availabilitySlot.startsAt,
                            ).toLocaleDateString("pt-PT", {
                                day: "2-digit",
                                month: "short",
                            })
                            : "Sem data"
                    }
                    description={
                        nextBooking
                            ? `${nextBooking.service.name} às ${formatBookingTime(
                                nextBooking.availabilitySlot.startsAt,
                            )}`
                            : "Não existem marcações futuras."
                    }
                />

                <DashboardCard
                    title="Tratamentos realizados"
                    value={String(completedBookings.length)}
                    description="Número de sessões e avaliações já realizadas."
                />

                <DashboardCard
                    title="Pagamentos pendentes"
                    value={String(pendingPayments.length)}
                    description="Reservas de tratamento ainda por pagar."
                />
            </div>

            <div className="mt-8 rounded-3xl border border-brand-gold/10 bg-white/80 p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-dark-gold">
                            Agenda
                        </p>

                        <h2 className="mt-3 text-2xl font-semibold text-brand-charcoal">
                            Próximas marcações
                        </h2>
                    </div>

                    <p className="text-sm text-brand-gray">
                        {upcomingBookings.length}{" "}
                        {upcomingBookings.length === 1
                            ? "marcação ativa"
                            : "marcações ativas"}
                    </p>
                </div>

                {upcomingBookings.length === 0 ? (
                    <div className="mt-8 rounded-3xl bg-brand-ivory p-8 text-center">
                        <h3 className="text-lg font-semibold text-brand-charcoal">
                            Ainda não tem marcações futuras
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-brand-gray">
                            Escolha um serviço e consulte os dias e horários
                            disponíveis na agenda.
                        </p>

                        <div className="mt-6">
                            <Button href="/">Fazer uma marcação</Button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-4">
                        {upcomingBookings.map((booking) => (
                            <article
                                key={booking.id}
                                className="rounded-3xl border border-brand-gold/10 bg-white p-5 transition hover:border-brand-gold/30 sm:p-6"
                            >
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark-gold">
                                            {getAppointmentTypeLabel(
                                                booking.appointmentType,
                                            )}
                                        </p>

                                        <h3 className="mt-3 text-xl font-semibold text-brand-charcoal">
                                            {booking.service.name}
                                        </h3>

                                        {booking.serviceOption ? (
                                            <p className="mt-2 text-sm text-brand-gray">
                                                {booking.serviceOption.name}
                                            </p>
                                        ) : null}

                                        <div className="mt-5 grid gap-2 text-sm text-brand-gray">
                                            <p className="capitalize">
                                                <span className="font-semibold text-brand-charcoal">
                                                    Data:
                                                </span>{" "}
                                                {formatBookingDate(
                                                    booking.availabilitySlot
                                                        .startsAt,
                                                )}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-brand-charcoal">
                                                    Horário:
                                                </span>{" "}
                                                {formatBookingTime(
                                                    booking.availabilitySlot
                                                        .startsAt,
                                                )}{" "}
                                                –{" "}
                                                {formatBookingTime(
                                                    booking.availabilitySlot
                                                        .endsAt,
                                                )}
                                            </p>

                                            <p>
                                                <span className="font-semibold text-brand-charcoal">
                                                    Profissional:
                                                </span>{" "}
                                                {booking.professional.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 sm:max-w-52 sm:justify-end">
                                        <span className="rounded-full border border-brand-gold/20 bg-brand-ivory px-3 py-2 text-xs font-semibold text-brand-dark-gold">
                                            {getBookingStatusLabel(
                                                booking.status,
                                            )}
                                        </span>

                                        <span className="rounded-full border border-brand-gold/20 bg-white px-3 py-2 text-xs font-semibold text-brand-gray">
                                            Pagamento:{" "}
                                            {getPaymentStatusLabel(
                                                booking.paymentStatus,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}