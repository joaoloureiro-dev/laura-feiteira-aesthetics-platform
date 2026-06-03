import { useEffect, useMemo, useState } from "react"

import { Container } from "../components/ui/Container"
import { Button } from "../components/ui/Button"
import { SectionHeading } from "../components/ui/SectionHeading"
import { ServiceCard } from "../features/services/components/ServiceCard"
import { getPublicServiceCatalog } from "../features/services/services.api"
import type { Service, ServiceCategory } from "../features/services/types/services.types"

type ServiceWithCategory = Service & {
    categoryName: string
}

/**
 * Public homepage.
 *
 * This page now loads the real service catalog from the backend.
 * The homepage only shows a short preview of each service.
 * Detailed information lives on the service detail page.
 */
export function HomePage() {
    const [categories, setCategories] = useState<ServiceCategory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function loadServices() {
            try {
                const catalog = await getPublicServiceCatalog()

                setCategories(catalog)
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar os serviços."

                setErrorMessage(message)
            } finally {
                setIsLoading(false)
            }
        }

        loadServices()
    }, [])

    /**
     * Converts category -> services into a flat list for homepage cards.
     *
     * We keep the category name because each card should show
     * where the service belongs.
     */
    const services = useMemo<ServiceWithCategory[]>(() => {
        return categories.flatMap((category) =>
            category.services.map((service) => ({
                ...service,
                categoryName: category.name,
            })),
        )
    }, [categories])

    return (
        <main>
            <section className="flex min-h-screen items-center pb-20 pt-32">
                <Container className="text-center">
                    <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-brand-dark-gold">
                        Laura Feiteira Estética
                    </p>

                    <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-brand-charcoal sm:text-5xl lg:text-6xl">
                        Cuidar do corpo com elegância, confiança e resultados.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-brand-gray sm:text-lg">
                        Serviços de estética pensados para o seu bem-estar, com marcações
                        online, área de cliente e acompanhamento personalizado.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button href="/booking" size="lg">
                            Reservar sessão
                        </Button>

                        <Button href="#services" variant="secondary" size="lg">
                            Conhecer serviços
                        </Button>
                    </div>
                </Container>
            </section>

            <section id="services" className="bg-brand-ivory py-24">
                <Container>
                    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                        <SectionHeading
                            eyebrow="Serviços"
                            title="Tratamentos pensados para realçar o seu bem-estar."
                        />

                        <p className="text-base leading-8 text-brand-gray">
                            Escolha o serviço que procura, consulte os detalhes do tratamento
                            e avance para a marcação de forma simples e intuitiva.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="mt-12 grid gap-6 md:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div
                                    key={item}
                                    className="h-96 animate-pulse rounded-3xl bg-white/70"
                                />
                            ))}
                        </div>
                    ) : null}

                    {errorMessage ? (
                        <div className="mt-12 rounded-3xl border border-red-200 bg-white p-6 text-red-700">
                            {errorMessage}
                        </div>
                    ) : null}

                    {!isLoading && !errorMessage ? (
                        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {services.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    categoryName={service.categoryName}
                                />
                            ))}
                        </div>
                    ) : null}
                </Container>
            </section>
        </main>
    )
}