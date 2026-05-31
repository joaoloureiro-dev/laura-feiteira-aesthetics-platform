export function HomePage() {
    return (
        <main>
            <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pb-20 pt-32 text-center">
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-brand-dark-gold">
                    Laura Feiteira Estética
                </p>

                <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                    Cuidar do corpo com elegância, confiança e resultados.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-brand-gray sm:text-lg">
                    Serviços de estética pensados para o seu bem-estar, com marcações online,
                    área de cliente e acompanhamento personalizado.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                    <a
                        href="#booking"
                        className="rounded-full bg-brand-gold px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-brand-dark-gold"
                    >
                        Reservar sessão
                    </a>

                    <a
                        href="#services"
                        className="rounded-full border border-brand-gold px-8 py-4 text-sm font-semibold uppercase tracking-wide text-brand-dark-gold transition hover:bg-white"
                    >
                        Conhecer serviços
                    </a>
                </div>
            </section>

            <section id="services" className="bg-white px-6 py-24">
                <div className="mx-auto max-w-6xl">
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-dark-gold">
                        Serviços
                    </p>

                    <div className="mt-4 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Tratamentos pensados para realçar o seu bem-estar.
                        </h2>

                        <p className="text-base leading-8 text-brand-gray">
                            Cada serviço terá uma explicação clara sobre o que faz, para que serve,
                            benefícios, duração e um botão direto para reservar.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {["Drenagem Linfática", "Massagem Modeladora", "Tratamentos Faciais"].map(
                            (service) => (
                                <article
                                    key={service}
                                    className="rounded-3xl border border-brand-gold/10 bg-brand-ivory p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="mb-6 h-40 rounded-2xl bg-white" />

                                    <h3 className="text-xl font-semibold">{service}</h3>

                                    <p className="mt-3 text-sm leading-7 text-brand-gray">
                                        Descrição breve do serviço, benefícios principais e indicação para
                                        quem procura este tratamento.
                                    </p>

                                    <a
                                        href="#booking"
                                        className="mt-6 inline-flex text-sm font-semibold uppercase tracking-wide text-brand-dark-gold"
                                    >
                                        Reservar sessão
                                    </a>
                                </article>
                            ),
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}