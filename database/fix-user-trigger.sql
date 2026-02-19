-- ============================================
-- FIX: Auto-create user profile on signup
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop the old trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a function that runs with SECURITY DEFINER
-- (bypasses RLS, runs as the DB owner)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert user profile row automatically on signup
  INSERT INTO public.users (id, email, full_name, daily_mode)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    20  -- default 20 min/day
  )
  ON CONFLICT (id) DO NOTHING;  -- safe to re-run

  -- Unlock the first mission for the new user
  INSERT INTO public.user_mission_progress (user_id, mission_id, status)
  SELECT NEW.id, m.id, 'available'
  FROM public.missions m
  WHERE m.day_number = 1 AND m.is_published = TRUE
  LIMIT 1
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

-- Attach the trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
