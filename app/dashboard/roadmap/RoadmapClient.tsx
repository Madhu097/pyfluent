'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle, Circle, Play } from 'lucide-react'

interface Mission {
    id: string
    day_number: number
    title: string
    description: string
    week_number: number
    is_project: boolean
    xp_reward: number
    progress: Array<{
        status: 'locked' | 'available' | 'in-progress' | 'completed'
        lesson_completed: boolean
        vocab_completed: boolean
        coding_task_completed: boolean
        quiz_completed: boolean
        writing_task_completed: boolean
    }>
}

export default function RoadmapClient({ missions }: { missions: Mission[] }) {
    const weeks = [1, 2, 3, 4].map(weekNum => ({
        number: weekNum,
        title: getWeekTitle(weekNum),
        missions: missions.filter(m => m.week_number === weekNum),
    }))

    const completedCount = missions.filter(m => m.progress[0]?.status === 'completed').length
    const progressPct = missions.length > 0 ? (completedCount / missions.length) * 100 : 0

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        <div className="flex items-center gap-6 lg:gap-10">
                            <Link href="/dashboard" className="flex items-center gap-2 text-[10px] lg:text-[11px] text-gray-400 hover:text-primary-600 font-black transition-all group shrink-0 uppercase tracking-[0.2em] pl-1">
                                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                                <span>Dashboard</span>
                            </Link>
                            <div className="h-5 w-px bg-gray-200 hidden xs:block" />
                            <div className="flex items-center">
                                <span className="text-xl lg:text-2xl font-black bg-gradient-to-r from-primary-600 to-success-600 bg-clip-text text-transparent">Roadmap</span>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-4">
                            <div className="w-24 lg:w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${progressPct}%` }} />
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                {completedCount}/{missions.length} Done
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
                {/* Header */}
                <div className="mb-5 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">30-Day Python Roadmap</h1>
                    <p className="text-sm sm:text-base text-gray-500">
                        Track your progress through the complete Python curriculum
                    </p>
                </div>

                {/* Progress Overview */}
                <div className="card mb-5 sm:mb-8 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base sm:text-xl font-semibold">Overall Progress</h2>
                        <span className="text-lg sm:text-2xl font-bold text-primary-600">
                            {completedCount}/{missions.length}
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 sm:h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-primary-600 to-success-600 h-full rounded-full transition-all duration-700"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{Math.round(progressPct)}% complete</p>
                </div>

                {/* Weeks */}
                <div className="space-y-5 sm:space-y-8">
                    {weeks.map(week => (
                        <div key={week.number} className="card p-4 sm:p-6">
                            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                <div className="bg-primary-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-semibold">
                                    Week {week.number}
                                </div>
                                <h2 className="text-lg sm:text-2xl font-bold">{week.title}</h2>
                            </div>

                            {/* Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {week.missions.map(mission => (
                                    <MissionCard key={mission.id} mission={mission} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function MissionCard({ mission }: { mission: Mission }) {
    const progress = mission.progress[0]
    const isCompleted = progress?.status === 'completed'
    const isInProgress = progress?.status === 'in-progress'

    const completedTasks = [
        progress?.lesson_completed,
        progress?.vocab_completed,
        progress?.coding_task_completed,
        progress?.quiz_completed,
        progress?.writing_task_completed,
    ].filter(Boolean).length

    const isLocked = progress?.status === 'locked'
    const isAvailable = progress?.status === 'available'

    const btnLabel = isCompleted ? 'Review' : isInProgress ? 'Continue' : isLocked ? 'Locked' : 'Start'

    return (
        <div className={`border rounded-xl p-3 sm:p-4 transition-all flex flex-col relative ${isCompleted
            ? 'bg-success-50 border-success-200 shadow-sm'
            : isInProgress
                ? 'bg-primary-50 border-primary-300 shadow-md ring-1 ring-primary-200'
                : isLocked
                    ? 'bg-gray-50 border-gray-100 opacity-70 grayscale-[0.5]'
                    : 'bg-white border-primary-200 shadow-sm hover:border-primary-400'
            }`}>
            {isAvailable && (
                <div className="absolute -top-2 -right-1 bg-primary-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg animate-bounce select-none z-10">
                    NEXT UP
                </div>
            )}

            <div className="flex items-start justify-between mb-2 gap-2">
                <div className="min-w-0">
                    <div className="text-xs font-semibold text-gray-400 mb-0.5">Day {mission.day_number}</div>
                    <h3 className="font-bold text-sm sm:text-base leading-tight">{mission.title}</h3>
                </div>
                {isCompleted && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success-600 flex-shrink-0 mt-0.5" />}
                {isLocked && <div className="text-gray-300">🔒</div>}
            </div>

            {mission.is_project && (
                <div className="badge badge-warning mb-2 text-[10px] w-fit font-bold uppercase tracking-tighter">Mini Project</div>
            )}

            <p className="text-xs sm:text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{mission.description}</p>

            {/* Progress bar */}
            {(isCompleted || isInProgress) && (
                <div className="mb-4">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">
                        <span>Progress</span>
                        <span>{completedTasks}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${isCompleted ? 'bg-success-500' : 'bg-primary-500'}`}
                            style={{ width: `${(completedTasks / 5) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            <Link
                href={isLocked ? '#' : `/dashboard/mission/${mission.id}`}
                onClick={(e) => isLocked && e.preventDefault()}
                className={`btn btn-sm w-full flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold transition-all ${isCompleted
                    ? 'bg-white border-2 border-success-500 text-success-600 hover:bg-success-500 hover:text-white'
                    : isLocked
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-transparent'
                        : 'btn-primary'
                    }`}
            >
                {!isLocked && (isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />)}
                {isLocked && <span className="mr-1 opacity-50">🔒</span>}
                {btnLabel}
            </Link>
        </div>
    )
}

function getWeekTitle(weekNum: number): string {
    const titles: Record<number, string> = {
        1: 'Python Basics',
        2: 'Loops & Strings',
        3: 'Data Structures',
        4: 'Functions & OOP',
    }
    return titles[weekNum] || ''
}
