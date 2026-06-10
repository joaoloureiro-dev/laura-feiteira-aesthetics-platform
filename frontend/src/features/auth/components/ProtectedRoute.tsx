import { Navigate, useLocation } from "react-router-dom"
import type { ReactNode } from "react"

import { useAuth } from "../services/AuthContext"
import type { UserRole } from "../types/auth.types"

type ProtectedRouteProps = {
    allowedRoles?: UserRole[]
    children: ReactNode
}

function getUnauthorizedMessage(role?: UserRole | null) {
    if (!role) {
        return "Precisa de iniciar sessão para aceder a esta área."
    }

    return "A sua conta não tem permissão para aceder a esta área."
}

/**
 * Protects frontend routes by authentication and role.
 *
 * Important:
 * This protects the frontend experience.
 * Real security is enforced by backend requireAuth([...roles]).
 */
export function ProtectedRoute({
    allowedRoles,
    children,
}: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <main className="min-h-screen bg-brand-ivory px-4 pt-36">
                <section className="mx-auto max-w-xl rounded-3xl border border-brand-gold/10 bg-white p-8 text-center shadow-xl shadow-black/5">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark-gold">
                        A validar sessão
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold text-brand-charcoal">
                        A confirmar permissões
                    </h1>

                    <p className="mt-4 leading-7 text-brand-gray">
                        Estamos a verificar se a sua conta tem acesso a esta área.
                    </p>

                    <div className="mx-auto mt-8 h-2 w-40 overflow-hidden rounded-full bg-brand-ivory">
                        <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-gold" />
                    </div>
                </section>
            </main>
        )
    }

    if (!isAuthenticated || !user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: location,
                    reason: getUnauthorizedMessage(null),
                }}
            />
        )
    }

    if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
        return (
            <Navigate
                to="/unauthorized"
                replace
                state={{
                    from: location,
                    reason: getUnauthorizedMessage(user.role),
                }}
            />
        )
    }

    return <>{children}</>
}