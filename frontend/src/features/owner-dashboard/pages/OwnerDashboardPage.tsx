import { Button } from "../../../components/ui/Button"
import { DashboardCard } from "../../../components/ui/DashboardCard"

/**
 * Owner dashboard placeholder.
 *
 * This dashboard is for Laura, the clinic owner.
 * It is focused on business operations: bookings, services, availability,
 * promotions, emails and analytics.
 */
export function OwnerDashboardPage() {
    return (
        <section>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-dark-gold">
                        Owner Dashboard
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold text-brand-charcoal">
                        Gestão da clínica
                    </h1>

                    <p className="mt-4 max-w-2xl leading-8 text-brand-gray">
                        Faça a gestão de marcações, agenda, serviços, preços, promoções,
                        emails automáticos e métricas do negócio.
                    </p>
                </div>

                <Button href="#calendar">Abrir agenda</Button>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
                <DashboardCard
                    title="Marcações de hoje"
                    value="0"
                    description="Resumo das sessões agendadas para o dia atual."
                />

                <DashboardCard
                    title="Serviços ativos"
                    value="3"
                    description="Serviços atualmente disponíveis para reserva online."
                />

                <DashboardCard
                    title="Emails pendentes"
                    value="0"
                    description="Respostas ou lembretes que precisam de atenção."
                />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-brand-gold/10 bg-white/80 p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-brand-charcoal">
                        Ações rápidas
                    </h2>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <Button href="#bookings" variant="secondary">
                            Ver marcações
                        </Button>

                        <Button href="#services" variant="secondary">
                            Gerir serviços
                        </Button>

                        <Button href="#promotions" variant="secondary">
                            Criar promoção
                        </Button>

                        <Button href="#emails" variant="secondary">
                            Ver emails
                        </Button>
                    </div>
                </div>

                <div className="rounded-3xl border border-brand-gold/10 bg-white/80 p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-brand-charcoal">
                        Próximas integrações
                    </h2>

                    <ul className="mt-5 grid gap-3 text-sm leading-6 text-brand-gray">
                        <li>Bloquear ou abrir horários na agenda.</li>
                        <li>Alterar preços e criar promoções.</li>
                        <li>Responder clientes com botões rápidos.</li>
                        <li>Ver dados do Google Analytics e serviços mais procurados.</li>
                    </ul>
                </div>
            </div>
        </section>
    )
}