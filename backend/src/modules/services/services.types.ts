export type ServiceSlugParams = {
    slug: string
}

export type PublicServiceOption = {
    id: string
    name: string
    description: string | null
    priceCents: number | null
    priceLabel: string | null
    durationMinutes: number | null
}

export type PublicServiceProfessional = {
    id: string
    name: string
    slug: string
}

export type PublicService = {
    id: string
    name: string
    slug: string
    description: string | null
    evaluationRequirement: string
    options: PublicServiceOption[]
    professionals: PublicServiceProfessional[]
}

export type PublicServiceCategory = {
    id: string
    name: string
    slug: string
    description: string | null
    services: PublicService[]
}