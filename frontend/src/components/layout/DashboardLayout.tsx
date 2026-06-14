import { useState, type ReactNode } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import { useAuth } from "../../features/auth/services/AuthContext"
import { useToast } from "../../features/toast/services/ToastContext"
import { routePaths } from "../../routes/routePaths"
import { BrandLogo } from "./BrandLogo"

type DashboardRole = "Cliente" | "Owner" | "Admin"

type DashboardLayoutProps = {
    children: ReactNode
    roleLabel: DashboardRole
}

type DashboardNavigationItem = {
    label: string
    href: string
}

const dashboardNavigation: Record<DashboardRole, DashboardNavigationItem[]> = {
    Cliente: [
        {
            label: "Resumo",
            href: routePaths.clientDashboard,
        },
        {
            label: "Marcações",
            href: "/client/bookings",
        },
        {
            label: "Tratamentos",
            href: "/client/treatments",
        },
        {
            label: "Pagamentos",
            href: "/client/payments",
        },
        {
            label: "Perfil",
            href: "/client/profile",
        },
    ],

    Owner: [
        {
            label: "Resumo",
            href: routePaths.ownerDashboard,
        },
        {
            label: "Marcações",
            href: "/owner/bookings",
        },
        {
            label: "Agenda",
            href: "/owner/calendar",
        },
        {
            label: "Serviços",
            href: "/owner/services",
        },
        {
            label: "Promoções",
            href: "/owner/promotions",
        },
        {
            label: "Emails",
            href: "/owner/emails",
        },
        {
            label: "Analytics",
            href: "/owner/analytics",
        },
    ],

    Admin: [
        {
            label: "Resumo",
            href: routePaths.adminDashboard,
        },
        {
            label: "Utilizadores",
            href: "/admin/users",
        },
        {
            label: "Roles",
            href: "/admin/roles",
        },
        {
            label: "Sistema",
            href: "/admin/system",
        },
        {
            label: "Audit Logs",
            href: "/admin/audit-logs",
        },
    ],
}

function getNavigationClassName({
    isActive,
}: {
    isActive: boolean
}) {
    return [
        "rounded-2xl px-4 py-3 text-sm font-medium transition",
        isActive
            ? "bg-brand-ivory text-brand-dark-gold"
            : "text-brand-gray hover:bg-brand-ivory hover:text-brand-dark-gold",
    ].join(" ")
}

export function DashboardLayout({
    children,
    roleLabel,
}: DashboardLayoutProps) {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const { showToast } = useToast()

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navigationItems = dashboardNavigation[roleLabel]

    function toggleMobileMenu() {
        setIsMobileMenuOpen((currentState) => !currentState)
    }

    function closeMobileMenu() {
        setIsMobileMenuOpen(false)
    }

    function handleLogout() {
        logout()
        closeMobileMenu()

        showToast({
            type: "success",
            title: "Sessão terminada",
            message: "Terminou sessão com sucesso.",
        })

        navigate(routePaths.login, {
            replace: true,
        })
    }

    return (
        <div className="min-h-screen bg-brand-ivory text-brand-charcoal">
            <header className="sticky top-0 z-40 border-b border-brand-gold/10 bg-white/85 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <BrandLogo
                        size="sm"
                        onClick={closeMobileMenu}
                    />

                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            {user?.name ? (
                                <p className="text-sm font-semibold text-brand-charcoal">
                                    {user.name}
                                </p>
                            ) : null}

                            <p className="text-xs font-medium uppercase tracking-wide text-brand-dark-gold">
                                {roleLabel}
                            </p>
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

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="hidden rounded-full border border-brand-gold/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-dark-gold transition hover:border-brand-gold hover:bg-brand-ivory md:inline-flex"
                        >
                            Sair
                        </button>
                    </div>
                </div>

                <div
                    id="dashboard-mobile-menu"
                    className={`border-t border-brand-gold/10 bg-white px-6 transition-all duration-300 md:hidden ${isMobileMenuOpen
                            ? "max-h-[128] opacity-100"
                            : "max-h-0 overflow-hidden opacity-0"
                        }`}
                >
                    <nav className="mx-auto flex max-w-7xl flex-col gap-2 py-5">
                        {navigationItems.map((item) => (
                            <NavLink
                                key={item.href}
                                to={item.href}
                                className={getNavigationClassName}
                                onClick={closeMobileMenu}
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-3 rounded-2xl border border-brand-gold/20 px-4 py-3 text-left text-sm font-semibold text-brand-dark-gold transition hover:bg-brand-ivory"
                        >
                            Terminar sessão
                        </button>
                    </nav>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 md:grid-cols-[260px_1fr]">
                <aside className="hidden md:block">
                    <div className="sticky top-28 rounded-3xl border border-brand-gold/10 bg-white/80 p-4 shadow-sm">
                        <div className="px-4 pb-4 pt-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark-gold">
                                {roleLabel}
                            </p>

                            {user?.email ? (
                                <p className="mt-2 truncate text-xs text-brand-gray">
                                    {user.email}
                                </p>
                            ) : null}
                        </div>

                        <nav className="grid gap-1">
                            {navigationItems.map((item) => (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    className={getNavigationClassName}
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-5 w-full rounded-2xl border border-brand-gold/20 px-4 py-3 text-left text-sm font-semibold text-brand-dark-gold transition hover:bg-brand-ivory"
                        >
                            Terminar sessão
                        </button>
                    </div>
                </aside>

                <main>{children}</main>
            </div>
        </div>
    )
}