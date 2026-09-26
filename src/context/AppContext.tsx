import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  Language,
  PrayerTimesData,
  PrayerName,
  PrayerStatus,
  PrayerLog,
  SunnahLog,
  QadaCounts,
  QuranReadingLog,
  KhatmGoal,
  HifzRecord,
  Habit,
  TodoItem,
  PlannedBlock,
  RamadanDayRecord,
  RamadanGoals,
  TaraweehLog,
  IftarMealItem,
  FidyaCalculation,
  RamadanJournalEntry,
  EidChecklist,
  ZakatCalculation,
  SadaqahEntry,
  CharityGoal,
  GroupKhatmTask,
  FamilyMember,
  TasbihSession,
  DhikrPreset,
  DailyReflection,
  AdminAuditLog,
  LocationConfig,
} from '../types';
import { fetchPrayerTimes, getNextPrayerInfo, NextPrayerInfo, POPULAR_LOCATIONS } from '../services/prayerService';
import { SURAHS_LIST } from '../services/quranData';

interface AppContextType {
  // User & Auth
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  setCurrentUser: (user: UserProfile | null) => void;
  loginAs: (email: string, role?: 'user' | 'admin') => void;
  signUpUser: (name: string, email: string, language: Language, location: LocationConfig, method: number, madhab: 'shafi' | 'hanafi') => void;
  signOut: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // Language & Localization
  language: Language;
  setLanguage: (lang: Language) => void;

  // Prayer & Times
  prayerTimes: PrayerTimesData | null;
  nextPrayerInfo: NextPrayerInfo | null;
  refreshPrayerTimes: () => Promise<void>;
  prayerLogs: PrayerLog[];
  logPrayer: (prayer: PrayerName, status: PrayerStatus) => void;
  prayerStreak: number;
  qadaCounts: QadaCounts;
  adjustQada: (prayer: keyof QadaCounts, delta: number) => void;
  sunnahLogs: SunnahLog[];
  logSunnah: (type: 'tahajjud' | 'duha' | 'witr' | 'rawatib', rakahs: number) => void;

  // Quran & Hifz
  readingLogs: QuranReadingLog[];
  logQuranReading: (pages: number, juz: number, notes?: string) => void;
  khatmGoal: KhatmGoal;
  updateKhatmGoal: (pagesPerDay: number) => void;
  hifzRecords: Record<number, HifzRecord>;
  updateHifzStatus: (surahNumber: number, status: HifzRecord['status'], mastery?: number) => void;

  // Productivity & Planner
  plannedBlocks: PlannedBlock[];
  addPlannedBlock: (block: Omit<PlannedBlock, 'id'>) => void;
  updatePlannedBlock: (id: string, updates: Partial<PlannedBlock>) => void;
  togglePlannedBlock: (id: string) => void;
  deletePlannedBlock: (id: string) => void;
  habits: Habit[];
  toggleHabit: (id: string, dateStr?: string) => void;
  addHabit: (name: string, category: 'spiritual' | 'general', extra?: Partial<Habit>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  todos: TodoItem[];
  addTodo: (todo: Omit<TodoItem, 'id'>) => void;
  updateTodo: (id: string, updates: Partial<TodoItem>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;

  // Ramadan Module
  ramadanDays: RamadanDayRecord[];
  updateRamadanDay: (day: number, updates: Partial<RamadanDayRecord>) => void;
  ramadanGoals: RamadanGoals;
  updateRamadanGoals: (goals: Partial<RamadanGoals>) => void;
  taraweehLogs: TaraweehLog[];
  addTaraweehLog: (log: Omit<TaraweehLog, 'id'>) => void;
  iftarMeals: IftarMealItem[];
  addIftarMeal: (meal: Omit<IftarMealItem, 'id'>) => void;
  deleteIftarMeal: (id: string) => void;
  fidyaSettings: FidyaCalculation;
  updateFidyaSettings: (settings: Partial<FidyaCalculation>) => void;
  ramadanJournals: RamadanJournalEntry[];
  saveRamadanJournal: (day: number, prompt: string, gratitude: string, reflection: string) => void;
  eidChecklist: EidChecklist;
  updateEidChecklist: (updates: Partial<EidChecklist>) => void;

  // Zakat & Charity
  zakatCalculations: ZakatCalculation[];
  saveZakatCalculation: (calc: Omit<ZakatCalculation, 'id'>) => void;
  sadaqahLogs: SadaqahEntry[];
  addSadaqah: (entry: Omit<SadaqahEntry, 'id'>) => void;
  charityGoal: CharityGoal;
  updateCharityGoal: (goal: Partial<CharityGoal>) => void;

  // Reflection & Tasbih
  dhikrPresets: DhikrPreset[];
  tasbihCount: number;
  currentDhikrKey: string;
  setCurrentDhikrKey: (key: string) => void;
  incrementTasbih: () => void;
  resetTasbih: () => void;
  dailyReflections: Record<string, DailyReflection>;
  saveDailyReflection: (date: string, reflection: DailyReflection) => void;

  // Group Khatm
  groupTasks: GroupKhatmTask[];
  createGroupTask: (title: string, description: string, type: 'para' | 'surah_repetition', targetDate: string, targetSurah?: string, repetitionGoal?: number) => { success: boolean; error?: string };
  claimGroupTaskPortion: (taskId: string, paraNumber?: number, repetitionCount?: number) => void;
  completeGroupTaskPortion: (taskId: string, assignmentId: string) => void;
  extendGroupTaskDeadline: (taskId: string, newDate: string) => void;
  closeGroupTask: (taskId: string) => void;

  // Family Mode
  familyMembers: FamilyMember[];
  activeFamilyMemberId: string | null; // null = parent user
  setActiveFamilyMemberId: (id: string | null) => void;
  addFamilyMember: (name: string, relationship: 'child' | 'spouse' | 'parent', ageGroup: 'child' | 'teen' | 'adult') => void;
  logFamilyMemberPrayer: (memberId: string, prayer: PrayerName, status: PrayerStatus) => void;

  // Admin Tools
  adminLogs: AdminAuditLog[];
  logAdminAction: (actionType: string, targetTable: string, targetId: string, notes: string) => void;
  toggleUserSuspension: (userId: string) => void;
  promoteUserRole: (userId: string, role: 'user' | 'admin') => void;
  deleteUser: (userId: string) => void;
  adminDeleteGroupTask: (taskId: string) => void;

  // In-App Notifications
  activeNotification: string | null;
  showNotification: (msg: string) => void;
  dismissNotification: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_default_01',
  name: 'Tariq Al-Mansoor',
  email: 'tariq@barakahdaily.com',
  role: 'user',
  language: 'en',
  location: POPULAR_LOCATIONS[0], // London
  calculationMethod: 2, // ISNA
  madhab: 'shafi',
  createdAt: '2026-01-15T08:00:00Z',
  lastActiveAt: new Date().toISOString(),
};

const DEFAULT_ADMIN: UserProfile = {
  id: 'usr_admin_01',
  name: 'Ghibli Operator',
  email: 'admin@barakahdaily.com',
  role: 'admin',
  language: 'en',
  location: POPULAR_LOCATIONS[2], // Makkah
  calculationMethod: 4, // Umm al-Qura
  madhab: 'hanafi',
  createdAt: '2025-11-01T00:00:00Z',
  lastActiveAt: new Date().toISOString(),
};

const DHIKR_PRESETS: DhikrPreset[] = [
  { key: 'subhanallah', arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'SubhanAllah', translation: 'Glory be to Allah', defaultTarget: 33 },
  { key: 'alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', translation: 'All praise is due to Allah', defaultTarget: 33 },
  { key: 'allahuakbar', arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', translation: 'Allah is the Greatest', defaultTarget: 34 },
  { key: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah', translation: 'I seek forgiveness from Allah', defaultTarget: 100 },
  { key: 'salawat', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', transliteration: 'Allahumma Salli \'ala Muhammad', translation: 'Blessings upon the Prophet Muhammad', defaultTarget: 100 },
  { key: 'lailahaillallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illallah', translation: 'There is no god but Allah', defaultTarget: 100 },
  { key: 'hawqalah', arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', transliteration: 'La hawla wa la quwwata illa billah', translation: 'There is no might nor power except with Allah', defaultTarget: 33 },
];

const INITIAL_HABITS: Habit[] = [
  { id: 'h1', name: 'Fajr in Congregation', nameArabic: 'صلاة الفجر جماعة', category: 'spiritual', lifeCategory: 'worship', priorityTag: 'fardh', frequency: 'daily', targetDaysPerWeek: 7, streak: 12, logs: {} },
  { id: 'h2', name: 'Morning Adhkar & Surah Yasin', nameArabic: 'أذكار الصباح', category: 'spiritual', lifeCategory: 'worship', priorityTag: 'sunnah', frequency: 'daily', targetDaysPerWeek: 7, streak: 9, logs: {} },
  { id: 'h3', name: 'Qur\'an Reading (1 Juz)', nameArabic: 'تلاوة جزء من القرآن', category: 'spiritual', lifeCategory: 'quran', priorityTag: 'sunnah', frequency: 'daily', targetDaysPerWeek: 7, streak: 14, logs: {} },
  { id: 'h4', name: 'Evening Adhkar & Istighfar', nameArabic: 'أذكار المساء', category: 'spiritual', lifeCategory: 'worship', priorityTag: 'sunnah', frequency: 'daily', targetDaysPerWeek: 7, streak: 7, logs: {} },
  { id: 'h5', name: 'Physical Activity & 8k Steps', category: 'general', lifeCategory: 'health', priorityTag: 'mubah', frequency: 'weekdays', targetDaysPerWeek: 5, streak: 5, logs: {} },
  { id: 'h6', name: 'Islamic Book / Seerah Reading', category: 'general', lifeCategory: 'personal', priorityTag: 'nafl', frequency: 'daily', targetDaysPerWeek: 7, streak: 8, logs: {} },
];

const INITIAL_TODOS: TodoItem[] = [
  { id: 't1', title: 'Prepare for Friday Jumu\'ah prayer early', priorityTag: 'fardh', dueDate: '2026-09-25', completed: false, category: 'worship' },
  { id: 't2', title: 'Deliver groceries to elderly neighbor (Sadaqah)', priorityTag: 'wajib', dueDate: '2026-09-25', completed: true, category: 'charity', completedAt: '2026-09-25T14:30:00Z' },
  { id: 't3', title: 'Revise Surah Al-Kahf verses 1-20', priorityTag: 'sunnah', dueDate: '2026-09-26', completed: false, category: 'quran' },
  { id: 't4', title: 'Calculate Zakat al-Fitr for household', priorityTag: 'wajib', dueDate: '2026-09-28', completed: false, category: 'finance' },
  { id: 't5', title: 'Review quarterly client deliverables & halal invoices', priorityTag: 'mubah', dueDate: '2026-09-29', completed: false, category: 'work' },
];

const INITIAL_PLANNED_BLOCKS: PlannedBlock[] = [
  { id: 'p1', title: 'Post-Fajr Qur\'an recitation & contemplation', prayerAnchor: 'Fajr', offsetMinutes: 20, durationMinutes: 45, priorityTag: 'sunnah', category: 'quran', date: '2026-09-25', completed: true, completedAt: '2026-09-25T06:15:00Z' },
  { id: 'p2', title: 'Work deep focus session & client deliverables', prayerAnchor: 'Dhuhr', offsetMinutes: -120, durationMinutes: 90, priorityTag: 'mubah', category: 'work', date: '2026-09-25', completed: true, completedAt: '2026-09-25T11:45:00Z' },
  { id: 'p3', title: 'Dhuhr prayer in congregation & rawatib rak\'ahs', prayerAnchor: 'Dhuhr', offsetMinutes: 0, durationMinutes: 25, priorityTag: 'fardh', category: 'worship', date: '2026-09-25', completed: false },
  { id: 'p4', title: 'Afternoon client deliverables & email reviews', prayerAnchor: 'Asr', offsetMinutes: -60, durationMinutes: 50, priorityTag: 'mubah', category: 'work', date: '2026-09-25', completed: false },
  { id: 'p5', title: 'Family dinner & Maghrib reflection with children', prayerAnchor: 'Maghrib', offsetMinutes: 30, durationMinutes: 60, priorityTag: 'nafl', category: 'family', date: '2026-09-25', completed: false },
  { id: 'p6', title: 'Isha prayer, Surah Al-Mulk & bedtime du\'as', prayerAnchor: 'Isha', offsetMinutes: 15, durationMinutes: 35, priorityTag: 'fardh', category: 'worship', date: '2026-09-25', completed: false },
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current user & authentication
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('bd_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>([DEFAULT_USER, DEFAULT_ADMIN]);

  const [language, setLanguage] = useState<Language>(() => {
    return currentUser?.language || 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' || language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Prayer times
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<NextPrayerInfo | null>(null);

  // Prayer Tracker
  const [prayerLogs, setPrayerLogs] = useState<PrayerLog[]>(() => {
    const saved = localStorage.getItem('bd_prayer_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [qadaCounts, setQadaCounts] = useState<QadaCounts>(() => {
    const saved = localStorage.getItem('bd_qada');
    return saved ? JSON.parse(saved) : { fajr: 3, dhuhr: 1, asr: 2, maghrib: 0, isha: 4 };
  });

  const [sunnahLogs, setSunnahLogs] = useState<SunnahLog[]>(() => {
    const saved = localStorage.getItem('bd_sunnah_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Quran
  const [readingLogs, setReadingLogs] = useState<QuranReadingLog[]>(() => {
    const saved = localStorage.getItem('bd_reading_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'r1', date: '2026-09-24', pagesRead: 20, juz: 1, notes: 'Completed Juz 1 after Fajr' },
      { id: 'r2', date: '2026-09-25', pagesRead: 15, juz: 2, notes: 'Surah Al-Baqarah verses 142-200' },
    ];
  });

  const [khatmGoal, setKhatmGoal] = useState<KhatmGoal>(() => {
    const saved = localStorage.getItem('bd_khatm_goal');
    return saved ? JSON.parse(saved) : {
      targetPagesPerDay: 20,
      currentPagesRead: 185,
      totalPages: 604,
      startDate: '2026-09-01',
      targetFinishDate: '2026-10-01',
    };
  });

  const [hifzRecords, setHifzRecords] = useState<Record<number, HifzRecord>>(() => {
    const saved = localStorage.getItem('bd_hifz');
    if (saved) return JSON.parse(saved);
    return {
      1: { surahNumber: 1, status: 'memorized', masteryLevel: 5, lastRevisedAt: '2026-09-24', nextRevisionDue: '2026-10-24' },
      67: { surahNumber: 67, status: 'memorized', masteryLevel: 4, lastRevisedAt: '2026-09-20', nextRevisionDue: '2026-09-27' },
      97: { surahNumber: 97, status: 'memorized', masteryLevel: 5, lastRevisedAt: '2026-09-22', nextRevisionDue: '2026-10-22' },
      112: { surahNumber: 112, status: 'memorized', masteryLevel: 5, lastRevisedAt: '2026-09-25', nextRevisionDue: '2026-10-25' },
      113: { surahNumber: 113, status: 'memorized', masteryLevel: 5, lastRevisedAt: '2026-09-25', nextRevisionDue: '2026-10-25' },
      114: { surahNumber: 114, status: 'memorized', masteryLevel: 5, lastRevisedAt: '2026-09-25', nextRevisionDue: '2026-10-25' },
      36: { surahNumber: 36, status: 'in-progress', masteryLevel: 2, lastRevisedAt: '2026-09-23', nextRevisionDue: '2026-09-26' },
      18: { surahNumber: 18, status: 'needs-revision', masteryLevel: 3, lastRevisedAt: '2026-09-15', nextRevisionDue: '2026-09-22' },
    };
  });

  // Productivity
  const [plannedBlocks, setPlannedBlocks] = useState<PlannedBlock[]>(() => {
    const saved = localStorage.getItem('bd_blocks');
    const today = new Date().toISOString().split('T')[0];
    if (saved) {
      try {
        const parsed: PlannedBlock[] = JSON.parse(saved);
        return parsed.map((b) => ({ ...b, date: b.date || today }));
      } catch (e) {
        console.error('Failed to parse saved blocks', e);
      }
    }
    return INITIAL_PLANNED_BLOCKS;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('bd_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const saved = localStorage.getItem('bd_todos');
    return saved ? JSON.parse(saved) : INITIAL_TODOS;
  });

  // Ramadan Module
  const [ramadanDays, setRamadanDays] = useState<RamadanDayRecord[]>(() => {
    const saved = localStorage.getItem('bd_ramadan_days');
    if (saved) return JSON.parse(saved);
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      date: `Day ${i + 1}`,
      fasted: i < 5 ? 'yes' : i === 5 ? 'excused' : 'no',
      taraweehAttended: i < 5,
      taraweehRakahs: i < 5 ? (i % 2 === 0 ? 20 : 8) : 0,
      juzRead: i < 5 ? 1 : 0,
      dhikrDone: i < 5,
      charityGiven: i < 5 ? 25 : 0,
    }));
  });

  const [ramadanGoals, setRamadanGoals] = useState<RamadanGoals>(() => {
    const saved = localStorage.getItem('bd_ramadan_goals');
    return saved ? JSON.parse(saved) : {
      targetKhatmCount: 1,
      currentKhatmJuz: 12,
      taraweehTargetNights: 30,
      completedTaraweehNights: 12,
      targetSadaqahAmount: 500,
      currentSadaqahAmount: 220,
    };
  });

  const [taraweehLogs, setTaraweehLogs] = useState<TaraweehLog[]>([
    { id: 'tr1', date: '2026-09-24', mosque: 'Central Mosque', rakahs: 20, juzCovered: 1, notes: 'Imam recited beautifully from Surah Al-Baqarah' },
  ]);

  const [iftarMeals, setIftarMeals] = useState<IftarMealItem[]>([
    { id: 'm1', title: 'Sunnah Opening: Medjool Dates & Zamzam', description: 'Break fast following prophetic tradition with fresh dates and water', sunnahItem: true, ingredients: ['Medjool dates', 'Fresh water', 'Zamzam'], guests: 4 },
    { id: 'm2', title: 'Traditional Harira / Lentil Soup', description: 'Nourishing warm spiced broth with chickpeas and fresh herbs', sunnahItem: false, ingredients: ['Lentils', 'Tomatoes', 'Chickpeas', 'Coriander', 'Cumin'], guests: 6 },
    { id: 'm3', title: 'Grilled Lemon Herb Chicken & Basmati Rice', description: 'Lean protein meal balanced with fragrant long-grain saffron rice', sunnahItem: false, ingredients: ['Chicken breast', 'Basmati rice', 'Olive oil', 'Garlic', 'Yogurt'], guests: 6 },
  ]);

  const [fidyaSettings, setFidyaSettings] = useState<FidyaCalculation>({
    daysMissed: 3,
    reason: 'medical',
    ratePerDay: 12,
    currency: 'USD',
  });

  const [ramadanJournals, setRamadanJournals] = useState<RamadanJournalEntry[]>([
    {
      day: 1,
      date: '2026-09-20',
      prompt: 'What was your primary intention (Niyyah) when entering this blessed month?',
      gratitude: 'Grateful for health and another chance to witness the holy days.',
      reflection: 'Felt a deep sense of stillness after Fajr. Set my heart on completing the full Qur\'an.'
    }
  ]);

  const [eidChecklist, setEidChecklist] = useState<EidChecklist>({
    zakatFitrPaid: false,
    zakatFitrAmount: 15,
    outfitReady: true,
    prayerLocation: 'Community Eid Gah / Sports Arena',
    prayerTime: '07:30 AM',
    giftsPlanned: [
      { id: 'g1', recipient: 'Mother & Father', gift: 'Fragrance & prayer mat', ready: true },
      { id: 'g2', recipient: 'Children', gift: 'Eidi money envelopes & books', ready: false },
    ],
  });

  // Zakat & Charity
  const [zakatCalculations, setZakatCalculations] = useState<ZakatCalculation[]>([
    {
      id: 'zk_2025',
      date: '2025-04-10',
      cash: 14500,
      goldGrams: 40,
      goldPricePerGram: 78,
      silverGrams: 0,
      silverPricePerGram: 0.95,
      investments: 6200,
      businessInventory: 0,
      debts: 1800,
      nisabType: 'gold',
      nisabThreshold: 6823,
      netZakatable: 22020,
      zakatDue: 550.5,
      currency: 'USD',
    }
  ]);

  const [sadaqahLogs, setSadaqahLogs] = useState<SadaqahEntry[]>([
    { id: 's1', date: '2026-09-20', amount: 50, cause: 'Clean Water Well Project', recipient: 'Islamic Relief', note: 'Given with intention of ongoing charity (Sadaqah Jariyah)', currency: 'USD' },
    { id: 's2', date: '2026-09-24', amount: 30, cause: 'Orphan Sponsorship Support', recipient: 'Local Community Waqf', note: 'Monthly pledge fulfilled', currency: 'USD' },
  ]);

  const [charityGoal, setCharityGoal] = useState<CharityGoal>({
    targetAmount: 1200,
    period: 'annual',
    currentAmount: 480,
    currency: 'USD',
  });

  // Reflection & Tasbih
  const [dhikrPresets] = useState<DhikrPreset[]>(DHIKR_PRESETS);
  const [currentDhikrKey, setCurrentDhikrKey] = useState<string>('subhanallah');
  const [tasbihCount, setTasbihCount] = useState<number>(14);
  const [dailyReflections, setDailyReflections] = useState<Record<string, DailyReflection>>({});

  // Group Khatm Tasks
  const [groupTasks, setGroupTasks] = useState<GroupKhatmTask[]>([
    {
      id: 'tsk_001',
      code: 'BARAKH',
      title: 'Family Ramadan Complete Qur\'an Khatm',
      description: 'Let us unite as a community to complete all 30 Para in devotion and peace.',
      creatorId: 'usr_default_01',
      creatorName: 'Tariq Al-Mansoor',
      createdAt: '2026-09-20',
      targetDate: '2026-10-10',
      type: 'para',
      status: 'active',
      assignments: [
        { id: 'as1', taskId: 'tsk_001', userId: 'usr_default_01', userName: 'Tariq Al-Mansoor', paraNumber: 1, status: 'completed', updatedAt: '2026-09-22' },
        { id: 'as2', taskId: 'tsk_001', userId: 'usr_default_01', userName: 'Tariq Al-Mansoor', paraNumber: 2, status: 'claimed', updatedAt: '2026-09-23' },
        { id: 'as3', taskId: 'tsk_001', userId: 'usr_02', userName: 'Fatima Z.', paraNumber: 3, status: 'claimed', updatedAt: '2026-09-23' },
        { id: 'as4', taskId: 'tsk_001', userId: 'usr_03', userName: 'Zayd M.', paraNumber: 4, status: 'claimed', updatedAt: '2026-09-24' },
      ],
    },
    {
      id: 'tsk_002',
      code: 'YASIN7',
      title: 'Surah Ya-Sin 121x Repetitions for Shifa & Barakah',
      description: 'Reciting Surah Ya-Sin collectively for our family members in illness.',
      creatorId: 'usr_default_01',
      creatorName: 'Tariq Al-Mansoor',
      createdAt: '2026-09-22',
      targetDate: '2026-09-30',
      type: 'surah_repetition',
      targetSurah: 'Ya-Sin (Surah 36)',
      repetitionGoal: 121,
      status: 'active',
      assignments: [
        { id: 'as5', taskId: 'tsk_002', userId: 'usr_default_01', userName: 'Tariq Al-Mansoor', repetitionCount: 20, status: 'completed', updatedAt: '2026-09-23' },
        { id: 'as6', taskId: 'tsk_002', userId: 'usr_04', userName: 'Hamza K.', repetitionCount: 15, status: 'completed', updatedAt: '2026-09-24' },
        { id: 'as7', taskId: 'tsk_002', userId: 'usr_05', userName: 'Amina S.', repetitionCount: 25, status: 'claimed', updatedAt: '2026-09-24' },
      ],
    }
  ]);

  // Family Mode
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: 'fam_1',
      parentId: 'usr_default_01',
      name: 'Yusuf (Age 10)',
      relationship: 'child',
      ageGroup: 'child',
      prayerStreak: 8,
      quranProgress: 45,
      todayPrayers: { Fajr: 'on-time', Dhuhr: 'on-time', Asr: 'on-time', Maghrib: null, Isha: null },
    },
    {
      id: 'fam_2',
      parentId: 'usr_default_01',
      name: 'Maryam (Age 14)',
      relationship: 'child',
      ageGroup: 'teen',
      prayerStreak: 15,
      quranProgress: 120,
      todayPrayers: { Fajr: 'on-time', Dhuhr: 'on-time', Asr: 'late', Maghrib: null, Isha: null },
    }
  ]);
  const [activeFamilyMemberId, setActiveFamilyMemberId] = useState<string | null>(null);

  // Admin Audit Log
  const [adminLogs, setAdminLogs] = useState<AdminAuditLog[]>([
    { id: 'aud_1', adminEmail: 'admin@barakahdaily.com', actionType: 'SYSTEM_BOOT', targetTable: 'system', targetId: 'sys_01', timestamp: '2026-09-25T00:00:00Z', notes: 'Platform initialization verified' },
    { id: 'aud_2', adminEmail: 'admin@barakahdaily.com', actionType: 'EXTEND_DEADLINE', targetTable: 'khatm_tasks', targetId: 'tsk_001', timestamp: '2026-09-24T14:30:00Z', notes: 'Operator extended task target date to 2026-10-10' },
  ]);

  // Notifications
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const dismissNotification = () => setActiveNotification(null);

  // Load prayer times
  const refreshPrayerTimes = async () => {
    if (!currentUser) return;
    try {
      const times = await fetchPrayerTimes(
        currentUser.location,
        currentUser.calculationMethod,
        currentUser.madhab
      );
      setPrayerTimes(times);
      setNextPrayerInfo(getNextPrayerInfo(times));
    } catch (e) {
      console.error('Failed to load prayer times:', e);
    }
  };

  useEffect(() => {
    refreshPrayerTimes();
    const interval = setInterval(() => {
      if (prayerTimes) {
        setNextPrayerInfo(getNextPrayerInfo(prayerTimes));
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [currentUser?.location, currentUser?.calculationMethod, currentUser?.madhab]);

  // Persistence to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bd_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('bd_prayer_logs', JSON.stringify(prayerLogs));
  }, [prayerLogs]);

  useEffect(() => {
    localStorage.setItem('bd_qada', JSON.stringify(qadaCounts));
  }, [qadaCounts]);

  useEffect(() => {
    localStorage.setItem('bd_reading_logs', JSON.stringify(readingLogs));
  }, [readingLogs]);

  useEffect(() => {
    localStorage.setItem('bd_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('bd_todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('bd_blocks', JSON.stringify(plannedBlocks));
  }, [plannedBlocks]);

  // Authentication Handlers
  const loginAs = (email: string, role: 'user' | 'admin' = 'user') => {
    const existing = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      setLanguage(existing.language);
      showNotification(`Signed in successfully as ${existing.name}`);
    } else {
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: role,
        language: 'en',
        location: POPULAR_LOCATIONS[0],
        calculationMethod: 2,
        madhab: 'shafi',
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };
      setAllUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      showNotification(`Account created and signed in as ${newUser.name}`);
    }
  };

  const signUpUser = (
    name: string,
    email: string,
    lang: Language,
    location: LocationConfig,
    method: number,
    madhab: 'shafi' | 'hanafi'
  ) => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'user',
      language: lang,
      location,
      calculationMethod: method,
      madhab,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setLanguage(lang);
    showNotification(`Welcome to BarakahDaily, ${name}!`);
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('bd_user');
    showNotification('Signed out successfully.');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates, lastActiveAt: new Date().toISOString() };
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    if (updates.language) {
      setLanguage(updates.language);
    }
    showNotification('Profile updated successfully.');
  };

  // Prayer actions
  const logPrayer = (prayer: PrayerName, status: PrayerStatus) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: PrayerLog = {
      id: `log_${Date.now()}`,
      date: today,
      prayer,
      status,
      profileId: activeFamilyMemberId || currentUser?.id || 'usr_0',
      timestamp: new Date().toISOString(),
    };
    setPrayerLogs((prev) => [...prev.filter((l) => !(l.date === today && l.prayer === prayer && l.profileId === newLog.profileId)), newLog]);
    showNotification(`${prayer} recorded as ${status}`);
  };

  const prayerStreak = 14;

  const adjustQada = (prayer: keyof QadaCounts, delta: number) => {
    setQadaCounts((prev) => {
      const newVal = Math.max(0, prev[prayer] + delta);
      return { ...prev, [prayer]: newVal };
    });
    if (delta < 0) {
      showNotification(`Alhamdulillah! Recorded 1 made-up Qada prayer.`);
    }
  };

  const logSunnah = (type: 'tahajjud' | 'duha' | 'witr' | 'rawatib', rakahs: number) => {
    const newLog: SunnahLog = {
      id: `sn_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      prayerType: type,
      rakahs,
      profileId: activeFamilyMemberId || currentUser?.id || 'usr_0',
    };
    setSunnahLogs((prev) => [newLog, ...prev]);
    showNotification(`Logged ${rakahs} rak'ahs for ${type}. May Allah accept.`);
  };

  // Quran actions
  const logQuranReading = (pages: number, juz: number, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: QuranReadingLog = {
      id: `qr_${Date.now()}`,
      date: today,
      pagesRead: pages,
      juz,
      notes,
    };
    setReadingLogs((prev) => [newLog, ...prev]);
    setKhatmGoal((prev) => {
      const updatedRead = Math.min(604, prev.currentPagesRead + pages);
      return { ...prev, currentPagesRead: updatedRead };
    });
    showNotification(`Logged ${pages} pages read. Khatm progress updated!`);
  };

  const updateKhatmGoal = (pagesPerDay: number) => {
    setKhatmGoal((prev) => {
      const remaining = 604 - prev.currentPagesRead;
      const daysNeeded = Math.ceil(remaining / pagesPerDay);
      const finishDate = new Date();
      finishDate.setDate(finishDate.getDate() + daysNeeded);
      return {
        ...prev,
        targetPagesPerDay: pagesPerDay,
        targetFinishDate: finishDate.toISOString().split('T')[0],
      };
    });
    showNotification(`Daily target updated to ${pagesPerDay} pages/day.`);
  };

  const updateHifzStatus = (surahNumber: number, status: HifzRecord['status'], mastery = 3) => {
    const now = new Date();
    const nextDue = new Date(now);
    nextDue.setDate(nextDue.getDate() + (status === 'memorized' ? 14 : 3));
    
    setHifzRecords((prev) => ({
      ...prev,
      [surahNumber]: {
        surahNumber,
        status,
        masteryLevel: mastery,
        lastRevisedAt: now.toISOString().split('T')[0],
        nextRevisionDue: nextDue.toISOString().split('T')[0],
      },
    }));
    showNotification(`Surah status updated to ${status}.`);
  };

  // Productivity
  const addPlannedBlock = (block: Omit<PlannedBlock, 'id'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newBlock: PlannedBlock = {
      ...block,
      date: block.date || today,
      id: `blk_${Date.now()}`,
    };
    setPlannedBlocks((prev) => [...prev, newBlock]);
    showNotification(`Added "${block.title}" around ${block.prayerAnchor}`);
  };

  const updatePlannedBlock = (id: string, updates: Partial<PlannedBlock>) => {
    setPlannedBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    showNotification('Planned task updated.');
  };

  const togglePlannedBlock = (id: string) => {
    setPlannedBlocks((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const willBeCompleted = !b.completed;
          return {
            ...b,
            completed: willBeCompleted,
            completedAt: willBeCompleted ? new Date().toISOString() : undefined,
          };
        }
        return b;
      })
    );
  };

  const deletePlannedBlock = (id: string) => {
    setPlannedBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleHabit = (id: string, dateStr?: string) => {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const currentVal = !!h.logs[targetDate];
          const newLogs = { ...h.logs, [targetDate]: !currentVal };
          const newStreak = !currentVal ? h.streak + 1 : Math.max(0, h.streak - 1);
          return { ...h, logs: newLogs, streak: newStreak };
        }
        return h;
      })
    );
  };

  const addHabit = (name: string, category: 'spiritual' | 'general', extra?: Partial<Habit>) => {
    const today = new Date().toISOString().split('T')[0];
    const newH: Habit = {
      id: `hb_${Date.now()}`,
      name,
      category,
      lifeCategory: extra?.lifeCategory || (category === 'spiritual' ? 'worship' : 'personal'),
      priorityTag: extra?.priorityTag || (category === 'spiritual' ? 'sunnah' : 'mubah'),
      frequency: extra?.frequency || 'daily',
      targetDaysPerWeek: extra?.targetDaysPerWeek || 7,
      nameArabic: extra?.nameArabic,
      description: extra?.description,
      streak: 1,
      logs: { [today]: true },
    };
    setHabits((prev) => [...prev, newH]);
    showNotification(`Habit "${name}" created.`);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
    showNotification('Habit updated.');
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    showNotification('Habit deleted.');
  };

  const addTodo = (todo: Omit<TodoItem, 'id'>) => {
    const newTodo: TodoItem = { ...todo, id: `td_${Date.now()}` };
    setTodos((prev) => [newTodo, ...prev]);
    showNotification(`Task added with ${todo.priorityTag.toUpperCase()} priority.`);
  };

  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showNotification('To-do task updated.');
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const willBeCompleted = !t.completed;
          return {
            ...t,
            completed: willBeCompleted,
            completedAt: willBeCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Ramadan
  const updateRamadanDay = (day: number, updates: Partial<RamadanDayRecord>) => {
    setRamadanDays((prev) =>
      prev.map((d) => (d.day === day ? { ...d, ...updates } : d))
    );
  };

  const updateRamadanGoals = (goals: Partial<RamadanGoals>) => {
    setRamadanGoals((prev) => ({ ...prev, ...goals }));
    showNotification('Ramadan goals updated.');
  };

  const addTaraweehLog = (log: Omit<TaraweehLog, 'id'>) => {
    const item: TaraweehLog = { ...log, id: `tr_${Date.now()}` };
    setTaraweehLogs((prev) => [item, ...prev]);
    setRamadanGoals((prev) => ({ ...prev, completedTaraweehNights: prev.completedTaraweehNights + 1 }));
    showNotification(`Recorded ${log.rakahs} rak'ahs Taraweeh at ${log.mosque}.`);
  };

  const addIftarMeal = (meal: Omit<IftarMealItem, 'id'>) => {
    const item: IftarMealItem = { ...meal, id: `m_${Date.now()}` };
    setIftarMeals((prev) => [...prev, item]);
    showNotification(`Added ${meal.title} to Iftar planner.`);
  };

  const deleteIftarMeal = (id: string) => {
    setIftarMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const updateFidyaSettings = (settings: Partial<FidyaCalculation>) => {
    setFidyaSettings((prev) => ({ ...prev, ...settings }));
  };

  const saveRamadanJournal = (day: number, prompt: string, gratitude: string, reflection: string) => {
    const date = new Date().toISOString().split('T')[0];
    const newEntry: RamadanJournalEntry = { day, date, prompt, gratitude, reflection };
    setRamadanJournals((prev) => [...prev.filter((j) => j.day !== day), newEntry]);
    showNotification(`Ramadan Day ${day} journal saved.`);
  };

  const updateEidChecklist = (updates: Partial<EidChecklist>) => {
    setEidChecklist((prev) => ({ ...prev, ...updates }));
  };

  // Zakat
  const saveZakatCalculation = (calc: Omit<ZakatCalculation, 'id'>) => {
    const newCalc: ZakatCalculation = { ...calc, id: `zk_${Date.now()}` };
    setZakatCalculations((prev) => [newCalc, ...prev]);
    showNotification(`Zakat calculation saved: ${calc.currency} ${calc.zakatDue.toFixed(2)} due.`);
  };

  const addSadaqah = (entry: Omit<SadaqahEntry, 'id'>) => {
    const newEntry: SadaqahEntry = { ...entry, id: `sd_${Date.now()}` };
    setSadaqahLogs((prev) => [newEntry, ...prev]);
    setCharityGoal((prev) => ({ ...prev, currentAmount: prev.currentAmount + entry.amount }));
    showNotification(`Logged charity of ${entry.currency} ${entry.amount}. May Allah bless your wealth.`);
  };

  const updateCharityGoal = (goal: Partial<CharityGoal>) => {
    setCharityGoal((prev) => ({ ...prev, ...goal }));
    showNotification('Charity goal updated.');
  };

  // Tasbih
  const incrementTasbih = () => {
    setTasbihCount((prev) => prev + 1);
  };

  const resetTasbih = () => {
    setTasbihCount(0);
    showNotification('Tasbih counter reset.');
  };

  const saveDailyReflection = (date: string, reflection: DailyReflection) => {
    setDailyReflections((prev) => ({ ...prev, [date]: reflection }));
    showNotification('Daily intention & gratitude saved.');
  };

  // Group Khatm Tasks
  const createGroupTask = (
    title: string,
    description: string,
    type: 'para' | 'surah_repetition',
    targetDate: string,
    targetSurah?: string,
    repetitionGoal?: number
  ) => {
    if (!currentUser) return { success: false, error: 'Must be signed in' };

    // PRD: "Each user may have a maximum of 2 active khatm tasks at a time (as creator)"
    const userActiveTasks = groupTasks.filter(
      (t) => t.creatorId === currentUser.id && t.status === 'active'
    );
    if (userActiveTasks.length >= 2) {
      return { success: false, error: 'Maximum 2 active Group Khatm tasks permitted per creator.' };
    }

    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newTask: GroupKhatmTask = {
      id: `tsk_${Date.now()}`,
      code: randomCode,
      title,
      description,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      createdAt: new Date().toISOString().split('T')[0],
      targetDate,
      type,
      targetSurah,
      repetitionGoal,
      status: 'active',
      assignments: [],
    };

    setGroupTasks((prev) => [newTask, ...prev]);
    showNotification(`Group Khatm created with join code: ${randomCode}`);
    return { success: true };
  };

  const claimGroupTaskPortion = (taskId: string, paraNumber?: number, repetitionCount?: number) => {
    if (!currentUser) return;
    setGroupTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newAssignment = {
            id: `as_${Date.now()}`,
            taskId,
            userId: currentUser.id,
            userName: currentUser.name,
            paraNumber,
            repetitionCount,
            status: 'claimed' as const,
            updatedAt: new Date().toISOString(),
          };
          return { ...t, assignments: [...t.assignments, newAssignment] };
        }
        return t;
      })
    );
    showNotification('Portion claimed successfully!');
  };

  const completeGroupTaskPortion = (taskId: string, assignmentId: string) => {
    setGroupTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedAssignments = t.assignments.map((a) =>
            a.id === assignmentId ? { ...a, status: 'completed' as const, updatedAt: new Date().toISOString() } : a
          );
          // Check if entire task is complete
          let isAllDone = false;
          if (t.type === 'para') {
            const completedParas = new Set(updatedAssignments.filter((a) => a.status === 'completed').map((a) => a.paraNumber));
            if (completedParas.size === 30) isAllDone = true;
          } else if (t.type === 'surah_repetition' && t.repetitionGoal) {
            const totalDone = updatedAssignments
              .filter((a) => a.status === 'completed')
              .reduce((sum, a) => sum + (a.repetitionCount || 0), 0);
            if (totalDone >= t.repetitionGoal) isAllDone = true;
          }
          return {
            ...t,
            status: isAllDone ? 'completed' : t.status,
            assignments: updatedAssignments,
          };
        }
        return t;
      })
    );
    showNotification('Recitation marked as completed. JazakAllah Khair!');
  };

  const extendGroupTaskDeadline = (taskId: string, newDate: string) => {
    setGroupTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, extendedDate: newDate, targetDate: newDate } : t))
    );
    logAdminAction('EXTEND_DEADLINE', 'khatm_tasks', taskId, `Extended to ${newDate}`);
    showNotification(`Khatm task deadline extended to ${newDate}.`);
  };

  const closeGroupTask = (taskId: string) => {
    setGroupTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'closed' } : t))
    );
    logAdminAction('CLOSE_TASK', 'khatm_tasks', taskId, 'Task closed by operator or creator');
    showNotification('Group task closed.');
  };

  // Family Mode
  const addFamilyMember = (name: string, relationship: 'child' | 'spouse' | 'parent', ageGroup: 'child' | 'teen' | 'adult') => {
    if (!currentUser) return;
    const newMember: FamilyMember = {
      id: `fam_${Date.now()}`,
      parentId: currentUser.id,
      name,
      relationship,
      ageGroup,
      prayerStreak: 1,
      quranProgress: 0,
      todayPrayers: {},
    };
    setFamilyMembers((prev) => [...prev, newMember]);
    showNotification(`Family profile for ${name} created.`);
  };

  const logFamilyMemberPrayer = (memberId: string, prayer: PrayerName, status: PrayerStatus) => {
    setFamilyMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              todayPrayers: { ...m.todayPrayers, [prayer]: status },
              prayerStreak: status === 'on-time' ? m.prayerStreak + 1 : m.prayerStreak,
            }
          : m
      )
    );
    showNotification(`Logged ${prayer} for family member.`);
  };

  // Admin Actions
  const logAdminAction = (actionType: string, targetTable: string, targetId: string, notes: string) => {
    const entry: AdminAuditLog = {
      id: `aud_${Date.now()}`,
      adminEmail: currentUser?.email || 'admin@barakahdaily.com',
      actionType,
      targetTable,
      targetId,
      timestamp: new Date().toISOString(),
      notes,
    };
    setAdminLogs((prev) => [entry, ...prev]);
  };

  const toggleUserSuspension = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const isSuspended = !u.isSuspended;
          logAdminAction(isSuspended ? 'SUSPEND_USER' : 'UNSUSPEND_USER', 'users', userId, `User ${u.email} suspended: ${isSuspended}`);
          return { ...u, isSuspended };
        }
        return u;
      })
    );
    showNotification('User status updated in admin records.');
  };

  const promoteUserRole = (userId: string, role: 'user' | 'admin') => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          logAdminAction('CHANGE_ROLE', 'users', userId, `Role changed to ${role}`);
          return { ...u, role };
        }
        return u;
      })
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role } : null));
    }
    showNotification(`User role updated to ${role}.`);
  };

  const deleteUser = (userId: string) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    logAdminAction('DELETE_USER', 'users', userId, 'User account removed by admin');
    showNotification('User deleted from platform.');
  };

  const adminDeleteGroupTask = (taskId: string) => {
    setGroupTasks((prev) => prev.filter((t) => t.id !== taskId));
    logAdminAction('DELETE_KHATM_TASK', 'khatm_tasks', taskId, 'Removed for policy/abuse handling');
    showNotification('Khatm task removed by admin.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        setCurrentUser,
        loginAs,
        signUpUser,
        signOut,
        updateProfile,
        language,
        setLanguage,
        prayerTimes,
        nextPrayerInfo,
        refreshPrayerTimes,
        prayerLogs,
        logPrayer,
        prayerStreak,
        qadaCounts,
        adjustQada,
        sunnahLogs,
        logSunnah,
        readingLogs,
        logQuranReading,
        khatmGoal,
        updateKhatmGoal,
        hifzRecords,
        updateHifzStatus,
        plannedBlocks,
        addPlannedBlock,
        updatePlannedBlock,
        togglePlannedBlock,
        deletePlannedBlock,
        habits,
        toggleHabit,
        addHabit,
        updateHabit,
        deleteHabit,
        todos,
        addTodo,
        updateTodo,
        toggleTodo,
        deleteTodo,
        ramadanDays,
        updateRamadanDay,
        ramadanGoals,
        updateRamadanGoals,
        taraweehLogs,
        addTaraweehLog,
        iftarMeals,
        addIftarMeal,
        deleteIftarMeal,
        fidyaSettings,
        updateFidyaSettings,
        ramadanJournals,
        saveRamadanJournal,
        eidChecklist,
        updateEidChecklist,
        zakatCalculations,
        saveZakatCalculation,
        sadaqahLogs,
        addSadaqah,
        charityGoal,
        updateCharityGoal,
        dhikrPresets,
        tasbihCount,
        currentDhikrKey,
        setCurrentDhikrKey,
        incrementTasbih,
        resetTasbih,
        dailyReflections,
        saveDailyReflection,
        groupTasks,
        createGroupTask,
        claimGroupTaskPortion,
        completeGroupTaskPortion,
        extendGroupTaskDeadline,
        closeGroupTask,
        familyMembers,
        activeFamilyMemberId,
        setActiveFamilyMemberId,
        addFamilyMember,
        logFamilyMemberPrayer,
        adminLogs,
        logAdminAction,
        toggleUserSuspension,
        promoteUserRole,
        deleteUser,
        adminDeleteGroupTask,
        activeNotification,
        showNotification,
        dismissNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
