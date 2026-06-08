import { Button } from "../components/ui/Button"
import { Container } from "../components/ui/Container"

export function UnauthorizedPage() {
    return (
        <main className="min-h-screen bg-brand-ivory pt-32">
            <Container>
                <div className="mx-auto max-w-2xl rounded-3xl bg-white/90 p-8 text-center shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark-gold">
                        Acesso negado
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold text-brand-charcoal">
                        Não tem permissão para aceder a esta área.
                    </h1>

                    <p className="mt-4 leading-7 text-brand-gray">
                        A sua conta não tem a role necessária para abrir esta página.
                    </p>

                    <div className="mt-8">
                        <Button href="/" variant="secondary">
                            Voltar ao início
                        </Button>
                    </div>
                </div>
            </Container>
        </main>
    )
}