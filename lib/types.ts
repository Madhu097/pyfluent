export interface User {
    id: string
    email: string
    full_name?: string
    daily_mode: 10 | 20 | 30
    current_streak: number
    longest_streak: number
    total_xp: number
    streak_freezes_available: number
    last_mission_date?: string
    skill_level: 'Beginner' | 'Strong' | 'Master'
    created_at: string
    updated_at: string
}

export interface Mission {
    id: string
    day_number: number
    title: string
    description?: string
    week_number: number
    is_project: boolean
    xp_reward: number
    is_published: boolean
    created_at: string
    updated_at: string
}

export interface Lesson {
    id: string
    mission_id: string
    content: string
    estimated_time_10min: number
    estimated_time_20min: number
    estimated_time_30min: number
    created_at: string
    updated_at: string
}

export interface VocabWord {
    id: string
    mission_id: string
    word: string
    meaning: string
    example_sentence: string
    category: 'programming' | 'workplace' | 'connectors' | 'interview'
    created_at: string
}

export interface CodingTask {
    id: string
    mission_id: string
    task_type: 'fill-blank' | 'predict-output' | 'reorder' | 'fix-bug' | 'mcq'
    prompt: string
    starter_code?: string
    expected_answer: string
    explanation: string
    options?: string[]
    difficulty: 'easy' | 'medium' | 'hard'
    order_index: number
    created_at: string
}

export interface Quiz {
    id: string
    mission_id: string
    created_at: string
}

export interface QuizQuestion {
    id: string
    quiz_id: string
    question_type: 'mcq' | 'predict-output'
    question_text: string
    code_snippet?: string
    options: string[]
    correct_answer: string
    explanation: string
    order_index: number
    created_at: string
}

export interface EnglishWritingTask {
    id: string
    mission_id: string
    task_type: 'explain-solution' | 'code-comment' | 'commit-message' | 'rewrite-professional'
    prompt: string
    context?: string
    min_words: number
    max_words: number
    created_at: string
}

export interface UserMissionProgress {
    id: string
    user_id: string
    mission_id: string
    status: 'locked' | 'available' | 'in-progress' | 'completed'
    lesson_completed: boolean
    vocab_completed: boolean
    coding_task_completed: boolean
    quiz_completed: boolean
    writing_task_completed: boolean
    quiz_score: number
    task_accuracy: number
    time_spent: number
    xp_earned: number
    completed_at?: string
    created_at: string
    updated_at: string
}

export interface UserVocabProgress {
    id: string
    user_id: string
    vocab_word_id: string
    mastery_level: 'learning' | 'familiar' | 'mastered'
    times_reviewed: number
    last_reviewed_at?: string
    created_at: string
}

export interface Streak {
    id: string
    user_id: string
    date: string
    mission_completed: boolean
    streak_freeze_used: boolean
    created_at: string
}

export interface EnglishWritingSubmission {
    id: string
    user_id: string
    writing_task_id: string
    submission_text: string
    word_count: number
    submitted_at: string
}

export interface CodingTaskSubmission {
    id: string
    user_id: string
    coding_task_id: string
    user_answer: string
    is_correct: boolean
    submitted_at: string
}

export interface QuizSubmission {
    id: string
    user_id: string
    quiz_question_id: string
    user_answer: string
    is_correct: boolean
    submitted_at: string
}

export interface DashboardStats {
    currentStreak: number
    longestStreak: number
    totalXP: number
    skillLevel: string
    weeklyProgress: number
    todayMission?: any
    completedMissions: number
    totalMissions: number
    missions?: any[]
}

export interface MissionWithProgress extends Mission {
    progress?: UserMissionProgress
    lesson?: Lesson
    vocab_words?: VocabWord[]
    coding_tasks?: CodingTask[]
    quiz?: Quiz & { questions: QuizQuestion[] }
    writing_task?: EnglishWritingTask
}
