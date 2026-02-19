import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export function calculateProgress(completed: number, total: number): number {
    if (total === 0) return 0
    return Math.round((completed / total) * 100)
}

export function getSkillLevel(totalXP: number): string {
    if (totalXP < 1000) return 'Beginner'
    if (totalXP < 3000) return 'Strong'
    return 'Master'
}

export function getMissionTimeEstimate(dailyMode: number): {
    lesson: number
    vocab: number
    task: number
    quiz: number
    writing: number
} {
    const estimates = {
        10: { lesson: 3, vocab: 2, task: 2, quiz: 2, writing: 1 },
        20: { lesson: 5, vocab: 4, task: 5, quiz: 4, writing: 2 },
        30: { lesson: 8, vocab: 6, task: 8, quiz: 6, writing: 2 },
    }
    return estimates[dailyMode as 10 | 20 | 30] || estimates[20]
}
