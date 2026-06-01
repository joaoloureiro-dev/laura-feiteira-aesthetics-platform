/**
 * Client dashboard placeholder.
 *
 * This page will be used by clinic clients.
 * Future features:
 * - upcoming bookings;
 * - treatment history;
 * - new booking flow;
 * - payment status;
 * - profile management.
 */
export function ClientDashboardPage() {
    return (
        <section>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-dark-gold">
                Client Dashboard
            </p>

            <h1 className="mt-4 text-3xl font-semibold">
                Bem-vinda à sua área de cliente
            </h1>

            <p className="mt-4 max-w-2xl leading-8 text-brand-gray">
                Aqui a cliente poderá consultar marcações, tratamentos realizados,
                pagamentos e reservar novas sessões.
            </p>
        </section>
    )
}