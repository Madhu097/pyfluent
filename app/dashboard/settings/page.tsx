'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'
import { ArrowLeft, User, Lock, Bell, Save, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    const [fullName, setFullName] = useState('')
    const [dailyMode, setDailyMode] = useState(20)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [saving, setSaving] = useState(false)
    const [savingPw, setSavingPw] = useState(false)
    const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        if (authLoading) return
        if (!user) { router.replace('/login'); return }

        // Pre-fill from Firebase
        setFullName(user.displayName ?? '')

        // Pre-fill daily mode from Supabase
        const supabase = createClient()
        supabase.from('users').select('daily_mode').eq('id', user.uid).maybeSingle().then(({ data }) => {
            if (data?.daily_mode) setDailyMode(data.daily_mode)
        })
    }, [user, authLoading]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setSaving(true)
        setProfileMsg(null)
        try {
            // Update Firebase display name
            await updateProfile(auth.currentUser!, { displayName: fullName })

            // Update Supabase profile
            const supabase = createClient()
            await supabase
                .from('users')
                .update({ full_name: fullName, daily_mode: dailyMode })
                .eq('id', user.uid)

            setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
        } catch (err: any) {
            setProfileMsg({ type: 'error', text: err.message ?? 'Failed to update profile.' })
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !auth.currentUser) return
        setSavingPw(true)
        setPwMsg(null)
        try {
            // Re-authenticate first
            const credential = EmailAuthProvider.credential(user.email!, currentPassword)
            await reauthenticateWithCredential(auth.currentUser, credential)
            // Update password
            await updatePassword(auth.currentUser, newPassword)
            setPwMsg({ type: 'success', text: 'Password changed successfully!' })
            setCurrentPassword('')
            setNewPassword('')
        } catch (err: any) {
            if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setPwMsg({ type: 'error', text: 'Current password is incorrect.' })
            } else if (err.code === 'auth/weak-password') {
                setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' })
            } else {
                setPwMsg({ type: 'error', text: err.message ?? 'Failed to change password.' })
            }
        } finally {
            setSavingPw(false)
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Nav */}
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 transition">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Dashboard
                        </Link>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-success-600 bg-clip-text text-transparent">
                            PyFluent
                        </span>
                    </div>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Settings</h1>
                    <p className="text-gray-600">Manage your account and preferences</p>
                </div>

                {/* Profile Settings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary-600" />
                        Profile
                    </h2>

                    {profileMsg && (
                        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-4 text-sm ${profileMsg.type === 'success'
                                ? 'bg-success-50 border border-success-200 text-success-800'
                                : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                            {profileMsg.type === 'success' && <CheckCircle className="w-4 h-4" />}
                            {profileMsg.text}
                        </div>
                    )}

                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={user?.email ?? ''}
                                disabled
                                className="input bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="input"
                                placeholder="Your full name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Daily Study Goal
                            </label>
                            <select
                                value={dailyMode}
                                onChange={e => setDailyMode(Number(e.target.value))}
                                className="input"
                            >
                                <option value={10}>10 minutes / day (Casual)</option>
                                <option value={20}>20 minutes / day (Regular)</option>
                                <option value={30}>30 minutes / day (Focused)</option>
                                <option value={60}>60 minutes / day (Intensive)</option>
                            </select>
                        </div>

                        <button type="submit" disabled={saving} className="btn btn-primary flex items-center gap-2">
                            {saving ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>

                {/* Password Settings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary-600" />
                        Change Password
                    </h2>

                    {pwMsg && (
                        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-4 text-sm ${pwMsg.type === 'success'
                                ? 'bg-success-50 border border-success-200 text-success-800'
                                : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                            {pwMsg.type === 'success' && <CheckCircle className="w-4 h-4" />}
                            {pwMsg.text}
                        </div>
                    )}

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                            <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
                        </div>
                        <button type="submit" disabled={savingPw} className="btn btn-primary flex items-center gap-2">
                            {savingPw ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Lock className="w-4 h-4" />
                            )}
                            {savingPw ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>

                {/* Notifications placeholder */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary-600" />
                        Notifications
                    </h2>
                    <div className="space-y-3">
                        {[
                            { label: 'Daily reminder', desc: 'Get reminded to complete your daily mission' },
                            { label: 'Streak alerts', desc: 'Be notified before your streak breaks' },
                            { label: 'Achievement unlocked', desc: 'Celebrate when you hit milestones' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between py-2">
                                <div>
                                    <div className="font-medium text-sm">{item.label}</div>
                                    <div className="text-xs text-gray-500">{item.desc}</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked={i === 0} className="sr-only peer" />
                                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600" />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
