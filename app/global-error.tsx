'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Global error:', error)
    }, [error])

    return (
        <html lang="en">
            <body>
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'system-ui, sans-serif',
                        background: '#f8fafc',
                        padding: '1rem',
                    }}
                >
                    <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💥</div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0f172a' }}>
                            Critical Error
                        </h1>
                        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                            {error?.message || 'A critical error occurred. Please refresh the page.'}
                        </p>
                        <button
                            onClick={reset}
                            style={{
                                background: '#0284c7',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.625rem 1.5rem',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
