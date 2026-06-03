// frontend/src/features/services/pages/ServiceDetailsPage.tsx
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button } from "../../../components/ui/Button"
import { Container } from "../../../components/ui/Container"
import { getPublicServiceBySlug } from "../services.api"
import { EvaluationButton } from "../components/EvaluationButton"
import type { Service } from "../types/services.types"

/**
 * Transforma preço em cents para string legível.
 */
function formatPrice(priceCents: number | null, priceLabel: string | null) {
    if (priceCents !== null) return `${priceCents / 100}€`
    if (priceLabel) return priceLabel
    return "Sob avaliação"
}

/**
 * Converte a exigência de avaliação para texto legível.
 */
function getEvaluationLabel(evaluationRequirement: string) {
    if (evaluationRequirement === "REQUIRED") return "Avaliação obrigatória antes da sessão"
    if (evaluationRequirement === "NOT_REQUIRED") return "Pode ser reservado diretamente"
    return "Avaliação online ou presencial disponível"
}

/**
 * Conteúdo temporário para descrição profissional.
 */
function getServicePageContent(service: Service) {
    const name = service.name.toLowerCase()
    if (name.includes("depilação"))
        return {
            purpose:
                "A depilação a laser tripla onda é indicada para reduzir progressivamente o crescimento do pelo, proporcionando uma pele mais lisa, confortável e cuidada.",
            indicatedFor: [
                "Pessoas que procuram reduzir pelos de forma progressiva.",
                "Clientes que querem alternativa mais duradoura à cera ou lâmina.",
                "Zonas faciais ou corporais com crescimento frequente de pelo.",
            ],
            benefits: [
                "Redução progressiva do pelo.",
                "Maior conforto diário.",
                "Tratamento adaptado à zona escolhida.",
            ],
        }

    if (name.includes("drenagem"))
        return {
            purpose:
                "A drenagem linfática ajuda na retenção de líquidos, sensação de inchaço e melhora do bem-estar geral.",
            indicatedFor: [
                "Pessoas com sensação de pernas pesadas ou inchaço.",
                "Clientes que procuram melhorar a sensação de leveza corporal.",
                "Acompanhamento estético e bem-estar corporal.",
            ],
            benefits: ["Sensação de leveza.", "Apoio na retenção de líquidos.", "Melhoria do conforto corporal."],
        }

    // Default
    return {
        purpose:
            service.description ??
            "Tratamento estético personalizado, pensado para melhorar o bem-estar, confiança e conforto da cliente.",
        indicatedFor: ["Clientes que procuram acompanhamento estético personalizado.", "Pessoas que desejam melhorar o bem-estar e autoestima.", "Tratamento adaptado às necessidades da cliente."],
        benefits: ["Atendimento personalizado.", "Plano adaptado ao objetivo da cliente.", "Possibilidade de avaliação online ou presencial."],
    }
}

/**
 * Página de detalhes de serviço.
 */
export function ServiceDetailsPage() {
    const { slug } = useParams<{ slug: string }>()
    const [service, setService] = useState<Service | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function loadService() {
            if (!slug) {
                setErrorMessage("Serviço inválido.")
                setIsLoading(false)
                return
            }
            try {
                const serviceData = await getPublicServiceBySlug(slug)
                setService(serviceData)
            } catch (error) {
                const message = error instanceof Error ? error.message : "Não foi possível carregar o serviço."
                setErrorMessage(message)
            } finally {
                setIsLoading(false)
            }
        }
        loadService()
    }, [slug])

    if (isLoading)
        return (
            <main className="min-h-screen bg-brand-ivory pt-32">
                <Container>
                    <div className="h-96 animate-pulse rounded-3xl bg-white/70" />
                </Container>
            </main>
        )

    if (errorMessage || !service)
        return (
            <main className="min-h-screen bg-brand-ivory pt-32">
                <Container>
                    <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark-gold">Serviço</p>
                        <h1 className="mt-4 text-3xl font-semibold text-brand-charcoal">Serviço não encontrado</h1>
                        <p className="mt-4 text-brand-gray">{errorMessage ?? "Não foi possível encontrar este serviço."}</p>
                        <Link to="/" className="mt-8 inline-flex text-sm font-semibold uppercase tracking-wide text-brand-dark-gold">Voltar ao início</Link>
                    </div>
                </Container>
            </main>
        )

    const content = getServicePageContent(service)

    return (
        <main className="bg-brand-ivory pb-24 pt-32">
            <Container>
                <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
                    <section className="rounded-3xl bg-white/90 p-8 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark-gold">Serviço</p>
                        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-brand-charcoal">{service.name}</h1>
                        <p className="mt-6 text-base leading-8 text-brand-gray">{content.purpose}</p>

                        <div className="mt-10 grid gap-6 md:grid-cols-2">
                            <div className="rounded-3xl border border-brand-gold/10 bg-brand-ivory p-6">
                                <h2 className="text-xl font-semibold text-brand-charcoal">Para quem é indicado</h2>
                                <ul className="mt-5 grid gap-3 text-sm leading-7 text-brand-gray">
                                    {content.indicatedFor.map((item) => (
                                        <li key={item}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="rounded-3xl border border-brand-gold/10 bg-brand-ivory p-6">
                                <h2 className="text-xl font-semibold text-brand-charcoal">Benefícios</h2>
                                <ul className="mt-5 grid gap-3 text-sm leading-7 text-brand-gray">
                                    {content.benefits.map((item) => (
                                        <li key={item}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-10 rounded-3xl border border-brand-gold/10 bg-white p-6">
                            <h2 className="text-xl font-semibold text-brand-charcoal">Tabela de preços</h2>
                            <p className="mt-2 text-sm leading-7 text-brand-gray">
                                Escolha a opção pretendida durante o processo de marcação. Nos serviços com valor sujeito a avaliação, o preço final será confirmado após análise.
                            </p>
                            <div className="mt-6 overflow-hidden rounded-2xl border border-brand-gold/10">
                                <table className="w-full border-collapse text-left text-sm">
                                    <thead className="bg-brand-ivory text-brand-charcoal">
                                        <tr>
                                            <th className="px-4 py-4 font-semibold">Opção</th>
                                            <th className="px-4 py-4 font-semibold">Preço</th>
                                            <th className="px-4 py-4 font-semibold">Duração</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-gold/10">
                                        {service.options.map((option) => (
                                            <tr key={option.id}>
                                                <td className="px-4 py-4 text-brand-gray">
                                                    <p className="font-medium text-brand-charcoal">{option.name}</p>
                                                    {option.description ? <p className="mt-1 text-xs leading-6 text-brand-gray">{option.description}</p> : null}
                                                </td>
                                                <td className="px-4 py-4 font-semibold text-brand-charcoal">{formatPrice(option.priceCents, option.priceLabel)}</td>
                                                <td className="px-4 py-4 text-brand-gray">{option.durationMinutes ? `${option.durationMinutes} min` : "Sob avaliação"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <aside className="sticky top-28 rounded-3xl border border-brand-gold/10 bg-white/95 p-6 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-dark-gold">Marcação</p>
                        <h2 className="mt-4 text-2xl font-semibold text-brand-charcoal">Pretende reservar este serviço?</h2>
                        <p className="mt-4 text-sm leading-7 text-brand-gray">
                            Todos os serviços dispõem de avaliação por videochamada ou presencial. A avaliação também entra na agenda e fecha a vaga escolhida no momento da marcação.
                        </p>

                        {/* Botão avaliação */}
                        <EvaluationButton serviceSlug={service.slug} />

                        {/* Botão reserva sessão */}
                        <Button
                            href={`/booking?service=${service.slug}&appointmentType=TREATMENT_SESSION`}
                            className="mt-3 w-full"
                        >
                            Reservar agora
                        </Button>

                        {/* Botão voltar */}
                        <Button href="/" variant="secondary" className="mt-3 w-full">
                            Voltar aos serviços
                        </Button>

                        <div className="mt-6 rounded-2xl bg-brand-ivory p-4 text-sm text-brand-gray">
                            Avaliação: <span className="font-semibold text-brand-charcoal">{getEvaluationLabel(service.evaluationRequirement)}</span>
                        </div>
                    </aside>
                </div>
            </Container>
        </main>
    )
}