export type ToastType = "success" | "error" | "warning" | "info"

export type Toast = {
    id: string
    type: ToastType
    title: string
    message?: string
}