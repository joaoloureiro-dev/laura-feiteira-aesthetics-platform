import { Navigate, useLocation } from "react-router-dom"
import type { ReactNode } from "react"

import { useAuth } from "../services/AuthContext"
import type { UserRole } from "../types/auth.types"

type ProtectedRouteProps = {
    allowedRoles?: UserRole[]
    children: ReactNode
}

/**
 * Protects frontend routes by authentication and role.
 *
 * Examples:
 * CLIENT dashboard -> allowedRoles={["CLIENT"]}
 * OWNER dashboard  -> allowedRoles={["OWNER"]}
 * ADMIN dashboard  -> allowedRoles={["ADMIN"]}
 */
export function ProtectedRoute({
    allowedRoles,
    children,
}: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return (
            <main className="min-h-screen bg-brand-ivory pt-32">
                <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-dark-gold">
                        A validar sessão
                    </p>

                    <p className="mt-4 text-brand-gray">
                        Estamos a confirmar as suas permissões.
                    </p>
                </div>
            </main>
        )
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return <>{children}</>
}