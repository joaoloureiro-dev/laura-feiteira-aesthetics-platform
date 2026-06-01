import "dotenv/config"

/**
 * Centralized environment configuration.
 *
 * Why this exists:
 * Instead of reading process.env directly across the backend,
 * we centralize environment variables here.
 *
 * This makes the app easier to maintain and safer when we add validation later.
 */
export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",

    /**
     * The API port used locally.
     * In production, Railway or Render may inject their own PORT value.
     */
    PORT: Number(process.env.PORT ?? 3333),

    /**
     * Frontend URL allowed to access the API.
     * Locally this points to the Vite dev server.
     */
    FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:5173",
}