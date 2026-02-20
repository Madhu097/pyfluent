'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import {
    ArrowLeft, BookOpen, Brain, Code, FileText, CheckCircle,
    Play, RotateCcw, Terminal, Lightbulb, ChevronRight,
    Zap, PenLine, Trophy, Star
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'



type MissionStep = 'lesson' | 'vocab' | 'coding' | 'quiz' | 'writing'

function safeParseOptions(raw: any): string[] {
    if (raw === null || raw === undefined || raw === '') return []
    if (Array.isArray(raw)) return raw.map(s => String(s).trim()).filter(Boolean)
    if (typeof raw === 'object') return Object.values(raw).map(s => String(s).trim()).filter(Boolean)
    if (typeof raw === 'string') {
        const trimmed = raw.trim()
        if (!trimmed) return []
        if (trimmed.charAt(0) === '[') {
            try {
                const parsed = JSON.parse(trimmed)
                if (Array.isArray(parsed)) return parsed.map(s => String(s).trim()).filter(Boolean)
            } catch { /* fall through */ }
        }
        return trimmed
            .replace(/^\[|\]$/g, '')
            .split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)|\n/)
            .map(s => s.trim().replace(/^["'`]|["'`]$/g, ''))
            .filter(Boolean)
    }
    return [String(raw)]
}

const MOCK_DATA = {
    vocab: [
        { word: 'print()', meaning: 'Displays information on the screen.', category: 'function' },
        { word: 'string', meaning: 'Text data enclosed in quotes.', category: 'data type' },
        { word: 'argument', meaning: 'A value passed into a function.', category: 'concept' },
        { word: 'output', meaning: 'Information produced by a program.', category: 'concept' }
    ],
    coding: [
        {
            task_type: 'fill-blank',
            prompt: 'Write code to print "Hello, World!" to the console.',
            starter_code: '# Complete the code below\nprint(___)',
            expected_answer: 'hello, world!',
            explanation: 'The print() function outputs text to the console. Strings must be in quotes.'
        },
        {
            task_type: 'mcq',
            prompt: 'Which of these is the correct syntax for a Python string?',
            options: ['"Hello"', 'Hello', 'print(Hello)', '#Hello'],
            expected_answer: '"Hello"',
            explanation: 'Strings in Python must be wrapped in matching single or double quotes.'
        }
    ],
    quiz: {
        questions: [
            {
                question_text: 'What does the print() function do in Python?',
                options: ['Stores data', 'Displays output', 'Performs math', 'Stops the program'],
                correct_answer: 'Displays output',
                explanation: 'print() is the primary way to output information from a Python script to the console.'
            },
            {
                question_text: 'What is a "string" in Python?',
                options: ['A physical wire', 'A number', 'A sequence of characters', 'A type of loop'],
                correct_answer: 'A sequence of characters',
                explanation: 'A string is a data type that represents text — a sequence of characters in quotes.'
            }
        ]
    }
}

export default function MissionClient({ mission, userId }: { mission: any; userId: string }) {
    const [mounted, setMounted] = useState(false)
    const [currentStep, setCurrentStep] = useState<MissionStep>('lesson')
    const [saving, setSaving] = useState(false)
    const [missionCompleted, setMissionCompleted] = useState(false)
    const [nextMissionUrl, setNextMissionUrl] = useState<string | null>(null)
    const [nextMissionDay, setNextMissionDay] = useState<number | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const progressData = mission?.progress?.[0] ?? {}
    const lesson = Array.isArray(mission?.lesson) ? mission.lesson[0] : mission?.lesson
    const vocabWords = (mission?.vocab_words?.length > 0) ? mission.vocab_words : MOCK_DATA.vocab
    const codingTasks = (mission?.coding_tasks?.length > 0) ? mission.coding_tasks : MOCK_DATA.coding
    const quiz = (mission?.quiz?.questions?.length > 0) ? mission.quiz : MOCK_DATA.quiz
    const writingTask = Array.isArray(mission?.writing_task) ? mission.writing_task[0] : mission?.writing_task

    const [localProgress, setLocalProgress] = useState(progressData)

    useEffect(() => {
        setMounted(true)
        if (mission?.progress?.[0]) setLocalProgress(mission.progress[0])
    }, [mission])

    const steps = [
        { id: 'lesson' as MissionStep, label: 'Lesson', icon: BookOpen, color: 'blue', completed: localProgress.lesson_completed },
        { id: 'vocab' as MissionStep, label: 'Vocab', icon: Brain, color: 'amber', completed: localProgress.vocab_completed },
        { id: 'coding' as MissionStep, label: 'Coding', icon: Code, color: 'green', completed: localProgress.coding_task_completed },
        { id: 'quiz' as MissionStep, label: 'Quiz', icon: Zap, color: 'purple', completed: localProgress.quiz_completed },
        { id: 'writing' as MissionStep, label: 'Writing', icon: PenLine, color: 'rose', completed: localProgress.writing_task_completed },
    ]

    const handleCompleteStep = async (step: MissionStep) => {
        setSaving(true)
        const fieldMap: Record<MissionStep, string> = {
            lesson: 'lesson_completed', vocab: 'vocab_completed',
            coding: 'coding_task_completed', quiz: 'quiz_completed', writing: 'writing_task_completed',
        }

        const updatedProgress = {
            ...localProgress,
            [fieldMap[step]]: true,
            status: 'in-progress'
        }
        setLocalProgress(updatedProgress)

        try {
            const targetMissionId = mission.id
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(targetMissionId)

            if (isUUID) {
                await supabase.from('user_mission_progress').upsert({
                    user_id: userId,
                    mission_id: targetMissionId,
                    [fieldMap[step]]: true,
                    status: 'in-progress',
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id,mission_id' })
            } else {
                console.warn('Skipping DB save for non-UUID mission:', targetMissionId)
            }

            const currentIndex = steps.findIndex(s => s.id === step)
            if (currentIndex < steps.length - 1) setCurrentStep(steps[currentIndex + 1].id)
            else await completeMission()
        } catch (err) {
            console.error('Step completion error:', err)
            const currentIndex = steps.findIndex(s => s.id === step)
            if (currentIndex < steps.length - 1) {
                setCurrentStep(steps[currentIndex + 1].id)
            } else {
                // Last step failed to save — still complete the mission flow
                await completeMission()
            }
        } finally {
            setSaving(false)
        }
    }

    const completeMission = async () => {
        // Update local state immediately so UI reflects completion
        setLocalProgress((prev: any) => ({
            ...prev,
            status: 'completed',
            lesson_completed: true,
            vocab_completed: true,
            coding_task_completed: true,
            quiz_completed: true,
            writing_task_completed: true,
        }))

        const nextDayNum = (mission.day_number || 0) + 1
        let resolvedNextUrl = '/dashboard/roadmap'

        try {
            const targetMissionId = mission.id
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(targetMissionId)

            if (isUUID) {
                // 1. Mark current mission as completed
                const { error: completeErr } = await supabase.from('user_mission_progress').upsert({
                    user_id: userId,
                    mission_id: targetMissionId,
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                    xp_earned: mission.xp_reward,
                    updated_at: new Date().toISOString(),
                    lesson_completed: true,
                    vocab_completed: true,
                    coding_task_completed: true,
                    quiz_completed: true,
                    writing_task_completed: true
                }, { onConflict: 'user_id,mission_id' })

                if (completeErr) console.error('Error saving completion:', completeErr)

                // 2. Award XP
                const { data: userData } = await supabase.from('users').select('total_xp, current_streak').eq('id', userId).single()
                if (userData) {
                    await supabase.from('users').update({
                        total_xp: (userData.total_xp || 0) + (mission.xp_reward || 0),
                        current_streak: (userData.current_streak || 0) + 1,
                        last_mission_date: new Date().toISOString().split('T')[0],
                        updated_at: new Date().toISOString()
                    }).eq('id', userId)
                }

                // 3. Unlock next mission
                if (nextDayNum <= 30) {
                    const { data: nextMission } = await supabase
                        .from('missions')
                        .select('id, day_number, title')
                        .eq('day_number', nextDayNum)
                        .maybeSingle()

                    if (nextMission?.id) {
                        await supabase.from('user_mission_progress').upsert({
                            user_id: userId,
                            mission_id: nextMission.id,
                            status: 'available',
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'user_id,mission_id' })
                        resolvedNextUrl = `/dashboard/mission/${nextMission.id}`
                    }
                }
            } else {
                // Virtual mission — still try to find next real mission
                if (nextDayNum <= 30) {
                    const { data: nextMission } = await supabase
                        .from('missions')
                        .select('id')
                        .eq('day_number', nextDayNum)
                        .maybeSingle()
                    if (nextMission?.id) {
                        resolvedNextUrl = `/dashboard/mission/${nextMission.id}`
                    } else {
                        resolvedNextUrl = `/dashboard/mission/day-${nextDayNum}`
                    }
                }
            }
        } catch (err) {
            console.error('Mission completion error:', err)
        }

        // Show completion screen regardless of DB save success
        setNextMissionUrl(resolvedNextUrl)
        setNextMissionDay(nextDayNum <= 30 ? nextDayNum : null)
        setMissionCompleted(true)
    }

    if (!mounted) return null

    // Mission Completion Celebration Screen
    if (missionCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-success-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-8 h-8 text-success-600" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Mission Complete!</h1>
                    <p className="text-gray-500 mb-2">
                        Day {mission.day_number} — <span className="font-semibold text-gray-700">{mission.title}</span>
                    </p>
                    <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-full font-bold mb-6">
                        <Star className="w-4 h-4 fill-current" />
                        +{mission.xp_reward} XP Earned
                    </div>

                    <div className="space-y-3">
                        {nextMissionDay && nextMissionUrl && (
                            <button
                                onClick={() => router.push(nextMissionUrl!)}
                                className="w-full btn btn-primary flex items-center justify-center gap-2 text-base py-3"
                            >
                                <Play className="w-4 h-4" />
                                Start Day {nextMissionDay}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={() => router.push('/dashboard/roadmap')}
                            className="w-full btn bg-white border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600 flex items-center justify-center gap-2"
                        >
                            View Full Roadmap
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full text-sm text-gray-400 hover:text-gray-600 py-2"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    try {
        const completedCount = steps.filter(s => s.completed).length
        const progressPct = Math.round((completedCount / steps.length) * 100)

        return (
            <div className="min-h-screen bg-gray-50/80">
                {/* Navbar */}
                <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
                    <div className="max-w-5xl mx-auto px-3 sm:px-4 h-13 sm:h-14 flex items-center justify-between gap-2 sm:gap-4">
                        <Link href="/dashboard/roadmap" className="flex items-center gap-1 sm:gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium group flex-shrink-0">
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                            <span className="hidden xs:inline">Roadmap</span>
                        </Link>
                        <div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
                            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-medium flex-shrink-0">
                                <div className="w-20 sm:w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-500 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
                                </div>
                                <span>{completedCount}/{steps.length}</span>
                            </div>
                            <div className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full truncate max-w-[140px] sm:max-w-none">
                                <span className="hidden sm:inline">Day {mission.day_number} · </span>{mission.title}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-amber-600 flex-shrink-0">
                            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                            +{mission.xp_reward}
                        </div>
                    </div>
                </nav>

                <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
                    {/* Step tabs — scrollable on mobile, full on sm+ */}
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-1 sm:p-1.5 mb-3 sm:mb-6 flex items-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center flex-shrink-0 sm:flex-1">
                                <button
                                    onClick={() => setCurrentStep(step.id)}
                                    className={`flex items-center justify-center sm:justify-start gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg sm:rounded-xl transition-all text-xs sm:text-sm font-semibold whitespace-nowrap
                                        ${currentStep === step.id
                                            ? 'bg-primary-500 text-white shadow-sm'
                                            : step.completed
                                                ? 'text-green-600 hover:bg-green-50'
                                                : 'text-gray-400 hover:bg-gray-50'
                                        }`}
                                >
                                    {step.completed && currentStep !== step.id
                                        ? <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                        : <step.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                    }
                                    <span className="hidden sm:inline">{step.label}</span>
                                </button>
                                {index < steps.length - 1 && (
                                    <div className={`h-px w-2 sm:w-3 mx-0.5 flex-shrink-0 rounded-full ${step.completed ? 'bg-green-300' : 'bg-gray-100'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Content card */}
                    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 md:p-8 min-h-[400px] sm:min-h-[500px]">
                        {currentStep === 'lesson' && (lesson
                            ? <LessonView lesson={lesson} onComplete={() => handleCompleteStep('lesson')} saving={saving} />
                            : <EmptyStep label="Lesson" onComplete={() => handleCompleteStep('lesson')} saving={saving} />
                        )}
                        {currentStep === 'vocab' && (
                            <VocabView words={vocabWords} onComplete={() => handleCompleteStep('vocab')} saving={saving} />
                        )}
                        {currentStep === 'coding' && (
                            <CodingView tasks={codingTasks} onComplete={() => handleCompleteStep('coding')} saving={saving} />
                        )}
                        {currentStep === 'quiz' && (quiz
                            ? <QuizView quiz={quiz} onComplete={() => handleCompleteStep('quiz')} saving={saving} />
                            : <EmptyStep label="Quiz" onComplete={() => handleCompleteStep('quiz')} saving={saving} />
                        )}
                        {currentStep === 'writing' && (writingTask
                            ? <WritingView task={writingTask} userId={userId} onComplete={() => handleCompleteStep('writing')} saving={saving} />
                            : <WritingView task={null} userId={userId} onComplete={() => handleCompleteStep('writing')} saving={saving} />
                        )}
                    </div>
                </div>
            </div>
        )
    } catch (err: any) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg border border-red-100 text-center">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <RotateCcw className="w-6 h-6 text-red-500" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                    <p className="text-gray-500 text-sm mb-6">{err.message || 'Unknown error'}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary px-6 py-2.5 rounded-xl text-sm font-bold">
                        Try Again
                    </button>
                </div>
            </div>
        )
    }
}

function EmptyStep({ label, onComplete, saving }: { label: string; onComplete: () => void; saving: boolean }) {
    return (
        <div className="text-center py-16">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900">Coming Soon</h2>
            <p className="text-gray-500 mb-6 text-sm max-w-xs mx-auto">This {label} module is being prepared for you.</p>
            <button onClick={onComplete} disabled={saving} className="btn btn-primary px-6 py-2.5 rounded-xl text-sm font-bold">
                {saving ? 'Saving...' : 'Continue'}
            </button>
        </div>
    )
}

const MarkdownComponents = {
    code: (props: any) => {
        const { children, className } = props
        const isBlock = className?.includes('language-')
        return isBlock ? (
            <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm font-mono my-4 border border-gray-800">
                <code>{children}</code>
            </pre>
        ) : (
            <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
        )
    },
    h1: ({ children }: any) => <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-xl font-bold mt-6 mb-3 text-gray-800">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">{children}</h3>,
    p: ({ children }: any) => <p className="mb-4 leading-7 text-gray-600">{children}</p>,
    li: ({ children }: any) => <li className="mb-1.5 leading-relaxed text-gray-600 ml-4">{children}</li>,
    ul: ({ children }: any) => <ul className="list-disc mb-4">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal mb-4">{children}</ol>,
    blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-primary-400 pl-4 py-1 italic text-gray-600 my-4 bg-primary-50/50 rounded-r-lg">{children}</blockquote>
    ),
}

function LessonView({ lesson, onComplete, saving }: { lesson: any; onComplete: () => void; saving: boolean }) {
    return (
        <div className="animate-fade-in max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Step 1 of 5</p>
                    <h2 className="text-lg font-bold text-gray-900">Lesson</h2>
                </div>
            </div>

            <div className="prose prose-sm max-w-none mb-8 text-gray-700">
                <ReactMarkdown components={MarkdownComponents}>
                    {lesson?.content || '# No content\nThis lesson has no content yet.'}
                </ReactMarkdown>
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <span className="text-xs text-gray-400">Read through the lesson above</span>
                <button onClick={onComplete} disabled={saving} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md active:scale-95 disabled:opacity-50">
                    {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Next: Vocabulary
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

function VocabView({ words, onComplete, saving }: { words: any[]; onComplete: () => void; saving: boolean }) {
    const [flipped, setFlipped] = useState<Set<number>>(new Set())
    const toggle = (i: number) => setFlipped(prev => {
        const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next
    })

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Step 2 of 5</p>
                    <h2 className="text-lg font-bold text-gray-900">Vocabulary</h2>
                </div>
                <span className="ml-auto text-xs text-gray-400 font-medium">{flipped.size}/{words.length} revealed</span>
            </div>

            {words.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm">No vocabulary for this mission.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {words.map((word, i) => (
                        <div
                            key={word.id || i}
                            onClick={() => toggle(i)}
                            className={`rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 select-none
                                ${flipped.has(i)
                                    ? 'border-amber-300 bg-amber-50'
                                    : 'border-gray-100 bg-white hover:border-amber-200 hover:shadow-sm'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h3 className={`font-bold text-base ${flipped.has(i) ? 'text-amber-800' : 'text-gray-900'}`}>{word.word}</h3>
                                <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase">{word.category}</span>
                            </div>
                            {flipped.has(i) ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-amber-900/80 leading-relaxed">{word.meaning}</p>
                                    {word.example_sentence && (
                                        <p className="text-xs italic text-amber-700/60 border-l-2 border-amber-200 pl-2">"{word.example_sentence}"</p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3" /> Tap to reveal definition
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <span className="text-xs text-gray-400">Tap each card to reveal the definition</span>
                <button onClick={onComplete} disabled={saving} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md active:scale-95 disabled:opacity-50">
                    {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Next: Coding
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

function PythonRunner({ starterCode, onOutputChange, height = '200px' }: {
    starterCode?: string; onOutputChange?: (out: string) => void; height?: string
}) {
    const [code, setCode] = useState(starterCode ?? '# Write your Python code here\nprint("Hello, World!")')
    const [output, setOutput] = useState('')
    const [running, setRunning] = useState(false)
    const [pyodideReady, setPyodideReady] = useState(false)
    const pyodideRef = useRef<any>(null)

    useEffect(() => {
        const load = async () => {
            if (!(window as any).loadPyodide) {
                const script = document.createElement('script')
                script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'
                script.onload = () => init()
                document.head.appendChild(script)
            } else { init() }
        }
        load()
    }, [])

    const init = async () => {
        try {
            if (pyodideRef.current) return
            const pyo = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/' })
            pyodideRef.current = pyo
            setPyodideReady(true)
        } catch (e) { console.error('Pyodide load error:', e) }
    }

    const runScript = async () => {
        if (!pyodideRef.current) return
        setRunning(true); setOutput('')
        try {
            const wrapped = `
import sys, io, traceback
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
try:
${code.split('\n').map(l => '    ' + l).join('\n')}
except Exception:
    print(traceback.format_exc(), file=sys.stderr)
`
            await pyodideRef.current.runPythonAsync(wrapped)
            const stdout = pyodideRef.current.runPython('sys.stdout.getvalue()')
            const stderr = pyodideRef.current.runPython('sys.stderr.getvalue()')
            const result = (stdout + (stderr ? '\n' + stderr : '')).trim() || '(no output)'
            setOutput(result)
            if (onOutputChange) onOutputChange(result)
        } catch (err: any) {
            const msg = `Error: ${err.message}`
            setOutput(msg)
            if (onOutputChange) onOutputChange(msg)
        } finally { setRunning(false) }
    }

    return (
        <div className="rounded-xl overflow-hidden border border-gray-800 bg-gray-900 shadow-lg">
            {/* Editor header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/70" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                        <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-gray-400 text-xs font-mono">main.py</span>
                </div>
                <button
                    onClick={runScript}
                    disabled={running || !pyodideReady}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95"
                >
                    {running ? <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                    {!pyodideReady ? 'Loading...' : running ? 'Running' : 'Run'}
                </button>
            </div>

            {/* Code editor */}
            <div className="relative">
                <textarea
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full bg-gray-900 text-green-400 font-mono text-sm p-4 resize-none focus:outline-none leading-6 selection:bg-blue-500/30"
                    style={{ height }}
                    spellCheck={false}
                />
                {!pyodideReady && (
                    <div className="absolute inset-0 bg-gray-900/95 flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
                        <span className="text-xs text-green-500/70 font-mono">Loading Python runtime...</span>
                    </div>
                )}
            </div>

            {/* Output */}
            <div className="border-t border-gray-800 bg-black/40">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800/50">
                    <Terminal className="w-3 h-3 text-gray-600" />
                    <span className="text-xs text-gray-600 font-mono uppercase tracking-wider">Output</span>
                </div>
                <pre className="px-4 py-3 text-sm font-mono text-gray-300 min-h-[60px] max-h-[160px] overflow-y-auto whitespace-pre-wrap leading-5">
                    {output || <span className="text-gray-700 italic text-xs">Run your code to see output here...</span>}
                </pre>
            </div>
        </div>
    )
}

function CodingView({ tasks, onComplete, saving }: { tasks: any[]; onComplete: () => void; saving: boolean }) {
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
    const [userAnswer, setUserAnswer] = useState('')
    const [codeOutput, setCodeOutput] = useState('')
    const [showExplanation, setShowExplanation] = useState(false)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

    const currentTask = tasks[currentTaskIndex]

    const handleSubmit = () => {
        const u = userAnswer.trim().toLowerCase()
        const o = codeOutput.trim().toLowerCase()
        const e = (currentTask.expected_answer ?? '').trim().toLowerCase()
        setIsCorrect(u === e || o === e || o.includes(e))
        setShowExplanation(true)
    }

    const handleNext = () => {
        if (currentTaskIndex < tasks.length - 1) {
            setCurrentTaskIndex(p => p + 1); setUserAnswer(''); setCodeOutput(''); setShowExplanation(false); setIsCorrect(null)
        } else { onComplete() }
    }

    if (!currentTask) return (
        <div className="text-center py-12">
            <Code className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold mb-2">Free Practice</h2>
            <div className="max-w-2xl mx-auto mb-6"><PythonRunner /></div>
            <button onClick={onComplete} disabled={saving} className="bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">Done Practicing</button>
        </div>
    )

    const options = safeParseOptions(currentTask.options)
    const isMCQ = currentTask.task_type === 'mcq' || currentTask.task_type === 'fix-bug'

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                    <Code className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold text-green-500 uppercase tracking-wider">Step 3 of 5 · Task {currentTaskIndex + 1}/{tasks.length}</p>
                    <h2 className="text-lg font-bold text-gray-900">Coding Challenge</h2>
                </div>
                <div className="flex gap-1">
                    {tasks.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentTaskIndex ? 'bg-green-500 w-4' : i < currentTaskIndex ? 'bg-green-300' : 'bg-gray-200'}`} />
                    ))}
                </div>
            </div>

            <div className="mb-5">
                <p className="text-base text-gray-800 font-medium leading-relaxed mb-4">{currentTask.prompt}</p>

                {isMCQ ? (
                    <div className="space-y-2">
                        {currentTask.starter_code && (
                            <div className="mb-4 rounded-xl overflow-hidden border border-gray-800">
                                <div className="bg-gray-800 px-3 py-1.5 text-xs text-gray-400 font-mono">Code</div>
                                <pre className="bg-gray-900 text-sky-400 p-4 text-sm font-mono overflow-x-auto"><code>{currentTask.starter_code}</code></pre>
                            </div>
                        )}
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => !showExplanation && setUserAnswer(option)}
                                disabled={showExplanation}
                                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-3
                                    ${showExplanation
                                        ? option === currentTask.expected_answer
                                            ? 'border-green-400 bg-green-50 text-green-800'
                                            : option === userAnswer
                                                ? 'border-red-300 bg-red-50 text-red-800'
                                                : 'border-gray-100 opacity-40'
                                        : userAnswer === option
                                            ? 'border-primary-400 bg-primary-50 text-primary-800'
                                            : 'border-gray-100 bg-white hover:border-gray-300 text-gray-700'
                                    }`}
                            >
                                <span className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center text-xs font-bold flex-shrink-0
                                    ${userAnswer === option && !showExplanation ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-200 text-gray-400'}`}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <code className="font-mono">{option}</code>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <PythonRunner starterCode={currentTask.starter_code} onOutputChange={setCodeOutput} height="180px" />
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Your Answer</label>
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={e => setUserAnswer(e.target.value)}
                                disabled={showExplanation}
                                className="w-full h-11 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 font-mono text-sm focus:bg-white focus:border-primary-400 outline-none transition-all placeholder:text-gray-300"
                                placeholder="Type the expected output..."
                            />
                        </div>
                    </div>
                )}
            </div>

            {showExplanation && (
                <div className={`rounded-xl p-4 mb-5 border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-500' : 'bg-amber-500'} text-white`}>
                            {isCorrect ? <CheckCircle className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                        </div>
                        <div>
                            <p className="font-semibold text-sm mb-1">{isCorrect ? 'Correct!' : 'Not quite'}</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{currentTask.explanation}</p>
                            {!isCorrect && <p className="text-xs text-gray-500 mt-2 font-mono">Expected: <span className="font-bold text-gray-700">{currentTask.expected_answer}</span></p>}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <span className="text-xs text-gray-400">{currentTaskIndex + 1} of {tasks.length} tasks</span>
                {!showExplanation ? (
                    <button onClick={handleSubmit} disabled={!userAnswer && !codeOutput}
                        className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 disabled:text-gray-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95">
                        Check Answer
                    </button>
                ) : (
                    <button onClick={handleNext} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95">
                        {currentTaskIndex < tasks.length - 1 ? 'Next Task' : 'Finish Coding'}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    )
}

function QuizView({ quiz, onComplete, saving }: { quiz: any; onComplete: () => void; saving: boolean }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)

    const questions = quiz?.questions ?? []
    const currentQuestion = questions[currentQuestionIndex]

    const handleSubmit = () => {
        if (selectedAnswer === currentQuestion.correct_answer) setScore(s => s + 1)
        setShowResult(true)
    }

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1); setSelectedAnswer(''); setShowResult(false)
        } else { setFinished(true) }
    }

    if (!currentQuestion) return <EmptyStep label="Quiz" onComplete={onComplete} saving={saving} />

    if (finished) {
        const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
        return (
            <div className="text-center py-12 animate-fade-in">
                <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '🔥' : '📚'}</div>
                <h2 className="text-2xl font-bold mb-1 text-gray-900">Quiz Complete!</h2>
                <p className="text-gray-500 text-sm mb-6">You scored {score} out of {questions.length}</p>
                <div className="inline-flex items-center gap-3 bg-gray-50 rounded-2xl px-8 py-4 mb-8">
                    <span className="text-5xl font-black text-primary-600">{score}</span>
                    <span className="text-2xl text-gray-200 font-light">/</span>
                    <span className="text-2xl font-bold text-gray-400">{questions.length}</span>
                </div>
                <div className="w-full max-w-xs mx-auto bg-gray-100 rounded-full h-2 mb-8 overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                </div>
                <p className={`text-sm font-semibold mb-6 ${pct >= 70 ? 'text-green-600' : 'text-gray-500'}`}>
                    {pct >= 90 ? 'Excellent mastery!' : pct >= 70 ? 'Good job!' : 'Keep practicing!'}
                </p>
                <button onClick={onComplete} disabled={saving} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl text-sm font-semibold mx-auto transition-all active:scale-95 disabled:opacity-50">
                    {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trophy className="w-4 h-4" />}
                    Continue to Writing
                </button>
            </div>
        )
    }

    const options = safeParseOptions(currentQuestion.options)
    const isCorrect = selectedAnswer === currentQuestion.correct_answer

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Step 4 of 5 · Question {currentQuestionIndex + 1}/{questions.length}</p>
                    <h2 className="text-lg font-bold text-gray-900">Knowledge Check</h2>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl px-3 py-1.5 text-center">
                    <div className="text-xs text-purple-400 font-medium">Score</div>
                    <div className="text-lg font-black text-purple-600">{score}</div>
                </div>
            </div>

            <div className="mb-5">
                <p className="text-base font-semibold text-gray-800 mb-4 leading-relaxed">{currentQuestion.question_text}</p>

                {currentQuestion.code_snippet && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-gray-800">
                        <div className="bg-gray-800 px-3 py-1.5 text-xs text-gray-400 font-mono">Code</div>
                        <pre className="bg-gray-900 text-sky-400 p-4 text-sm font-mono overflow-x-auto"><code>{currentQuestion.code_snippet}</code></pre>
                    </div>
                )}

                <div className="space-y-2">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => !showResult && setSelectedAnswer(option)}
                            disabled={showResult}
                            className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium flex items-center gap-3
                                ${showResult
                                    ? option === currentQuestion.correct_answer
                                        ? 'border-green-400 bg-green-50 text-green-800'
                                        : option === selectedAnswer
                                            ? 'border-red-300 bg-red-50 text-red-800'
                                            : 'border-gray-100 opacity-40'
                                    : selectedAnswer === option
                                        ? 'border-purple-400 bg-purple-50 text-purple-800'
                                        : 'border-gray-100 bg-white hover:border-gray-300 text-gray-700'
                                }`}
                        >
                            <span className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center text-xs font-bold flex-shrink-0
                                ${showResult
                                    ? option === currentQuestion.correct_answer ? 'bg-green-500 border-green-500 text-white' : option === selectedAnswer ? 'bg-red-400 border-red-400 text-white' : 'border-gray-200 text-gray-400'
                                    : selectedAnswer === option ? 'bg-purple-500 border-purple-500 text-white' : 'border-gray-200 text-gray-400'
                                }`}>
                                {String.fromCharCode(65 + index)}
                            </span>
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {showResult && (
                <div className={`rounded-xl p-4 mb-5 border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-500' : 'bg-red-400'} text-white`}>
                            {isCorrect ? <CheckCircle className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                        </div>
                        <div>
                            <p className="font-semibold text-sm mb-1">{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{currentQuestion.explanation}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 pt-5 border-t border-gray-100">
                <div className="flex gap-1">
                    {questions.map((_: any, i: number) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentQuestionIndex ? 'w-6 bg-purple-500' : i < currentQuestionIndex ? 'w-3 bg-purple-300' : 'w-3 bg-gray-200'}`} />
                    ))}
                </div>
                {!showResult ? (
                    <button onClick={handleSubmit} disabled={!selectedAnswer}
                        className="w-full xs:w-auto bg-purple-500 hover:bg-purple-600 disabled:bg-gray-200 disabled:text-gray-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95">
                        Submit Answer
                    </button>
                ) : (
                    <button onClick={handleNext} className="w-full xs:w-auto flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95">
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    )
}

function WritingView({ task, userId, onComplete, saving }: { task: any; userId: string; onComplete: () => void; saving: boolean }) {
    const [text, setText] = useState('')
    const supabase = createClient()
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
    const minWords = task?.min_words ?? 30
    const maxWords = task?.max_words ?? 150
    const isValid = wordCount >= minWords && wordCount <= maxWords

    // Default prompt if no task from DB
    const prompt = task?.prompt ?? 'Write a short paragraph explaining what you learned in this lesson. Use at least one Python term from the vocabulary section.'
    const context = task?.context ?? null
    const taskType = task?.task_type ?? 'free-writing'

    const handleSubmit = async () => {
        try {
            if (task?.id) {
                await supabase.from('english_writing_submissions').insert({
                    user_id: userId, writing_task_id: task.id, submission_text: text, word_count: wordCount,
                })
            }
            onComplete()
        } catch { onComplete() }
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center">
                    <PenLine className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Step 5 of 5 · Final</p>
                    <h2 className="text-lg font-bold text-gray-900">English Writing</h2>
                </div>
            </div>

            {/* Prompt card */}
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100 rounded-xl p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-rose-500 uppercase tracking-wider bg-rose-100 px-2 py-0.5 rounded-full">{taskType.replace('-', ' ')}</span>
                    <span className="text-xs text-gray-400">{minWords}–{maxWords} words</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 leading-relaxed">{prompt}</p>
                {context && (
                    <div className="mt-3 pt-3 border-t border-rose-100">
                        <p className="text-xs text-gray-500 italic leading-relaxed">💡 {context}</p>
                    </div>
                )}
            </div>

            {/* Writing tips — 1 col on mobile, 3 on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                {['Use complete sentences', 'Include Python terms', 'Be specific & clear'].map((tip, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-2 sm:p-2.5 flex sm:flex-col items-center sm:justify-center gap-2">
                        <span className="text-gray-300 text-sm">{['✍️', '🐍', '🎯'][i]}</span>
                        <p className="text-xs text-gray-500 font-medium">{tip}</p>
                    </div>
                ))}
            </div>

            {/* Textarea */}
            <div className="relative mb-4">
                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="w-full min-h-[200px] bg-white border-2 border-gray-100 rounded-xl p-4 text-sm leading-relaxed focus:border-rose-300 focus:shadow-sm outline-none transition-all placeholder:text-gray-300 resize-none"
                    placeholder="Start writing your response here..."
                />
                {/* Word count badge */}
                <div className={`absolute bottom-3 right-3 text-xs font-bold px-2 py-1 rounded-lg ${isValid ? 'bg-green-100 text-green-700' : wordCount > maxWords ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                    {wordCount} / {maxWords}
                </div>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${isValid ? 'bg-green-500' : wordCount > maxWords ? 'bg-red-500' : 'bg-rose-400'}`}
                        style={{ width: `${Math.min((wordCount / maxWords) * 100, 100)}%` }}
                    />
                </div>
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                    {wordCount < minWords ? `${minWords - wordCount} more words needed` : isValid ? '✓ Good length' : `${wordCount - maxWords} words over limit`}
                </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-400">Complete your writing to finish the mission</p>
                <button
                    onClick={handleSubmit}
                    disabled={saving || !isValid}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-200 disabled:text-gray-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                >
                    {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trophy className="w-4 h-4" />}
                    Complete Mission
                </button>
            </div>
        </div>
    )
}
