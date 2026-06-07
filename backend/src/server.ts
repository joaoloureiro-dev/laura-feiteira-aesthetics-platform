import { buildApp } from "./app"
import { env } from "./config/env"

async function startServer() {
    const app = await buildApp() // <-- await aqui, porque buildApp agora é async

    try {
        await app.listen({
            port: env.PORT,
            host: "0.0.0.0",
        })

        app.log.info(`API running on port ${env.PORT}`)
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

startServer()