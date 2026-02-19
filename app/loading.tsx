export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg animate-pulse" />
                    <div className="w-32 h-8 bg-primary-200 rounded animate-pulse" />
                </div>
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
        </div>
    )
}
