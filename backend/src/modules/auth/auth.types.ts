import type { UserRole } from "@prisma/client"

/**
 * Public register request.
 *
 * Any public registration always creates a CLIENT account.
 * OWNER and ADMIN users must be created manually/admin-side later.
 */
export type RegisterBody = {
    name: string
    email: string
    password: string
}

/**
 * Login request.
 *
 * The same login endpoint is used by CLIENT, OWNER and ADMIN.
 */
export type LoginBody = {
    email: string
    password: string
}

/**
 * Safe user object returned to the frontend.
 *
 * Never return passwordHash.
 */
export type AuthenticatedUser = {
    id: string
    name: string
    email: string
    role: UserRole
}

/**
 * Auth response returned after register/login.
 */
export type AuthResponse = {
    user: AuthenticatedUser
    token: string
}

/**
 * JWT payload stored inside the token.
 *
 * tokenVersion allows us to invalidate old tokens later:
 * - password change;
 * - forced logout;
 * - security reset.
 */
export type JwtPayload = {
    userId: string
    role: UserRole
    tokenVersion: number
}