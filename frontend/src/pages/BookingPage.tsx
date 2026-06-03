import { useSearchParams } from "react-router-dom"

import { Button } from "../components/ui/Button"
import { Container } from "../components/ui/Container"

/**
 * Temporary booking page.
 *
 * The "Reservar agora" button already sends the selected service slug here.
 * Later, this page will become the real booking flow with:
 * - service option selection;
 * - online or in-person evaluation;
 * - available dates and hours;
 * - payment;
 * - account creation/login.
 */
export function BookingPage() {
    const [searchParams] = useSearchParams()
    const serviceSlug = searchParams.get("service")

    return (
        <main className="min-h-screen bg-brand-ivory pt-32">
            <Container>
                <div className="mx-auto max-w-3xl rounded-3xl bg-white/90 p-8 text-center shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark-gold">
                        Agenda de marcação
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold text-brand-charcoal">
                        Escolha o dia e hora da sua sessão
                    </h1>

                    <p className="mt-5 leading-8 text-brand-gray">
                        Esta página vai receber o fluxo real de marcação. O serviço
                        selecionado já chega através do URL para prepararmos a agenda.
                    </p>

                    {serviceSlug ? (
                        <div className="mt-8 rounded-2xl bg-brand-ivory p-4 text-sm text-brand-gray">
                            Serviço selecionado:{" "}
                            <span className="font-semibold text-brand-charcoal">
                                {serviceSlug}
                            </span>
                        </div>
                    ) : null}

                    <div className="mt-8">
                        <Button href="/" variant="secondary">
                            Voltar ao site
                        </Button>
                    </div>
                </div>
            </Container>
        </main>
    )
}