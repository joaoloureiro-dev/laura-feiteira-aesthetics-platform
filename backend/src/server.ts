import { buildApp } from "./app"
import { env } from "./config/env"

/**
 * Starts the HTTP server.
 *
 * This file should be responsible only for starting the app.
 * The app configuration itself stays inside app.ts.
 */
async function startServer() {
    const app = buildApp()

    try {
        await app.listen({
            port: env.PORT,
            host: "0.0.0.0",
        })

        app.log.info(`API running on port ${env.PORT}`)
    } catch (error) {
        app.log.error(error)

        /**
         * If the server cannot start, we exit the process with code 1.
         * This is important for deployment platforms to detect failure.
         */
        process.exit(1)
    }
}

startServer()