import { Button } from "../../../components/ui/Button"
import { DashboardCard } from "../../../components/ui/DashboardCard"

/**
 * Admin dashboard placeholder.
 *
 * This dashboard is for technical platform administration.
 * It is not the same as the owner dashboard.
 *
 * The owner manages the clinic business.
 * The admin manages technical and platform-level settings.
 */
export function AdminDashboardPage() {
    return (
        <section>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-dark-gold">
                        Admin Dashboard
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold text-brand-charcoal">
                        Administração da plataforma
                    </h1>

                    <p className="mt-4 max-w-2xl leading-8 text-brand-gray">
                        Área para gestão técnica da plataforma, utilizadores, permissões,
                        configurações globais e auditoria.
                    </p>
                </div>

                <Button href="#system">Ver sistema</Button>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
                <DashboardCard
                    title="Utilizadores"
                    value="0"
                    description="Número total de contas registadas na plataforma."
                />

                <DashboardCard
                    title="Roles ativos"
                    value="3"
                    description="CLIENT, OWNER e ADMIN serão os perfis principais."
                />

                <DashboardCard
                    title="Estado do sistema"
                    value="OK"
                    description="Resumo técnico da aplicação e integrações."
                />
            </div>

            <div className="mt-8 rounded-3xl border border-brand-gold/10 bg-white/80 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-brand-charcoal">
                    Gestão técnica futura
                </h2>

                <ul className="mt-5 grid gap-3 text-sm leading-6 text-brand-gray">
                    <li>Gerir utilizadores e permissões.</li>
                    <li>Consultar logs de auditoria.</li>
                    <li>Monitorizar serviços externos.</li>
                    <li>Gerir configurações globais da plataforma.</li>
                </ul>
            </div>
        </section>
    )
}