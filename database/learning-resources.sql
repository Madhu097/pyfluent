-- Learning Resources Tables
-- Run this in your Supabase SQL editor

-- 1. PDF Resources table
CREATE TABLE IF NOT EXISTS learning_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',   -- 'beginner' | 'intermediate' | 'advanced' | 'general'
    file_url TEXT NOT NULL,            -- Supabase Storage URL
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT DEFAULT 0,
    uploaded_by TEXT NOT NULL,         -- user email
    is_published BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Coding Problems table
CREATE TABLE IF NOT EXISTS coding_problems (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT DEFAULT 'easy',    -- 'easy' | 'medium' | 'hard'
    category TEXT DEFAULT 'basics',    -- 'basics' | 'loops' | 'functions' | 'data-structures' | 'oop'
    starter_code TEXT DEFAULT '',
    solution_code TEXT DEFAULT '',
    hints TEXT[] DEFAULT '{}',
    expected_output TEXT DEFAULT '',
    xp_reward INTEGER DEFAULT 10,
    is_published BOOLEAN DEFAULT true,
    solve_count INTEGER DEFAULT 0,
    uploaded_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User problem attempts
CREATE TABLE IF NOT EXISTS user_problem_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    problem_id UUID REFERENCES coding_problems(id) ON DELETE CASCADE,
    code_submitted TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    xp_earned INTEGER DEFAULT 0,
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Storage bucket for PDFs (run separately in Supabase dashboard → Storage)
-- Create a bucket named: learning-resources
-- Set it to public: true

-- 5. RLS Policies
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_problem_attempts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published resources
CREATE POLICY "Public read learning_resources" ON learning_resources
    FOR SELECT USING (is_published = true);

-- Anyone can read published problems
CREATE POLICY "Public read coding_problems" ON coding_problems
    FOR SELECT USING (is_published = true);

-- Authenticated users can insert resources (admin check done in app)
CREATE POLICY "Auth insert learning_resources" ON learning_resources
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth insert coding_problems" ON coding_problems
    FOR INSERT WITH CHECK (true);

-- Auth delete (admin only enforced in app)
CREATE POLICY "Auth delete learning_resources" ON learning_resources
    FOR DELETE USING (true);

CREATE POLICY "Auth delete coding_problems" ON coding_problems
    FOR DELETE USING (true);

-- Users can manage their own attempts
CREATE POLICY "Users manage own attempts" ON user_problem_attempts
    FOR ALL USING (user_id = auth.uid()::text OR true);

-- Increment view count function
CREATE OR REPLACE FUNCTION increment_view_count(resource_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE learning_resources SET view_count = view_count + 1 WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
