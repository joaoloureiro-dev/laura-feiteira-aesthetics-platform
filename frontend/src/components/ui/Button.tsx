import type { ButtonHTMLAttributes, ReactNode } from "react"

/**
 * Defines the visual style options available for the Button component.
 *
 * "primary" is used for the main action.
 * "secondary" is used for alternative actions.
 * "ghost" is used for subtle links/actions.
 */
type ButtonVariant = "primary" | "secondary" | "ghost"

/**
 * Defines the available button sizes.
 *
 * Centralizing sizes keeps the interface consistent across:
 * public website, client dashboard, owner dashboard and admin dashboard.
 */
type ButtonSize = "sm" | "md" | "lg"

/**
 * Shared props used by both button and link versions.
 */
type ButtonBaseProps = {
    children: ReactNode
    variant?: ButtonVariant
    size?: ButtonSize
    className?: string
}

/**
 * Props for a real HTML button.
 *
 * Use this mode for actions:
 * - submitting a form;
 * - opening a modal;
 * - triggering a state change.
 *
 * We omit "className" and "children" because they already exist in ButtonBaseProps.
 */
type ButtonActionProps = ButtonBaseProps &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">

/**
 * Props for a link styled as a button.
 *
 * Use this mode for navigation:
 * - moving to another page;
 * - moving to a page section;
 * - external links.
 */
type ButtonLinkProps = ButtonBaseProps & {
    href: string
    target?: "_self" | "_blank" | "_parent" | "_top"
    rel?: string
    ariaLabel?: string
}

type ButtonProps = ButtonActionProps | ButtonLinkProps

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-brand-gold text-white shadow-sm hover:bg-brand-dark-gold focus-visible:outline-brand-dark-gold",
    secondary:
        "border border-brand-gold/50 text-brand-dark-gold hover:bg-white focus-visible:outline-brand-gold",
    ghost:
        "text-brand-dark-gold hover:bg-white/70 focus-visible:outline-brand-gold",
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-5 py-3 text-xs",
    md: "px-6 py-3.5 text-sm",
    lg: "px-8 py-4 text-sm",
}

/**
 * Builds the final className used by both button and link modes.
 *
 * Keeping this logic in one function prevents duplicated Tailwind classes
 * and makes future style changes easier.
 */
function getButtonClasses({
    variant = "primary",
    size = "md",
    className = "",
}: Pick<ButtonBaseProps, "variant" | "size" | "className">) {
    const baseClasses =
        "inline-flex items-center justify-center rounded-full font-semibold uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
}

/**
 * Type guard.
 *
 * This function tells TypeScript:
 * "If href is a string, then this Button must be a link button."
 *
 * This is more reliable than using only `"href" in props`,
 * because button props and link props are part of a union type.
 */
function isButtonLinkProps(props: ButtonProps): props is ButtonLinkProps {
    return "href" in props && typeof props.href === "string"
}

/**
 * Internal component used when Button should behave as a link.
 *
 * It receives only link-specific props, so TypeScript cannot confuse it
 * with native button props.
 */
function ButtonLink({
    children,
    href,
    target,
    rel,
    ariaLabel,
    variant,
    size,
    className,
}: ButtonLinkProps) {
    const classes = getButtonClasses({ variant, size, className })

    return (
        <a
            href={href}
            target={target}
            rel={rel}
            aria-label={ariaLabel}
            className={classes}
        >
            {children}
        </a>
    )
}

/**
 * Internal component used when Button should behave as a real button.
 *
 * The default type is "button" to avoid accidental form submissions.
 * When we later need submit buttons, we can pass type="submit".
 */
function ButtonAction({
    children,
    variant,
    size,
    className,
    type = "button",
    ...buttonProps
}: ButtonActionProps) {
    const classes = getButtonClasses({ variant, size, className })

    return (
        <button type={type} className={classes} {...buttonProps}>
            {children}
        </button>
    )
}

/**
 * Reusable Button component.
 *
 * Important concept:
 * A link and a button can look the same visually, but they are not the same in HTML.
 *
 * - Use href when the user is navigating somewhere.
 * - Do not use href when the user is performing an action.
 */
export function Button(props: ButtonProps) {
    if (isButtonLinkProps(props)) {
        return <ButtonLink {...props} />
    }

    return <ButtonAction {...props} />
}