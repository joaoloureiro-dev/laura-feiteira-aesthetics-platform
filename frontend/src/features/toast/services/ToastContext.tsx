import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react"

import type { Toast, ToastType } from "../types/toast.types"

type CreateToastInput = {
    type?: ToastType
    title: string
    message?: string
}

type ToastContextValue = {
    toasts: Toast[]
    showToast: (toast: CreateToastInput) => void
    removeToast: (id: string) => void
    clearToasts: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_DURATION_MS = 4500

function createToastId() {
    return `${Date.now()}-${crypto.randomUUID()}`
}

/**
 * ToastProvider stores temporary UI feedback messages.
 *
 * Examples:
 * - Login successful;
 * - Booking confirmed;
 * - Slot already reserved;
 * - Payment failed.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== id),
        )
    }, [])

    const showToast = useCallback(
        ({ type = "info", title, message }: CreateToastInput) => {
            const toast: Toast = {
                id: createToastId(),
                type,
                title,
                message,
            }

            setToasts((currentToasts) => [...currentToasts, toast])

            window.setTimeout(() => {
                removeToast(toast.id)
            }, TOAST_DURATION_MS)
        },
        [removeToast],
    )

    const clearToasts = useCallback(() => {
        setToasts([])
    }, [])

    const value = useMemo<ToastContextValue>(
        () => ({
            toasts,
            showToast,
            removeToast,
            clearToasts,
        }),
        [toasts, showToast, removeToast, clearToasts],
    )

    return (
        <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error("useToast must be used inside ToastProvider")
    }

    return context
}