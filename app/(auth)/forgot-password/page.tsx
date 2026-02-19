'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Code2, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [sent, setSent] = useState(false)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await sendPasswordResetEmail(auth, email)
            setSent(true)
        } catch (err: any) {
            if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
                // Don't reveal if email exists — show success anyway for security
                setSent(true)
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many requests. Please wait a few minutes and try again.')
            } else {
                setError('Something went wrong. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
                        <CheckCircle className="w-16 h-16 text-success-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
                        <p className="text-gray-600 mb-6">
                            If <strong>{email}</strong> is registered, you'll receive a password reset link shortly.
                        </p>
                        <Link href="/login" className="btn btn-primary block text-center w-full py-3">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <Link href="/landing" className="flex items-center justify-center space-x-2 mb-8">
                    <Code2 className="w-10 h-10 text-primary-600" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-success-600 bg-clip-text text-transparent">
                        PyFluent
                    </span>
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                    <h1 className="text-3xl font-bold text-center mb-2">Reset Password</h1>
                    <p className="text-gray-600 text-center mb-8">
                        Enter your email and we'll send you a reset link
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleReset} className="space-y-5">
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

                        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-base">
                            {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Sending...</span>
                                </span>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 mt-6 text-sm">
                        Remember your password?{' '}
                        <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
