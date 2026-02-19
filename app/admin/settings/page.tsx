'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import Link from 'next/link'
import {
    ArrowLeft, Shield, Lock, Eye, EyeOff,
    CheckCircle, AlertCircle, Key, Save
} from 'lucide-react'

const STORAGE_KEY = 'pyfluent_admin_auth'

export default function AdminSettingsPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    const [oldPw, setOldPw] = useState('')
    const [newPw, setNewPw] = useState('')
    const [confirmPw, setConfirmPw] = useState('')
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (authLoading) return
        if (!user) { router.replace('/login'); return }
        if (!isAdmin(user.email)) { router.replace('/dashboard'); return }
        // Check admin password session
        if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
            window.location.href = '/admin/login'
        }
    }, [user, authLoading])

    // Password strength
    const strength = (() => {
        if (!newPw) return 0
        let s = 0
        if (newPw.length >= 8) s++
        if (/[A-Z]/.test(newPw)) s++
        if (/[0-9]/.test(newPw)) s++
        if (/[^A-Za-z0-9]/.test(newPw)) s++
        return s
    })()

    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
    const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-green-500'][strength]

    const handleChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(''); setSuccess(false)

        if (!oldPw || !newPw || !confirmPw) { setError('All fields are required.'); return }
        if (newPw !== confirmPw) { setError('New passwords do not match.'); return }
        if (newPw.length < 8) { setError('New password must be at least 8 characters.'); return }
        if (strength < 2) { setError('Password is too weak. Use uppercase, numbers, or symbols.'); return }

        setSaving(true)
        try {
            const { data, error: rpcErr } = await supabase.rpc('change_admin_password', {
                old_password: oldPw,
                new_password: newPw,
            })

            if (rpcErr) throw new Error(rpcErr.message)

            if (data === true) {
                setSuccess(true)
                setOldPw(''); setNewPw(''); setConfirmPw('')
                localStorage.setItem(STORAGE_KEY, 'true')
            } else {
                setError('Current password is incorrect.')
            }
        } catch (err: any) {
            setError(err.message || 'Failed to change password.')
        } finally {
            setSaving(false)
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Navbar */}
            <nav className="bg-gray-900 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm font-medium group transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            Admin Panel
                        </Link>
                        <span className="text-gray-700">|</span>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary-400" />
                            <span className="text-white font-semibold text-sm">Settings</span>
                        </div>
                    </div>
                    <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-white mb-1">Admin Settings</h1>
                    <p className="text-gray-400 text-sm">Manage your admin panel security settings.</p>
                </div>

                {/* Change Password Card */}
                <div className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
                    {/* Card header */}
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
                        <div className="w-9 h-9 bg-primary-500/20 rounded-xl flex items-center justify-center">
                            <Key className="w-4 h-4 text-primary-400" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-sm">Change Admin Password</h2>
                            <p className="text-xs text-gray-500">Update the password used to access the admin panel</p>
                        </div>
                    </div>

                    <form onSubmit={handleChange} className="p-6 space-y-5">
                        {/* Success */}
                        {success && (
                            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                <p className="text-sm text-green-300 font-medium">Password changed successfully!</p>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-300">{error}</p>
                            </div>
                        )}

                        {/* Current password */}
                        <PasswordField
                            label="Current Password"
                            value={oldPw}
                            onChange={v => { setOldPw(v); setError(''); setSuccess(false) }}
                            show={showOld}
                            onToggle={() => setShowOld(v => !v)}
                            placeholder="Enter current password"
                        />

                        {/* New password */}
                        <div>
                            <PasswordField
                                label="New Password"
                                value={newPw}
                                onChange={v => { setNewPw(v); setError(''); setSuccess(false) }}
                                show={showNew}
                                onToggle={() => setShowNew(v => !v)}
                                placeholder="Min 8 chars, uppercase + number recommended"
                            />
                            {/* Strength bar */}
                            {newPw && (
                                <div className="mt-2">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-white/10'}`} />
                                        ))}
                                    </div>
                                    <p className={`text-xs font-semibold ${['', 'text-red-400', 'text-amber-400', 'text-blue-400', 'text-green-400'][strength]}`}>
                                        {strengthLabel}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm password */}
                        <div>
                            <PasswordField
                                label="Confirm New Password"
                                value={confirmPw}
                                onChange={v => { setConfirmPw(v); setError(''); setSuccess(false) }}
                                show={showConfirm}
                                onToggle={() => setShowConfirm(v => !v)}
                                placeholder="Re-enter new password"
                            />
                            {confirmPw && newPw && (
                                <p className={`text-xs mt-1.5 font-medium ${confirmPw === newPw ? 'text-green-400' : 'text-red-400'}`}>
                                    {confirmPw === newPw ? '✓ Passwords match' : '✗ Passwords do not match'}
                                </p>
                            )}
                        </div>

                        {/* Requirements */}
                        <div className="bg-white/3 border border-white/5 rounded-xl p-4">
                            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Password Requirements</p>
                            <ul className="space-y-1.5">
                                {[
                                    { label: 'At least 8 characters', met: newPw.length >= 8 },
                                    { label: 'At least one uppercase letter', met: /[A-Z]/.test(newPw) },
                                    { label: 'At least one number', met: /[0-9]/.test(newPw) },
                                    { label: 'At least one special character', met: /[^A-Za-z0-9]/.test(newPw) },
                                ].map((req, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs">
                                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${req.met ? 'bg-green-500/20' : 'bg-white/5'}`}>
                                            {req.met && <CheckCircle className="w-3 h-3 text-green-400" />}
                                        </div>
                                        <span className={req.met ? 'text-green-400' : 'text-gray-500'}>{req.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={saving || !oldPw || !newPw || !confirmPw}
                            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98]"
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {saving ? 'Saving...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* Info card */}
                <div className="mt-4 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                    <p className="text-xs text-amber-300/80 leading-relaxed">
                        <span className="font-bold text-amber-300">⚠️ Note:</span> This password protects the admin panel only.
                        It is separate from your Firebase login password. The default password is <span className="font-mono font-bold">Admin@123</span>.
                    </p>
                </div>
            </div>
        </div>
    )
}

// ─── Password Field Component ─────────────────────────────────────────────────
function PasswordField({ label, value, onChange, show, onToggle, placeholder }: {
    label: string; value: string; onChange: (v: string) => void
    show: boolean; onToggle: () => void; placeholder: string
}) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
            <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white placeholder:text-gray-700 text-sm focus:outline-none focus:border-primary-500/50 focus:bg-white/8 transition-all"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>
    )
}
