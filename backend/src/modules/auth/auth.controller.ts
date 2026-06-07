import type { FastifyReply, FastifyRequest } from "fastify"

import { AuthService } from "./auth.service"
import type { LoginBody, RegisterBody } from "./auth.types"

const authService = new AuthService()

/**
 * HTTP controller for authentication.
 */
export class AuthController {
    /**
     * POST /auth/register
     *
     * Public account creation.
     * Always creates CLIENT users.
     */
    async register(
        request: FastifyRequest<{
            Body: RegisterBody
        }>,
        reply: FastifyReply,
    ) {
        try {
            const result = await authService.register(request.body)

            return reply.status(201).send({
                data: result,
            })
        } catch (error) {
            const code = error instanceof Error ? error.message : "REGISTER_FAILED"

            if (
                code === "NAME_REQUIRED" ||
                code === "EMAIL_REQUIRED" ||
                code === "PASSWORD_TOO_SHORT" ||
                code === "EMAIL_ALREADY_IN_USE"
            ) {
                return reply.status(400).send({
                    error: {
                        code,
                        message: "Could not create account.",
                    },
                })
            }

            return reply.status(500).send({
                error: {
                    code: "REGISTER_FAILED",
                    message: "Could not create account.",
                },
            })
        }
    }

    /**
     * POST /auth/login
     *
     * Shared login for CLIENT, OWNER and ADMIN.
     */
    async login(
        request: FastifyRequest<{
            Body: LoginBody
        }>,
        reply: FastifyReply,
    ) {
        try {
            const result = await authService.login(request.body)

            return reply.status(200).send({
                data: result,
            })
        } catch (error) {
            const code = error instanceof Error ? error.message : "LOGIN_FAILED"

            if (code === "INVALID_CREDENTIALS") {
                return reply.status(401).send({
                    error: {
                        code,
                        message: "Invalid email or password.",
                    },
                })
            }

            return reply.status(500).send({
                error: {
                    code: "LOGIN_FAILED",
                    message: "Could not login.",
                },
            })
        }
    }

    /**
     * GET /auth/me
     *
     * Returns the authenticated token payload.
     */
    async me(request: FastifyRequest, reply: FastifyReply) {
        if (!request.user) {
            return reply.status(401).send({
                error: {
                    code: "UNAUTHORIZED",
                    message: "Authentication required.",
                },
            })
        }

        return reply.status(200).send({
            data: request.user,
        })
    }
}