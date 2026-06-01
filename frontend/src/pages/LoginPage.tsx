import { Button } from "../components/ui/Button"
import { Container } from "../components/ui/Container"

/**
 * Temporary login page.
 *
 * Later this page will include:
 * - email/password login;
 * - Google OAuth login;
 * - registration link;
 * - validation with React Hook Form and Zod;
 * - API connection to the Fastify backend.
 */
export function LoginPage() {
    return (
        <main className="flex min-h-screen items-center pt-24">
            <Container>
                <div className="mx-auto max-w-xl rounded-3xl bg-white/80 p-8 shadow-sm">
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-dark-gold">
                        Área cliente
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold text-brand-charcoal">
                        Entrar na sua conta
                    </h1>

                    <p className="mt-4 leading-8 text-brand-gray">
                        Em breve, esta página permitirá aos clientes entrar, criar conta e
                        aceder às suas marcações, tratamentos e pagamentos.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button href="/client/dashboard">Ver dashboard cliente</Button>

                        <Button href="/" variant="secondary">
                            Voltar ao site
                        </Button>
                    </div>
                </div>
            </Container>
        </main>
    )
}