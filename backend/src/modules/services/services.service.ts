import { ServicesRepository } from "./services.repository"
import type {
    PublicService,
    PublicServiceCategory,
    PublicServiceOption,
    PublicServiceProfessional,
} from "./services.types"

const servicesRepository = new ServicesRepository()

type ServiceOptionFromRepository = {
    id: string
    name: string
    description: string | null
    priceCents: number | null
    priceLabel: string | null
    durationMinutes: number | null
}

type ServiceProfessionalFromRepository = {
    professional: {
        id: string
        name: string
        slug: string
    }
}

type ServiceFromRepository = {
    id: string
    name: string
    slug: string
    description: string | null
    evaluationRequirement: string
    options: ServiceOptionFromRepository[]
    professionals: ServiceProfessionalFromRepository[]
}

type ServiceCategoryFromRepository = {
    id: string
    name: string
    slug: string
    description: string | null
    services: ServiceFromRepository[]
}

/**
 * Maps a service option from Prisma shape to the public API shape.
 */
function mapPublicServiceOption(
    option: ServiceOptionFromRepository,
): PublicServiceOption {
    return {
        id: option.id,
        name: option.name,
        description: option.description,
        priceCents: option.priceCents,
        priceLabel: option.priceLabel,
        durationMinutes: option.durationMinutes,
    }
}

/**
 * Maps a professional relation from Prisma shape to the public API shape.
 *
 * Prisma returns:
 * service.professionals[].professional
 *
 * Frontend expects:
 * service.professionals[]
 */
function mapPublicServiceProfessional(
    item: ServiceProfessionalFromRepository,
): PublicServiceProfessional {
    return {
        id: item.professional.id,
        name: item.professional.name,
        slug: item.professional.slug,
    }
}

/**
 * Maps a service from Prisma shape to the public API shape.
 */
function mapPublicService(service: ServiceFromRepository): PublicService {
    return {
        id: service.id,
        name: service.name,
        slug: service.slug,
        description: service.description,
        evaluationRequirement: service.evaluationRequirement,
        options: service.options.map(mapPublicServiceOption),
        professionals: service.professionals.map(mapPublicServiceProfessional),
    }
}

export class ServicesService {
    /**
     * Returns public service catalog grouped by category.
     */
    async listPublicCatalog(): Promise<PublicServiceCategory[]> {
        const categories = (await servicesRepository.findPublicCatalog()) as
            ServiceCategoryFromRepository[]

        return categories
            .map((category): PublicServiceCategory => ({
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                services: category.services.map(mapPublicService),
            }))
            .filter((category) => category.services.length > 0)
    }

    /**
     * Returns one public service by slug.
     */
    async getPublicServiceBySlug(slug: string): Promise<PublicService | null> {
        const service = (await servicesRepository.findPublicServiceBySlug(
            slug,
        )) as ServiceFromRepository | null

        if (!service) {
            return null
        }

        return mapPublicService(service)
    }
}