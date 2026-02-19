'use client'

import { useState } from 'react'
import { User, DashboardStats } from '@/lib/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import {
    Flame, Trophy, Target, BookOpen, BarChart3,
    Settings, LogOut, Play, Menu, X, ChevronRight, Library
} from 'lucide-react'

interface DashboardClientProps {
    user: User
    stats: DashboardStats
}

export default function DashboardClient({ user, stats }: DashboardClientProps) {
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = async () => {
        await signOut(auth)
        router.push('/landing')
    }

    const todayMission = stats.todayMission

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/dashboard/roadmap', label: 'Roadmap' },
        { href: '/dashboard/progress', label: 'Progress' },
        { href: '/dashboard/resources', label: 'Resources', icon: <Library className="w-3.5 h-3.5 text-indigo-500" /> },
        { href: '/dashboard/playground', label: 'Playground', icon: <Play className="w-3.5 h-3.5 text-green-500" /> },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        <div className="flex items-center justify-between w-full">
                            {/* Logo */}
                            <Link href="/dashboard" className="flex items-center gap-3 shrink-0 group">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-success-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:rotate-6 transition-transform">
                                    P
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-black bg-gradient-to-r from-primary-600 to-success-600 bg-clip-text text-transparent">
                                        PyFluent
                                    </span>
                                </div>
                            </Link>

                            {/* Balanced Navigation Spacing */}
                            <div className="hidden md:flex items-center justify-center flex-1 px-4 lg:px-8">
                                <div className="flex items-center gap-x-6 lg:gap-x-10 bg-gray-50/80 px-6 py-2 rounded-2xl border border-gray-100 shadow-sm">
                                    {navLinks.map(link => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="flex items-center gap-2 text-[11px] lg:text-[13px] text-gray-400 hover:text-primary-600 font-bold tracking-[0.15em] transition-all hover:-translate-y-0.5 uppercase whitespace-nowrap"
                                        >
                                            {link.icon}
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* User Actions */}
                            <div className="flex items-center gap-3">
                                <Link href="/dashboard/settings" className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-primary-600 transition-all border border-gray-100">
                                    <Settings className="w-5 h-5" />
                                </Link>
                                <button onClick={handleLogout} className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-red-600 transition-all border border-gray-100">
                                    <LogOut className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="md:hidden p-2 rounded-xl bg-primary-600 text-white"
                                >
                                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                {link.icon}
                                {link.label}
                                <ChevronRight className="w-4 h-4 ml-auto text-gray-300" />
                            </Link>
                        ))}
                        <div className="border-t border-gray-100 pt-2 mt-2 flex gap-2">
                            <Link href="/dashboard/settings" onClick={() => setMobileMenuOpen(false)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                                <Settings className="w-4 h-4" /> Settings
                            </Link>
                            <button onClick={handleLogout}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
                {/* Welcome Section */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        Welcome back, {user?.full_name || user?.email?.split('@')[0] || 'Learner'}! 👋
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500">
                        Ready to continue your Python journey? Let's make today count!
                    </p>
                </div>

                {/* Stats Grid — 2 cols on mobile, 4 on desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                    <StatCard
                        icon={<Flame className="w-6 h-6 sm:w-8 sm:h-8 text-danger-600" />}
                        label="Streak"
                        value={`${stats.currentStreak}d`}
                        bgColor="bg-danger-50"
                    />
                    <StatCard
                        icon={<Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-warning-600" />}
                        label="Total XP"
                        value={stats.totalXP.toLocaleString()}
                        bgColor="bg-warning-50"
                    />
                    <StatCard
                        icon={<Target className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />}
                        label="Level"
                        value={stats.skillLevel}
                        bgColor="bg-primary-50"
                    />
                    <StatCard
                        icon={<BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-success-600" />}
                        label="Done"
                        value={`${stats.completedMissions}/${stats.totalMissions}`}
                        bgColor="bg-success-50"
                    />
                </div>

                {/* Main Content Grid — stacked on mobile, side-by-side on lg */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
                    {/* Today's Mission */}
                    <div className="lg:col-span-2">
                        <div className="card border-primary-100 shadow-xl shadow-primary-500/5 overflow-hidden">
                            <div className="flex items-center justify-between mb-6 p-1">
                                <h2 className="text-2xl font-black uppercase tracking-widest text-gray-900 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white p-1 text-sm">✓</span>
                                    Today's Mission
                                </h2>
                                <span className="text-[10px] font-black text-primary-500 bg-primary-50 px-2 py-1 rounded border border-primary-100 uppercase animate-pulse">Updated</span>
                            </div>
                            {todayMission ? (
                                <div className="bg-gradient-to-br from-primary-50 to-success-50 rounded-xl p-4 sm:p-6 border border-primary-200">
                                    <div className="flex items-start justify-between mb-3 sm:mb-4 gap-3">
                                        <div className="min-w-0">
                                            <div className="text-xs sm:text-sm font-semibold text-primary-600 mb-1">
                                                Day {todayMission.day_number}
                                            </div>
                                            <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 leading-tight">{todayMission.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2">{todayMission.description}</p>
                                        </div>
                                        <div className="badge badge-primary flex-shrink-0 text-xs sm:text-sm">
                                            {todayMission.xp_reward} XP
                                        </div>
                                    </div>

                                    {/* Mission Progress */}
                                    <div className="space-y-1.5 mb-4 sm:mb-6">
                                        <ProgressItem label="Lesson" completed={todayMission.progress?.lesson_completed || false} />
                                        <ProgressItem label="Vocabulary" completed={todayMission.progress?.vocab_completed || false} />
                                        <ProgressItem label="Coding Task" completed={todayMission.progress?.coding_task_completed || false} />
                                        <ProgressItem label="Quiz" completed={todayMission.progress?.quiz_completed || false} />
                                        <ProgressItem label="Writing Task" completed={todayMission.progress?.writing_task_completed || false} />
                                    </div>

                                    <Link
                                        href={`/dashboard/mission/${todayMission.id}`}
                                        className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm sm:text-base"
                                    >
                                        <Play className="w-4 h-4" />
                                        {todayMission.progress?.status === 'in-progress' ? 'Continue Mission' : 'Start Mission'}
                                    </Link>
                                </div>
                            ) : (
                                <div className="text-center py-10 sm:py-12">
                                    <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-success-600 mx-auto mb-3 sm:mb-4" />
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2">All Caught Up!</h3>
                                    <p className="text-sm text-gray-600">You've completed all available missions. Great work!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Weekly Progress */}
                        <div className="card">
                            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">This Week</h3>
                            <div className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Progress</span>
                                    <span className="font-semibold">{Math.round(stats.weeklyProgress)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-primary-600 to-success-600 h-2 rounded-full transition-all"
                                        style={{ width: `${stats.weeklyProgress}%` }}
                                    />
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mt-3">
                                Complete {Math.max(0, 7 - (stats.completedMissions % 7))} more missions this week.
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="card">
                            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                {[
                                    { href: '/dashboard/roadmap', icon: <BookOpen className="w-4 h-4 text-primary-600" />, label: 'View Roadmap' },
                                    { href: '/dashboard/resources', icon: <Library className="w-4 h-4 text-indigo-500" />, label: 'Resources & Challenges' },
                                    { href: '/dashboard/progress', icon: <BarChart3 className="w-4 h-4 text-success-600" />, label: 'View Analytics' },
                                    { href: '/dashboard/settings', icon: <Settings className="w-4 h-4 text-gray-500" />, label: 'Settings' },
                                ].map(action => (
                                    <Link key={action.href} href={action.href} className="flex items-center gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        {action.icon}
                                        <span className="text-sm font-medium">{action.label}</span>
                                        <ChevronRight className="w-4 h-4 ml-auto text-gray-300" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Streak Freeze */}
                        {(user?.streak_freezes_available ?? 0) > 0 && (
                            <div className="card bg-primary-50 border-primary-200">
                                <h3 className="text-base sm:text-lg font-semibold mb-2">❄️ Streak Freeze</h3>
                                <p className="text-xs sm:text-sm text-gray-700">
                                    You have {user?.streak_freezes_available ?? 0} streak freeze available this week.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ icon, label, value, bgColor }: { icon: React.ReactNode; label: string; value: string; bgColor: string }) {
    return (
        <div className="card p-3 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-4">
                <div className={`p-2 sm:p-3 rounded-lg ${bgColor} flex-shrink-0`}>{icon}</div>
                <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-gray-500 truncate">{label}</div>
                    <div className="text-lg sm:text-2xl font-bold truncate">{value}</div>
                </div>
            </div>
        </div>
    )
}

function ProgressItem({ label, completed }: { label: string; completed: boolean }) {
    return (
        <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
            <span className="text-xs sm:text-sm font-medium text-gray-700">{label}</span>
            {completed ? (
                <span className="text-success-600 text-xs sm:text-sm font-semibold">✓ Done</span>
            ) : (
                <span className="text-gray-300 text-xs sm:text-sm">Pending</span>
            )}
        </div>
    )
}
