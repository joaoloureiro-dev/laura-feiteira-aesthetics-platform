import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Container } from "../../../components/ui/Container"
import { useToast } from "../../toast/services/ToastContext"
import { getPublicServiceCatalog } from "../services.api"
import type {
    Service,
    ServiceCategory,
} from "../types/services.types"

function formatPrice(
    priceCents: number | null,
    priceLabel: string | null,
) {
    if (priceCents !== null) {
        return `${(priceCents / 100).toLocaleString("pt-PT", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        })}€`
    }

    if (priceLabel) {
        return priceLabel
    }

    return "Sob avaliação"
}

function getServiceStartingPrice(service: Service) {
    const optionWithLowestPrice = service.options
        .filter((option) => option.priceCents !== null)
        .sort(
            (firstOption, secondOption) =>
                (firstOption.priceCents ?? 0) -
                (secondOption.priceCents ?? 0),
        )[0]

    if (optionWithLowestPrice) {
        return `Desde ${formatPrice(
            optionWithLowestPrice.priceCents,
            optionWithLowestPrice.priceLabel,
        )}`
    }

    const optionWithLabel = service.options.find(
        (option) => option.priceLabel,
    )

    if (optionWithLabel) {
        return optionWithLabel.priceLabel ?? "Sob avaliação"
    }

    return "Sob avaliação"
}

function getEvaluationLabel(evaluationRequirement: string) {
    if (evaluationRequirement === "REQUIRED") {
        return "Avaliação obrigatória"
    }

    if (evaluationRequirement === "NOT_REQUIRED") {
        return "Reserva direta"
    }

    return "Avaliação disponível"
}

function ServicesPageSkeleton() {
    return (
        <main className="min-h-screen bg-brand-ivory pb-24 pt-32">
            <Container>
                <div className="animate-pulse">
                    <div className="mx-auto h-4 w-44 rounded-full bg-brand-gold/20" />

                    <div className="mx-auto mt-5 h-12 max-w-xl rounded-2xl bg-white/80" />

                    <div className="mx-auto mt-5 h-4 max-w-2xl rounded-full bg-white/80" />

                    <div className="mt-14 grid gap-8">
                        {Array.from({ length: 2 }).map((_, categoryIndex) => (
                            <section key={categoryIndex}>
                                <div className="h-8 w-64 rounded-2xl bg-white/80" />

                                <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {Array.from({ length: 3 }).map(
                                        (_, serviceIndex) => (
                                            <div
                                                key={serviceIndex}
                                                className="h-72 rounded-3xl bg-white/80"
                                            />
                                        ),
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </Container>
        </main>
    )
}

function ServiceCard({ service }: { service: Service }) {
    return (
        <article className="flex h-full flex-col rounded-3xl border border-brand-gold/10 bg-white/90 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-gold/30 hover:shadow-lg hover:shadow-black/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-brand-ivory px-3 py-2 text-xs font-semibold uppercase tracking-wide text-brand-dark-gold">
                    {getEvaluationLabel(service.evaluationRequirement)}
                </span>

                <span className="text-sm font-semibold text-brand-charcoal">
                    {getServiceStartingPrice(service)}
                </span>
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-brand-charcoal">
                {service.name}
            </h3>

            <p className="mt-4 flex-1 text-sm leading-7 text-brand-gray">
                {service.description ??
                    "Tratamento personalizado e adaptado às necessidades de cada cliente."}
            </p>

            {service.options.length > 0 ? (
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-brand-gray">
                    {service.options.length}{" "}
                    {service.options.length === 1
                        ? "opção disponível"
                        : "opções disponíveis"}
                </p>
            ) : null}

            <Link
                to={`/services/${service.slug}`}
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-brand-gold px-5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-dark-gold"
            >
                Ver serviço
            </Link>
        </article>
    )
}

export function ServicesPage() {
    const { showToast } = useToast()

    const [categories, setCategories] = useState<ServiceCategory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function loadServices() {
            try {
                setIsLoading(true)
                setErrorMessage(null)

                const catalog = await getPublicServiceCatalog()

                setCategories(catalog)
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar os serviços."

                setErrorMessage(message)

                showToast({
                    type: "error",
                    title: "Erro ao carregar serviços",
                    message,
                })
            } finally {
                setIsLoading(false)
            }
        }

        loadServices()
    }, [showToast])

    if (isLoading) {
        return <ServicesPageSkeleton />
    }

    return (
        <main className="min-h-screen bg-brand-ivory pb-24 pt-32">
            <Container>
                <header className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-dark-gold">
                        Serviços
                    </p>

                    <h1 className="mt-5 text-4xl font-semibold tracking-tight text-brand-charcoal sm:text-5xl">
                        Encontre o tratamento adequado para si
                    </h1>

                    <p className="mt-5 text-base leading-8 text-brand-gray">
                        Consulte os tratamentos disponíveis, preços, duração e
                        necessidade de avaliação antes de escolher a sua marcação.
                    </p>
                </header>

                {errorMessage ? (
                    <div
                        className="mx-auto mt-10 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700"
                        role="alert"
                    >
                        {errorMessage}
                    </div>
                ) : null}

                {!errorMessage && categories.length === 0 ? (
                    <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-brand-gold/10 bg-white/80 p-10 text-center shadow-sm">
                        <h2 className="text-2xl font-semibold text-brand-charcoal">
                            Ainda não existem serviços disponíveis
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-brand-gray">
                            O catálogo de serviços será disponibilizado em breve.
                        </p>
                    </div>
                ) : null}

                <div className="mt-14 grid gap-14">
                    {categories.map((category) => (
                        <section key={category.id}>
                            <div className="max-w-2xl">
                                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark-gold">
                                    Categoria
                                </p>

                                <h2 className="mt-3 text-3xl font-semibold text-brand-charcoal">
                                    {category.name}
                                </h2>

                                {category.description ? (
                                    <p className="mt-4 leading-7 text-brand-gray">
                                        {category.description}
                                    </p>
                                ) : null}
                            </div>

                            {category.services.length === 0 ? (
                                <div className="mt-6 rounded-3xl border border-brand-gold/10 bg-white/80 p-7 text-sm text-brand-gray">
                                    Ainda não existem serviços nesta categoria.
                                </div>
                            ) : (
                                <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {category.services.map((service) => (
                                        <ServiceCard
                                            key={service.id}
                                            service={service}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    ))}
                </div>
            </Container>
        </main>
    )
}