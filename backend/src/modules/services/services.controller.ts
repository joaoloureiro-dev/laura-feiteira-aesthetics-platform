// backend/src/modules/services/services.controller.ts
import type { FastifyReply, FastifyRequest } from "fastify"
import { ServicesService } from "./services.service"
import type { ServiceSlugParams } from "./services.types"

const servicesService = new ServicesService()

export class ServicesController {
    async listPublicCatalog(
        _request: FastifyRequest,
        reply: FastifyReply
    ) {
        const catalog = await servicesService.listPublicCatalog()
        return reply.status(200).send({ data: catalog })
    }

    async getPublicServiceBySlug(
        request: FastifyRequest<{ Params: ServiceSlugParams }>,
        reply: FastifyReply
    ) {
        const { slug } = request.params
        const service = await servicesService.getPublicServiceBySlug(slug)
        if (!service) {
            return reply.status(404).send({
                error: {
                    code: "SERVICE_NOT_FOUND",
                    message: "Service not found",
                },
            })
        }
        return reply.status(200).send({ data: service })
    }
}