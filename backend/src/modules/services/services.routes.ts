// backend/src/modules/services/services.routes.ts
import type { FastifyInstance } from "fastify"
import { ServicesController } from "./services.controller"
import type { ServiceSlugParams } from "./services.types"

const servicesController = new ServicesController()

export async function servicesRoutes(app: FastifyInstance) {
    app.get("/services", (request, reply) =>
        servicesController.listPublicCatalog(request, reply)
    )

    app.get<{ Params: ServiceSlugParams }>("/services/:slug", (request, reply) =>
        servicesController.getPublicServiceBySlug(request, reply)
    )
}