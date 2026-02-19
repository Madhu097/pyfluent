'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import MissionClient from './MissionClient'
import MissionLoading from './loading'

const curriculum: Record<number, any> = {
    4: {
        title: 'Conditional Logic & If-Else',
        topic: 'If Statements',
        content: `## Making Decisions\nIn Python, we use \`if\` statements to run code only when certain conditions are met.\n\n\`\`\`python\ntemperature = 25\nif temperature > 20:\n    print("It's a warm day!")\nelse:\n    print("It's cold.")\n\`\`\``,
        vocab: [{ word: 'boolean', meaning: 'True or False' }, { word: 'indentation', meaning: 'Leading spaces' }],
        task: { prompt: 'Write an if statement', starter: 'x = 15\n___ x > 10:\n    print("Large")', answer: 'if' }
    },
    5: {
        title: 'Lists & Collections',
        topic: 'Python Lists',
        content: `## Intro to Lists\nLists store multiple items: \`fruits = ["apple", "banana"]\``,
        vocab: [{ word: 'index', meaning: 'Position (starts at 0)' }],
        task: { prompt: 'Add to a list', starter: 'nums = [1]\nnums.___ (2)', answer: 'append' }
    }
}

function generateVirtualContent(dayNum: number) {
    return curriculum[dayNum] || {
        title: `Mission ${dayNum}: Python Mastery`,
        topic: 'Advanced Basics',
        content: `## Continuing Your Journey\nFocusing on core syntax and professional logic in Day ${dayNum}.`,
        vocab: [{ word: 'logic', meaning: 'Reasoning' }],
        task: { prompt: 'Output a message', starter: 'print("___")', answer: 'Hello' }
    }
}

export default function MissionPage({ params }: { params: { id: string } }) {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [mission, setMission] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return
        if (!user) { router.replace('/login'); return }

        const supabase = createClient()

        const fetchMission = async () => {
            setLoading(true)
            try {
                let missionData = null
                const dayNumFromId = parseInt(params.id.split('-').pop() || '0')

                // 1. Resolve Mission Record from DB
                if (params.id.includes('day-') || params.id.includes('emergency-')) {
                    const { data } = await supabase.from('missions').select('*').eq('day_number', dayNumFromId).maybeSingle()
                    missionData = data
                } else {
                    const { data } = await supabase.from('missions').select('*').eq('id', params.id).maybeSingle()
                    missionData = data
                }

                // EMERGENCY MODE: If still no DB record, build a virtual one
                if (!missionData) {
                    console.warn(`Mission DB record missing for day ${dayNumFromId}. Using Virtual Fallback.`)
                    const fallbackDay = dayNumFromId || 1
                    const vData = generateVirtualContent(fallbackDay)
                    setMission({
                        id: params.id,
                        title: vData.title,
                        day_number: fallbackDay,
                        xp_reward: 100,
                        lesson: { content: `# ${vData.title}\n\n${vData.content}` },
                        vocab_words: (vData.vocab || []).map((v: any) => ({ ...v, category: 'programming' })),
                        coding_tasks: [{
                            task_type: 'fill-blank',
                            prompt: vData.task.prompt,
                            starter_code: vData.task.starter,
                            expected_answer: vData.task.answer,
                            explanation: 'Correct!'
                        }],
                        quiz: { questions: [{ question_text: 'Objective?', options: [vData.topic], correct_answer: vData.topic, explanation: 'Correct' }] },
                        writing_task: { task_type: 'explain-solution', prompt: 'Summarize Day ' + fallbackDay, min_words: 5, max_words: 50 },
                        progress: [{ status: 'available' }],
                    })
                    setLoading(false)
                    return
                }

                const missionUUID = missionData.id
                const realDayNum = missionData.day_number

                // 2. Fetch Progress and Content
                const [progRes, lessonsRes, vocabRes, codingRes, quizzesRes, writingRes] = await Promise.all([
                    supabase.from('user_mission_progress').select('*').eq('user_id', user.uid).eq('mission_id', missionUUID).maybeSingle(),
                    supabase.from('lessons').select('*').eq('mission_id', missionUUID),
                    supabase.from('vocab_words').select('*').eq('mission_id', missionUUID),
                    supabase.from('coding_tasks').select('*').eq('mission_id', missionUUID),
                    supabase.from('quizzes').select('*').eq('mission_id', missionUUID),
                    supabase.from('english_writing_tasks').select('*').eq('mission_id', missionUUID),
                ])

                let progressData = progRes.data || {
                    user_id: user.uid,
                    mission_id: missionUUID,
                    status: 'available',
                    lesson_completed: false,
                    vocab_completed: false,
                    coding_task_completed: false,
                    quiz_completed: false,
                    writing_task_completed: false
                }

                if (lessonsRes.data && lessonsRes.data.length > 0) {
                    // Full DB Content
                    let quizWithQuestions = null
                    const quizData = quizzesRes.data?.[0]
                    if (quizData) {
                        const { data: questions } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quizData.id)
                        quizWithQuestions = { ...quizData, questions: questions ?? [] }
                    }
                    setMission({
                        ...missionData,
                        lesson: lessonsRes.data[0],
                        vocab_words: vocabRes.data || [],
                        coding_tasks: codingRes.data || [],
                        quiz: quizWithQuestions,
                        writing_task: writingRes.data?.[0],
                        progress: [progressData],
                    })
                } else {
                    // Hybrid: Real ID, Virtual Content
                    const vData = generateVirtualContent(realDayNum)
                    setMission({
                        ...missionData,
                        lesson: { content: `# ${vData.title}\n\n${vData.content}` },
                        vocab_words: (vData.vocab || []).map((v: any) => ({ ...v, category: 'programming' })),
                        coding_tasks: [{ task_type: 'fill-blank', prompt: vData.task.prompt, starter_code: vData.task.starter, expected_answer: vData.task.answer, explanation: 'Correct!' }],
                        quiz: { questions: [{ question_text: 'Objective?', options: [vData.topic], correct_answer: vData.topic, explanation: 'Correct' }] },
                        writing_task: { task_type: 'explain-solution', prompt: 'Summarize Day ' + realDayNum, min_words: 5, max_words: 50 },
                        progress: [progressData],
                    })
                }
            } catch (err) {
                console.error('Mission Page Load Fail:', err)
                router.push('/dashboard')
            } finally {
                setLoading(false)
            }
        }

        fetchMission()
    }, [user, authLoading, params.id])

    if (authLoading || loading) return <MissionLoading />
    if (!user) return null
    if (!mission) return <div className="p-10 text-center">Mission not found. <button onClick={() => router.push('/dashboard')} className="text-primary-600 underline">Return to Dashboard</button></div>

    return <MissionClient mission={mission} userId={user.uid} />
}
