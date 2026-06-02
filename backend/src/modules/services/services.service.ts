// backend/src/modules/services/services.service.ts
import { ServicesRepository } from "./services.repository"
import type { PublicService, PublicServiceCategory, PublicServiceOption } from "./services.types"

const servicesRepository = new ServicesRepository()

export class ServicesService {
    async listPublicCatalog(): Promise<PublicServiceCategory[]> {
        const categories = await servicesRepository.findPublicCatalog()

        return categories
            .map((category: any): PublicServiceCategory => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                services: category.services.map((service: any): PublicService => ({
                    id: service.id,
                    name: service.name,
                    slug: service.slug,
                    description: service.description,
                    evaluationRequirement: service.evaluationRequirement as string,
                    options: service.options.map((option: any): PublicServiceOption => ({
                        id: option.id,
                        name: option.name,
                        description: option.description,
                        priceCents: option.priceCents,
                        priceLabel: option.priceLabel,
                        durationMinutes: option.durationMinutes,
                    })),
                })),
            }))
            .filter((category: PublicServiceCategory) => category.services.length > 0)
    }

    async getPublicServiceBySlug(slug: string): Promise<PublicService | null> {
        const service = await servicesRepository.findPublicServiceBySlug(slug)

        if (!service) return null

        return {
            id: service.id,
            name: service.name,
            slug: service.slug,
            description: service.description,
            evaluationRequirement: service.evaluationRequirement as string,
            options: service.options.map((option: any): PublicServiceOption => ({
                id: option.id,
                name: option.name,
                description: option.description,
                priceCents: option.priceCents,
                priceLabel: option.priceLabel,
                durationMinutes: option.durationMinutes,
            })),
        }
    }
}