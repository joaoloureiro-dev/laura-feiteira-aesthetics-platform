export function Footer() {
    return (
        <footer className="border-t border-brand-gold/10 bg-brand-ivory">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-brand-gray md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="font-semibold text-brand-charcoal">Laura Feiteira Estética</p>
                    <p className="mt-1">Cuidado estético com elegância, confiança e bem-estar.</p>
                </div>

                <div className="flex flex-col gap-2 md:items-end">
                    <p>© {new Date().getFullYear()} Laura Feiteira Estética.</p>
                    <p>Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}