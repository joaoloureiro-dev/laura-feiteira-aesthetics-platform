import bcrypt from "bcryptjs"
import jwt, { type Secret, type SignOptions } from "jsonwebtoken"

import { env } from "../../config/env"
import { prisma } from "../../database/prisma"
import type {
    AuthResponse,
    JwtPayload,
    LoginBody,
    RegisterBody,
} from "./auth.types"

const PASSWORD_MIN_LENGTH = 8

/**
 * Auth service.
 *
 * Responsible for:
 * - public client registration;
 * - login for CLIENT / OWNER / ADMIN;
 * - JWT generation.
 */
export class AuthService {
    /**
     * Public registration.
     *
     * Business rule:
     * Anyone registering from the public website becomes CLIENT.
     * OWNER and ADMIN accounts are not created publicly.
     */
    async register(data: RegisterBody): Promise<AuthResponse> {
        const normalizedName = data.name.trim()
        const normalizedEmail = data.email.trim().toLowerCase()

        if (!normalizedName) {
            throw new Error("NAME_REQUIRED")
        }

        if (!normalizedEmail) {
            throw new Error("EMAIL_REQUIRED")
        }

        if (data.password.length < PASSWORD_MIN_LENGTH) {
            throw new Error("PASSWORD_TOO_SHORT")
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        })

        if (existingUser) {
            throw new Error("EMAIL_ALREADY_IN_USE")
        }

        const passwordHash = await bcrypt.hash(data.password, 12)

        const user = await prisma.user.create({
            data: {
                name: normalizedName,
                email: normalizedEmail,
                passwordHash,
                role: "CLIENT",
            },
        })

        const token = this.generateToken({
            userId: user.id,
            role: user.role,
            tokenVersion: user.tokenVersion,
        })

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        }
    }

    /**
     * Login.
     *
     * This endpoint is shared by:
     * - CLIENT;
     * - OWNER;
     * - ADMIN.
     *
     * The frontend redirects based on user.role.
     */
    async login(data: LoginBody): Promise<AuthResponse> {
        const normalizedEmail = data.email.trim().toLowerCase()

        if (!normalizedEmail || !data.password) {
            throw new Error("INVALID_CREDENTIALS")
        }

        const user = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        })

        if (!user || !user.passwordHash) {
            throw new Error("INVALID_CREDENTIALS")
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.passwordHash,
        )

        if (!isPasswordValid) {
            throw new Error("INVALID_CREDENTIALS")
        }

        const token = this.generateToken({
            userId: user.id,
            role: user.role,
            tokenVersion: user.tokenVersion,
        })

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        }
    }

    /**
     * Generates JWT token.
     *
     * JWT_EXPIRES_IN is a number in seconds.
     * Example:
     * 3600 = 1 hour
     * 604800 = 7 days
     */
    private generateToken(payload: JwtPayload): string {
        const secret: Secret = env.JWT_SECRET

        const options: SignOptions = {
            expiresIn: env.JWT_EXPIRES_IN,
        }

        return jwt.sign(payload, secret, options)
    }
}