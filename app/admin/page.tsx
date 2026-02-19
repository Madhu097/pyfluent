'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import Link from 'next/link'
import { LayoutDashboard, BookOpen, Brain, Code, FileQuestion, Settings, LogOut, Shield } from 'lucide-react'

const STORAGE_KEY = 'pyfluent_admin_auth'

export default function AdminPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [stats, setStats] = useState({ missions: 0, users: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return
        if (!user) { router.replace('/login'); return }
        if (!isAdmin(user.email)) { router.replace('/dashboard'); return }

        // Require admin password session
        if (!localStorage.getItem(STORAGE_KEY)) {
            window.location.href = '/admin/login'
            return
        }

        const supabase = createClient()
        Promise.all([
            supabase.from('missions').select('*', { count: 'exact', head: true }),
            supabase.from('users').select('*', { count: 'exact', head: true }),
        ]).then(([m, u]) => {
            setStats({ missions: m.count ?? 0, users: u.count ?? 0 })
        }).catch(() => {
            // Tables may not exist yet — that's fine
        }).finally(() => {
            setLoading(false)
        })
    }, [user, authLoading]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleLogout = () => {
        localStorage.removeItem(STORAGE_KEY)
        window.location.href = '/admin/login'
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <nav className="bg-gray-900 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-primary-400" />
                            <h1 className="text-lg font-bold text-white">PyFluent Admin</h1>
                            <span className="text-gray-700">|</span>
                            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Back to App
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors font-medium"
                            >
                                <LogOut className="w-3.5 h-3.5" /> Lock Panel
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-900 border border-white/10 rounded-xl p-5">
                        <h3 className="text-gray-400 text-sm mb-2">Total Users</h3>
                        <div className="text-3xl font-bold text-white">{stats.users}</div>
                    </div>
                    <div className="bg-gray-900 border border-white/10 rounded-xl p-5">
                        <h3 className="text-gray-400 text-sm mb-2">Total Missions</h3>
                        <div className="text-3xl font-bold text-white">{stats.missions}</div>
                    </div>
                    <div className="bg-gray-900 border border-white/10 rounded-xl p-5">
                        <h3 className="text-gray-400 text-sm mb-2">Curriculum Progress</h3>
                        <div className="text-3xl font-bold text-white">{Math.round((stats.missions / 30) * 100)}%</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: <LayoutDashboard className="w-8 h-8 text-primary-400" />, title: 'Manage Missions', desc: 'Create, edit, and organize the 30-day curriculum', href: '/admin/missions' },
                        { icon: <BookOpen className="w-8 h-8 text-green-400" />, title: 'Manage Lessons', desc: 'Edit lesson content and markdown', href: '/admin/lessons' },
                        { icon: <Brain className="w-8 h-8 text-amber-400" />, title: 'Manage Vocabulary', desc: 'Add and edit developer English vocabulary', href: '/admin/vocabulary' },
                        { icon: <Code className="w-8 h-8 text-red-400" />, title: 'Manage Coding Tasks', desc: 'Create interactive coding challenges', href: '/admin/coding-tasks' },
                        { icon: <FileQuestion className="w-8 h-8 text-blue-400" />, title: 'Manage Quizzes', desc: 'Build quizzes and questions', href: '/admin/quizzes' },
                        { icon: <Settings className="w-8 h-8 text-gray-400" />, title: 'Settings', desc: 'Change admin password and platform config', href: '/admin/settings' },
                    ].map((item, i) => (
                        <Link key={i} href={item.href}
                            className="bg-gray-900 border border-white/10 rounded-xl p-5 hover:border-primary-500/40 hover:bg-gray-800 transition-all group">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <div>
                                    <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Admin info */}
                <div className="mt-6 bg-primary-500/10 border border-primary-500/20 rounded-xl p-5">
                    <h3 className="font-semibold text-primary-300 mb-1">🔐 Admin Session Active</h3>
                    <p className="text-gray-400 text-sm">
                        Logged in as <span className="text-white font-medium">{user?.email}</span>.
                        Your session expires when you close this tab.
                        Go to <Link href="/admin/settings" className="text-primary-400 hover:underline">Settings</Link> to change your admin password.
                    </p>
                </div>
            </div>
        </div>
    )
}
