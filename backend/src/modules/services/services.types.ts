// backend/src/modules/services/services.types.ts

export interface PublicServiceOption {
    id: string
    name: string
    description: string | null
    priceCents: number | null
    priceLabel: string | null
    durationMinutes: number | null
}

export interface PublicService {
    id: string
    name: string
    slug: string
    description: string | null
    evaluationRequirement: string
    options: PublicServiceOption[]
}

export interface PublicServiceCategory {
    id: string
    name: string
    slug: string
    description: string | null
    services: PublicService[]
}

/**
 * Tipo para Fastify request.params em GET /services/:slug
 */
export interface ServiceSlugParams {
    slug: string
}