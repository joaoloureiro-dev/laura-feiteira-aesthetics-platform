import type { ApiResponse, Service, ServiceCategory } from "./types/services.types"

/**
 * API base URL.
 *
 * In development, this points to the local Fastify backend.
 * In production, Vercel will use the environment variable configured there.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333"

/**
 * Fetches the full public service catalog.
 *
 * The backend returns:
 * category -> services -> options
 */
export async function getPublicServiceCatalog(): Promise<ServiceCategory[]> {
    const response = await fetch(`${API_BASE_URL}/services`)

    if (!response.ok) {
        throw new Error("Não foi possível carregar os serviços.")
    }

    const payload = (await response.json()) as ApiResponse<ServiceCategory[]>

    return payload.data
}

/**
 * Fetches one public service by slug.
 *
 * This is used by the service detail page:
 * /services/:slug
 */
export async function getPublicServiceBySlug(slug: string): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/services/${slug}`)

    if (response.status === 404) {
        throw new Error("Serviço não encontrado.")
    }

    if (!response.ok) {
        throw new Error("Não foi possível carregar o serviço.")
    }

    const payload = (await response.json()) as ApiResponse<Service>

    return payload.data
}