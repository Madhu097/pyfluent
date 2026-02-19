'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Thin progress bar at the top of the page that appears
 * instantly when navigating between routes.
 */
export default function TopLoader() {
    const pathname = usePathname()
    const barRef = useRef<HTMLDivElement>(null)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const bar = barRef.current
        if (!bar) return

        // Reset and animate
        bar.style.transition = 'none'
        bar.style.width = '0%'
        bar.style.opacity = '1'

        // Small delay so the reset paint fires first
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                bar.style.transition = 'width 0.4s ease-out'
                bar.style.width = '85%'
            })
        })

        // Complete after a short delay
        timerRef.current = setTimeout(() => {
            bar.style.transition = 'width 0.2s ease-out, opacity 0.3s ease-out 0.2s'
            bar.style.width = '100%'
            setTimeout(() => { bar.style.opacity = '0' }, 400)
        }, 300)

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [pathname])

    return (
        <div
            ref={barRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '3px',
                width: '0%',
                opacity: 0,
                zIndex: 9999,
                background: 'linear-gradient(90deg, #0284c7, #16a34a)',
                borderRadius: '0 2px 2px 0',
                pointerEvents: 'none',
            }}
        />
    )
}
