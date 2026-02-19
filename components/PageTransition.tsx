'use client'

import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useRef } from 'react'

/**
 * Snappy page fade-in on every route change.
 * Shortened duration to 0.12s for a faster, lag-free feel.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        // Trigger re-animation on route change
        el.style.animation = 'none'
        // Force reflow
        void el.offsetHeight
        el.style.animation = 'pageFadeIn 0.12s ease-out both'
    }, [pathname])

    return (
        <div ref={ref} style={{ animation: 'pageFadeIn 0.12s ease-out both' }}>
            {children}
        </div>
    )
}
