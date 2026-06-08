import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"

import { loginRequest, meRequest, registerRequest } from "./auth.api"
import type { AuthUser, LoginBody, RegisterBody } from "../types/auth.types"

const AUTH_TOKEN_STORAGE_KEY = "laura_feiteira_auth_token"
const AUTH_USER_STORAGE_KEY = "laura_feiteira_auth_user"

type AuthContextValue = {
    user: AuthUser | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (body: LoginBody) => Promise<AuthUser>
    register: (body: RegisterBody) => Promise<AuthUser>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getStoredUser(): AuthUser | null {
    const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY)

    if (!storedUser) {
        return null
    }

    try {
        return JSON.parse(storedUser) as AuthUser
    } catch {
        localStorage.removeItem(AUTH_USER_STORAGE_KEY)
        return null
    }
}

/**
 * Stores and validates the frontend authentication state.
 *
 * Important:
 * This protects the frontend experience, but real security is always enforced
 * by the backend JWT middleware.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem(AUTH_TOKEN_STORAGE_KEY),
    )
    const [user, setUser] = useState<AuthUser | null>(() => getStoredUser())
    const [isLoading, setIsLoading] = useState(true)

    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
        localStorage.removeItem(AUTH_USER_STORAGE_KEY)
        setToken(null)
        setUser(null)
    }, [])

    useEffect(() => {
        async function validateSession() {
            if (!token) {
                setIsLoading(false)
                return
            }

            try {
                const session = await meRequest(token)

                const nextUser: AuthUser = {
                    id: session.userId,
                    role: session.role,
                    tokenVersion: session.tokenVersion,
                    name: user?.name,
                    email: user?.email,
                }

                localStorage.setItem(
                    AUTH_USER_STORAGE_KEY,
                    JSON.stringify(nextUser),
                )

                setUser(nextUser)
            } catch {
                logout()
            } finally {
                setIsLoading(false)
            }
        }

        validateSession()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, logout])

    async function login(body: LoginBody) {
        const result = await loginRequest(body)

        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.token)
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(result.user))

        setToken(result.token)
        setUser(result.user)

        return result.user
    }

    async function register(body: RegisterBody) {
        const result = await registerRequest(body)

        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, result.token)
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(result.user))

        setToken(result.token)
        setUser(result.user)

        return result.user
    }

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(user && token),
            isLoading,
            login,
            register,
            logout,
        }),
        [user, token, isLoading, logout],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }

    return context
}