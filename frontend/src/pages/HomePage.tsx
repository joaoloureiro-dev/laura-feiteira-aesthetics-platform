import { Button } from "../components/ui/Button"
import { Container } from "../components/ui/Container"
import { SectionHeading } from "../components/ui/SectionHeading"

/**
 * Temporary service data used only for the first visual version of the homepage.
 *
 * Later, this data will come from the backend, because the owner dashboard
 * will allow Laura to edit services, descriptions, prices and promotions.
 */
const featuredServices = [
    {
        name: "Drenagem Linfática",
        description:
            "Tratamento pensado para ajudar na retenção de líquidos, sensação de leveza e bem-estar corporal.",
    },
    {
        name: "Massagem Modeladora",
        description:
            "Técnica estética focada em contorno corporal, firmeza e melhoria da aparência da pele.",
    },
    {
        name: "Tratamentos Faciais",
        description:
            "Cuidados faciais personalizados para hidratação, luminosidade e melhoria da textura da pele.",
    },
]

/**
 * Public homepage.
 *
 * This page is intentionally simple at this stage.
 * We are building the visual foundation first, then we will connect real routes,
 * authentication, booking flow and backend data step by step.
 */
export function HomePage() {
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
                        <Button href="#booking" size="lg">
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
                            Cada serviço terá uma explicação clara sobre o que faz, para que
                            serve, benefícios, duração e um botão direto para reservar.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {featuredServices.map((service) => (
                            <article
                                key={service.name}
                                className="rounded-3xl border border-brand-gold/10 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                {/* Placeholder reserved for a future service image. */}
                                <div className="mb-6 h-40 rounded-2xl bg-brand-ivory" />

                                <h3 className="text-xl font-semibold text-brand-charcoal">
                                    {service.name}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-brand-gray">
                                    {service.description}
                                </p>

                                <Button
                                    href="#booking"
                                    variant="ghost"
                                    size="sm"
                                    className="mt-6 px-0"
                                >
                                    Reservar sessão
                                </Button>
                            </article>
                        ))}
                    </div>
                </Container>
            </section>
        </main>
    )
}