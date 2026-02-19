'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('App error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-6xl mb-6">⚠️</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Something went wrong</h1>
                <p className="text-gray-500 mb-8">
                    {error?.message || 'An unexpected error occurred. Please try again.'}
                </p>
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={reset}
                        className="btn btn-primary"
                    >
                        Try Again
                    </button>
                    <Link href="/dashboard" className="btn btn-secondary">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}
