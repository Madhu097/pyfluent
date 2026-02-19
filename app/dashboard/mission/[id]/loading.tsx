export default function MissionLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Nav skeleton */}
            <div className="bg-white border-b sticky top-0 z-50 h-16 flex items-center px-8">
                <div className="w-40 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="ml-auto w-48 h-5 bg-gray-100 rounded animate-pulse" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Steps progress skeleton */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                    <div className="flex items-center justify-between">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center">
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                                    <div className="w-16 h-3 bg-gray-100 rounded animate-pulse" />
                                </div>
                                {i < 4 && <div className="w-12 h-1 mx-2 bg-gray-100 rounded animate-pulse" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="w-32 h-7 bg-gray-200 rounded animate-pulse mb-6" />
                    {/* Paragraph lines */}
                    <div className="space-y-3 mb-8">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="h-4 bg-gray-100 rounded animate-pulse"
                                style={{ width: `${70 + Math.random() * 30}%` }}
                            />
                        ))}
                    </div>
                    {/* Code block skeleton */}
                    <div className="bg-gray-900 rounded-lg p-4 mb-8">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-700 rounded animate-pulse mb-2" style={{ width: `${40 + Math.random() * 50}%` }} />
                        ))}
                    </div>
                    {/* Button skeleton */}
                    <div className="w-40 h-10 bg-primary-100 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    )
}
