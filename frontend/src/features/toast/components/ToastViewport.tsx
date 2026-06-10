import { useToast } from "../services/ToastContext"
import type { Toast, ToastType } from "../types/toast.types"

function getToastStyles(type: ToastType) {
    if (type === "success") {
        return {
            border: "border-green-200",
            background: "bg-green-50",
            title: "text-green-800",
            message: "text-green-700",
            dot: "bg-green-500",
        }
    }

    if (type === "error") {
        return {
            border: "border-red-200",
            background: "bg-red-50",
            title: "text-red-800",
            message: "text-red-700",
            dot: "bg-red-500",
        }
    }

    if (type === "warning") {
        return {
            border: "border-amber-200",
            background: "bg-amber-50",
            title: "text-amber-800",
            message: "text-amber-700",
            dot: "bg-amber-500",
        }
    }

    return {
        border: "border-brand-gold/20",
        background: "bg-white",
        title: "text-brand-charcoal",
        message: "text-brand-gray",
        dot: "bg-brand-gold",
    }
}

function ToastCard({ toast }: { toast: Toast }) {
    const { removeToast } = useToast()
    const styles = getToastStyles(toast.type)

    return (
        <div
            className={`pointer-events-auto w-full max-w-sm rounded-2xl border ${styles.border} ${styles.background} p-4 shadow-xl shadow-black/10`}
            role="status"
        >
            <div className="flex gap-3">
                <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`}
                />

                <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${styles.title}`}>
                        {toast.title}
                    </p>

                    {toast.message ? (
                        <p className={`mt-1 text-sm leading-6 ${styles.message}`}>
                            {toast.message}
                        </p>
                    ) : null}
                </div>

                <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    className="rounded-full px-2 text-sm text-brand-gray transition hover:bg-black/5 hover:text-brand-charcoal"
                    aria-label="Fechar notificação"
                >
                    ×
                </button>
            </div>
        </div>
    )
}

/**
 * Fixed viewport for toast notifications.
 */
export function ToastViewport() {
    const { toasts } = useToast()

    if (toasts.length === 0) {
        return null
    }

    return (
        <div className="fixed right-4 top-24 z-50 flex w-[calc(100%-2rem)] flex-col items-end gap-3 sm:right-6 sm:w-auto">
            {toasts.map((toast) => (
                <ToastCard key={toast.id} toast={toast} />
            ))}
        </div>
    )
}