import { Link } from "react-router-dom"

import logo from "../../assets/brand/laura-feiteira-logo.png"
import { routePaths } from "../../routes/routePaths"

type BrandLogoProps = {
    /**
     * Controls the visual size of the logo.
     * We use variants instead of random Tailwind classes across the project.
     */
    size?: "sm" | "md" | "lg"

    /**
     * Optional callback used to close mobile menus after clicking the logo.
     */
    onClick?: () => void
}

const logoSizeClasses = {
    sm: "h-10",
    md: "h-14 sm:h-16",
    lg: "h-16 sm:h-20",
}

/**
 * Reusable brand logo component.
 *
 * Why this exists:
 * The logo appears in the public header and in dashboard headers.
 * By centralizing it here, we only need to update the logo path, size,
 * alt text or link behavior in one place.
 */
export function BrandLogo({ size = "md", onClick }: BrandLogoProps) {
    return (
        <Link
            to={routePaths.home}
            className="inline-flex items-center"
            aria-label="Ir para a página inicial da Laura Feiteira Estética"
            onClick={onClick}
        >
            <img
                src={logo}
                alt="Laura Feiteira Estética"
                className={`${logoSizeClasses[size]} w-auto object-contain`}
            />
        </Link>
    )
}