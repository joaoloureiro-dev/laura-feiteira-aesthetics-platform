import { useState, useEffect } from "react"

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
    evaluationRequirement: string
    options: ServiceOption[]
}

export type ServiceCategory = {
    id: string
    name: string
    slug: string
    description: string | null
    services: Service[]
}

export const useServices = () => {
    const [categories, setCategories] = useState<ServiceCategory[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/services`)
                if (!res.ok) throw new Error("Failed to fetch services")
                const data = await res.json()
                setCategories(data.data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchServices()
    }, [])

    return { categories, loading, error }
}