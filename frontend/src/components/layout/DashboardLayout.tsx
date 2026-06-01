import { useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { BrandLogo } from "./BrandLogo"

import { routePaths } from "../../routes/routePaths"

type DashboardRole = "Cliente" | "Owner" | "Admin"

type DashboardLayoutProps = {
    children: ReactNode
    roleLabel: DashboardRole
}

type DashboardNavigationItem = {
    label: string
    href: string
}

/**
 * Navigation items by dashboard role.
 *
 * Why this exists:
 * Client, owner and admin users should not see the same menu.
 * Later, the backend will also enforce permissions, but the frontend should already
 * show a role-based experience.
 */
const dashboardNavigation: Record<DashboardRole, DashboardNavigationItem[]> = {
    Cliente: [
        { label: "Resumo", href: routePaths.clientDashboard },
        { label: "Marcações", href: "/client/bookings" },
        { label: "Tratamentos", href: "/client/treatments" },
        { label: "Pagamentos", href: "/client/payments" },
        { label: "Perfil", href: "/client/profile" },
    ],
    Owner: [
        { label: "Resumo", href: routePaths.ownerDashboard },
        { label: "Marcações", href: "/owner/bookings" },
        { label: "Agenda", href: "/owner/calendar" },
        { label: "Serviços", href: "/owner/services" },
        { label: "Promoções", href: "/owner/promotions" },
        { label: "Emails", href: "/owner/emails" },
        { label: "Analytics", href: "/owner/analytics" },
    ],
    Admin: [
        { label: "Resumo", href: routePaths.adminDashboard },
        { label: "Utilizadores", href: "/admin/users" },
        { label: "Roles", href: "/admin/roles" },
        { label: "Sistema", href: "/admin/system" },
        { label: "Audit Logs", href: "/admin/audit-logs" },
    ],
}

/**
 * Shared dashboard layout.
 *
 * This component gives the client, owner and admin areas the same professional base:
 * - top header;
 * - role badge;
 * - sidebar on desktop;
 * - collapsible menu on mobile;
 * - central content area.
 */
export function DashboardLayout({ children, roleLabel }: DashboardLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navigationItems = dashboardNavigation[roleLabel]

    function toggleMobileMenu() {
        setIsMobileMenuOpen((currentState) => !currentState)
    }

    function closeMobileMenu() {
        setIsMobileMenuOpen(false)
    }

    return (
        <div className="min-h-screen bg-brand-ivory text-brand-charcoal">
            <header className="sticky top-0 z-40 border-b border-brand-gold/10 bg-white/85 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <BrandLogo size="sm" onClick={closeMobileMenu} />

                    <div className="flex items-center gap-3">
                        <div className="hidden rounded-full border border-brand-gold/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-dark-gold sm:block">
                            {roleLabel}
                        </div>

                        <button
                            type="button"
                            className="inline-flex rounded-full border border-brand-gold/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-dark-gold md:hidden"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="dashboard-mobile-menu"
                            onClick={toggleMobileMenu}
                        >
                            Menu
                        </button>
                    </div>
                </div>

                <div
                    id="dashboard-mobile-menu"
                    className={`border-t border-brand-gold/10 bg-white px-6 transition-all duration-300 md:hidden ${isMobileMenuOpen
                        ? "max-h-96 opacity-100"
                        : "max-h-0 overflow-hidden opacity-0"
                        }`}
                >
                    <nav className="mx-auto flex max-w-7xl flex-col gap-2 py-5">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className="rounded-2xl px-4 py-3 text-sm font-medium text-brand-gray transition hover:bg-brand-ivory hover:text-brand-dark-gold"
                                onClick={closeMobileMenu}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 md:grid-cols-[260px_1fr]">
                <aside className="hidden md:block">
                    <div className="sticky top-28 rounded-3xl border border-brand-gold/10 bg-white/80 p-4 shadow-sm">
                        <p className="px-4 pb-4 pt-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark-gold">
                            {roleLabel}
                        </p>

                        <nav className="grid gap-1">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className="rounded-2xl px-4 py-3 text-sm font-medium text-brand-gray transition hover:bg-brand-ivory hover:text-brand-dark-gold"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                <main>{children}</main>
            </div>
        </div>
    )
}