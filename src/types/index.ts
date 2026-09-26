export type Language = 'en' | 'ar' | 'ur' | 'hi' | 'bn';

export type UserRole = 'user' | 'admin';

export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Qiyam';

export type PrayerStatus = 'on-time' | 'late' | 'missed' | 'qada';

export type IslamicPriority = 'fardh' | 'wajib' | 'sunnah' | 'nafl' | 'mubah';

export type LifeTaskCategory =
  | 'worship'
  | 'quran'
  | 'work'
  | 'family'
  | 'health'
  | 'charity'
  | 'finance'
  | 'personal';

export interface LocationConfig {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  language: Language;
  location: LocationConfig;
  calculationMethod: number; // 2: ISNA, 3: MWL, 4: Umm al-Qura, 5: Egyptian, 1: Karachi, etc.
  madhab: 'shafi' | 'hanafi';
  createdAt: string;
  lastActiveAt: string;
  isSuspended?: boolean;
}

export interface FamilyMember {
  id: string;
  parentId: string;
  name: string;
  relationship: 'child' | 'spouse' | 'parent';
  ageGroup: 'child' | 'teen' | 'adult';
  prayerStreak: number;
  quranProgress: number; // pages read or surahs memorized
  todayPrayers: Record<string, PrayerStatus | null>;
}

export interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Qiyam?: string;
  date: {
    gregorian: string;
    hijriDate: string;
    hijriMonthName: string;
    hijriYear: string;
    hijriDay: number;
  };
  source: string;
  [key: string]: any;
}

export interface PrayerLog {
  id: string;
  date: string; // YYYY-MM-DD
  prayer: PrayerName;
  status: PrayerStatus;
  profileId: string;
  timestamp: string;
}

export interface SunnahLog {
  id: string;
  date: string;
  prayerType: 'tahajjud' | 'duha' | 'witr' | 'rawatib';
  rakahs: number;
  profileId: string;
}

export interface QadaCounts {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface SurahMeta {
  number: number;
  name: string;
  arabicName: string;
  englishTranslation: string;
  totalVerses: number;
  revelationType: 'Meccan' | 'Medinan';
  juz: number;
}

export interface HifzRecord {
  surahNumber: number;
  status: 'not-started' | 'in-progress' | 'memorized' | 'needs-revision';
  lastRevisedAt?: string;
  nextRevisionDue?: string;
  masteryLevel: number; // 0 to 5
  notes?: string;
}

export interface QuranReadingLog {
  id: string;
  date: string;
  pagesRead: number;
  juz: number;
  notes?: string;
}

export interface KhatmGoal {
  targetPagesPerDay: number;
  currentPagesRead: number;
  totalPages: number; // 604
  startDate: string;
  targetFinishDate: string;
}

export interface Habit {
  id: string;
  name: string;
  nameArabic?: string;
  category: 'spiritual' | 'general';
  lifeCategory?: LifeTaskCategory;
  priorityTag?: IslamicPriority;
  frequency?: 'daily' | 'weekdays' | 'weekends' | 'custom';
  targetDaysPerWeek?: number;
  description?: string;
  streak: number;
  logs: Record<string, boolean>; // date -> completed
}

export interface TodoItem {
  id: string;
  title: string;
  priorityTag: IslamicPriority;
  dueDate: string;
  completed: boolean;
  category: LifeTaskCategory | string;
  completedAt?: string;
}

export interface PlannedBlock {
  id: string;
  title: string;
  prayerAnchor: PrayerName;
  offsetMinutes: number; // e.g. +30 mins after prayer, -15 mins before
  durationMinutes: number;
  priorityTag: IslamicPriority;
  category?: LifeTaskCategory;
  date?: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  completionNote?: string;
}

export interface RamadanDayRecord {
  day: number; // 1 to 30
  date: string;
  fasted: 'yes' | 'no' | 'excused';
  taraweehAttended: boolean;
  taraweehRakahs: number;
  juzRead: number;
  dhikrDone: boolean;
  charityGiven: number;
  notes?: string;
}

export interface RamadanGoals {
  targetKhatmCount: number;
  currentKhatmJuz: number;
  taraweehTargetNights: number;
  completedTaraweehNights: number;
  targetSadaqahAmount: number;
  currentSadaqahAmount: number;
}

export interface TaraweehLog {
  id: string;
  date: string;
  mosque: string;
  rakahs: number;
  juzCovered: number;
  notes?: string;
}

export interface IftarMealItem {
  id: string;
  title: string;
  description: string;
  sunnahItem: boolean;
  ingredients: string[];
  guests: number;
}

export interface FidyaCalculation {
  daysMissed: number;
  reason: 'medical' | 'elderly' | 'pregnancy' | 'travel';
  ratePerDay: number;
  currency: string;
}

export interface RamadanJournalEntry {
  day: number;
  date: string;
  prompt: string;
  gratitude: string;
  reflection: string;
}

export interface EidChecklist {
  zakatFitrPaid: boolean;
  zakatFitrAmount: number;
  outfitReady: boolean;
  prayerLocation: string;
  prayerTime: string;
  giftsPlanned: { id: string; recipient: string; gift: string; ready: boolean }[];
}

export interface ZakatCalculation {
  id: string;
  date: string;
  cash: number;
  goldGrams: number;
  goldPricePerGram: number;
  silverGrams: number;
  silverPricePerGram: number;
  investments: number;
  businessInventory: number;
  debts: number;
  nisabType: 'gold' | 'silver';
  nisabThreshold: number;
  netZakatable: number;
  zakatDue: number;
  currency: string;
}

export interface SadaqahEntry {
  id: string;
  date: string;
  amount: number;
  cause: string;
  recipient: string;
  note: string;
  currency: string;
}

export interface CharityGoal {
  targetAmount: number;
  period: 'monthly' | 'annual';
  currentAmount: number;
  currency: string;
}

export interface GroupKhatmTask {
  id: string;
  code: string;
  title: string;
  description: string;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  targetDate: string;
  extendedDate?: string;
  type: 'para' | 'surah_repetition';
  targetSurah?: string;
  repetitionGoal?: number;
  status: 'active' | 'completed' | 'expired' | 'closed';
  assignments: KhatmAssignment[];
}

export interface KhatmAssignment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  paraNumber?: number; // 1 to 30
  repetitionCount?: number;
  status: 'claimed' | 'completed';
  updatedAt: string;
}

export interface DhikrPreset {
  key: string;
  arabic: string;
  transliteration: string;
  translation: string;
  defaultTarget: number;
}

export interface TasbihSession {
  id: string;
  dhikrKey: string;
  count: number;
  target: number;
  date: string;
}

export interface DailyReflection {
  date: string;
  gratitude: string;
  niyyah: string;
  reflection: string;
}

export interface AdminAuditLog {
  id: string;
  adminEmail: string;
  actionType: string;
  targetTable: string;
  targetId: string;
  timestamp: string;
  notes: string;
}
