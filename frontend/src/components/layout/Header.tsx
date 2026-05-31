export function Header() {
    return (
        <header className="fixed left-0 top-0 z-50 w-full border-b border-brand-gold/10 bg-brand-ivory/90 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
                <a href="/" className="flex items-center gap-3" aria-label="Laura Feiteira Estética">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold bg-white text-sm font-semibold text-brand-dark-gold">
                        LF
                    </div>

                    <div className="leading-tight">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-charcoal">
                            Laura Feiteira
                        </p>
                        <p className="text-xs uppercase tracking-[0.28em] text-brand-dark-gold">
                            Estética
                        </p>
                    </div>
                </a>

                <nav className="hidden items-center gap-8 text-sm font-medium text-brand-gray md:flex">
                    <a href="#services" className="transition hover:text-brand-dark-gold">
                        Serviços
                    </a>
                    <a href="#about" className="transition hover:text-brand-dark-gold">
                        Sobre
                    </a>
                    <a href="#reviews" className="transition hover:text-brand-dark-gold">
                        Avaliações
                    </a>
                    <a href="#contact" className="transition hover:text-brand-dark-gold">
                        Contacto
                    </a>
                </nav>

                <a
                    href="#booking"
                    className="hidden rounded-full bg-brand-gold px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-dark-gold md:inline-flex"
                >
                    Reservar
                </a>

                <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/40 text-brand-dark-gold md:hidden"
                    aria-label="Abrir menu"
                >
                    <span className="block h-0.5 w-5 bg-current before:mb-1.5 before:block before:h-0.5 before:w-5 before:bg-current after:mt-1.5 after:block after:h-0.5 after:w-5 after:bg-current" />
                </button>
            </div>
        </header>
    )
}