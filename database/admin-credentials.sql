-- Admin Credentials Table
-- Run this in your Supabase SQL editor

-- Store admin password (hashed with pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_credentials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default password: Admin@123
-- (hashed with bcrypt, cost factor 10)
INSERT INTO admin_credentials (password_hash)
VALUES (crypt('Admin@123', gen_salt('bf', 10)))
ON CONFLICT DO NOTHING;

-- RLS: nobody can read/write this table from the client directly
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- No public access — all access goes through secure functions below
CREATE POLICY "No direct access" ON admin_credentials
    FOR ALL USING (false);

-- ── Secure function: verify admin password ────────────────────────────────────
-- Returns true if the supplied password matches the stored hash
CREATE OR REPLACE FUNCTION verify_admin_password(input_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    stored_hash TEXT;
BEGIN
    SELECT password_hash INTO stored_hash FROM admin_credentials LIMIT 1;
    IF stored_hash IS NULL THEN RETURN FALSE; END IF;
    RETURN stored_hash = crypt(input_password, stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Secure function: change admin password ────────────────────────────────────
-- Only updates if the old password is correct
CREATE OR REPLACE FUNCTION change_admin_password(old_password TEXT, new_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    stored_hash TEXT;
BEGIN
    SELECT password_hash INTO stored_hash FROM admin_credentials LIMIT 1;
    IF stored_hash IS NULL THEN RETURN FALSE; END IF;
    -- Verify old password
    IF stored_hash != crypt(old_password, stored_hash) THEN RETURN FALSE; END IF;
    -- Update with new hash
    UPDATE admin_credentials
    SET password_hash = crypt(new_password, gen_salt('bf', 10)),
        updated_at = NOW();
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anon/authenticated roles so client can call via rpc()
GRANT EXECUTE ON FUNCTION verify_admin_password(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION change_admin_password(TEXT, TEXT) TO anon, authenticated;
