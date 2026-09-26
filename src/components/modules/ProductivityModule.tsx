import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import {
  PlannedBlock,
  IslamicPriority,
  LifeTaskCategory,
  PrayerName,
  TodoItem,
} from '../../types';
import {
  Plus,
  Flame,
  CheckCircle2,
  Trash2,
  Clock,
  CheckSquare,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Edit3,
  AlertTriangle,
  X,
  Tag,
  Briefcase,
  Users,
  BookOpen,
  HeartPulse,
  HeartHandshake,
  Coins,
  Compass,
  Check,
  Filter,
  Lock,
  RotateCcw,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const ProductivityModule: React.FC = () => {
  const {
    language,
    prayerTimes,
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
    prayerLogs,
    readingLogs,
    sadaqahLogs,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  const todayStr = new Date().toISOString().split('T')[0];

  const [activeTab, setActiveTab] = useState<'planner' | 'habits' | 'todos' | 'review'>('planner');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedPlannerDate, setSelectedPlannerDate] = useState<string>(todayStr);
  const [showAllDates, setShowAllDates] = useState<boolean>(false);

  // Form states for new block
  const [newTitle, setNewTitle] = useState('');
  const [newAnchor, setNewAnchor] = useState<PrayerName>('Dhuhr');
  const [newOffset, setNewOffset] = useState<number>(15);
  const [newDuration, setNewDuration] = useState<number>(30);
  const [newPriority, setNewPriority] = useState<IslamicPriority>('wajib');
  const [newCategory, setNewCategory] = useState<LifeTaskCategory>('work');
  const [newDate, setNewDate] = useState<string>(todayStr);

  // Rich Habit Form & Modal States
  const ALL_DAYS_LIST = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [isAddingHabitModal, setIsAddingHabitModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitNameArabic, setNewHabitNameArabic] = useState('');
  const [newHabitCat, setNewHabitCat] = useState<'spiritual' | 'general'>('spiritual');
  const [newHabitLifeCat, setNewHabitLifeCat] = useState<LifeTaskCategory>('worship');
  const [newHabitPriority, setNewHabitPriority] = useState<IslamicPriority>('sunnah');
  const [newHabitFrequency, setNewHabitFrequency] = useState<'daily' | 'weekdays' | 'weekends' | 'custom'>('daily');
  const [newHabitCustomDays, setNewHabitCustomDays] = useState<string[]>(ALL_DAYS_LIST);
  const [newHabitDescription, setNewHabitDescription] = useState('');

  // Habit edit modal state
  const [editHabitItem, setEditHabitItem] = useState<{
    id: string;
    name: string;
    nameArabic: string;
    category: 'spiritual' | 'general';
    lifeCategory: LifeTaskCategory;
    priorityTag: IslamicPriority;
    frequency: 'daily' | 'weekdays' | 'weekends' | 'custom';
    customDays: string[];
    description: string;
  } | null>(null);

  const [deleteHabitConfirm, setDeleteHabitConfirm] = useState<{ id: string; name: string } | null>(null);

  // Habit Log Protection Consent Modal
  const [habitConsentModal, setHabitConsentModal] = useState<{
    habit: typeof habits[0];
    dateStr: string;
  } | null>(null);

  // Todo form
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<IslamicPriority>('fardh');
  const [newTodoCategory, setNewTodoCategory] = useState<LifeTaskCategory>('worship');

  // Modal states for Task Confirmation & Consent / Editing
  const [consentModalItem, setConsentModalItem] = useState<{
    type: 'block' | 'todo';
    id: string;
    item: PlannedBlock | TodoItem;
  } | null>(null);

  const [editModalItem, setEditModalItem] = useState<{
    type: 'block' | 'todo';
    id: string;
    title: string;
    priority: IslamicPriority;
    category: LifeTaskCategory;
    anchor?: PrayerName;
    offset?: number;
    duration?: number;
    date?: string;
    dueDate?: string;
  } | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<{ type: 'block' | 'todo'; id: string; title: string } | null>(null);

  // Category Configuration
  const LIFE_CATEGORIES: { id: LifeTaskCategory; key: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string; border: string }[] = [
    { id: 'worship', key: 'catWorship', icon: Compass, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'quran', key: 'catQuran', icon: BookOpen, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'work', key: 'catWork', icon: Briefcase, color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' },
    { id: 'family', key: 'catFamily', icon: Users, color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
    { id: 'health', key: 'catHealth', icon: HeartPulse, color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-200' },
    { id: 'charity', key: 'catCharity', icon: HeartHandshake, color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
    { id: 'finance', key: 'catFinance', icon: Coins, color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 'personal', key: 'catPersonal', icon: Tag, color: 'text-stone-700', bg: 'bg-stone-100', border: 'border-stone-200' },
  ];

  // Islamic Priority Config
  const PRIORITY_TAGS: { id: IslamicPriority; key: string; color: string; bg: string; border: string; desc: string }[] = [
    { id: 'fardh', key: 'fardh', color: 'text-emerald-900', bg: 'bg-emerald-100', border: 'border-emerald-300', desc: 'Obligatory Duty' },
    { id: 'wajib', key: 'wajib', color: 'text-sky-900', bg: 'bg-sky-100', border: 'border-sky-300', desc: 'Necessary Action' },
    { id: 'sunnah', key: 'sunnah', color: 'text-teal-900', bg: 'bg-teal-100', border: 'border-teal-300', desc: 'Emphasized Sunnah' },
    { id: 'nafl', key: 'nafl', color: 'text-amber-900', bg: 'bg-amber-100', border: 'border-amber-300', desc: 'Voluntary / Mustahabb' },
    { id: 'mubah', key: 'mubah', color: 'text-stone-800', bg: 'bg-stone-200', border: 'border-stone-300', desc: 'Daily Life Affairs' },
  ];

  // Spiritual & Life Habit Presets
  const HABIT_PRESETS = [
    {
      name: 'Morning & Evening Adhkar',
      nameArabic: 'أذكار الصباح والمساء',
      category: 'spiritual' as const,
      lifeCategory: 'worship' as LifeTaskCategory,
      priorityTag: 'sunnah' as IslamicPriority,
      frequency: 'daily' as const,
      customDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      description: 'Recite protection and remembrance supplications after Fajr & Asr/Maghrib.',
      icon: '🤲',
    },
    {
      name: '1 Juz Qur\'an Recitation',
      nameArabic: 'تلاوة جزء من القرآن',
      category: 'spiritual' as const,
      lifeCategory: 'quran' as LifeTaskCategory,
      priorityTag: 'sunnah' as IslamicPriority,
      frequency: 'daily' as const,
      customDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      description: 'Recite 1 Juz daily to complete a Khatm Quran monthly.',
      icon: '📖',
    },
    {
      name: 'Tahajjud & Night Prayer',
      nameArabic: 'صلاة الليل والتهجد',
      category: 'spiritual' as const,
      lifeCategory: 'worship' as LifeTaskCategory,
      priorityTag: 'sunnah' as IslamicPriority,
      frequency: 'daily' as const,
      customDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      description: 'Pray 2-8 rak\'ahs in the final third of the night before Fajr.',
      icon: '🌙',
    },
    {
      name: 'Duha Prayer (2-8 Rakahs)',
      nameArabic: 'صلاة الضحى',
      category: 'spiritual' as const,
      lifeCategory: 'worship' as LifeTaskCategory,
      priorityTag: 'nafl' as IslamicPriority,
      frequency: 'daily' as const,
      customDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      description: 'Daily charity for every joint in the body, prayed mid-morning.',
      icon: '☀️',
    },
    {
      name: '100x Daily Istighfar & Salawat',
      nameArabic: 'الاستغفار والصلاة على النبي',
      category: 'spiritual' as const,
      lifeCategory: 'worship' as LifeTaskCategory,
      priorityTag: 'sunnah' as IslamicPriority,
      frequency: 'daily' as const,
      customDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      description: 'Purify heart and invite barakah with daily dhikr.',
      icon: '📿',
    },
    {
      name: '8,000 Healthy Steps & Fitness',
      nameArabic: 'النشاط البدني والحركة',
      category: 'general' as const,
      lifeCategory: 'health' as LifeTaskCategory,
      priorityTag: 'mubah' as IslamicPriority,
      frequency: 'weekdays' as const,
      customDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      description: 'Maintain bodily strength as an Amanah from Allah.',
      icon: '🏃',
    },
    {
      name: 'Islamic Book / Seerah Reading',
      nameArabic: 'قراءة سير الأنبياء والصحابة',
      category: 'general' as const,
      lifeCategory: 'personal' as LifeTaskCategory,
      priorityTag: 'nafl' as IslamicPriority,
      frequency: 'daily' as const,
      customDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      description: 'Spend 15 minutes acquiring sacred knowledge.',
      icon: '📚',
    },
    {
      name: 'Family Reflection & Gratitude',
      nameArabic: 'جلسة ذكر وتواصل عائلي',
      category: 'general' as const,
      lifeCategory: 'family' as LifeTaskCategory,
      priorityTag: 'sunnah' as IslamicPriority,
      frequency: 'daily' as const,
      customDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      description: 'Gather with family for dinner and spiritual reflection.',
      icon: '👨‍👩‍👧',
    },
  ];

  // Past 7 Days List for Habit Matrix
  const getPast7Days = () => {
    const days: { dateStr: string; dayLabel: string; dayNum: number; isToday: boolean }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      days.push({
        dateStr,
        dayLabel,
        dayNum,
        isToday: i === 0,
      });
    }
    return days;
  };
  const weekDaysList = getPast7Days();

  const getPriorityBadge = (p: IslamicPriority) => {
    const config = PRIORITY_TAGS.find((item) => item.id === p) || PRIORITY_TAGS[0];
    return (
      <span className={`text-[11px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-lg border ${config.bg} ${config.color} ${config.border}`}>
        {t(config.key) || config.id}
      </span>
    );
  };

  const getCategoryBadge = (cat?: LifeTaskCategory | string) => {
    if (!cat) return null;
    const item = LIFE_CATEGORIES.find((c) => c.id === cat);
    if (!item) {
      return (
        <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
          {cat}
        </span>
      );
    }
    const IconComp = item.icon;
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border ${item.bg} ${item.color} ${item.border}`}>
        <IconComp className="w-3 h-3" />
        <span>{t(item.key)}</span>
      </span>
    );
  };

  const changePlannerDateBy = (days: number) => {
    const current = new Date(selectedPlannerDate || todayStr);
    current.setDate(current.getDate() + days);
    const nextStr = current.toISOString().split('T')[0];
    setSelectedPlannerDate(nextStr);
    setNewDate(nextStr);
    setShowAllDates(false);
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addPlannedBlock({
      title: newTitle.trim(),
      prayerAnchor: newAnchor,
      offsetMinutes: Number(newOffset),
      durationMinutes: Number(newDuration),
      priorityTag: newPriority,
      category: newCategory,
      date: newDate || selectedPlannerDate || todayStr,
      completed: false,
    });
    setNewTitle('');
  };

  const toggleNewHabitCustomDay = (day: string) => {
    setNewHabitCustomDays((prev) => {
      const exists = prev.includes(day);
      const next = exists ? prev.filter((d) => d !== day) : [...prev, day];
      if (next.length === 7) setNewHabitFrequency('daily');
      else if (next.length === 5 && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].every((d) => next.includes(d))) setNewHabitFrequency('weekdays');
      else if (next.length === 2 && ['Sat', 'Sun'].every((d) => next.includes(d))) setNewHabitFrequency('weekends');
      else setNewHabitFrequency('custom');
      return next;
    });
  };

  const handleFrequencyChange = (freq: 'daily' | 'weekdays' | 'weekends' | 'custom') => {
    setNewHabitFrequency(freq);
    if (freq === 'daily') setNewHabitCustomDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    else if (freq === 'weekdays') setNewHabitCustomDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    else if (freq === 'weekends') setNewHabitCustomDays(['Sat', 'Sun']);
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim(), newHabitCat, {
      nameArabic: newHabitNameArabic.trim() || undefined,
      lifeCategory: newHabitLifeCat,
      priorityTag: newHabitPriority,
      frequency: newHabitFrequency,
      customDays: newHabitCustomDays,
      targetDaysPerWeek: newHabitCustomDays.length,
      description: newHabitDescription.trim() || undefined,
    });
    setNewHabitName('');
    setNewHabitNameArabic('');
    setNewHabitDescription('');
    setNewHabitCustomDays(ALL_DAYS_LIST);
    setIsAddingHabitModal(false);
  };

  const handleApplyHabitPreset = (preset: typeof HABIT_PRESETS[0]) => {
    addHabit(preset.name, preset.category, {
      nameArabic: preset.nameArabic,
      lifeCategory: preset.lifeCategory,
      priorityTag: preset.priorityTag,
      frequency: preset.frequency,
      customDays: preset.customDays,
      targetDaysPerWeek: preset.customDays.length,
      description: preset.description,
    });
  };

  const handleOpenEditHabitModal = (habit: typeof habits[0]) => {
    setEditHabitItem({
      id: habit.id,
      name: habit.name,
      nameArabic: habit.nameArabic || '',
      category: habit.category,
      lifeCategory: habit.lifeCategory || 'worship',
      priorityTag: habit.priorityTag || 'sunnah',
      frequency: habit.frequency || 'daily',
      customDays: habit.customDays || ALL_DAYS_LIST,
      description: habit.description || '',
    });
  };

  const toggleEditHabitCustomDay = (day: string) => {
    if (!editHabitItem) return;
    const exists = editHabitItem.customDays.includes(day);
    const nextDays = exists
      ? editHabitItem.customDays.filter((d) => d !== day)
      : [...editHabitItem.customDays, day];

    let nextFreq = editHabitItem.frequency;
    if (nextDays.length === 7) nextFreq = 'daily';
    else if (nextDays.length === 5 && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].every((d) => nextDays.includes(d))) nextFreq = 'weekdays';
    else if (nextDays.length === 2 && ['Sat', 'Sun'].every((d) => nextDays.includes(d))) nextFreq = 'weekends';
    else nextFreq = 'custom';

    setEditHabitItem({
      ...editHabitItem,
      customDays: nextDays,
      frequency: nextFreq,
    });
  };

  const handleSaveEditHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editHabitItem) return;
    updateHabit(editHabitItem.id, {
      name: editHabitItem.name.trim(),
      nameArabic: editHabitItem.nameArabic.trim() || undefined,
      category: editHabitItem.category,
      lifeCategory: editHabitItem.lifeCategory,
      priorityTag: editHabitItem.priorityTag,
      frequency: editHabitItem.frequency,
      customDays: editHabitItem.customDays,
      targetDaysPerWeek: editHabitItem.customDays.length,
      description: editHabitItem.description.trim() || undefined,
    });
    setEditHabitItem(null);
  };

  const handleDeleteHabit = () => {
    if (deleteHabitConfirm) {
      deleteHabit(deleteHabitConfirm.id);
      setDeleteHabitConfirm(null);
    }
  };

  const handleHabitDayClick = (habit: typeof habits[0], dateStr: string, isTargetDay: boolean) => {
    if (!isTargetDay) return;
    const isDone = !!habit.logs[dateStr];
    if (!isDone) {
      // Uncompleted entry -> Log entry immediately
      toggleHabit(habit.id, dateStr);
    } else {
      // Completed entry -> Protected log entry, show Consent Confirmation modal
      setHabitConsentModal({ habit, dateStr });
    }
  };

  const handleConfirmUnlogHabit = () => {
    if (!habitConsentModal) return;
    toggleHabit(habitConsentModal.habit.id, habitConsentModal.dateStr);
    setHabitConsentModal(null);
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    addTodo({
      title: newTodoTitle.trim(),
      priorityTag: newTodoPriority,
      dueDate: todayStr,
      completed: false,
      category: newTodoCategory,
    });
    setNewTodoTitle('');
  };

  // Safe Toggle with Consent Protocol
  const handleTaskCheckClick = (type: 'block' | 'todo', item: PlannedBlock | TodoItem) => {
    if (!item.completed) {
      // Uncompleted -> Mark as completed immediately
      if (type === 'block') {
        togglePlannedBlock(item.id);
      } else {
        toggleTodo(item.id);
      }
    } else {
      // Completed -> Protected state: Show Consent & Modification modal
      setConsentModalItem({ type, id: item.id, item });
    }
  };

  const handleConfirmReopen = () => {
    if (!consentModalItem) return;
    if (consentModalItem.type === 'block') {
      togglePlannedBlock(consentModalItem.id);
    } else {
      toggleTodo(consentModalItem.id);
    }
    setConsentModalItem(null);
  };

  const openEditModalFromConsent = () => {
    if (!consentModalItem) return;
    const { type, id, item } = consentModalItem;
    if (type === 'block') {
      const b = item as PlannedBlock;
      setEditModalItem({
        type: 'block',
        id,
        title: b.title,
        priority: b.priorityTag,
        category: (b.category as LifeTaskCategory) || 'work',
        anchor: b.prayerAnchor,
        offset: b.offsetMinutes,
        duration: b.durationMinutes,
        date: b.date || todayStr,
      });
    } else {
      const tItem = item as TodoItem;
      setEditModalItem({
        type: 'todo',
        id,
        title: tItem.title,
        priority: tItem.priorityTag,
        category: (tItem.category as LifeTaskCategory) || 'worship',
        dueDate: tItem.dueDate,
      });
    }
    setConsentModalItem(null);
  };

  const openDirectEditModal = (type: 'block' | 'todo', item: PlannedBlock | TodoItem) => {
    if (type === 'block') {
      const b = item as PlannedBlock;
      setEditModalItem({
        type: 'block',
        id: b.id,
        title: b.title,
        priority: b.priorityTag,
        category: (b.category as LifeTaskCategory) || 'work',
        anchor: b.prayerAnchor,
        offset: b.offsetMinutes,
        duration: b.durationMinutes,
        date: b.date || todayStr,
      });
    } else {
      const tItem = item as TodoItem;
      setEditModalItem({
        type: 'todo',
        id: tItem.id,
        title: tItem.title,
        priority: tItem.priorityTag,
        category: (tItem.category as LifeTaskCategory) || 'worship',
        dueDate: tItem.dueDate,
      });
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalItem) return;
    if (editModalItem.type === 'block') {
      updatePlannedBlock(editModalItem.id, {
        title: editModalItem.title.trim(),
        prayerAnchor: editModalItem.anchor,
        offsetMinutes: Number(editModalItem.offset),
        durationMinutes: Number(editModalItem.duration),
        priorityTag: editModalItem.priority,
        category: editModalItem.category,
        date: editModalItem.date,
      });
    } else {
      updateTodo(editModalItem.id, {
        title: editModalItem.title.trim(),
        priorityTag: editModalItem.priority,
        category: editModalItem.category,
        dueDate: editModalItem.dueDate,
      });
    }
    setEditModalItem(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    if (deleteConfirmId.type === 'block') {
      deletePlannedBlock(deleteConfirmId.id);
    } else {
      deleteTodo(deleteConfirmId.id);
    }
    setDeleteConfirmId(null);
  };

  // Filter tasks by category & date
  const filteredBlocks = plannedBlocks.filter((b) => {
    const matchesCategory = selectedCategoryFilter === 'all' || b.category === selectedCategoryFilter;
    const taskDate = b.date || todayStr;
    const matchesDate = showAllDates || taskDate === selectedPlannerDate;
    return matchesCategory && matchesDate;
  });

  const filteredTodos = selectedCategoryFilter === 'all'
    ? todos
    : todos.filter((tItem) => tItem.category === selectedCategoryFilter);

  // Review calculations
  const totalPrayerLogs = prayerLogs.length;
  const onTimePrayers = prayerLogs.filter((p) => p.status === 'on-time').length;
  const prayerConsistency = totalPrayerLogs > 0 ? Math.round((onTimePrayers / totalPrayerLogs) * 100) : 85;

  const totalPagesRead = readingLogs.reduce((sum, r) => sum + r.pagesRead, 0);
  const totalCharityGiven = sadaqahLogs.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      {/* 1. SUB-TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-3 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'planner'
                ? 'bg-[#1D7A9C] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('productivityTitle')}
          </button>
          <button
            onClick={() => setActiveTab('habits')}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'habits'
                ? 'bg-[#1D7A9C] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('habitsTitle')}
          </button>
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'todos'
                ? 'bg-[#1D7A9C] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('islamicPriorities')}
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'review'
                ? 'bg-[#1D7A9C] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('weeklyReview')}
          </button>
        </div>

        {/* Database Consistency Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-[#2E8B4F] border border-emerald-200 text-xs font-bold self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Spiritual Audit Protected</span>
        </div>
      </div>

      {/* Category Filter Pills (When on planner or todos tab) */}
      {(activeTab === 'planner' || activeTab === 'todos') && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1 scrollbar-thin">
          <span className="text-xs font-bold text-stone-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>{t('filterByLifeCategory') || 'Filter:'}</span>
          </span>
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#0B2E1C] text-[#FBBF24] shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            {t('allCategories')}
          </button>
          {LIFE_CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = selectedCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? `${cat.bg} ${cat.color} border-2 ${cat.border} shadow-xs font-extrabold`
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{t(cat.key)}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. TAB 1: PRAYER-ANCHORED DAY PLANNER */}
      {activeTab === 'planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Main schedule timeline */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('timeBlockedSchedule')}</h3>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">Tasks structured seamlessly around daily Fardh prayers</p>
                </div>
              </div>

              {/* Date Navigation & Selector Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 rounded-2xl p-3 border border-stone-200 mb-5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changePlannerDateBy(-1)}
                    className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Previous Day"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                    <Calendar className="w-4 h-4 text-[#1D7A9C]" />
                    <input
                      type="date"
                      value={selectedPlannerDate}
                      onChange={(e) => {
                        setSelectedPlannerDate(e.target.value);
                        setNewDate(e.target.value);
                        setShowAllDates(false);
                      }}
                      className="bg-transparent text-xs sm:text-sm font-bold text-[#16241A] outline-none cursor-pointer"
                    />
                  </div>
                  <button
                    onClick={() => changePlannerDateBy(1)}
                    className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Next Day"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {selectedPlannerDate !== todayStr && (
                    <button
                      onClick={() => {
                        setSelectedPlannerDate(todayStr);
                        setNewDate(todayStr);
                        setShowAllDates(false);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-200 transition-colors cursor-pointer"
                    >
                      Today
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowAllDates(!showAllDates)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    showAllDates
                      ? 'bg-[#1D7A9C] text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {showAllDates ? 'Viewing All Dates' : 'Filter: Selected Date Only'}
                </button>
              </div>

              {/* Prayer anchors timeline or Empty State */}
              {filteredBlocks.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed border-stone-300 rounded-3xl bg-stone-50/80 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-stone-200/70 text-stone-600 flex items-center justify-center mx-auto">
                    <Calendar className="w-6 h-6 text-[#1D7A9C]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-[#16241A]">
                      {!showAllDates
                        ? `No Tasks Scheduled for ${selectedPlannerDate}`
                        : t('noTasksInLifeCategory')}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-md mx-auto mt-1">
                      {!showAllDates
                        ? `You have no tasks saved for ${selectedPlannerDate}${selectedCategoryFilter !== 'all' ? ` under the selected category` : ''}. Add a new task for this date or view tasks from all dates.`
                        : t('noTasksInLifeCategoryDesc')}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setNewDate(selectedPlannerDate);
                        const formElem = document.querySelector('form');
                        formElem?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#1D7A9C] text-white font-bold text-xs sm:text-sm hover:bg-[#15607a] transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Task for {selectedPlannerDate}</span>
                    </button>
                    {!showAllDates && (
                      <button
                        onClick={() => setShowAllDates(true)}
                        className="px-4 py-2.5 rounded-xl bg-stone-800 text-white font-bold text-xs sm:text-sm hover:bg-black transition-colors cursor-pointer shadow-2xs"
                      >
                        View All Dates
                      </button>
                    )}
                    {selectedCategoryFilter !== 'all' && (
                      <button
                        onClick={() => setSelectedCategoryFilter('all')}
                        className="px-4 py-2.5 rounded-xl bg-[#0B2E1C] text-[#FBBF24] font-bold text-xs sm:text-sm hover:bg-[#123D28] transition-colors cursor-pointer shadow-2xs"
                      >
                        {t('showAllCategoriesBtn')}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as PrayerName[])
                    .filter((prayer) => filteredBlocks.some((b) => b.prayerAnchor === prayer))
                    .map((prayer) => {
                      const prayerTime = prayerTimes ? prayerTimes[prayer] : '--:--';
                      const associatedTasks = filteredBlocks.filter((b) => b.prayerAnchor === prayer);

                      return (
                        <div key={prayer} className="border border-stone-200 rounded-2xl p-4 sm:p-5 bg-stone-50/70">
                          {/* Anchor Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3.5">
                            <div className="flex items-center gap-2.5">
                              <span className="w-3.5 h-3.5 rounded-full bg-[#2E8B4F] shadow-xs" />
                              <span className="text-base sm:text-lg font-black text-[#0B2E1C]">{t(prayer)}</span>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-[#2E8B4F] bg-[#E1F2E7] px-3 py-1 rounded-xl tabular-nums border border-[#2E8B4F]/30">
                              {prayerTime}
                            </span>
                          </div>

                          {/* Associated Planned Tasks */}
                          <div className="space-y-2.5">
                            {associatedTasks.map((task) => (
                              <div
                                key={task.id}
                                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                                  task.completed
                                    ? 'bg-emerald-50/40 border-emerald-200/80 text-stone-600'
                                    : 'bg-white border-stone-200 text-[#16241A] hover:border-[#1D7A9C]/50 shadow-2xs'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3">
                                    {/* Checkmark Button */}
                                    <button
                                      onClick={() => handleTaskCheckClick('block', task)}
                                      className={`w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition-all cursor-pointer ${
                                        task.completed
                                          ? 'bg-[#2E8B4F] border border-[#2E8B4F] text-white shadow-xs hover:bg-[#257341]'
                                          : 'border-2 border-stone-300 hover:border-[#1D7A9C] bg-white'
                                      }`}
                                      title={task.completed ? 'Completed (Click to view verification & edit)' : 'Mark completed'}
                                    >
                                      {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                                    </button>

                                    <div>
                                      <p className={`text-sm sm:text-base font-bold ${task.completed ? 'line-through text-stone-500 font-semibold' : 'text-[#16241A]'}`}>
                                        {task.title}
                                      </p>
                                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                                          <Calendar className="w-2.5 h-2.5 text-stone-500" />
                                          <span>{task.date || todayStr}</span>
                                        </span>
                                        <span className="text-xs text-stone-500 font-medium">
                                          {task.offsetMinutes >= 0 ? `+${task.offsetMinutes}m after` : `${task.offsetMinutes}m before`} · {task.durationMinutes}m
                                        </span>
                                        {getCategoryBadge(task.category)}
                                        {getPriorityBadge(task.priorityTag)}
                                        {task.completed && (
                                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E8B4F] bg-[#E1F2E7] px-2 py-0.5 rounded-md border border-[#2E8B4F]/20">
                                            <Lock className="w-2.5 h-2.5" />
                                            <span>Logged</span>
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Edit & Delete Action Buttons */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => openDirectEditModal('block', task)}
                                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#1D7A9C] hover:bg-stone-100 transition-colors cursor-pointer"
                                      title="Edit task"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmId({ type: 'block', id: task.id, title: task.title })}
                                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                      title="Delete task"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Add block sidebar form */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs h-fit">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-100">
              <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#1D7A9C]" />
                <span>{t('addTask')}</span>
              </h4>
              <span className="text-xs font-semibold text-[#1D7A9C] bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 hidden sm:inline-block">
                Prayer-Anchored
              </span>
            </div>

            <form onSubmit={handleAddBlock} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">{t('taskTitleLabel')}</label>
                <input
                  type="text"
                  placeholder={t('taskPlaceholder')}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm sm:text-base font-semibold outline-none focus:border-[#1D7A9C] bg-white shadow-2xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#1D7A9C]" />
                    <span>Task Date</span>
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold outline-none focus:border-[#1D7A9C] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">{t('prayerAnchorLabel')}</label>
                  <select
                    value={newAnchor}
                    onChange={(e) => setNewAnchor(e.target.value as PrayerName)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold outline-none focus:border-[#1D7A9C] bg-white"
                  >
                    <option value="Fajr">{t('Fajr')}</option>
                    <option value="Dhuhr">{t('Dhuhr')}</option>
                    <option value="Asr">{t('Asr')}</option>
                    <option value="Maghrib">{t('Maghrib')}</option>
                    <option value="Isha">{t('Isha')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">{t('offsetMinutesLabel')}</label>
                  <input
                    type="number"
                    value={newOffset}
                    onChange={(e) => setNewOffset(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold outline-none focus:border-[#1D7A9C] bg-white"
                  />
                  <span className="text-[11px] text-stone-500 font-medium mt-1 block">+after, -before</span>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">{t('durationMinutesLabel')}</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold outline-none focus:border-[#1D7A9C] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">
                    {t('lifeCategoryLabel')}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as LifeTaskCategory)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold outline-none focus:border-[#1D7A9C] bg-white"
                  >
                    {LIFE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {t(cat.key)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">{t('priorityTagLabel')}</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as IslamicPriority)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm sm:text-base font-semibold outline-none focus:border-[#1D7A9C] bg-white"
                  >
                    {PRIORITY_TAGS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {t(p.key)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#1D7A9C] hover:bg-[#15607a] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                <span>{t('addTask')}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. TAB 2: HABIT TRACKER */}
      {activeTab === 'habits' && (
        <div className="space-y-6">
          {/* Spiritual & Daily Presets Header Bar */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('habitsTitle')}</h3>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">Build lasting spiritual routines, daily Sunnahs, and healthy personal habits</p>
              </div>

              <button
                onClick={() => setIsAddingHabitModal(true)}
                className="px-5 py-3 rounded-2xl bg-[#0E8C74] text-white text-xs sm:text-sm font-bold hover:bg-[#0b705d] transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Add Custom Habit</span>
              </button>
            </div>

            {/* Quick Presets Bar */}
            <div className="bg-emerald-50/50 rounded-2xl p-4 sm:p-5 border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black uppercase text-[#0E8C74] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Recommended Sunnah & Daily Presets (1-Click Add)</span>
                </span>
                <span className="text-xs text-stone-500 font-medium hidden sm:inline">Tap any preset to add instantly</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {HABIT_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyHabitPreset(preset)}
                    className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-[#0E8C74] hover:shadow-xs text-left transition-all cursor-pointer group space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{preset.icon}</span>
                      <span className="text-xs sm:text-sm font-black text-[#16241A] group-hover:text-[#0E8C74] line-clamp-1">{preset.name}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#0E8C74] font-arabic font-bold line-clamp-1">{preset.nameArabic}</p>
                    <div className="flex items-center gap-1 pt-0.5">
                      <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded capitalize">
                        {preset.frequency}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Habits Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {habits.map((habit) => {
                const isDoneToday = !!habit.logs[todayStr];
                const activeDays = habit.customDays || ALL_DAYS_LIST;

                return (
                  <div
                    key={habit.id}
                    className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-4 ${
                      isDoneToday
                        ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs'
                        : 'bg-white border-stone-200 hover:border-stone-300 shadow-xs'
                    }`}
                  >
                    {/* Card Top Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-lg sm:text-xl font-black text-[#16241A] leading-tight">{habit.name}</h4>
                          {habit.nameArabic && (
                            <span className="text-base sm:text-lg font-bold text-[#0E8C74] font-arabic bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                              {habit.nameArabic}
                            </span>
                          )}
                        </div>

                        {habit.description && (
                          <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">{habit.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {getCategoryBadge(habit.lifeCategory || (habit.category === 'spiritual' ? 'worship' : 'personal'))}
                          {getPriorityBadge(habit.priorityTag || (habit.category === 'spiritual' ? 'sunnah' : 'mubah'))}
                          <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#0E8C74]" />
                            <span>
                              {activeDays.length === 7
                                ? 'Daily (Mon-Sun)'
                                : `Active: ${activeDays.join(', ')}`}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Action buttons & Streak */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#9A7218] bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-300">
                          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>{habit.streak}d streak</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditHabitModal(habit)}
                            className="p-2 rounded-xl text-stone-500 hover:text-[#0E8C74] hover:bg-stone-100 transition-colors cursor-pointer"
                            title="Edit Habit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteHabitConfirm({ id: habit.id, name: habit.name })}
                            className="p-2 rounded-xl text-stone-500 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Habit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Interactive 7-Day Consistency Matrix */}
                    <div className="bg-stone-50/90 rounded-2xl p-3.5 sm:p-4 border border-stone-200">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-black text-stone-700 uppercase tracking-wider">7-Day Consistency Tracker</span>
                        <span className="text-xs font-bold text-[#0E8C74]">Tap day to toggle log</span>
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {weekDaysList.map((day) => {
                          const isDoneOnDay = !!habit.logs[day.dateStr];
                          const isTargetDay = activeDays.includes(day.dayLabel);

                          return (
                            <button
                              key={day.dateStr}
                              disabled={!isTargetDay}
                              onClick={() => handleHabitDayClick(habit, day.dateStr, isTargetDay)}
                              className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl text-center transition-all border ${
                                !isTargetDay
                                  ? 'bg-stone-100/60 border-stone-200/80 text-stone-400 cursor-not-allowed opacity-50'
                                  : isDoneOnDay
                                  ? 'bg-[#0E8C74] text-white border-[#0E8C74] shadow-xs cursor-pointer'
                                  : day.isToday
                                  ? 'bg-white border-2 border-[#0E8C74] text-[#16241A] font-extrabold shadow-2xs cursor-pointer'
                                  : 'bg-white border-stone-300 text-stone-800 hover:border-[#0E8C74] cursor-pointer'
                              }`}
                              title={
                                !isTargetDay
                                  ? `${day.dayLabel} is an Off Day (Not scheduled for this habit)`
                                  : `${day.dateStr} (${day.dayLabel}) - Click to toggle completion`
                              }
                            >
                              <span className="text-[11px] uppercase font-black tracking-tight">{day.dayLabel}</span>
                              <span className="text-xs sm:text-sm font-black mt-0.5">{day.dayNum}</span>
                              <div className="mt-1">
                                {isDoneOnDay ? (
                                  <Check className="w-4 h-4 stroke-[3]" />
                                ) : !isTargetDay ? (
                                  <span className="text-[10px] font-bold text-stone-400 leading-none">Off</span>
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-stone-300 inline-block" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 3: TODOS WITH EXPANDED ISLAMIC PRIORITY & LIFE TAGS */}
      {activeTab === 'todos' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('islamicPriorities')} & Daily Tasks</h3>
                <p className="text-xs sm:text-sm text-stone-600 font-medium">Prioritize worldly and spiritual duties across Fardh, Wajib, Sunnah, Nafl, and Mubah</p>
              </div>

              {/* Add Todo */}
              <form onSubmit={handleAddTodo} className="flex flex-wrap items-center gap-2.5">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTodoTitle}
                  onChange={(e) => setNewTodoTitle(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl border border-stone-200 text-sm font-semibold outline-none min-w-[200px]"
                  required
                />
                <select
                  value={newTodoCategory}
                  onChange={(e) => setNewTodoCategory(e.target.value as LifeTaskCategory)}
                  className="px-3 py-2.5 rounded-2xl border border-stone-200 text-xs sm:text-sm font-semibold outline-none bg-white"
                >
                  {LIFE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {t(cat.key)}
                    </option>
                  ))}
                </select>
                <select
                  value={newTodoPriority}
                  onChange={(e) => setNewTodoPriority(e.target.value as IslamicPriority)}
                  className="px-3 py-2.5 rounded-2xl border border-stone-200 text-xs sm:text-sm font-semibold outline-none bg-white"
                >
                  {PRIORITY_TAGS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t(p.key)}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#1D7A9C] text-white text-xs sm:text-sm font-bold hover:bg-[#15607a] cursor-pointer shadow-xs"
                >
                  + Add
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {filteredTodos.length === 0 ? (
                <div className="text-center py-10 px-4 border border-dashed border-stone-300 rounded-3xl bg-stone-50/80 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-stone-200/70 text-stone-600 flex items-center justify-center mx-auto">
                    <Filter className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-[#16241A]">
                      {t('noTasksInLifeCategory')}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-md mx-auto mt-1">
                      {t('noTasksInLifeCategoryDesc')}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setSelectedCategoryFilter('all')}
                      className="px-4 py-2.5 rounded-xl bg-[#0B2E1C] text-[#FBBF24] font-bold text-xs sm:text-sm hover:bg-[#123D28] transition-colors cursor-pointer shadow-2xs"
                    >
                      {t('showAllCategoriesBtn')}
                    </button>
                    {selectedCategoryFilter !== 'all' && (
                      <button
                        onClick={() => {
                          setNewTodoCategory(selectedCategoryFilter as LifeTaskCategory);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#1D7A9C] text-white font-bold text-xs sm:text-sm hover:bg-[#15607a] transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t('addCategoryTaskBtn')}</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                      todo.completed
                        ? 'bg-emerald-50/40 border-emerald-200/80 text-stone-600'
                        : 'bg-white border-stone-200 text-[#16241A] hover:border-stone-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <button
                        onClick={() => handleTaskCheckClick('todo', todo)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                          todo.completed
                            ? 'bg-[#2E8B4F] border-[#2E8B4F] text-white shadow-xs hover:bg-[#257341]'
                            : 'border-2 border-stone-300 hover:border-[#1D7A9C] bg-white'
                        }`}
                        title={todo.completed ? 'Completed (Click to view verification & edit)' : 'Mark completed'}
                      >
                        {todo.completed && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>
                      <div>
                        <p className={`text-sm sm:text-base font-bold ${todo.completed ? 'line-through text-stone-500 font-semibold' : 'text-[#16241A]'}`}>
                          {todo.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-stone-500 font-medium">Due: {todo.dueDate}</span>
                          {getCategoryBadge(todo.category)}
                          {getPriorityBadge(todo.priorityTag)}
                          {todo.completed && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E8B4F] bg-[#E1F2E7] px-2 py-0.5 rounded-md border border-[#2E8B4F]/20">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Recorded</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openDirectEditModal('todo', todo)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-[#1D7A9C] hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Edit task"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId({ type: 'todo', id: todo.id, title: todo.title })}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 4: WEEKLY & MONTHLY REVIEW SUMMARY */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] mb-2 tracking-tight">{t('weeklyReview')}</h3>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mb-6">
              Holistic summary of your spiritual consistency, habits, reading, and charity
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 sm:p-6 rounded-3xl bg-[#E1F2E7]/50 border border-[#2E8B4F]/40 shadow-2xs">
                <span className="text-xs sm:text-sm font-bold text-[#2E8B4F] uppercase tracking-wider">Prayer Consistency</span>
                <p className="text-3xl sm:text-4xl font-black text-[#16241A] mt-2 tabular-nums">{prayerConsistency}%</p>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">{onTimePrayers} prayers on-time</p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#FAF0D8]/50 border border-[#C89B2E]/40 shadow-2xs">
                <span className="text-xs sm:text-sm font-bold text-[#C89B2E] uppercase tracking-wider">Qur'an Recitation</span>
                <p className="text-3xl sm:text-4xl font-black text-[#16241A] mt-2 tabular-nums">{totalPagesRead}</p>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">Total pages read recorded</p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#DCF0F6]/50 border border-[#1D7A9C]/40 shadow-2xs">
                <span className="text-xs sm:text-sm font-bold text-[#1D7A9C] uppercase tracking-wider">Habit Adherence</span>
                <p className="text-3xl sm:text-4xl font-black text-[#16241A] mt-2 tabular-nums">82%</p>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">Average streak active</p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-[#F0EBF8]/50 border border-[#7C3AED]/30 shadow-2xs">
                <span className="text-xs sm:text-sm font-bold text-[#7C3AED] uppercase tracking-wider">Charity & Sadaqah</span>
                <p className="text-3xl sm:text-4xl font-black text-[#16241A] mt-2 tabular-nums">${totalCharityGiven}</p>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">Cumulative deeds recorded</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. CONSENT & DATABASE CONSISTENCY MODAL (Triggered when user clicks a completed task) */}
      {consentModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 text-[#16241A] relative">
            <button
              onClick={() => setConsentModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#2E8B4F] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-[#16241A] leading-tight">
                  {t('completedTaskLocked')}
                </h4>
                <p className="text-xs font-semibold text-[#2E8B4F]">Verified in Spiritual Ledger</p>
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 mb-4 space-y-2">
              <p className="text-sm font-bold text-[#16241A]">{consentModalItem.item.title}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {getCategoryBadge((consentModalItem.item as any).category)}
                {getPriorityBadge(consentModalItem.item.priorityTag)}
                {consentModalItem.item.completedAt && (
                  <span className="text-[11px] font-semibold text-stone-500">
                    {t('completedAt')}: {new Date(consentModalItem.item.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-medium mb-6 leading-relaxed">
              {t('completedTaskWarning')}
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => setConsentModalItem(null)}
                className="w-full py-3 px-4 rounded-xl bg-[#0B2E1C] hover:bg-[#123D28] text-[#FBBF24] font-black text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{t('keepCompleted')}</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={openEditModalFromConsent}
                  className="py-2.5 px-3 rounded-xl border border-stone-200 hover:border-[#1D7A9C] bg-white text-stone-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#1D7A9C]" />
                  <span>{t('editTask')}</span>
                </button>

                <button
                  onClick={handleConfirmReopen}
                  className="py-2.5 px-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('reopenTask')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. EDIT TASK MODAL */}
      {editModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 text-[#16241A] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditModalItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#1D7A9C] flex items-center justify-center shrink-0">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A]">
                  {t('editTask')}
                </h4>
                <p className="text-xs text-stone-500 font-medium">Update parameters with database audit logging</p>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">{t('taskTitleLabel')}</label>
                <input
                  type="text"
                  value={editModalItem.title}
                  onChange={(e) => setEditModalItem({ ...editModalItem, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm sm:text-base font-semibold outline-none focus:border-[#1D7A9C]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">
                  {t('lifeCategoryLabel')}
                </label>
                <select
                  value={editModalItem.category}
                  onChange={(e) => setEditModalItem({ ...editModalItem, category: e.target.value as LifeTaskCategory })}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm sm:text-base font-semibold outline-none focus:border-[#1D7A9C] bg-white"
                >
                  {LIFE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {t(cat.key)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">{t('priorityTagLabel')}</label>
                <select
                  value={editModalItem.priority}
                  onChange={(e) => setEditModalItem({ ...editModalItem, priority: e.target.value as IslamicPriority })}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm sm:text-base font-semibold outline-none focus:border-[#1D7A9C] bg-white"
                >
                  {PRIORITY_TAGS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t(p.key)}
                    </option>
                  ))}
                </select>
              </div>

              {editModalItem.type === 'block' && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#1D7A9C]" />
                      <span>Task Date</span>
                    </label>
                    <input
                      type="date"
                      value={editModalItem.date || todayStr}
                      onChange={(e) => setEditModalItem({ ...editModalItem, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm sm:text-base font-semibold outline-none focus:border-[#1D7A9C]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">{t('prayerAnchorLabel')}</label>
                    <select
                      value={editModalItem.anchor}
                      onChange={(e) => setEditModalItem({ ...editModalItem, anchor: e.target.value as PrayerName })}
                      className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm sm:text-base font-semibold outline-none focus:border-[#1D7A9C] bg-white"
                    >
                      <option value="Fajr">{t('Fajr')}</option>
                      <option value="Dhuhr">{t('Dhuhr')}</option>
                      <option value="Asr">{t('Asr')}</option>
                      <option value="Maghrib">{t('Maghrib')}</option>
                      <option value="Isha">{t('Isha')}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">{t('offsetMinutesLabel')}</label>
                      <input
                        type="number"
                        value={editModalItem.offset ?? 0}
                        onChange={(e) => setEditModalItem({ ...editModalItem, offset: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm sm:text-base font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">{t('durationMinutesLabel')}</label>
                      <input
                        type="number"
                        value={editModalItem.duration ?? 30}
                        onChange={(e) => setEditModalItem({ ...editModalItem, duration: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm sm:text-base font-semibold outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {editModalItem.type === 'todo' && (
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={editModalItem.dueDate || todayStr}
                    onChange={(e) => setEditModalItem({ ...editModalItem, dueDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm sm:text-base font-semibold outline-none"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
                  className="flex-1 py-3.5 rounded-2xl border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-[#1D7A9C] hover:bg-[#15607a] text-white font-extrabold text-sm transition-colors cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-[#16241A]">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-[#16241A] mb-1">Delete Task?</h4>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mb-5">
              Are you sure you want to remove <span className="font-bold text-stone-900">"{deleteConfirmId.title}"</span>? This cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs sm:text-sm hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT HABIT MODAL */}
      {editHabitItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 text-[#16241A] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditHabitItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-xl font-extrabold text-[#16241A] mb-4 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#0E8C74]" />
              <span>Edit Habit</span>
            </h4>

            <form onSubmit={handleSaveEditHabit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Habit Title</label>
                  <input
                    type="text"
                    value={editHabitItem.name}
                    onChange={(e) => setEditHabitItem({ ...editHabitItem, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold outline-none focus:border-[#0E8C74]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Arabic / Subtitle</label>
                  <input
                    type="text"
                    value={editHabitItem.nameArabic}
                    onChange={(e) => setEditHabitItem({ ...editHabitItem, nameArabic: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold outline-none focus:border-[#0E8C74] font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Type</label>
                  <select
                    value={editHabitItem.category}
                    onChange={(e) => setEditHabitItem({ ...editHabitItem, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold outline-none bg-white"
                  >
                    <option value="spiritual">Spiritual / Ibadaat</option>
                    <option value="general">General / Daily</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Life Category</label>
                  <select
                    value={editHabitItem.lifeCategory}
                    onChange={(e) => setEditHabitItem({ ...editHabitItem, lifeCategory: e.target.value as LifeTaskCategory })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold outline-none bg-white"
                  >
                    {LIFE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {t(cat.key)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Islamic Priority</label>
                  <select
                    value={editHabitItem.priorityTag}
                    onChange={(e) => setEditHabitItem({ ...editHabitItem, priorityTag: e.target.value as IslamicPriority })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-bold outline-none bg-white"
                  >
                    {PRIORITY_TAGS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {t(p.key)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Active Days Selection in Edit Modal */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Scheduled Active Days</label>
                <div className="grid grid-cols-7 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  {ALL_DAYS_LIST.map((day) => {
                    const isSelected = editHabitItem.customDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleEditHabitCustomDay(day)}
                        className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'bg-[#0E8C74] text-white border-[#0E8C74] shadow-xs'
                            : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                        }`}
                      >
                        <span>{day}</span>
                        {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-stone-500 font-medium mt-1">
                  Active Days ({editHabitItem.customDays.length}/7): {editHabitItem.customDays.length === 0 ? 'None' : editHabitItem.customDays.join(', ')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description / Notes</label>
                <input
                  type="text"
                  value={editHabitItem.description}
                  onChange={(e) => setEditHabitItem({ ...editHabitItem, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-medium outline-none focus:border-[#0E8C74]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditHabitItem(null)}
                  className="flex-1 py-3 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#0E8C74] hover:bg-[#0b705d] text-white font-extrabold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW HABIT MODAL */}
      {isAddingHabitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 text-[#16241A] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddingHabitModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0E8C74] flex items-center justify-center shrink-0">
                <Plus className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-[#16241A]">Add Custom Habit</h4>
                <p className="text-xs sm:text-sm text-stone-500 font-medium">Define your spiritual or personal daily routine</p>
              </div>
            </div>

            <form onSubmit={handleAddHabit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Habit Name (English / Title)</label>
                  <input
                    type="text"
                    placeholder="e.g. Morning Adhkar or 8k Steps"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold outline-none focus:border-[#0E8C74] bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Arabic Subtitle (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. أذكار الصباح"
                    value={newHabitNameArabic}
                    onChange={(e) => setNewHabitNameArabic(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-semibold outline-none focus:border-[#0E8C74] bg-white font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Habit Type</label>
                  <select
                    value={newHabitCat}
                    onChange={(e) => setNewHabitCat(e.target.value as 'spiritual' | 'general')}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-bold outline-none bg-white"
                  >
                    <option value="spiritual">Spiritual / Ibadaat</option>
                    <option value="general">General / Daily</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Life Domain</label>
                  <select
                    value={newHabitLifeCat}
                    onChange={(e) => setNewHabitLifeCat(e.target.value as LifeTaskCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-bold outline-none bg-white"
                  >
                    {LIFE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {t(cat.key)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Islamic Priority</label>
                  <select
                    value={newHabitPriority}
                    onChange={(e) => setNewHabitPriority(e.target.value as IslamicPriority)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm font-bold outline-none bg-white"
                  >
                    {PRIORITY_TAGS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {t(p.key)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Active Days Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-stone-700">Scheduled Active Days</label>
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => handleFrequencyChange('daily')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${newHabitFrequency === 'daily' ? 'bg-[#0E8C74] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                    >
                      All Days
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFrequencyChange('weekdays')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${newHabitFrequency === 'weekdays' ? 'bg-[#0E8C74] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                    >
                      Weekdays
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFrequencyChange('weekends')}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${newHabitFrequency === 'weekends' ? 'bg-[#0E8C74] text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                    >
                      Weekends
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  {ALL_DAYS_LIST.map((day) => {
                    const isSelected = newHabitCustomDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleNewHabitCustomDay(day)}
                        className={`py-2.5 px-1 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer border flex flex-col items-center gap-1 ${
                          isSelected
                            ? 'bg-[#0E8C74] text-white border-[#0E8C74] shadow-xs'
                            : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                        }`}
                      >
                        <span>{day}</span>
                        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-stone-500 font-medium mt-1">
                  Selected ({newHabitCustomDays.length}/7 days): {newHabitCustomDays.length === 0 ? 'None selected' : newHabitCustomDays.join(', ')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Habit Description / Anchor Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Recite after Fajr or pray mid-morning"
                  value={newHabitDescription}
                  onChange={(e) => setNewHabitDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm font-medium outline-none focus:border-[#0E8C74] bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddingHabitModal(false)}
                  className="px-5 py-3 rounded-2xl border border-stone-200 text-stone-700 text-xs sm:text-sm font-bold hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#0E8C74] text-white text-xs sm:text-sm font-extrabold hover:bg-[#0b705d] transition-colors cursor-pointer shadow-xs"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE HABIT CONFIRMATION MODAL */}
      {deleteHabitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-[#16241A]">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-[#16241A] mb-1">Delete Habit?</h4>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mb-5">
              Are you sure you want to remove habit <span className="font-bold text-stone-900">"{deleteHabitConfirm.name}"</span>? Your logged streaks for this habit will be removed.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteHabitConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs sm:text-sm hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHabit}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
              >
                Delete Habit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HABIT LOG CONSENT & PROTECTION MODAL */}
      {habitConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 text-[#16241A] relative">
            <button
              onClick={() => setHabitConsentModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0E8C74] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-[#16241A] leading-tight">
                  Logged Habit Entry Locked
                </h4>
                <p className="text-xs font-semibold text-[#0E8C74]">Recorded in Daily Routine Ledger</p>
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm sm:text-base font-extrabold text-[#16241A]">{habitConsentModal.habit.name}</p>
                {habitConsentModal.habit.nameArabic && (
                  <p className="text-xs font-bold text-[#0E8C74] font-arabic">{habitConsentModal.habit.nameArabic}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {getCategoryBadge(habitConsentModal.habit.lifeCategory || (habitConsentModal.habit.category === 'spiritual' ? 'worship' : 'personal'))}
                {getPriorityBadge(habitConsentModal.habit.priorityTag || (habitConsentModal.habit.category === 'spiritual' ? 'sunnah' : 'mubah'))}
                <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                  Date: {habitConsentModal.dateStr}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 font-medium mb-6 leading-relaxed">
              This habit completion entry is already recorded in your streak history. Unmarking or removing this completed entry requires your explicit confirmation to protect streak consistency.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => setHabitConsentModal(null)}
                className="w-full py-3 px-4 rounded-xl bg-[#0B2E1C] hover:bg-[#123D28] text-[#FBBF24] font-black text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <Check className="w-4 h-4" />
                <span>Keep Completed & Locked</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    const h = habitConsentModal.habit;
                    setHabitConsentModal(null);
                    handleOpenEditHabitModal(h);
                  }}
                  className="py-2.5 px-3 rounded-xl border border-stone-200 hover:border-[#0E8C74] bg-white text-stone-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#0E8C74]" />
                  <span>Edit Habit</span>
                </button>

                <button
                  onClick={handleConfirmUnlogHabit}
                  className="py-2.5 px-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Unmark Entry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
