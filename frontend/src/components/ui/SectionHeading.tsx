import type { ReactNode } from "react"

type SectionHeadingProps = {
    eyebrow?: string
    title: string
    description?: ReactNode
    align?: "left" | "center"
}

/**
 * Reusable heading block for website sections.
 *
 * Why this exists:
 * Sections such as Services, About, Reviews and Contact should follow
 * the same visual hierarchy: small label, strong title and optional description.
 */
export function SectionHeading({
    eyebrow,
    title,
    description,
    align = "left",
}: SectionHeadingProps) {
    const alignmentClasses = align === "center" ? "mx-auto text-center" : ""

    return (
        <div className={`max-w-3xl ${alignmentClasses}`}>
            {eyebrow ? (
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-dark-gold">
                    {eyebrow}
                </p>
            ) : null}

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-charcoal sm:text-4xl">
                {title}
            </h2>

            {description ? (
                <p className="mt-5 text-base leading-8 text-brand-gray">{description}</p>
            ) : null}
        </div>
    )
}