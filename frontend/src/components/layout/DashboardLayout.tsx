import type { ReactNode } from "react"
import { Link } from "react-router-dom"

import { routePaths } from "../../routes/routePaths"

type DashboardLayoutProps = {
    children: ReactNode
    roleLabel: "Cliente" | "Owner" | "Admin"
}

/**
 * Shared dashboard layout.
 *
 * Why this exists:
 * Client, owner and admin dashboards will have different data,
 * but they still share a similar application structure:
 * header, navigation area and main content area.
 *
 * Later we can make this layout more advanced with:
 * - sidebar;
 * - user avatar;
 * - logout button;
 * - notifications;
 * - role-based menu items.
 */
export function DashboardLayout({ children, roleLabel }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-brand-ivory text-brand-charcoal">
            <header className="border-b border-brand-gold/10 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
                    <Link
                        to={routePaths.home}
                        className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-dark-gold"
                    >
                        Laura Feiteira Estética
                    </Link>

                    <div className="rounded-full border border-brand-gold/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-dark-gold">
                        {roleLabel}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </div>
    )
}