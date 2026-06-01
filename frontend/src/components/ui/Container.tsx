import type { HTMLAttributes, ReactNode } from "react"

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode
}

/**
 * Reusable layout container.
 *
 * Why this exists:
 * Most sections of the website should use the same maximum width and horizontal spacing.
 * This avoids random layouts and keeps the design aligned across pages.
 */
export function Container({ children, className = "", ...props }: ContainerProps) {
    return (
        <div className={`mx-auto max-w-6xl px-6 ${className}`} {...props}>
            {children}
        </div>
    )
}