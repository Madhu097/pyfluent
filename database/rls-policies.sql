-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_writing_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vocab_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_writing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- MISSIONS TABLE POLICIES
-- ============================================

-- Everyone can read published missions
CREATE POLICY "Anyone can view published missions"
  ON missions FOR SELECT
  USING (is_published = TRUE);

-- Only authenticated users can view all missions (for admin)
CREATE POLICY "Authenticated users can view all missions"
  ON missions FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin can insert missions (implement admin check in app)
CREATE POLICY "Authenticated users can insert missions"
  ON missions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Admin can update missions
CREATE POLICY "Authenticated users can update missions"
  ON missions FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Admin can delete missions
CREATE POLICY "Authenticated users can delete missions"
  ON missions FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- LESSONS TABLE POLICIES
-- ============================================

-- Everyone can read lessons for published missions
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM missions m
      WHERE m.id = lessons.mission_id AND m.is_published = TRUE
    )
  );

-- Admin can manage lessons
CREATE POLICY "Authenticated users can insert lessons"
  ON lessons FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update lessons"
  ON lessons FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete lessons"
  ON lessons FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- VOCABULARY WORDS TABLE POLICIES
-- ============================================

-- Everyone can read vocab words
CREATE POLICY "Anyone can view vocab words"
  ON vocab_words FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM missions m
      WHERE m.id = vocab_words.mission_id AND m.is_published = TRUE
    )
  );

-- Admin can manage vocab words
CREATE POLICY "Authenticated users can insert vocab words"
  ON vocab_words FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update vocab words"
  ON vocab_words FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete vocab words"
  ON vocab_words FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- CODING TASKS TABLE POLICIES
-- ============================================

-- Everyone can read coding tasks
CREATE POLICY "Anyone can view coding tasks"
  ON coding_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM missions m
      WHERE m.id = coding_tasks.mission_id AND m.is_published = TRUE
    )
  );

-- Admin can manage coding tasks
CREATE POLICY "Authenticated users can insert coding tasks"
  ON coding_tasks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update coding tasks"
  ON coding_tasks FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete coding tasks"
  ON coding_tasks FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- QUIZZES TABLE POLICIES
-- ============================================

-- Everyone can read quizzes
CREATE POLICY "Anyone can view quizzes"
  ON quizzes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM missions m
      WHERE m.id = quizzes.mission_id AND m.is_published = TRUE
    )
  );

-- Admin can manage quizzes
CREATE POLICY "Authenticated users can insert quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update quizzes"
  ON quizzes FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete quizzes"
  ON quizzes FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- QUIZ QUESTIONS TABLE POLICIES
-- ============================================

-- Everyone can read quiz questions
CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      JOIN missions m ON m.id = q.mission_id
      WHERE q.id = quiz_questions.quiz_id AND m.is_published = TRUE
    )
  );

-- Admin can manage quiz questions
CREATE POLICY "Authenticated users can insert quiz questions"
  ON quiz_questions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update quiz questions"
  ON quiz_questions FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete quiz questions"
  ON quiz_questions FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- ENGLISH WRITING TASKS TABLE POLICIES
-- ============================================

-- Everyone can read writing tasks
CREATE POLICY "Anyone can view writing tasks"
  ON english_writing_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM missions m
      WHERE m.id = english_writing_tasks.mission_id AND m.is_published = TRUE
    )
  );

-- Admin can manage writing tasks
CREATE POLICY "Authenticated users can insert writing tasks"
  ON english_writing_tasks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update writing tasks"
  ON english_writing_tasks FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete writing tasks"
  ON english_writing_tasks FOR DELETE
  USING (auth.role() = 'authenticated');

-- ============================================
-- USER MISSION PROGRESS TABLE POLICIES
-- ============================================

-- Users can view their own progress
CREATE POLICY "Users can view own progress"
  ON user_mission_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON user_mission_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON user_mission_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- USER VOCABULARY PROGRESS TABLE POLICIES
-- ============================================

-- Users can view their own vocab progress
CREATE POLICY "Users can view own vocab progress"
  ON user_vocab_progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own vocab progress
CREATE POLICY "Users can update own vocab progress"
  ON user_vocab_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own vocab progress
CREATE POLICY "Users can insert own vocab progress"
  ON user_vocab_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STREAKS TABLE POLICIES
-- ============================================

-- Users can view their own streaks
CREATE POLICY "Users can view own streaks"
  ON streaks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own streaks
CREATE POLICY "Users can update own streaks"
  ON streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own streaks
CREATE POLICY "Users can insert own streaks"
  ON streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- ENGLISH WRITING SUBMISSIONS TABLE POLICIES
-- ============================================

-- Users can view their own submissions
CREATE POLICY "Users can view own writing submissions"
  ON english_writing_submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert own writing submissions"
  ON english_writing_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- CODING TASK SUBMISSIONS TABLE POLICIES
-- ============================================

-- Users can view their own submissions
CREATE POLICY "Users can view own coding submissions"
  ON coding_task_submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert own coding submissions"
  ON coding_task_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- QUIZ SUBMISSIONS TABLE POLICIES
-- ============================================

-- Users can view their own submissions
CREATE POLICY "Users can view own quiz submissions"
  ON quiz_submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert own quiz submissions"
  ON quiz_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
