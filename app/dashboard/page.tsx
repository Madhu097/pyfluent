'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import DashboardClient from './DashboardClient'
import DashboardLoading from './loading'

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [data, setData] = useState<any>(null)
    const [dataLoading, setDataLoading] = useState(true)

    useEffect(() => {
        if (authLoading) return

        if (!user) {
            router.replace('/login')
            return
        }

        const supabase = createClient()

        const fetchData = async () => {
            setDataLoading(true)

            try {
                // 1. Fetch ALL missions and User Progress
                let { data: allMissions, error: mErr } = await supabase
                    .from('missions')
                    .select('*')
                    .order('day_number', { ascending: true })

                if (mErr) throw mErr

                allMissions = allMissions || []

                // 2. SELF-HEALING: Provision missing missions 1-30
                // This ensures every day always has a real database record for progress tracking
                if (allMissions.length < 30) {
                    const existingDays = allMissions.map(m => m.day_number)
                    const toInsert = []
                    for (let d = 1; d <= 30; d++) {
                        if (!existingDays.includes(d)) {
                            toInsert.push({
                                day_number: d,
                                title: d % 7 === 0 ? `Week ${Math.ceil(d / 7)} Review` : `Mission ${d}: Python Pro`,
                                description: 'Mastering Python through professional communication.',
                                week_number: Math.ceil(d / 7),
                                is_project: d % 7 === 0,
                                xp_reward: 100,
                                is_published: true
                            })
                        }
                    }
                    if (toInsert.length > 0) {
                        console.log('Provisioning missing days:', toInsert.map(i => i.day_number))
                        const { error: insErr } = await supabase.from('missions').upsert(toInsert, { onConflict: 'day_number' })
                        if (!insErr) {
                            const { data: refreshed } = await supabase
                                .from('missions')
                                .select('*')
                                .order('day_number', { ascending: true })
                            if (refreshed) allMissions = refreshed
                        } else {
                            console.error('Provisioning failed:', insErr)
                        }
                    }
                }

                // 3. Fetch Profile and Progress
                const [profileRes, progressRes] = await Promise.all([
                    supabase.from('users').select('*').eq('id', user.uid).maybeSingle(),
                    supabase.from('user_mission_progress').select('*').eq('user_id', user.uid),
                ])

                let profile = profileRes.data
                const progressRows = progressRes.data ?? []

                // 4. Ensure User Profile exists
                if (!profile) {
                    const newProfile = {
                        id: user.uid,
                        email: user.email ?? '',
                        full_name: user.displayName || (user.email ?? 'Learner').split('@')[0],
                        total_xp: 0,
                        current_streak: 0,
                        longest_streak: 0,
                        skill_level: 'Beginner'
                    }
                    await supabase.from('users').upsert(newProfile)
                    const { data: created } = await supabase.from('users').select('*').eq('id', user.uid).single()
                    profile = created
                }

                // 5. PROGRESS CALCULATION (The High Water Mark)
                const completedMissions = progressRows.filter(p => p.status === 'completed')
                const completedDayNums: number[] = []

                // Map real DB records that are completed
                allMissions.forEach(m => {
                    if (completedMissions.some(p => p.mission_id === m.id)) {
                        completedDayNums.push(m.day_number)
                    }
                })

                // FALLBACK: Map virtual IDs if they were ever recorded
                completedMissions.forEach(p => {
                    const idStr = String(p.mission_id)
                    if (idStr.includes('day-') || idStr.includes('emergency-')) {
                        const d = parseInt(idStr.split('-').pop() || '0')
                        if (d > 0 && !completedDayNums.includes(d)) {
                            completedDayNums.push(d)
                        }
                    }
                })

                const lastCompletedDay = completedDayNums.length > 0 ? Math.max(...completedDayNums) : 0
                const targetDay = lastCompletedDay + 1

                // 6. Build UI Stats
                const todayMissionData = allMissions.find(m => m.day_number === targetDay) || allMissions[0] || {
                    id: `temp-${targetDay}`,
                    day_number: targetDay,
                    title: `Mission ${targetDay}: Python Pro`,
                    description: 'Ready to learn?',
                    xp_reward: 100
                }

                const todayProgress = progressRows.find(p => p.mission_id === todayMissionData.id)

                const stats = {
                    currentStreak: profile?.current_streak ?? 0,
                    longestStreak: profile?.longest_streak ?? 0,
                    totalXP: profile?.total_xp ?? 0,
                    skillLevel: profile?.skill_level ?? 'Beginner',
                    weeklyProgress: Math.min(((completedDayNums.filter(d => d > Math.floor((targetDay - 1) / 7) * 7).length) / 7) * 100, 100),
                    todayMission: {
                        ...todayMissionData,
                        progress: todayProgress || { status: 'available' }
                    },
                    completedMissions: completedDayNums.length,
                    totalMissions: 30,
                    missions: allMissions.map(m => ({
                        mission: m,
                        progress: progressRows.find(p => p.mission_id === m.id)
                    })),
                }

                setData({ profile, stats })
            } catch (err) {
                console.error('FATAL Dashboard Load Error:', err)
            } finally {
                setDataLoading(false)
            }
        }

        fetchData()
    }, [user, authLoading])

    if (authLoading || dataLoading) return <DashboardLoading />
    if (!data) return <DashboardLoading />

    return <DashboardClient user={data.profile} stats={data.stats} />
}
