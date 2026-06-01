import { Button } from "../../../components/ui/Button"
import { DashboardCard } from "../../../components/ui/DashboardCard"

/**
 * Client dashboard placeholder.
 *
 * This page will be used by clinic clients.
 * At this stage, the data is static only to design the interface.
 * Later, it will come from the backend API.
 */
export function ClientDashboardPage() {
    return (
        <section>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-dark-gold">
                        Client Dashboard
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold text-brand-charcoal">
                        Bem-vinda à sua área de cliente
                    </h1>

                    <p className="mt-4 max-w-2xl leading-8 text-brand-gray">
                        Consulte as suas marcações, tratamentos realizados, pagamentos e faça
                        novas reservas.
                    </p>
                </div>

                <Button href="#new-booking">Nova marcação</Button>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
                <DashboardCard
                    title="Próxima marcação"
                    value="Sem data"
                    description="Quando existir uma reserva ativa, a próxima sessão aparece aqui."
                />

                <DashboardCard
                    title="Tratamentos realizados"
                    value="0"
                    description="Histórico de sessões realizadas pela cliente."
                />

                <DashboardCard
                    title="Pagamentos"
                    value="Pendente"
                    description="Estado dos pagamentos associados às marcações."
                />
            </div>

            <div className="mt-8 rounded-3xl border border-brand-gold/10 bg-white/80 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-brand-charcoal">
                    Próximas funcionalidades
                </h2>

                <ul className="mt-5 grid gap-3 text-sm leading-6 text-brand-gray">
                    <li>Escolher serviço, dia e hora disponível.</li>
                    <li>Ver histórico de tratamentos realizados.</li>
                    <li>Efetuar pagamento no momento da reserva.</li>
                    <li>Receber lembretes automáticos por email.</li>
                </ul>
            </div>
        </section>
    )
}