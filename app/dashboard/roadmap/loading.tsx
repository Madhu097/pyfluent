export default function RoadmapLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Nav skeleton */}
            <div className="bg-white border-b h-16 flex items-center px-8">
                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header skeleton */}
                <div className="mb-8">
                    <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="w-80 h-4 bg-gray-100 rounded animate-pulse" />
                </div>

                {/* Progress bar skeleton */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                    <div className="flex justify-between mb-2">
                        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full animate-pulse" />
                </div>

                {/* Week sections skeleton */}
                {[...Array(4)].map((_, weekIdx) => (
                    <div key={weekIdx} className="mb-10">
                        <div className="w-40 h-6 bg-gray-200 rounded animate-pulse mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {[...Array(7)].map((_, dayIdx) => (
                                <div key={dayIdx} className="bg-white rounded-xl border border-gray-200 p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-12 h-5 bg-gray-100 rounded-full animate-pulse" />
                                        <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse" />
                                    </div>
                                    <div className="w-full h-5 bg-gray-200 rounded animate-pulse mb-2" />
                                    <div className="w-3/4 h-4 bg-gray-100 rounded animate-pulse mb-4" />
                                    <div className="w-full h-2 bg-gray-100 rounded-full animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
