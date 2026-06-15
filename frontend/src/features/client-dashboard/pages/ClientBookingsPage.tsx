import { useEffect, useMemo, useState } from "react"

import { Button } from "../../../components/ui/Button"
import { useAuth } from "../../auth/services/AuthContext"
import { useToast } from "../../toast/services/ToastContext"
import { getMyBookings } from "../services/clientDashboard.api"
import type {
    ClientAppointmentType,
    ClientBooking,
} from "../types/clientDashboard.types"

function formatDate(dateValue: string) {
    return new Date(dateValue).toLocaleDateString("pt-PT", {
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

function ClientBookingsSkeleton() {
    return (
        <section className="animate-pulse">
            <div className="h-4 w-44 rounded-full bg-brand-gold/20" />
            <div className="mt-5 h-10 w-72 rounded-2xl bg-white/80" />
            <div className="mt-4 h-4 max-w-2xl rounded-full bg-white/80" />

            <div className="mt-10 grid gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-56 rounded-3xl bg-white/80"
                    />
                ))}
            </div>
        </section>
    )
}

function BookingCard({ booking }: { booking: ClientBooking }) {
    return (
        <article className="rounded-3xl border border-brand-gold/10 bg-white/80 p-5 shadow-sm transition hover:border-brand-gold/30 sm:p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark-gold">
                        {getAppointmentTypeLabel(booking.appointmentType)}
                    </p>

                    <h3 className="mt-3 text-xl font-semibold text-brand-charcoal">
                        {booking.service.name}
                    </h3>

                    {booking.serviceOption ? (
                        <p className="mt-2 text-sm text-brand-gray">
                            {booking.serviceOption.name}
                        </p>
                    ) : null}

                    <div className="mt-5 grid gap-2 text-sm leading-6 text-brand-gray">
                        <p className="capitalize">
                            <span className="font-semibold text-brand-charcoal">
                                Data:
                            </span>{" "}
                            {formatDate(booking.availabilitySlot.startsAt)}
                        </p>

                        <p>
                            <span className="font-semibold text-brand-charcoal">
                                Horário:
                            </span>{" "}
                            {formatTime(booking.availabilitySlot.startsAt)} –{" "}
                            {formatTime(booking.availabilitySlot.endsAt)}
                        </p>

                        <p>
                            <span className="font-semibold text-brand-charcoal">
                                Profissional:
                            </span>{" "}
                            {booking.professional.name}
                        </p>

                        {booking.clientNotes ? (
                            <p>
                                <span className="font-semibold text-brand-charcoal">
                                    Observações:
                                </span>{" "}
                                {booking.clientNotes}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:max-w-56 sm:justify-end">
                    <span className="rounded-full border border-brand-gold/20 bg-brand-ivory px-3 py-2 text-xs font-semibold text-brand-dark-gold">
                        {getBookingStatusLabel(booking.status)}
                    </span>

                    <span className="rounded-full border border-brand-gold/20 bg-white px-3 py-2 text-xs font-semibold text-brand-gray">
                        Pagamento: {getPaymentStatusLabel(booking.paymentStatus)}
                    </span>
                </div>
            </div>
        </article>
    )
}

export function ClientBookingsPage() {
    const { token } = useAuth()
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
                    title: "Erro ao carregar marcações",
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

    const bookingHistory = useMemo(
        () =>
            bookings
                .filter(
                    (booking) =>
                        new Date(booking.availabilitySlot.startsAt) < now ||
                        booking.status === "COMPLETED" ||
                        booking.status === "CANCELLED",
                )
                .sort(
                    (firstBooking, secondBooking) =>
                        new Date(
                            secondBooking.availabilitySlot.startsAt,
                        ).getTime() -
                        new Date(
                            firstBooking.availabilitySlot.startsAt,
                        ).getTime(),
                ),
        [bookings],
    )

    if (isLoading) {
        return <ClientBookingsSkeleton />
    }

    return (
        <section>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-dark-gold">
                        Área de cliente
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold text-brand-charcoal">
                        As minhas marcações
                    </h1>

                    <p className="mt-4 max-w-2xl leading-8 text-brand-gray">
                        Consulte as próximas reservas e o histórico de avaliações e
                        tratamentos realizados.
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

            <section className="mt-10">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-dark-gold">
                            Agenda
                        </p>

                        <h2 className="mt-3 text-2xl font-semibold text-brand-charcoal">
                            Próximas marcações
                        </h2>
                    </div>

                    <p className="text-sm text-brand-gray">
                        {upcomingBookings.length}
                    </p>
                </div>

                {upcomingBookings.length === 0 ? (
                    <div className="mt-6 rounded-3xl border border-brand-gold/10 bg-white/80 p-8 text-center shadow-sm">
                        <h3 className="text-lg font-semibold text-brand-charcoal">
                            Não existem marcações futuras
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-brand-gray">
                            Consulte os serviços disponíveis e escolha um dia e
                            horário para a sua próxima marcação.
                        </p>

                        <div className="mt-6">
                            <Button href="/">Fazer marcação</Button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-4">
                        {upcomingBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="mt-12">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-dark-gold">
                            Histórico
                        </p>

                        <h2 className="mt-3 text-2xl font-semibold text-brand-charcoal">
                            Marcações anteriores
                        </h2>
                    </div>

                    <p className="text-sm text-brand-gray">
                        {bookingHistory.length}
                    </p>
                </div>

                {bookingHistory.length === 0 ? (
                    <div className="mt-6 rounded-3xl border border-brand-gold/10 bg-white/80 p-8 text-center shadow-sm">
                        <p className="text-sm leading-7 text-brand-gray">
                            Ainda não existe histórico de marcações.
                        </p>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-4">
                        {bookingHistory.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                            />
                        ))}
                    </div>
                )}
            </section>
        </section>
    )
}