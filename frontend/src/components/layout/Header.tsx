import { useState } from "react"


import logo from "../../assets/brand/laura-feiteira-logo.png"

import { Link } from "react-router-dom"
import { routePaths } from "../../routes/routePaths"

const navigationLinks = [
    {
        label: "Serviços",
        href: "#services",
    },
    {
        label: "Sobre",
        href: "#about",
    },
    {
        label: "Avaliações",
        href: "#reviews",
    },
    {
        label: "Contacto",
        href: "#contact",
    },
]

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    function toggleMobileMenu() {
        setIsMobileMenuOpen((currentState) => !currentState)
    }

    function closeMobileMenu() {
        setIsMobileMenuOpen(false)
    }

    return (
        <header className="fixed left-0 top-0 z-50 w-full bg-brand-ivory/95 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
                <Link
                    to={routePaths.home}
                    className="flex items-center gap-3"
                    aria-label="Ir para a página inicial da Laura Feiteira Estética"
                    onClick={closeMobileMenu}
                >
                    <img
                        src={logo}
                        alt="Laura Feiteira Estética"
                        className="h-14 w-auto object-contain sm:h-16"
                    />
                </Link>

                <nav
                    className="hidden items-center gap-8 text-sm font-medium text-brand-gray md:flex"
                    aria-label="Navegação principal"
                >
                    {navigationLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="transition hover:text-brand-dark-gold"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    <a
                        href={routePaths.login}
                        className="rounded-full border border-brand-gold/40 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-brand-dark-gold transition hover:bg-white"
                    >
                        Área cliente
                    </a>

                    <a
                        href="#booking"
                        className="rounded-full bg-brand-gold px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-brand-dark-gold"
                    >
                        Reservar
                    </a>
                </div>

                <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/40 text-brand-dark-gold transition hover:bg-white md:hidden"
                    aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                    onClick={toggleMobileMenu}
                >
                    <span className="relative h-4 w-5">
                        <span
                            className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""
                                }`}
                        />
                        <span
                            className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? "opacity-0" : ""
                                }`}
                        />
                        <span
                            className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                                }`}
                        />
                    </span>
                </button>
            </div>

            <div
                id="mobile-menu"
                className={`border-t border-brand-gold/10 bg-brand-ivory px-6 transition-all duration-300 md:hidden ${isMobileMenuOpen
                    ? "max-h-96 opacity-100"
                    : "max-h-0 overflow-hidden opacity-0"
                    }`}
            >
                <nav
                    className="mx-auto flex max-w-6xl flex-col gap-2 py-5"
                    aria-label="Navegação mobile"
                >
                    {navigationLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded-2xl px-4 py-3 text-sm font-medium text-brand-gray transition hover:bg-white hover:text-brand-dark-gold"
                            onClick={closeMobileMenu}
                        >
                            {link.label}
                        </a>
                    ))}

                    <div className="mt-4 grid gap-3 border-t border-brand-gold/10 pt-5">
                        <a
                            href={routePaths.login}
                            className="rounded-full border border-brand-gold/40 px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-brand-dark-gold transition hover:bg-white"
                            onClick={closeMobileMenu}
                        >
                            Área cliente
                        </a>

                        <a
                            href="#booking"
                            className="rounded-full bg-brand-gold px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-brand-dark-gold"
                            onClick={closeMobileMenu}
                        >
                            Reservar sessão
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    )
}