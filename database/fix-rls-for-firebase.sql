-- ============================================
-- FIX RLS FOR FIREBASE AUTH USERS (CLEAN VERSION)
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Relax USERS table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Allow profile insert" ON users;
DROP POLICY IF EXISTS "Allow profile select" ON users;
DROP POLICY IF EXISTS "Allow profile update" ON users;

CREATE POLICY "Allow profile insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow profile select" ON users FOR SELECT USING (true);
CREATE POLICY "Allow profile update" ON users FOR UPDATE USING (true);

-- 2. Relax USER_MISSION_PROGRESS table
DROP POLICY IF EXISTS "Users can view own progress" ON user_mission_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_mission_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_mission_progress;
DROP POLICY IF EXISTS "Allow progress select" ON user_mission_progress;
DROP POLICY IF EXISTS "Allow progress insert" ON user_mission_progress;
DROP POLICY IF EXISTS "Allow progress update" ON user_mission_progress;

CREATE POLICY "Allow progress select" ON user_mission_progress FOR SELECT USING (true);
CREATE POLICY "Allow progress insert" ON user_mission_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow progress update" ON user_mission_progress FOR UPDATE USING (true);

-- 3. Relax MISSIONS table
DROP POLICY IF EXISTS "Anyone can view published missions" ON missions;
DROP POLICY IF EXISTS "Authenticated users can view all missions" ON missions;
DROP POLICY IF EXISTS "Authenticated users can insert missions" ON missions;
DROP POLICY IF EXISTS "Authenticated users can update missions" ON missions;
DROP POLICY IF EXISTS "Allow missions select" ON missions;
DROP POLICY IF EXISTS "Allow missions insert" ON missions;
DROP POLICY IF EXISTS "Allow missions update" ON missions;

CREATE POLICY "Allow missions select" ON missions FOR SELECT USING (true);
CREATE POLICY "Allow missions insert" ON missions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow missions update" ON missions FOR UPDATE USING (true);

-- 4. Relax OTHER tables
-- Streaks
DROP POLICY IF EXISTS "Allow streaks select" ON streaks;
DROP POLICY IF EXISTS "Allow streaks insert" ON streaks;
DROP POLICY IF EXISTS "Allow streaks update" ON streaks;
CREATE POLICY "Allow streaks select" ON streaks FOR SELECT USING (true);
CREATE POLICY "Allow streaks insert" ON streaks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow streaks update" ON streaks FOR UPDATE USING (true);

-- Submissions
DROP POLICY IF EXISTS "Allow writing submissions select" ON english_writing_submissions;
DROP POLICY IF EXISTS "Allow writing submissions insert" ON english_writing_submissions;
CREATE POLICY "Allow writing submissions select" ON english_writing_submissions FOR SELECT USING (true);
CREATE POLICY "Allow writing submissions insert" ON english_writing_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow coding submissions select" ON coding_task_submissions;
DROP POLICY IF EXISTS "Allow coding submissions insert" ON coding_task_submissions;
CREATE POLICY "Allow coding submissions select" ON coding_task_submissions FOR SELECT USING (true);
CREATE POLICY "Allow coding submissions insert" ON coding_task_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow quiz submissions select" ON quiz_submissions;
DROP POLICY IF EXISTS "Allow quiz submissions insert" ON quiz_submissions;
CREATE POLICY "Allow quiz submissions select" ON quiz_submissions FOR SELECT USING (true);
CREATE POLICY "Allow quiz submissions insert" ON quiz_submissions FOR INSERT WITH CHECK (true);

-- Vocab Progress
DROP POLICY IF EXISTS "Allow vocab progress select" ON user_vocab_progress;
DROP POLICY IF EXISTS "Allow vocab progress insert" ON user_vocab_progress;
DROP POLICY IF EXISTS "Allow vocab progress update" ON user_vocab_progress;
CREATE POLICY "Allow vocab progress select" ON user_vocab_progress FOR SELECT USING (true);
CREATE POLICY "Allow vocab progress insert" ON user_vocab_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow vocab progress update" ON user_vocab_progress FOR UPDATE USING (true);
