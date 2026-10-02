-- ==============================================================================
-- BARAKAH DAILY - DATABASE SCHEMA MIGRATION: ADD USERNAME & EMAIL VERIFICATION
-- Run this in your Supabase SQL Editor to update existing databases safely.
-- ==============================================================================

-- 1. Safely add 'username' column if it does not exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'username'
    ) THEN
        -- Add column as nullable initially
        ALTER TABLE public.profiles ADD COLUMN username TEXT;
        
        -- Backfill any existing profiles with a safe unique username derived from email or id
        UPDATE public.profiles 
        SET username = LOWER(REGEXP_REPLACE(SPLIT_PART(email, '@', 1), '[^a-zA-Z0-9_.-]', '', 'g')) || '_' || SUBSTRING(MD5(id) FROM 1 FOR 4)
        WHERE username IS NULL OR username = '';

        -- Enforce NOT NULL and UNIQUE constraint
        ALTER TABLE public.profiles ALTER COLUMN username SET NOT NULL;
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);
    END IF;
END $$;

-- 2. Safely add 'email_verified' column if it does not exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'email_verified'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN email_verified BOOLEAN DEFAULT FALSE NOT NULL;
    END IF;
END $$;

-- 3. Safely add 'password_hash' column if it does not exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN password_hash TEXT;
    END IF;
END $$;

-- 4. Create Indexes if not already present
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 5. Create Email Verifications OTP audit & expiration table
CREATE TABLE IF NOT EXISTS public.email_verifications (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    attempts INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON public.email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_email_verifications_expires ON public.email_verifications(expires_at);

-- 6. Enable Row Level Security (RLS) on email_verifications
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'email_verifications' AND policyname = 'email_verifications_select'
    ) THEN
        CREATE POLICY "email_verifications_select" ON public.email_verifications FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'email_verifications' AND policyname = 'email_verifications_insert'
    ) THEN
        CREATE POLICY "email_verifications_insert" ON public.email_verifications FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'email_verifications' AND policyname = 'email_verifications_update'
    ) THEN
        CREATE POLICY "email_verifications_update" ON public.email_verifications FOR UPDATE USING (true);
    END IF;
END $$;
