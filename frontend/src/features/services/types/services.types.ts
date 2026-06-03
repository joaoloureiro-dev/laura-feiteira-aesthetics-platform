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
export type AvailabilitySlot = {
    id: string
    startsAt: string // ou Date se fores converter
    endsAt: string   // ou Date
    appointmentType: "ONLINE_EVALUATION" | "IN_PERSON_EVALUATION" | "TREATMENT_SESSION"
    isOpen: boolean
    note?: string
}