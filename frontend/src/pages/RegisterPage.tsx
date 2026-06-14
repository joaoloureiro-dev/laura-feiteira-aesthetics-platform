import { useState } from "react"
import type { SubmitEventHandler } from "react"
import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "../features/auth/services/AuthContext"
import { getDashboardPathByRole } from "../features/auth/utils/dashboardRole.utils"
import { useToast } from "../features/toast/services/ToastContext"
import { routePaths } from "../routes/routePaths"

const MINIMUM_PASSWORD_LENGTH = 8

export function RegisterPage() {
    const navigate = useNavigate()
    const { register } = useAuth()
    const { showToast } = useToast()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")

    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()

        const normalizedName = name.trim()
        const normalizedEmail = email.trim().toLowerCase()

        if (!normalizedName) {
            const message = "Introduza o seu nome."

            setErrorMessage(message)

            showToast({
                type: "warning",
                title: "Nome obrigatório",
                message,
            })

            return
        }

        if (!normalizedEmail) {
            const message = "Introduza um endereço de email válido."

            setErrorMessage(message)

            showToast({
                type: "warning",
                title: "Email obrigatório",
                message,
            })

            return
        }

        if (password.length < MINIMUM_PASSWORD_LENGTH) {
            const message = `A password deve ter pelo menos ${MINIMUM_PASSWORD_LENGTH} caracteres.`

            setErrorMessage(message)

            showToast({
                type: "warning",
                title: "Password demasiado curta",
                message,
            })

            return
        }

        if (password !== passwordConfirmation) {
            const message = "As passwords introduzidas não coincidem."

            setErrorMessage(message)

            showToast({
                type: "warning",
                title: "Passwords diferentes",
                message,
            })

            return
        }

        try {
            setIsSubmitting(true)
            setErrorMessage(null)

            const user = await register({
                name: normalizedName,
                email: normalizedEmail,
                password,
            })

            showToast({
                type: "success",
                title: "Conta criada com sucesso",
                message: "A sua área de cliente já está disponível.",
            })

            navigate(getDashboardPathByRole(user.role), {
                replace: true,
            })
        } catch (error) {
            const message =
                error instanceof Error && error.message === "EMAIL_ALREADY_IN_USE"
                    ? "Já existe uma conta associada a este email."
                    : "Não foi possível criar a conta. Tente novamente."

            setErrorMessage(message)

            showToast({
                type: "error",
                title: "Não foi possível criar a conta",
                message,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="min-h-screen bg-brand-ivory px-4 pb-20 pt-36 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-xl">
                <div className="mb-10 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-dark-gold">
                        Área de cliente
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-brand-charcoal sm:text-5xl">
                        Criar uma conta
                    </h1>

                    <p className="mx-auto mt-4 max-w-lg text-base leading-8 text-brand-gray">
                        Crie a sua conta para fazer marcações, consultar tratamentos e
                        acompanhar o histórico de serviços.
                    </p>
                </div>

                <div className="rounded-3xl border border-brand-gold/10 bg-white p-6 shadow-xl shadow-black/5 sm:p-8 lg:p-10">
                    <form className="grid gap-5" onSubmit={handleSubmit}>
                        {errorMessage ? (
                            <div
                                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
                                role="alert"
                            >
                                {errorMessage}
                            </div>
                        ) : null}

                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-semibold text-brand-charcoal"
                            >
                                Nome
                            </label>

                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                                disabled={isSubmitting}
                                className="h-14 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 text-brand-charcoal outline-none transition placeholder:text-brand-gray/60 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 disabled:cursor-not-allowed disabled:opacity-70"
                                placeholder="O seu nome"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-brand-charcoal"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                disabled={isSubmitting}
                                className="h-14 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 text-brand-charcoal outline-none transition placeholder:text-brand-gray/60 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 disabled:cursor-not-allowed disabled:opacity-70"
                                placeholder="exemplo@email.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-brand-charcoal"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                minLength={MINIMUM_PASSWORD_LENGTH}
                                required
                                disabled={isSubmitting}
                                className="h-14 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 text-brand-charcoal outline-none transition placeholder:text-brand-gray/60 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 disabled:cursor-not-allowed disabled:opacity-70"
                                placeholder="Mínimo de 8 caracteres"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password-confirmation"
                                className="mb-2 block text-sm font-semibold text-brand-charcoal"
                            >
                                Confirmar password
                            </label>

                            <input
                                id="password-confirmation"
                                type="password"
                                autoComplete="new-password"
                                value={passwordConfirmation}
                                onChange={(event) =>
                                    setPasswordConfirmation(event.target.value)
                                }
                                minLength={MINIMUM_PASSWORD_LENGTH}
                                required
                                disabled={isSubmitting}
                                className="h-14 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 text-brand-charcoal outline-none transition placeholder:text-brand-gray/60 focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 disabled:cursor-not-allowed disabled:opacity-70"
                                placeholder="Repita a password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-14 w-full rounded-full bg-brand-gold px-6 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-dark-gold disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? "A criar conta..." : "Criar conta"}
                        </button>
                    </form>

                    <div className="mt-7 rounded-2xl bg-brand-ivory p-5 text-center">
                        <p className="text-sm leading-7 text-brand-gray">
                            Já tem uma conta?{" "}
                            <Link
                                to={routePaths.login}
                                className="font-semibold text-brand-dark-gold transition hover:text-brand-charcoal"
                            >
                                Entrar
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}