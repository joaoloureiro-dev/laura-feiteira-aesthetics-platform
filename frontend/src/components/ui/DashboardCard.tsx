import type { ReactNode } from "react"

type DashboardCardProps = {
    title: string
    value: string
    description: string
    children?: ReactNode
}

/**
 * Reusable dashboard card.
 *
 * Why this exists:
 * Client, owner and admin dashboards will all need cards for metrics,
 * summaries and quick actions. This keeps the dashboard UI consistent.
 */
export function DashboardCard({
    title,
    value,
    description,
    children,
}: DashboardCardProps) {
    return (
        <article className="rounded-3xl border border-brand-gold/10 bg-white/80 p-6 shadow-sm">
            <p className="text-sm font-medium text-brand-gray">{title}</p>

            <p className="mt-3 text-3xl font-semibold text-brand-charcoal">{value}</p>

            <p className="mt-3 text-sm leading-6 text-brand-gray">{description}</p>

            {children ? <div className="mt-5">{children}</div> : null}
        </article>
    )
}