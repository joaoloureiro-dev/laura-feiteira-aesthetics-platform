function App() {
  return (
    <main className="min-h-screen bg-brand-ivory text-brand-charcoal">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-brand-dark-gold">
          Laura Feiteira Estética
        </p>

        <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Cuidar do corpo com elegância, confiança e resultados.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-brand-gray sm:text-lg">
          Plataforma profissional para serviços de estética, marcações online,
          área de cliente e gestão completa da clínica.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#services"
            className="rounded-full bg-brand-gold px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-brand-dark-gold"
          >
            Reservar sessão
          </a>

          <a
            href="#about"
            className="rounded-full border border-brand-gold px-8 py-4 text-sm font-semibold uppercase tracking-wide text-brand-dark-gold transition hover:bg-white"
          >
            Conhecer serviços
          </a>
        </div>
      </section>
    </main>
  )
}

export default App