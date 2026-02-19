'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Code2, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const getFriendlyError = (code: string) => {
        switch (code) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                return 'Incorrect email or password. Please check and try again.'
            case 'auth/invalid-email':
                return 'Please enter a valid email address.'
            case 'auth/user-disabled':
                return 'This account has been disabled. Please contact support.'
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please wait a few minutes and try again.'
            case 'auth/network-request-failed':
                return 'Network error. Please check your internet connection.'
            case 'auth/popup-closed-by-user':
                return 'Google sign-in was cancelled.'
            default:
                return `Login failed (${code}). Please check your credentials.`
        }
    }

    const navigateToDashboard = () => {
        router.push('/dashboard')
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigateToDashboard()
        } catch (err: any) {
            setError(getFriendlyError(err.code))
        } finally {
            setLoading(false)
        }
    }

    const handleGoogle = async () => {
        setGoogleLoading(true)
        setError('')
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            navigateToDashboard()
        } catch (err: any) {
            if (err.code !== 'auth/popup-closed-by-user') {
                setError(getFriendlyError(err.code))
            }
        } finally {
            setGoogleLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <Link href="/landing" className="flex items-center justify-center space-x-2 mb-8">
                    <Code2 className="w-10 h-10 text-primary-600" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-success-600 bg-clip-text text-transparent">
                        PyFluent
                    </span>
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
                    <p className="text-gray-600 text-center mb-6">
                        Continue your Python learning journey
                    </p>

                    {/* Google Sign In */}
                    <button
                        type="button"
                        onClick={handleGoogle}
                        disabled={googleLoading || loading}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl py-2.5 px-4 text-sm font-medium text-gray-700 transition-all mb-5 disabled:opacity-50"
                    >
                        {googleLoading ? (
                            <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        {googleLoading ? 'Signing in...' : 'Continue with Google'}
                    </button>

                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-5 text-sm">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password with show/hide */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPw ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input pr-10"
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    title={showPw ? 'Hide password' : 'Show password'}
                                    tabIndex={-1}
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || googleLoading}
                            className="btn btn-primary w-full py-3 text-base"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Logging in...</span>
                                </span>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 mt-6 text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-primary-600 font-semibold hover:text-primary-700">
                            Sign up free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
