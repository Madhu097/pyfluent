export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Nav skeleton */}
            <div className="bg-white border-b h-16 flex items-center px-8">
                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="ml-8 flex space-x-6">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome skeleton */}
                <div className="mb-8">
                    <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="w-96 h-4 bg-gray-100 rounded animate-pulse" />
                </div>

                {/* Stats grid skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 bg-gray-100 rounded-lg animate-pulse" />
                                <div className="space-y-2">
                                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                                    <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main content skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Mission card skeleton */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                        <div className="w-40 h-7 bg-gray-200 rounded animate-pulse mb-4" />
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <div className="w-16 h-5 bg-primary-100 rounded-full animate-pulse mb-2" />
                            <div className="w-56 h-7 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="w-full h-4 bg-gray-100 rounded animate-pulse mb-6" />
                            <div className="space-y-2 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex justify-between p-2 bg-white rounded">
                                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                                        <div className="w-20 h-4 bg-gray-100 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>
                            <div className="w-full h-10 bg-primary-100 rounded-lg animate-pulse" />
                        </div>
                    </div>

                    {/* Sidebar skeleton */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="w-24 h-5 bg-gray-200 rounded animate-pulse mb-4" />
                            <div className="w-full h-2 bg-gray-100 rounded-full animate-pulse mb-2" />
                            <div className="w-48 h-4 bg-gray-100 rounded animate-pulse mt-4" />
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-4" />
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-full h-12 bg-gray-50 rounded-lg animate-pulse" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
