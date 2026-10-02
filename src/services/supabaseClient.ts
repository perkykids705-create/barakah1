import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, FamilyMember, FamilyDua, GroupKhatmTask, PrayerName, PrayerStatus } from '../types';

// Environment variable extraction with secure fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project.supabase.co')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Health check to verify active connection to Supabase database.
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  latencyMs?: number;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in .env. Running in Offline / Local Mode.',
    };
  }

  const startTime = Date.now();
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    const latency = Date.now() - startTime;

    if (error && error.code !== 'PGRST116') {
      return {
        connected: false,
        message: `Connection error: ${error.message} (${error.code})`,
        latencyMs: latency,
      };
    }

    return {
      connected: true,
      message: `Successfully connected to Supabase (${latency}ms)`,
      latencyMs: latency,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to reach Supabase: ${err?.message || 'Network error'}`,
    };
  }
}

// ==============================================================================
// 1. User Profile Sync
// ==============================================================================

export async function syncUserProfileToSupabase(user: UserProfile): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        language: user.language,
        location: user.location,
        calculation_method: user.calculationMethod,
        madhab: user.madhab,
        is_suspended: user.isSuspended || false,
        email_verified: user.emailVerified || false,
        password_hash: user.passwordHash || null,
        last_active_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.warn('[Supabase] Failed to sync user profile:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Profile sync exception:', err);
    return false;
  }
}

// ==============================================================================
// 2. Prayer Logs Sync
// ==============================================================================

export async function syncPrayerLogToSupabase(
  userId: string,
  date: string,
  prayer: PrayerName,
  status: PrayerStatus
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const logId = `${userId}_${date}_${prayer}`;
    const { error } = await supabase.from('prayer_logs').upsert(
      {
        id: logId,
        user_id: userId,
        date,
        prayer,
        status,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.warn('[Supabase] Failed to sync prayer log:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Prayer log sync exception:', err);
    return false;
  }
}

// ==============================================================================
// 3. Family Mode Sync
// ==============================================================================

export async function syncFamilyMemberToSupabase(member: FamilyMember): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('family_members').upsert(
      {
        id: member.id,
        parent_id: member.parentId,
        name: member.name,
        relationship: member.relationship,
        age_group: member.ageGroup,
        prayer_streak: member.prayerStreak,
        quran_progress: member.quranProgress,
        target_quran_pages: member.targetQuranPages || 30,
        hifz_surah: member.hifzSurah || 'Juz 30 (Amma)',
        barakah_stars: member.barakahStars || 0,
        badges: member.badges || [],
        today_prayers: member.todayPrayers || {},
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.warn('[Supabase] Failed to sync family member:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Family member sync exception:', err);
    return false;
  }
}

export async function deleteFamilyMemberFromSupabase(memberId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('family_members').delete().eq('id', memberId);
    return !error;
  } catch {
    return false;
  }
}

export async function syncFamilyDuaToSupabase(dua: FamilyDua, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('family_duas').upsert(
      {
        id: dua.id,
        user_id: userId,
        text: dua.text,
        added_by: dua.addedBy,
        answered: dua.answered || false,
        created_at: dua.createdAt,
      },
      { onConflict: 'id' }
    );
    return !error;
  } catch {
    return false;
  }
}

export async function deleteFamilyDuaFromSupabase(duaId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('family_duas').delete().eq('id', duaId);
    return !error;
  } catch {
    return false;
  }
}

// ==============================================================================
// 4. Group Khatm Tasks Sync
// ==============================================================================

export async function syncGroupKhatmTaskToSupabase(task: GroupKhatmTask): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('group_khatm_tasks').upsert(
      {
        id: task.id,
        code: task.code,
        title: task.title,
        description: task.description,
        type: task.type,
        target_date: task.targetDate,
        extended_date: task.extendedDate || null,
        target_surah: task.targetSurah || null,
        repetition_goal: task.repetitionGoal || null,
        status: task.status,
        creator_id: task.creatorId,
        creator_name: task.creatorName,
        assignments: task.assignments,
        created_at: task.createdAt,
      },
      { onConflict: 'id' }
    );
    if (error) {
      console.warn('[Supabase] Failed to sync group khatm task:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Khatm task sync exception:', err);
    return false;
  }
}

export async function fetchGroupKhatmTasksFromSupabase(): Promise<GroupKhatmTask[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('group_khatm_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      code: row.code,
      title: row.title,
      description: row.description,
      creatorId: row.creator_id,
      creatorName: row.creator_name,
      createdAt: row.created_at,
      targetDate: row.target_date,
      extendedDate: row.extended_date,
      type: row.type,
      targetSurah: row.target_surah,
      repetitionGoal: row.repetition_goal,
      status: row.status,
      assignments: row.assignments || [],
    }));
  } catch {
    return null;
  }
}
