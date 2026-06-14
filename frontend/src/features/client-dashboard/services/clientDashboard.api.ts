import type {
    ApiResponse,
    ClientBooking,
} from "../types/clientDashboard.types"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333"

type ApiErrorResponse = {
    error?: {
        code?: string
        message?: string
    }
}

/**
 * Loads all bookings belonging to the authenticated client.
 *
 * Security:
 * The backend obtains the client userId from the validated JWT.
 * No userId is sent by the frontend.
 */
export async function getMyBookings(token: string) {
    const response = await fetch(`${API_BASE_URL}/bookings/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const payload = (await response.json().catch(() => null)) as
        | ApiResponse<ClientBooking[]>
        | ApiErrorResponse
        | null

    if (!response.ok) {
        const errorPayload = payload as ApiErrorResponse | null

        throw new Error(
            errorPayload?.error?.code ?? "BOOKINGS_FETCH_FAILED",
        )
    }

    return (payload as ApiResponse<ClientBooking[]>).data
}