import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Container } from "../components/ui/Container"
import { Button } from "../components/ui/Button"
import type { Service, AvailabilitySlot } from "../features/services/types/services.types"

/**
 * Tradução do tipo de marcação
 */
function getAppointmentTypeLabel(appointmentType: string | null) {
    if (appointmentType === "ONLINE_EVALUATION") return "Avaliação por videochamada"
    if (appointmentType === "IN_PERSON_EVALUATION") return "Avaliação presencial"
    if (appointmentType === "TREATMENT_SESSION") return "Sessão/tratamento"
    return "Ainda não selecionado"
}

export function BookingPage() {
    const [searchParams] = useSearchParams()
    const serviceSlug = searchParams.get("service")
    const appointmentType = searchParams.get("appointmentType")

    const [service, setService] = useState<Service | null>(null)
    const [slots, setSlots] = useState<AvailabilitySlot[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadData() {
            if (!serviceSlug) {
                setError("Serviço não selecionado")
                setLoading(false)
                return
            }

            try {
                // 🔹 Alteração: substituir pelo endpoint real do backend
                const resService = await fetch(`/api/services/${serviceSlug}`)
                const serviceData: Service = await resService.json()
                setService(serviceData)

                // 🔹 Alteração: endpoint que retorna slots disponíveis filtrados por tipo
                const resSlots = await fetch(
                    `/api/availability?type=${appointmentType}&serviceSlug=${serviceSlug}`,
                )
                const slotsData: AvailabilitySlot[] = await resSlots.json()
                setSlots(slotsData)
            } catch (err) {
                setError("Não foi possível carregar os dados.")
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [serviceSlug, appointmentType])

    if (loading) return <Container><p>Carregando agenda...</p></Container>
    if (error) return <Container><p>{error}</p></Container>

    /**
     * 🔹 Alteração importante:
     * Esta função vai criar a booking PENDING no backend.
     * Depois deve redirecionar para o checkout de pagamento real.
     */
    async function handleSlotSelect(slotId: string) {
        if (!service) return

        try {
            const res = await fetch(`/api/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    serviceId: service.id,
                    serviceOptionId: null, // alterar se houver opção selecionada
                    availabilitySlotId: slotId,
                    appointmentType,
                }),
            })

            const booking = await res.json()

            // 🔹 Alteração futura:
            // booking.checkoutUrl vem do backend (Stripe, PayPal, etc.)
            window.location.href = booking.checkoutUrl
        } catch (err) {
            alert("Não foi possível criar a reserva. Tente novamente.")
        }
    }

    return (
        <main className="min-h-screen bg-brand-ivory pt-32 pb-24">
            <Container>
                <div className="mx-auto max-w-4xl rounded-3xl bg-white/90 p-8 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark-gold">
                        {getAppointmentTypeLabel(appointmentType)}
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold text-brand-charcoal">
                        Marcação do serviço: {service?.name}
                    </h1>

                    <p className="mt-5 text-sm text-brand-gray">
                        Escolha um horário disponível. A vaga será confirmada após pagamento.
                        O cliente receberá um email automático quando a reserva estiver confirmada.
                    </p>

                    <div className="mt-8 grid gap-4">
                        {slots.length === 0 ? (
                            <p className="text-center text-sm text-red-500">
                                Nenhum horário disponível para o tipo de marcação selecionado.
                            </p>
                        ) : (
                            slots.map((slot) => (
                                <Button
                                    key={slot.id}
                                    size="sm"
                                    onClick={() => handleSlotSelect(slot.id)}
                                >
                                    {new Date(slot.startsAt).toLocaleString()} - {new Date(slot.endsAt).toLocaleTimeString()}
                                </Button>
                            ))
                        )}
                    </div>

                    <div className="mt-6">
                        <Button href="/" variant="secondary">
                            Voltar
                        </Button>
                    </div>
                </div>
            </Container>
        </main>
    )
}