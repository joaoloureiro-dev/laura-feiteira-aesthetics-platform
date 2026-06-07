import "dotenv/config"

/**
 * Centralized environment configuration.
 *
 * Keeping env variables here avoids reading process.env directly
 * across the application.
 */
export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT ?? 3333),

    FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:5173",

    JWT_SECRET: process.env.JWT_SECRET ?? "local-dev-secret-change-later",
    JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN ?? 604800), // 7 dias default

    SMTP_HOST: process.env.SMTP_HOST ?? "",
    SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
    SMTP_SECURE: process.env.SMTP_SECURE === "true",
    SMTP_USER: process.env.SMTP_USER ?? "",
    SMTP_PASS: process.env.SMTP_PASS ?? "",
    SMTP_FROM:
        process.env.SMTP_FROM ?? "Laura Feiteira Estética <no-reply@example.com>",
}