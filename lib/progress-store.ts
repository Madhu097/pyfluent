/**
 * localStorage-based mission progress store.
 * Acts as the primary source of truth for completed days.
 * DB saves are attempted but may fail silently (Firebase UID / UUID type mismatch).
 */

const KEY = (userId: string) => `pyfluent_progress_${userId}`

export interface LocalProgress {
    completedDays: number[]        // e.g. [1, 2, 3]
    completedMissionIds: string[]  // UUID or virtual IDs
    totalXP: number
    lastUpdated: string
}

export function getLocalProgress(userId: string): LocalProgress {
    if (typeof window === 'undefined') return { completedDays: [], completedMissionIds: [], totalXP: 0, lastUpdated: '' }
    try {
        const raw = localStorage.getItem(KEY(userId))
        if (!raw) return { completedDays: [], completedMissionIds: [], totalXP: 0, lastUpdated: '' }
        return JSON.parse(raw) as LocalProgress
    } catch {
        return { completedDays: [], completedMissionIds: [], totalXP: 0, lastUpdated: '' }
    }
}

export function markMissionComplete(userId: string, dayNumber: number, missionId: string, xpReward: number) {
    if (typeof window === 'undefined') return
    const current = getLocalProgress(userId)
    const updated: LocalProgress = {
        completedDays: Array.from(new Set([...current.completedDays, dayNumber])),
        completedMissionIds: Array.from(new Set([...current.completedMissionIds, missionId])),
        totalXP: (current.totalXP || 0) + xpReward,
        lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem(KEY(userId), JSON.stringify(updated))
}

export function getLastCompletedDay(userId: string): number {
    const { completedDays } = getLocalProgress(userId)
    if (!completedDays.length) return 0
    return Math.max(...completedDays)
}

export function isMissionCompleted(userId: string, dayNumber: number): boolean {
    const { completedDays } = getLocalProgress(userId)
    return completedDays.includes(dayNumber)
}
