/**
 * Admin dashboard placeholder.
 *
 * This page is for technical platform administration.
 * It is different from the owner dashboard.
 *
 * Future features:
 * - user management;
 * - role management;
 * - system settings;
 * - audit logs;
 * - technical monitoring.
 */
export function AdminDashboardPage() {
    return (
        <section>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-dark-gold">
                Admin Dashboard
            </p>

            <h1 className="mt-4 text-3xl font-semibold">
                Administração da plataforma
            </h1>

            <p className="mt-4 max-w-2xl leading-8 text-brand-gray">
                Esta área será usada para gestão técnica da plataforma, utilizadores,
                permissões e configurações globais.
            </p>
        </section>
    )
}