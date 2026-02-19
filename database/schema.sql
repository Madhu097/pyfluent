-- ============================================
-- PYFLUENT DATABASE SCHEMA
-- PostgreSQL Schema for Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  daily_mode INTEGER DEFAULT 20 CHECK (daily_mode IN (10, 20, 30)),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  streak_freezes_available INTEGER DEFAULT 1,
  last_mission_date DATE,
  skill_level TEXT DEFAULT 'Beginner' CHECK (skill_level IN ('Beginner', 'Strong', 'Master')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MISSIONS TABLE
-- ============================================
CREATE TABLE public.missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_number INTEGER NOT NULL UNIQUE CHECK (day_number >= 1 AND day_number <= 30),
  title TEXT NOT NULL,
  description TEXT,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 4),
  is_project BOOLEAN DEFAULT FALSE,
  xp_reward INTEGER DEFAULT 100,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LESSONS TABLE
-- ============================================
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  content TEXT NOT NULL, -- Markdown content
  estimated_time_10min INTEGER DEFAULT 3, -- minutes for 10min mode
  estimated_time_20min INTEGER DEFAULT 5,
  estimated_time_30min INTEGER DEFAULT 8,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- VOCABULARY WORDS TABLE
-- ============================================
CREATE TABLE public.vocab_words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  example_sentence TEXT NOT NULL,
  category TEXT CHECK (category IN ('programming', 'workplace', 'connectors', 'interview')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CODING TASKS TABLE
-- ============================================
CREATE TABLE public.coding_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL CHECK (task_type IN ('fill-blank', 'predict-output', 'reorder', 'fix-bug', 'mcq')),
  prompt TEXT NOT NULL,
  starter_code TEXT,
  expected_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  options JSONB, -- For MCQ and reorder tasks
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- QUIZZES TABLE
-- ============================================
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- QUIZ QUESTIONS TABLE
-- ============================================
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'predict-output')),
  question_text TEXT NOT NULL,
  code_snippet TEXT,
  options JSONB NOT NULL, -- Array of options
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENGLISH WRITING TASKS TABLE
-- ============================================
CREATE TABLE public.english_writing_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL CHECK (task_type IN ('explain-solution', 'code-comment', 'commit-message', 'rewrite-professional')),
  prompt TEXT NOT NULL,
  context TEXT,
  min_words INTEGER DEFAULT 10,
  max_words INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER MISSION PROGRESS TABLE
-- ============================================
CREATE TABLE public.user_mission_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'in-progress', 'completed')),
  lesson_completed BOOLEAN DEFAULT FALSE,
  vocab_completed BOOLEAN DEFAULT FALSE,
  coding_task_completed BOOLEAN DEFAULT FALSE,
  quiz_completed BOOLEAN DEFAULT FALSE,
  writing_task_completed BOOLEAN DEFAULT FALSE,
  quiz_score INTEGER DEFAULT 0,
  task_accuracy INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in minutes
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

-- ============================================
-- USER VOCABULARY PROGRESS TABLE
-- ============================================
CREATE TABLE public.user_vocab_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vocab_word_id UUID NOT NULL REFERENCES vocab_words(id) ON DELETE CASCADE,
  mastery_level TEXT DEFAULT 'learning' CHECK (mastery_level IN ('learning', 'familiar', 'mastered')),
  times_reviewed INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, vocab_word_id)
);

-- ============================================
-- STREAKS TABLE
-- ============================================
CREATE TABLE public.streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mission_completed BOOLEAN DEFAULT FALSE,
  streak_freeze_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ============================================
-- ENGLISH WRITING SUBMISSIONS TABLE
-- ============================================
CREATE TABLE public.english_writing_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  writing_task_id UUID NOT NULL REFERENCES english_writing_tasks(id) ON DELETE CASCADE,
  submission_text TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, writing_task_id)
);

-- ============================================
-- CODING TASK SUBMISSIONS TABLE
-- ============================================
CREATE TABLE public.coding_task_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coding_task_id UUID NOT NULL REFERENCES coding_tasks(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- QUIZ SUBMISSIONS TABLE
-- ============================================
CREATE TABLE public.quiz_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_missions_day_number ON missions(day_number);
CREATE INDEX idx_missions_week_number ON missions(week_number);
CREATE INDEX idx_lessons_mission_id ON lessons(mission_id);
CREATE INDEX idx_vocab_words_mission_id ON vocab_words(mission_id);
CREATE INDEX idx_coding_tasks_mission_id ON coding_tasks(mission_id);
CREATE INDEX idx_quizzes_mission_id ON quizzes(mission_id);
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX idx_english_writing_tasks_mission_id ON english_writing_tasks(mission_id);
CREATE INDEX idx_user_mission_progress_user_id ON user_mission_progress(user_id);
CREATE INDEX idx_user_mission_progress_mission_id ON user_mission_progress(mission_id);
CREATE INDEX idx_user_vocab_progress_user_id ON user_vocab_progress(user_id);
CREATE INDEX idx_streaks_user_id ON streaks(user_id);
CREATE INDEX idx_streaks_date ON streaks(date);
CREATE INDEX idx_english_writing_submissions_user_id ON english_writing_submissions(user_id);
CREATE INDEX idx_coding_task_submissions_user_id ON coding_task_submissions(user_id);
CREATE INDEX idx_quiz_submissions_user_id ON quiz_submissions(user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_mission_progress_updated_at BEFORE UPDATE ON user_mission_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to initialize user progress for all missions
CREATE OR REPLACE FUNCTION initialize_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Create progress entries for all published missions
  INSERT INTO user_mission_progress (user_id, mission_id, status)
  SELECT NEW.id, m.id, 
    CASE 
      WHEN m.day_number = 1 THEN 'available'
      ELSE 'locked'
    END
  FROM missions m
  WHERE m.is_published = TRUE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to initialize progress when user is created
CREATE TRIGGER on_user_created
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_progress();
