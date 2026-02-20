'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import RoadmapClient from './RoadmapClient'
import RoadmapLoading from './loading'

export default function RoadmapPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [missions, setMissions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return
        if (!user) { router.replace('/login'); return }

        const supabase = createClient()

        const fetchMissions = async () => {
            setLoading(true)
            try {
                // 1. Fetch all missions
                const { data: allMissions } = await supabase
                    .from('missions')
                    .select('*')
                    .order('day_number', { ascending: true })

                // 2. Fetch user's progress
                const { data: progressData } = await supabase
                    .from('user_mission_progress')
                    .select('*')
                    .eq('user_id', user.uid)

                const progressItems = progressData ?? []
                const dbMissions = allMissions ?? []

                // 3. Robust High-Water Mark Calculation
                const completedMissions = progressItems.filter(p => p.status === 'completed')
                const completedDayNums: number[] = []

                // Map real UUID records to day numbers
                dbMissions.forEach(m => {
                    if (completedMissions.some(p => p.mission_id === m.id)) {
                        completedDayNums.push(m.day_number)
                    }
                })

                // Fallsback for legacy/virtual IDs
                completedMissions.forEach(p => {
                    const mid = String(p.mission_id)
                    if (mid.includes('day-') || mid.includes('emergency-')) {
                        const d = parseInt(mid.split('-').pop() || '0')
                        if (d > 0 && !completedDayNums.includes(d)) {
                            completedDayNums.push(d)
                        }
                    }
                })

                const lastCompletedDay = completedDayNums.length > 0 ? Math.max(...completedDayNums) : 0

                // 4. Map missions to UI structure (ensure full 30 days)
                const fullMissions: any[] = []
                for (let d = 1; d <= 30; d++) {
                    const dbMission = dbMissions.find(m => m.day_number === d)

                    const prog = progressItems.find(p =>
                        p.mission_id === dbMission?.id ||
                        String(p.mission_id).includes(`-${d}`)
                    )

                    let status = d === 1 ? 'available' : 'locked'
                    if (prog) {
                        status = prog.status
                    }
                    if (status === 'locked' && d <= lastCompletedDay + 1) {
                        status = 'available'
                    }

                    if (dbMission) {
                        fullMissions.push({
                            ...dbMission,
                            progress: [{
                                status,
                                ...prog,
                                lesson_completed: prog?.lesson_completed || false,
                                vocab_completed: prog?.vocab_completed || false,
                                coding_task_completed: prog?.coding_task_completed || false,
                                quiz_completed: prog?.quiz_completed || false,
                                writing_task_completed: prog?.writing_task_completed || false
                            }]
                        })
                    } else {
                        fullMissions.push({
                            id: `day-fallback-${d}`,
                            day_number: d,
                            title: d % 7 === 0 ? `Week ${Math.ceil(d / 7)} Review` : `Mission ${d}: Python Pro`,
                            description: 'Continuing your track toward code fluency.',
                            week_number: Math.ceil(d / 7),
                            is_project: d % 7 === 0,
                            xp_reward: 100,
                            progress: [{ status }]
                        })
                    }
                }

                setMissions(fullMissions)
            } catch (err) {
                console.error('Roadmap fail:', err)
                setMissions([])
            } finally {
                setLoading(false)
            }
        }

        fetchMissions()
    }, [user, authLoading, pathname])

    if (authLoading || loading) return <RoadmapLoading />

    return <RoadmapClient missions={missions} />
}
