import type {
    ApiResponse,
    AuthResponse,
    LoginBody,
    MeResponse,
    RegisterBody,
} from "../types/auth.types"

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333"

type ApiErrorResponse = {
    error?: {
        code?: string
        message?: string
    }
}

async function parseApiResponse<T>(response: Response): Promise<T> {
    const payload = (await response.json().catch(() => null)) as
        | ApiResponse<T>
        | ApiErrorResponse
        | null

    if (!response.ok) {
        const errorPayload = payload as ApiErrorResponse | null

        throw new Error(errorPayload?.error?.code ?? "API_REQUEST_FAILED")
    }

    return (payload as ApiResponse<T>).data
}

export async function loginRequest(body: LoginBody): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    return parseApiResponse<AuthResponse>(response)
}

export async function registerRequest(
    body: RegisterBody,
): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })

    return parseApiResponse<AuthResponse>(response)
}

export async function meRequest(token: string): Promise<MeResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return parseApiResponse<MeResponse>(response)
}