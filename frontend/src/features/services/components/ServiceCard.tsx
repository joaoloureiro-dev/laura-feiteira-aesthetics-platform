import { Button } from "../../../components/ui/Button"
import type { Service, ServiceOption } from "../types/services.types"

type ServiceCardProps = {
    service: Service
    categoryName: string
}

/**
 * Formats a price stored in cents.
 *
 * Example:
 * 3500 -> 35€
 * 4500 -> 45€
 *
 * Prices must always be stored in cents because later Stripe/payment logic
 * should never depend on floating point values.
 */
function formatPrice(priceCents: number) {
    return `${priceCents / 100}€`
}

/**
 * Gets the lowest numeric price from the service options.
 *
 * Why this matters:
 * The homepage card should show "A partir de X€".
 * It should NOT use the first option returned by the API, because the order
 * can change depending on database sorting.
 *
 * Example:
 * Drenagem Linfática:
 * - Por zona: 35€
 * - Pack 10 sessões: 300€
 *
 * Correct card text:
 * "A partir de 35€"
 */
function getLowestNumericPrice(options: ServiceOption[]) {
    const numericPrices = options
        .map((option) => option.priceCents)
        .filter((price): price is number => price !== null)

    if (numericPrices.length === 0) {
        return null
    }

    return Math.min(...numericPrices)
}

/**
 * Builds the price preview shown on the homepage card.
 *
 * Variable-price services, such as tattoo removal, can use priceLabel
 * like "Desde 50€".
 */
function getPricePreview(service: Service) {
    const lowestNumericPrice = getLowestNumericPrice(service.options)

    if (lowestNumericPrice !== null) {
        return `A partir de ${formatPrice(lowestNumericPrice)}`
    }

    const firstPriceLabel = service.options.find((option) => option.priceLabel)
        ?.priceLabel

    return firstPriceLabel ?? "Preço sob avaliação"
}

/**
 * Public service card used on the homepage.
 *
 * This card is intentionally short and conversion-focused:
 * - category;
 * - service name;
 * - brief summary;
 * - correct price preview;
 * - direct booking CTA;
 * - detail page CTA.
 */
export function ServiceCard({ service, categoryName }: ServiceCardProps) {
    return (
        <article className="group flex h-full flex-col rounded-3xl border border-brand-gold/10 bg-white/85 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-6 flex h-40 items-center justify-center rounded-2xl bg-brand-ivory">
                <span className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark-gold/70">
                    {categoryName}
                </span>
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark-gold">
                {categoryName}
            </p>

            <h3 className="mt-3 text-xl font-semibold text-brand-charcoal">
                {service.name}
            </h3>

            <p className="mt-3 flex-1 text-sm leading-7 text-brand-gray">
                {service.description ??
                    "Tratamento estético personalizado, pensado para melhorar o bem-estar, a confiança e os resultados da cliente."}
            </p>

            <div className="mt-6 rounded-2xl bg-brand-ivory px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-brand-gray">
                    Preço
                </p>

                <p className="mt-1 text-lg font-semibold text-brand-charcoal">
                    {getPricePreview(service)}
                </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button href={`/booking?service=${service.slug}`} size="sm">
                    Reservar agora
                </Button>

                <Button href={`/services/${service.slug}`} variant="secondary" size="sm">
                    Saber mais
                </Button>
            </div>
        </article>
    )
}