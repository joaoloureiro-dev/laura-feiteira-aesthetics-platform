export type ServiceOption = {
    id: string
    name: string
    description: string | null
    priceCents: number | null
    priceLabel: string | null
    durationMinutes: number | null
}

export type Service = {
    id: string
    name: string
    slug: string
    description: string | null
    evaluationRequirement: "OPTIONAL" | "REQUIRED" | "NOT_REQUIRED" | string
    options: ServiceOption[]
}

export type ServiceCategory = {
    id: string
    name: string
    slug: string
    description: string | null
    services: Service[]
}

export type ApiResponse<T> = {
    data: T
}