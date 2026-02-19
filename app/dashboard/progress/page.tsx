'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import {
    ArrowLeft, Flame, Trophy, Target, BookOpen,
    TrendingUp, Calendar, Award, BarChart3
} from 'lucide-react'

export default function ProgressPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return
        if (!user) { router.replace('/login'); return }

        const supabase = createClient()

        const fetchStats = async () => {
            try {
                const [profileRes, progressRes] = await Promise.all([
                    supabase.from('users').select('*').eq('id', user.uid).maybeSingle(),
                    supabase
                        .from('user_mission_progress')
                        .select('*, mission:missions(*)')
                        .eq('user_id', user.uid),
                ])

                const profile = profileRes.data
                const progress = progressRes.data ?? []

                const completed = progress.filter((p: any) => p.status === 'completed').length
                const inProgress = progress.filter((p: any) => p.status === 'in-progress').length
                const available = progress.filter((p: any) => p.status === 'available').length

                // Weekly breakdown (last 4 weeks)
                const weeklyData = [1, 2, 3, 4].map(w => ({
                    week: w,
                    label: `Week ${w}`,
                    completed: progress.filter((p: any) =>
                        p.mission?.week_number === w && p.status === 'completed'
                    ).length,
                    total: progress.filter((p: any) => p.mission?.week_number === w).length || 7,
                }))

                setStats({
                    profile,
                    completed,
                    inProgress,
                    available,
                    total: 30,
                    weeklyData,
                    completionRate: Math.round((completed / 30) * 100),
                })
            } catch (err) {
                console.error('Progress fetch error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [user, authLoading]) // eslint-disable-line react-hooks/exhaustive-deps

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const s = stats ?? {}

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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
                    <p className="text-gray-600">Track your Python learning journey</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: <BookOpen className="w-6 h-6 text-primary-600" />, label: 'Completed', value: s.completed ?? 0, bg: 'bg-primary-50' },
                        { icon: <Flame className="w-6 h-6 text-danger-600" />, label: 'Day Streak', value: s.profile?.current_streak ?? 0, bg: 'bg-danger-50' },
                        { icon: <Trophy className="w-6 h-6 text-warning-600" />, label: 'Total XP', value: (s.profile?.total_xp ?? 0).toLocaleString(), bg: 'bg-warning-50' },
                        { icon: <Target className="w-6 h-6 text-success-600" />, label: 'Completion', value: `${s.completionRate ?? 0}%`, bg: 'bg-success-50' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center mb-3`}>
                                {item.icon}
                            </div>
                            <div className="text-2xl font-bold">{item.value}</div>
                            <div className="text-sm text-gray-500">{item.label}</div>
                        </div>
                    ))}
                </div>

                {/* Overall Progress Bar */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-600" />
                            Overall Course Progress
                        </h2>
                        <span className="text-primary-600 font-bold">{s.completed ?? 0} / 30 missions</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4">
                        <div
                            className="bg-gradient-to-r from-primary-600 to-success-600 h-4 rounded-full transition-all duration-700"
                            style={{ width: `${s.completionRate ?? 0}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Start</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Complete</span>
                    </div>
                </div>

                {/* Weekly Breakdown */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        Weekly Breakdown
                    </h2>
                    <div className="space-y-4">
                        {(s.weeklyData ?? []).map((week: any) => (
                            <div key={week.week}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">{week.label}</span>
                                    <span className="text-gray-500">{week.completed}/{week.total} missions</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div
                                        className="bg-gradient-to-r from-primary-500 to-success-500 h-2.5 rounded-full transition-all"
                                        style={{ width: `${week.total > 0 ? (week.completed / week.total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mission Status Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Completed', count: s.completed ?? 0, color: 'text-success-600', bg: 'bg-success-50 border-success-200', icon: <Award className="w-5 h-5 text-success-600" /> },
                        { label: 'In Progress', count: s.inProgress ?? 0, color: 'text-primary-600', bg: 'bg-primary-50 border-primary-200', icon: <BarChart3 className="w-5 h-5 text-primary-600" /> },
                        { label: 'Locked', count: Math.max(0, 30 - (s.completed ?? 0) - (s.inProgress ?? 0) - (s.available ?? 0)), color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200', icon: <Target className="w-5 h-5 text-gray-400" /> },
                    ].map((item, i) => (
                        <div key={i} className={`rounded-xl border p-5 ${item.bg}`}>
                            <div className="flex items-center gap-3 mb-2">
                                {item.icon}
                                <span className="font-medium text-gray-700">{item.label}</span>
                            </div>
                            <div className={`text-3xl font-bold ${item.color}`}>{item.count}</div>
                            <div className="text-sm text-gray-500">missions</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
