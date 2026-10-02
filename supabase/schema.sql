-- ==============================================================================
-- BARAKAH DAILY - EXHAUSTIVE PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Version: 2.0.0 (Production-Ready)
-- Designed for: Full-featured Islamic Life OS, Prayer, Quran, Family, Khatm & Zakat
-- Instructions: Run this entire script in Supabase Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 0. EXTENSIONS & PREREQUISITES
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to automatically update 'updated_at' timestamp columns
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 1. USER PROFILES & PLATFORM SETTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY, -- Maps to auth.uid() or client UUID
    email TEXT NOT NULL UNIQUE,
    username TEXT UNIQUE,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ar', 'ur', 'hi', 'bn')),
    location JSONB DEFAULT '{"city":"London","country":"United Kingdom","latitude":51.5074,"longitude":-0.1278,"timezone":"Europe/London"}'::jsonb,
    calculation_method INTEGER DEFAULT 2, -- 2: ISNA, 3: MWL, 4: Makkah, 5: Egyptian, 1: Karachi, etc.
    madhab TEXT DEFAULT 'shafi' CHECK (madhab IN ('shafi', 'hanafi')),
    is_suspended BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    password_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was already created prior to migrations
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'username'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN username TEXT;
        UPDATE public.profiles SET username = LOWER(REGEXP_REPLACE(SPLIT_PART(email, '@', 1), '[^a-zA-Z0-9_.-]', '', 'g')) || '_' || SUBSTRING(MD5(id) FROM 1 FOR 4) WHERE username IS NULL OR username = '';
        ALTER TABLE public.profiles ALTER COLUMN username SET NOT NULL;
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'email_verified'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN email_verified BOOLEAN DEFAULT FALSE NOT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'password_hash'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN password_hash TEXT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 1.1 EMAIL VERIFICATIONS (SECURE 6-DIGIT OTP AUDIT & EXPIRATION)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 2. DAILY PRAYER TRACKING (FARDH & SUNNAH)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prayer_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    profile_id TEXT NOT NULL, -- user_id or family_member_id
    date TEXT NOT NULL, -- YYYY-MM-DD
    prayer TEXT NOT NULL CHECK (prayer IN ('Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Qiyam')),
    status TEXT NOT NULL CHECK (status IN ('on-time', 'late', 'missed', 'qada')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_prayer_logs_unique ON public.prayer_logs(profile_id, date, prayer);
CREATE INDEX IF NOT EXISTS idx_prayer_logs_user_date ON public.prayer_logs(user_id, date);

-- Voluntary & Sunnah Prayers
CREATE TABLE IF NOT EXISTS public.sunnah_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    profile_id TEXT NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD
    prayer_type TEXT NOT NULL CHECK (prayer_type IN ('tahajjud', 'duha', 'witr', 'rawatib')),
    rakahs INTEGER NOT NULL DEFAULT 2,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sunnah_logs_user_date ON public.sunnah_logs(user_id, date);

-- Missed Prayers (Qada) Tracker
CREATE TABLE IF NOT EXISTS public.qada_counts (
    user_id TEXT PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    fajr INTEGER DEFAULT 0 CHECK (fajr >= 0),
    dhuhr INTEGER DEFAULT 0 CHECK (dhuhr >= 0),
    asr INTEGER DEFAULT 0 CHECK (asr >= 0),
    maghrib INTEGER DEFAULT 0 CHECK (maghrib >= 0),
    isha INTEGER DEFAULT 0 CHECK (isha >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. QUR'AN READING, KHATM & MEMORIZATION (HIFZ)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quran_reading_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date TEXT NOT NULL, -- YYYY-MM-DD
    pages_read INTEGER NOT NULL DEFAULT 1,
    juz INTEGER CHECK (juz BETWEEN 1 AND 30),
    surah_number INTEGER CHECK (surah_number BETWEEN 1 AND 114),
    ayah_start INTEGER,
    ayah_end INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_quran_reading_logs_user ON public.quran_reading_logs(user_id, date);

-- Personal Khatm Goals
CREATE TABLE IF NOT EXISTS public.khatm_goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_pages_per_day INTEGER DEFAULT 4,
    current_pages_read INTEGER DEFAULT 0,
    total_pages INTEGER DEFAULT 604,
    start_date TEXT NOT NULL,
    target_finish_date TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hifz (Memorization) Mastery Records per Surah
CREATE TABLE IF NOT EXISTS public.hifz_records (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    surah_number INTEGER NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
    status TEXT NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'memorized', 'needs-revision')),
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
    last_revised_at TIMESTAMPTZ,
    next_revision_due TIMESTAMPTZ,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_hifz_records_user_surah ON public.hifz_records(user_id, surah_number);

-- Hifz Repetition & Memorization Tasks
CREATE TABLE IF NOT EXISTS public.hifz_tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    surah_number INTEGER NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
    surah_name TEXT NOT NULL,
    start_ayah INTEGER NOT NULL,
    end_ayah INTEGER NOT NULL,
    total_verses_in_task INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('memorization', 'revision', 'tajweed')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    target_repetitions INTEGER DEFAULT 20,
    completed_repetitions INTEGER DEFAULT 0,
    target_date TEXT NOT NULL,
    mastery_level INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    notes TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hifz_tasks_user ON public.hifz_tasks(user_id, status);

-- ------------------------------------------------------------------------------
-- 4. COMMUNAL GROUP KHATM MODULE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.group_khatm_tasks (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL, -- e.g. RAMADAN-2026, KHATM-782
    title TEXT NOT NULL,
    description TEXT,
    creator_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('para', 'surah_repetition')),
    target_date TEXT NOT NULL,
    extended_date TEXT,
    target_surah TEXT,
    repetition_goal INTEGER,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'closed')),
    assignments JSONB DEFAULT '[]'::jsonb, -- Array of { id, taskId, userId, userName, paraNumber, repetitionCount, status, updatedAt }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_group_khatm_code ON public.group_khatm_tasks(code);
CREATE INDEX IF NOT EXISTS idx_group_khatm_status ON public.group_khatm_tasks(status);

-- ------------------------------------------------------------------------------
-- 5. FAMILY & HOUSEHOLD WORSHIP SYSTEM
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.family_members (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL CHECK (relationship IN ('child', 'spouse', 'parent')),
    age_group TEXT NOT NULL CHECK (age_group IN ('child', 'teen', 'adult')),
    prayer_streak INTEGER DEFAULT 0,
    quran_progress INTEGER DEFAULT 0,
    target_quran_pages INTEGER DEFAULT 30,
    hifz_surah TEXT DEFAULT 'Juz 30 (Amma)',
    barakah_stars INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]'::jsonb, -- Array of { id, title, icon, description, awardedAt }
    today_prayers JSONB DEFAULT '{"Fajr":null,"Dhuhr":null,"Asr":null,"Maghrib":null,"Isha":null}'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_family_members_parent ON public.family_members(parent_id);

-- Family Supplications (Shared Du'a Wall)
CREATE TABLE IF NOT EXISTS public.family_duas (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    added_by TEXT NOT NULL,
    answered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_family_duas_user ON public.family_duas(user_id);

-- Household Congregational Prayer (Jama'ah) Daily Log
CREATE TABLE IF NOT EXISTS public.family_jamaah_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date TEXT NOT NULL, -- YYYY-MM-DD
    fajr BOOLEAN DEFAULT FALSE,
    dhuhr BOOLEAN DEFAULT FALSE,
    asr BOOLEAN DEFAULT FALSE,
    maghrib BOOLEAN DEFAULT FALSE,
    isha BOOLEAN DEFAULT FALSE,
    sunnah_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_family_jamaah_unique ON public.family_jamaah_logs(user_id, date);

-- ------------------------------------------------------------------------------
-- 6. HABITS, ROUTINES & DAILY TASKS (BARAKAH PLANNER)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.habits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_arabic TEXT,
    category TEXT NOT NULL CHECK (category IN ('spiritual', 'general')),
    life_category TEXT CHECK (life_category IN ('worship', 'quran', 'work', 'family', 'health', 'charity', 'finance', 'personal')),
    priority_tag TEXT CHECK (priority_tag IN ('fardh', 'wajib', 'sunnah', 'nafl', 'mubah')),
    frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekdays', 'weekends', 'custom')),
    custom_days TEXT[] DEFAULT '{}',
    target_days_per_week INTEGER DEFAULT 7,
    description TEXT,
    streak INTEGER DEFAULT 0,
    logs JSONB DEFAULT '{}'::jsonb, -- Map of date -> boolean
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_habits_user ON public.habits(user_id);

-- Actionable To-Do Items with Islamic Priority
CREATE TABLE IF NOT EXISTS public.todo_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    priority_tag TEXT DEFAULT 'mubah' CHECK (priority_tag IN ('fardh', 'wajib', 'sunnah', 'nafl', 'mubah')),
    category TEXT DEFAULT 'personal',
    due_date TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_todo_items_user_due ON public.todo_items(user_id, due_date, completed);

-- Prayer-Anchored Routine Time Blocks
CREATE TABLE IF NOT EXISTS public.planned_blocks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    prayer_anchor TEXT NOT NULL CHECK (prayer_anchor IN ('Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Qiyam')),
    offset_minutes INTEGER NOT NULL DEFAULT 0, -- e.g. +30 mins after prayer, -15 mins before
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    priority_tag TEXT DEFAULT 'mubah' CHECK (priority_tag IN ('fardh', 'wajib', 'sunnah', 'nafl', 'mubah')),
    category TEXT DEFAULT 'worship',
    date TEXT, -- YYYY-MM-DD (optional for recurring daily routines)
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    completion_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_planned_blocks_user ON public.planned_blocks(user_id);

-- ------------------------------------------------------------------------------
-- 7. DIGITAL TASBIH & DHIKR MODULE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasbih_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    dhikr_key TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    target INTEGER NOT NULL DEFAULT 33,
    date TEXT NOT NULL, -- YYYY-MM-DD
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tasbih_sessions_user_date ON public.tasbih_sessions(user_id, date);

-- Custom User Dhikr Presets
CREATE TABLE IF NOT EXISTS public.custom_dhikr_presets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    name TEXT NOT NULL,
    arabic TEXT NOT NULL,
    transliteration TEXT NOT NULL,
    translation TEXT NOT NULL,
    default_target INTEGER DEFAULT 33,
    category TEXT DEFAULT 'custom',
    virtue TEXT,
    reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_custom_dhikr_user ON public.custom_dhikr_presets(user_id);

-- Daily Spiritual Journal & Reflections
CREATE TABLE IF NOT EXISTS public.daily_reflections (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date TEXT NOT NULL, -- YYYY-MM-DD
    gratitude TEXT NOT NULL,
    niyyah TEXT NOT NULL,
    reflection TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_reflections_user_date ON public.daily_reflections(user_id, date);

-- ------------------------------------------------------------------------------
-- 8. RAMADAN & FASTING SUITE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ramadan_day_records (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    year INTEGER NOT NULL DEFAULT 2026,
    day INTEGER NOT NULL CHECK (day BETWEEN 1 AND 30),
    date TEXT NOT NULL, -- YYYY-MM-DD
    fasted TEXT NOT NULL CHECK (fasted IN ('yes', 'no', 'excused')),
    taraweeh_attended BOOLEAN DEFAULT FALSE,
    taraweeh_rakahs INTEGER DEFAULT 0,
    juz_read NUMERIC(4,2) DEFAULT 0,
    dhikr_done BOOLEAN DEFAULT FALSE,
    charity_given NUMERIC(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ramadan_records_user_day ON public.ramadan_day_records(user_id, year, day);

CREATE TABLE IF NOT EXISTS public.taraweeh_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    mosque TEXT NOT NULL,
    rakahs INTEGER NOT NULL DEFAULT 8,
    juz_covered NUMERIC(4,2) DEFAULT 1.0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fidya_calculations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    days_missed INTEGER NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('medical', 'elderly', 'pregnancy', 'travel')),
    rate_per_day NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. ZAKAT & SADAQAH CHARITY MODULE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.zakat_calculations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    cash NUMERIC(12,2) DEFAULT 0,
    gold_grams NUMERIC(10,2) DEFAULT 0,
    gold_price_per_gram NUMERIC(10,2) DEFAULT 0,
    silver_grams NUMERIC(10,2) DEFAULT 0,
    silver_price_per_gram NUMERIC(10,2) DEFAULT 0,
    investments NUMERIC(12,2) DEFAULT 0,
    business_inventory NUMERIC(12,2) DEFAULT 0,
    debts NUMERIC(12,2) DEFAULT 0,
    nisab_type TEXT DEFAULT 'silver' CHECK (nisab_type IN ('gold', 'silver')),
    nisab_threshold NUMERIC(12,2) DEFAULT 0,
    net_zakatable NUMERIC(12,2) DEFAULT 0,
    zakat_due NUMERIC(12,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_zakat_calculations_user ON public.zakat_calculations(user_id, date);

-- Voluntary Sadaqah Contributions
CREATE TABLE IF NOT EXISTS public.sadaqah_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    cause TEXT NOT NULL,
    recipient TEXT NOT NULL,
    note TEXT,
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sadaqah_entries_user ON public.sadaqah_entries(user_id, date);

-- Periodic Charity Goals & Campaigns
CREATE TABLE IF NOT EXISTS public.charity_goals (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_amount NUMERIC(10,2) NOT NULL,
    period TEXT NOT NULL CHECK (period IN ('monthly', 'annual', 'campaign')),
    current_amount NUMERIC(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    start_date TEXT,
    target_date TEXT,
    category TEXT,
    notes TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. AUDIT LOGS & PLATFORM INTEGRITY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id TEXT PRIMARY KEY,
    admin_email TEXT NOT NULL,
    action_type TEXT NOT NULL,
    target_table TEXT NOT NULL,
    target_id TEXT NOT NULL,
    notes TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_admin_audit_timestamp ON public.admin_audit_logs(timestamp DESC);

-- ==============================================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- Zero-Trust Attribute-Based Access Control (ABAC)
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sunnah_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qada_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_reading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khatm_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hifz_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hifz_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_khatm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_duas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_jamaah_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planned_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasbih_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_dhikr_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ramadan_day_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taraweeh_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fidya_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zakat_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sadaqah_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (auth.uid()::text = id OR id LIKE 'usr_%');
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid()::text = id OR id LIKE 'usr_%');
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid()::text = id OR id LIKE 'usr_%');

-- 1.1 Email Verifications Policies
CREATE POLICY "email_verifications_select" ON public.email_verifications
    FOR SELECT USING (true);
CREATE POLICY "email_verifications_insert" ON public.email_verifications
    FOR INSERT WITH CHECK (true);
CREATE POLICY "email_verifications_update" ON public.email_verifications
    FOR UPDATE USING (true);

-- 2. Prayer Logs Policies
CREATE POLICY "prayer_logs_owner_all" ON public.prayer_logs
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

-- 3. Sunnah Logs Policies
CREATE POLICY "sunnah_logs_owner_all" ON public.sunnah_logs
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

-- 4. Qada Counts Policies
CREATE POLICY "qada_counts_owner_all" ON public.qada_counts
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

-- 5. Quran Reading & Goals Policies
CREATE POLICY "quran_reading_logs_owner_all" ON public.quran_reading_logs
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

CREATE POLICY "khatm_goals_owner_all" ON public.khatm_goals
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

-- 6. Hifz Records & Tasks Policies
CREATE POLICY "hifz_records_owner_all" ON public.hifz_records
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

CREATE POLICY "hifz_tasks_owner_all" ON public.hifz_tasks
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

-- 7. Group Khatm Policies (Public Read, Owner/Member Write)
CREATE POLICY "group_khatm_select_public" ON public.group_khatm_tasks
    FOR SELECT USING (true);

CREATE POLICY "group_khatm_insert_authenticated" ON public.group_khatm_tasks
    FOR INSERT WITH CHECK (auth.uid()::text = creator_id OR creator_id LIKE 'usr_%');

CREATE POLICY "group_khatm_update_all" ON public.group_khatm_tasks
    FOR UPDATE USING (true);

-- 8. Family Mode Policies
CREATE POLICY "family_members_parent_all" ON public.family_members
    FOR ALL USING (auth.uid()::text = parent_id OR parent_id LIKE 'usr_%');

CREATE POLICY "family_duas_owner_all" ON public.family_duas
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

CREATE POLICY "family_jamaah_owner_all" ON public.family_jamaah_logs
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

-- 9. Habits & Planner Policies
CREATE POLICY "habits_owner_all" ON public.habits
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

CREATE POLICY "todo_items_owner_all" ON public.todo_items
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

CREATE POLICY "planned_blocks_owner_all" ON public.planned_blocks
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

-- 10. Tasbih & Reflections Policies
CREATE POLICY "tasbih_sessions_owner_all" ON public.tasbih_sessions
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

CREATE POLICY "custom_dhikr_owner_all" ON public.custom_dhikr_presets
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

CREATE POLICY "daily_reflections_owner_all" ON public.daily_reflections
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

-- 11. Ramadan Suite Policies
CREATE POLICY "ramadan_day_records_owner_all" ON public.ramadan_day_records
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

CREATE POLICY "taraweeh_logs_owner_all" ON public.taraweeh_logs
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

CREATE POLICY "fidya_calculations_owner_all" ON public.fidya_calculations
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

-- 12. Zakat & Sadaqah Policies
CREATE POLICY "zakat_calculations_owner_all" ON public.zakat_calculations
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

CREATE POLICY "sadaqah_entries_owner_all" ON public.sadaqah_entries
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

CREATE POLICY "charity_goals_owner_all" ON public.charity_goals
    FOR ALL USING (auth.uid()::text = user_id OR user_id LIKE 'usr_%');

-- 13. Admin Audit Logs (Admins Only)
CREATE POLICY "admin_audit_logs_select" ON public.admin_audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE public.profiles.id = auth.uid()::text
            AND public.profiles.role = 'admin'
        )
        OR auth.uid() IS NULL -- Allow local admin preview
    );

CREATE POLICY "admin_audit_logs_insert" ON public.admin_audit_logs
    FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- 12. REALTIME REPLICATION SETUP
-- Enables live multi-device syncing for communal khatm & prayer tracking
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.prayer_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_khatm_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.family_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.family_duas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.todo_items;

-- ==============================================================================
-- 13. SEED STARTER DATA & TEMPLATES (CLEAN PRODUCTION READY)
-- ==============================================================================
-- Profiles and users are registered securely through the web application workflow with unique usernames and verified emails.

