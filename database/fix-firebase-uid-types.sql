-- ============================================================
-- FIX: Change user_id columns from UUID to TEXT
-- version 2: Drops all RLS policies FIRST to avoid dependency errors
-- ============================================================

-- Step 0: DISABLE RLS temporarily on all tables to clear dependencies
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_mission_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_vocab_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE streaks DISABLE ROW LEVEL SECURITY;
ALTER TABLE english_writing_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE coding_task_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE missions DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_words DISABLE ROW LEVEL SECURITY;
ALTER TABLE coding_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE english_writing_tasks DISABLE ROW LEVEL SECURITY;

-- Step 1: DROP ALL OLD POLICIES that reference user_id or id
-- This is necessary before changing column types
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can view own progress" ON user_mission_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_mission_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_mission_progress;
DROP POLICY IF EXISTS "Users can view own vocab progress" ON user_vocab_progress;
DROP POLICY IF EXISTS "Users can update own vocab progress" ON user_vocab_progress;
DROP POLICY IF EXISTS "Users can insert own vocab progress" ON user_vocab_progress;
DROP POLICY IF EXISTS "Users can view own streaks" ON streaks;
DROP POLICY IF EXISTS "Users can update own streaks" ON streaks;
DROP POLICY IF EXISTS "Users can insert own streaks" ON streaks;
DROP POLICY IF EXISTS "Users can view own writing submissions" ON english_writing_submissions;
DROP POLICY IF EXISTS "Users can insert own writing submissions" ON english_writing_submissions;
DROP POLICY IF EXISTS "Users can view own coding submissions" ON coding_task_submissions;
DROP POLICY IF EXISTS "Users can insert own coding submissions" ON coding_task_submissions;
DROP POLICY IF EXISTS "Users can view own quiz submissions" ON quiz_submissions;
DROP POLICY IF EXISTS "Users can insert own quiz submissions" ON quiz_submissions;
DROP POLICY IF EXISTS "Anyone can view published missions" ON missions;
DROP POLICY IF EXISTS "Authenticated users can view all missions" ON missions;
DROP POLICY IF EXISTS "Authenticated users can insert missions" ON missions;
DROP POLICY IF EXISTS "Authenticated users can update missions" ON missions;
DROP POLICY IF EXISTS "Authenticated users can delete missions" ON missions;
DROP POLICY IF EXISTS "Anyone can view lessons" ON lessons;
DROP POLICY IF EXISTS "Anyone can view vocab words" ON vocab_words;
DROP POLICY IF EXISTS "Anyone can view coding tasks" ON coding_tasks;
DROP POLICY IF EXISTS "Anyone can view quizzes" ON quizzes;
DROP POLICY IF EXISTS "Anyone can view quiz questions" ON quiz_questions;
DROP POLICY IF EXISTS "Anyone can view writing tasks" ON english_writing_tasks;

-- Step 2: Drop all foreign key constraints referencing users.id
ALTER TABLE user_mission_progress DROP CONSTRAINT IF EXISTS user_mission_progress_user_id_fkey;
ALTER TABLE user_vocab_progress DROP CONSTRAINT IF EXISTS user_vocab_progress_user_id_fkey;
ALTER TABLE streaks DROP CONSTRAINT IF EXISTS streaks_user_id_fkey;
ALTER TABLE english_writing_submissions DROP CONSTRAINT IF EXISTS english_writing_submissions_user_id_fkey;
ALTER TABLE coding_task_submissions DROP CONSTRAINT IF EXISTS coding_task_submissions_user_id_fkey;
ALTER TABLE quiz_submissions DROP CONSTRAINT IF EXISTS quiz_submissions_user_id_fkey;

-- Step 3: Drop the FK from users to auth.users
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Step 4: Change users.id from UUID to TEXT
ALTER TABLE users ALTER COLUMN id TYPE TEXT USING id::TEXT;

-- Step 5: Change all user_id columns from UUID to TEXT
ALTER TABLE user_mission_progress ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE user_vocab_progress ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE streaks ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE english_writing_submissions ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE coding_task_submissions ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;
ALTER TABLE quiz_submissions ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Step 6: Re-add foreign key constraints (now TEXT → TEXT)
ALTER TABLE user_mission_progress 
  ADD CONSTRAINT user_mission_progress_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_vocab_progress 
  ADD CONSTRAINT user_vocab_progress_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE streaks 
  ADD CONSTRAINT streaks_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE english_writing_submissions 
  ADD CONSTRAINT english_writing_submissions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE coding_task_submissions 
  ADD CONSTRAINT coding_task_submissions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE quiz_submissions 
  ADD CONSTRAINT quiz_submissions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Step 7: RE-ENABLE RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vocab_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_writing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_writing_tasks ENABLE ROW LEVEL SECURITY;

-- Step 8: Create open policies (since auth is handled by Firebase, not Supabase)
-- In a production environment, you would use more restrictive policies, 
-- but for development with Firebase, this allows the app to function.
CREATE POLICY "Allow all" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON user_mission_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON user_vocab_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON streaks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON english_writing_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON coding_task_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON quiz_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON missions FOR SELECT USING (true);
CREATE POLICY "Allow all" ON lessons FOR SELECT USING (true);
CREATE POLICY "Allow all" ON vocab_words FOR SELECT USING (true);
CREATE POLICY "Allow all" ON coding_tasks FOR SELECT USING (true);
CREATE POLICY "Allow all" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Allow all" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Allow all" ON english_writing_tasks FOR SELECT USING (true);

-- Verify
SELECT 'Migration complete! user_id columns are now TEXT and RLS is reset.' as status;
