import type { ReactNode } from "react"

import { Footer } from "./Footer"
import { Header } from "./Header"

type PublicLayoutProps = {
    children: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-brand-ivory text-brand-charcoal">
            <Header />
            {children}
            <Footer />
        </div>
    )
}