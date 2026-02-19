'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { createClient } from '@/lib/supabase'
import { Code2 } from 'lucide-react'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const supabase = createClient()

    const getFriendlyError = (code: string) => {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'This email is already registered. Try logging in instead.'
            case 'auth/invalid-email':
                return 'Please enter a valid email address.'
            case 'auth/weak-password':
                return 'Password must be at least 6 characters.'
            case 'auth/too-many-requests':
                return 'Too many attempts. Please wait a few minutes and try again.'
            case 'auth/network-request-failed':
                return 'Network error. Please check your internet connection.'
            default:
                return 'Something went wrong. Please try again.'
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // 1. Create Firebase user (no email confirmation needed by default)
            const { user } = await createUserWithEmailAndPassword(auth, email, password)

            // 2. Set display name in Firebase
            await updateProfile(user, { displayName: fullName })

            // 3. Create user profile in Supabase DB using the Firebase UID
            const { error: dbError } = await supabase.from('users').insert({
                id: user.uid,
                email: user.email!,
                full_name: fullName,
                daily_mode: 20,
            })

            // DB error is non-fatal — profile can be created on first dashboard load
            if (dbError) {
                console.warn('Profile insert warning:', dbError.message)
            }

            // 4. Redirect immediately — no email confirmation required
            router.push('/dashboard')
        } catch (err: any) {
            console.error('CRITICAL SIGNUP ERROR:', err)
            const friendly = getFriendlyError(err.code)
            setError(friendly === 'Something went wrong. Please try again.'
                ? `Signup failed (${err.code}). Please try again.`
                : friendly)
        } finally {
            setLoading(false)
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
                    <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
                    <p className="text-gray-600 text-center mb-8">
                        Start your Python learning journey today
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="input"
                                placeholder="John Doe"
                                required
                            />
                        </div>

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
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                            <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3 text-base"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Creating Account...</span>
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 mt-6 text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                            Log in
                        </Link>
                    </p>
                </div>

                <p className="text-center text-gray-400 text-xs mt-6">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    )
}
