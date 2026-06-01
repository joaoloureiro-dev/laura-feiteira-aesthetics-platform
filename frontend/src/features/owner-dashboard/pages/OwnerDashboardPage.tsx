/**
 * Owner dashboard placeholder.
 *
 * This page will be used by Laura, the clinic owner.
 * Future features:
 * - bookings management;
 * - calendar availability;
 * - services and prices;
 * - promotions;
 * - automated email actions;
 * - analytics overview.
 */
export function OwnerDashboardPage() {
    return (
        <section>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-dark-gold">
                Owner Dashboard
            </p>

            <h1 className="mt-4 text-3xl font-semibold">
                Gestão da clínica
            </h1>

            <p className="mt-4 max-w-2xl leading-8 text-brand-gray">
                Aqui a Laura poderá gerir marcações, agenda, serviços, preços,
                promoções, emails automáticos e métricas do negócio.
            </p>
        </section>
    )
}