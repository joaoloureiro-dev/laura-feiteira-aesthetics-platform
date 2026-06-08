export type UserRole = "CLIENT" | "OWNER" | "ADMIN"

export type AuthUser = {
    id: string
    name?: string
    email?: string
    role: UserRole
    tokenVersion?: number
}

export type LoginBody = {
    email: string
    password: string
}

export type RegisterBody = {
    name: string
    email: string
    password: string
}

export type AuthResponse = {
    user: AuthUser
    token: string
}

export type ApiResponse<T> = {
    data: T
}

export type MeResponse = {
    userId: string
    role: UserRole
    tokenVersion: number
}