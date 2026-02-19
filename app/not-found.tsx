import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-8xl font-black text-gray-200 mb-4">404</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
                <p className="text-gray-500 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link href="/dashboard" className="btn btn-primary">
                        Go to Dashboard
                    </Link>
                    <Link href="/landing" className="btn btn-secondary">
                        Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
