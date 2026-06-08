export type ServiceOption = {
    id: string
    name: string
    description: string | null
    priceCents: number | null
    priceLabel: string | null
    durationMinutes: number | null
}

export type ServiceProfessional = {
    id: string
    name: string
    slug: string
}

export type Service = {
    id: string
    name: string
    slug: string
    description: string | null
    evaluationRequirement: "OPTIONAL" | "REQUIRED" | "NOT_REQUIRED" | string
    options: ServiceOption[]
    professionals: ServiceProfessional[]
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

export type AppointmentType =
    | "ONLINE_EVALUATION"
    | "IN_PERSON_EVALUATION"
    | "TREATMENT_SESSION"

export type AvailabilitySlot = {
    id: string
    startsAt: string
    endsAt: string
    appointmentType: AppointmentType
    isOpen: boolean
    note?: string | null
}