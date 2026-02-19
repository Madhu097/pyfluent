'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { isAdmin } from '@/lib/admin'
import { Shield, Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react'

const ADMIN_PASSWORD = 'Admin@123'
const STORAGE_KEY = 'pyfluent_admin_auth'

export default function AdminLoginPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    // Redirect if already authenticated
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'true') {
            router.replace('/admin')
        }
    }, [])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!user) {
            setError('You must be logged in first. Please log in to the app, then come back here.')
            return
        }

        if (!isAdmin(user.email)) {
            setError(`"${user.email}" is not an admin email. Update NEXT_PUBLIC_ADMIN_EMAILS in .env and restart the dev server.`)
            return
        }

        if (!password) {
            setError('Please enter the admin password.')
            return
        }

        setSubmitting(true)

        // Check password — synchronous, no network needed
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem(STORAGE_KEY, 'true')
            window.location.href = '/admin'   // hard navigate to avoid any router caching
            return
        }

        // Also try Supabase RPC if SQL has been set up
        import('@/lib/supabase').then(({ createClient }) => {
            const supabase = createClient()
            return supabase.rpc('verify_admin_password', { input_password: password })
        }).then(({ data }) => {
            if (data === true) {
                localStorage.setItem(STORAGE_KEY, 'true')
                window.location.href = '/admin'
            } else {
                setError(`Wrong password. Default is: Admin@123`)
                setSubmitting(false)
            }
        }).catch(() => {
            // RPC not set up — password was already wrong (checked above)
            setError(`Wrong password. Default is: Admin@123`)
            setSubmitting(false)
        })
    }

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const userIsAdmin = !!user && isAdmin(user.email)

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-xl mb-4">
                            <Shield className="w-7 h-7 text-blue-400" />
                        </div>
                        <h1 className="text-xl font-bold text-white">Admin Login</h1>
                        <p className="text-gray-400 text-sm mt-1">Enter the admin password to continue</p>
                    </div>

                    {/* User status badge */}
                    {user ? (
                        <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 mb-5 ${userIsAdmin ? 'bg-green-900/40 border border-green-700/50' : 'bg-red-900/40 border border-red-700/50'}`}>
                            {userIsAdmin
                                ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            }
                            <div className="min-w-0">
                                <p className="text-white text-sm font-medium truncate">{user.email}</p>
                                <p className={`text-xs ${userIsAdmin ? 'text-green-400' : 'text-red-400'}`}>
                                    {userIsAdmin ? '✓ Admin account' : '✗ Not an admin email'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg px-3 py-2.5 mb-5 text-center">
                            <p className="text-yellow-300 text-sm">
                                ⚠️ Not logged in —{' '}
                                <a href="/login" className="underline font-semibold hover:text-yellow-200">Log in first</a>
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="admin-pw" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                                Admin Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                <input
                                    id="admin-pw"
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setError('') }}
                                    placeholder="Enter admin password"
                                    autoComplete="current-password"
                                    autoFocus
                                    className="w-full bg-gray-700 border border-gray-600 text-white placeholder-gray-500 rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                />
                                {/* Eye icon toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowPw(v => !v)}
                                    tabIndex={-1}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white rounded transition-colors"
                                    title={showPw ? 'Hide password' : 'Show password'}
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {/* Text toggle */}
                            <button
                                type="button"
                                onClick={() => setShowPw(v => !v)}
                                className="text-xs text-gray-500 hover:text-gray-300 mt-1.5 transition-colors"
                            >
                                {showPw ? '🙈 Hide password' : '👁 Show password'}
                            </button>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-2 bg-red-900/40 border border-red-700/50 rounded-lg px-3 py-2.5">
                                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                <p className="text-red-300 text-sm leading-relaxed">{error}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting || !password}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <Shield className="w-4 h-4" />
                                    Enter Admin Panel
                                </>
                            )}
                        </button>
                    </form>

                    {/* Hint */}
                    <div className="mt-5 bg-amber-900/30 border border-amber-700/40 rounded-lg p-3 text-center">
                        <p className="text-amber-300 text-xs font-medium">
                            🔑 Default password: <span className="font-mono font-bold text-amber-200">Admin@123</span>
                        </p>
                        <p className="text-amber-600 text-xs mt-0.5">Change it in Admin → Settings after login</p>
                    </div>

                    <p className="text-center mt-4">
                        <a href="/dashboard" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                            ← Back to Dashboard
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
