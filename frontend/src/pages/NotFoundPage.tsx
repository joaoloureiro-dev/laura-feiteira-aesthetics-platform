import { Link } from "react-router-dom"

import { routePaths } from "../routes/routePaths"

/**
 * 404 page.
 *
 * This page appears when the user tries to access a route that does not exist.
 */
export function NotFoundPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-brand-ivory px-6 text-center">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-dark-gold">
                    Página não encontrada
                </p>

                <h1 className="mt-4 text-4xl font-semibold text-brand-charcoal">
                    Esta página não existe.
                </h1>

                <p className="mt-4 text-brand-gray">
                    O endereço pode estar errado ou a página pode ter sido movida.
                </p>

                <Link
                    to={routePaths.home}
                    className="mt-8 inline-flex rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-dark-gold"
                >
                    Voltar ao início
                </Link>
            </div>
        </main>
    )
}