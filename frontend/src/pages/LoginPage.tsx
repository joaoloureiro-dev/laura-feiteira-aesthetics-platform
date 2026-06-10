import { useState } from "react"
import type { SubmitEventHandler } from "react"
import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "../features/auth/services/AuthContext"
import type { UserRole } from "../features/auth/types/auth.types"
import { useToast } from "../features/toast/services/ToastContext"
import { routePaths } from "../routes/routePaths"

function getDashboardPathByRole(role: UserRole) {
    if (role === "ADMIN") {
        return routePaths.adminDashboard
    }

    if (role === "OWNER") {
        return routePaths.ownerDashboard
    }

    return routePaths.clientDashboard
}

function getDashboardNameByRole(role: UserRole) {
    if (role === "ADMIN") {
        return "dashboard de administração"
    }

    if (role === "OWNER") {
        return "dashboard de gestão"
    }

    return "área de cliente"
}

export function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const { showToast } = useToast()

    const [email, setEmail] = useState("cliente.auth@test.com")
    const [password, setPassword] = useState("password123")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()

        try {
            setIsSubmitting(true)
            setErrorMessage(null)

            const user = await login({
                email,
                password,
            })

            showToast({
                type: "success",
                title: "Login efetuado com sucesso",
                message: `A redirecionar para o ${getDashboardNameByRole(
                    user.role,
                )}.`,
            })

            navigate(getDashboardPathByRole(user.role), {
                replace: true,
            })
        } catch {
            showToast({
                type: "error",
                title: "Não foi possível iniciar sessão",
                message: "Confirme o email e a password e tente novamente.",
            })

            setErrorMessage("Email ou password inválidos.")
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleGoogleLogin() {
        const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3333"

        /**
         * Visual ready.
         * Backend route /auth/google still needs to be implemented/configured.
         */
        window.location.href = `${apiUrl}/auth/google`
    }

    return (
        <main className="min-h-screen bg-brand-ivory px-4 pb-20 pt-36 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-xl">
                <div className="mb-10 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-dark-gold">
                        Área reservada
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-brand-charcoal sm:text-5xl">
                        Entrar na sua conta
                    </h1>

                    <p className="mx-auto mt-4 max-w-lg text-base leading-8 text-brand-gray">
                        Aceda à sua área pessoal. O sistema encaminha automaticamente
                        clientes, owner e admin para o dashboard correto.
                    </p>
                </div>

                <div className="rounded-3xl border border-brand-gold/10 bg-white p-6 shadow-xl shadow-black/5 sm:p-8 lg:p-10">
                    <form className="grid gap-5" onSubmit={handleSubmit}>
                        {errorMessage ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                                {errorMessage}
                            </div>
                        ) : null}

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
                                className="h-14 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 text-brand-charcoal outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10"
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
                                autoComplete="current-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                className="h-14 w-full rounded-2xl border border-brand-gold/20 bg-white px-4 text-brand-charcoal outline-none transition focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10"
                                placeholder="A sua password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-14 w-full rounded-full bg-brand-gold px-6 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-brand-dark-gold disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? "A entrar..." : "Entrar"}
                        </button>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={isSubmitting}
                            className="flex h-14 w-full items-center justify-center gap-3 rounded-full border border-brand-gold/20 bg-white px-6 text-sm font-semibold text-brand-charcoal transition hover:border-brand-gold hover:bg-brand-ivory disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <path
                                    fill="#FFC107"
                                    d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.243 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
                                />
                                <path
                                    fill="#FF3D00"
                                    d="M6.306 14.691l6.571 4.819C14.655 16.108 19.002 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.311 4.337-17.694 10.691z"
                                />
                                <path
                                    fill="#4CAF50"
                                    d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.157 35.091 26.678 36 24 36c-5.222 0-9.619-3.329-11.283-7.946l-6.522 5.025C9.53 39.556 16.227 44 24 44z"
                                />
                                <path
                                    fill="#1976D2"
                                    d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 0 1-4.084 5.565h.002l6.19 5.238C36.971 39.214 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"
                                />
                            </svg>

                            Entrar com Google
                        </button>
                    </form>

                    <div className="mt-7 rounded-2xl bg-brand-ivory p-5">
                        <p className="text-sm leading-7 text-brand-gray">
                            Ainda não tem conta?{" "}
                            <Link
                                to={routePaths.home}
                                className="font-semibold text-brand-dark-gold transition hover:text-brand-charcoal"
                            >
                                Criar conta será adicionado no próximo passo
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </section>
        </main>
    )
}