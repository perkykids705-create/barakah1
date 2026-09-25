import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { ActiveTab } from '../layout/AppShell';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  ArrowRight,
  Flame,
  Moon,
  Plus,
  Compass,
} from 'lucide-react';
import { PrayerName, PrayerStatus } from '../../types';

interface HomeDashboardProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  const {
    currentUser,
    language,
    prayerTimes,
    nextPrayerInfo,
    prayerLogs,
    logPrayer,
    prayerStreak,
    readingLogs,
    khatmGoal,
    habits,
    toggleHabit,
    plannedBlocks,
    togglePlannedBlock,
    tasbihCount,
    incrementTasbih,
    currentDhikrKey,
    dhikrPresets,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = prayerLogs.filter((l) => l.date === todayStr);

  const prayersList: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const getPrayerLogStatus = (prayer: PrayerName): PrayerStatus | null => {
    const log = todayLogs.find((l) => l.prayer === prayer);
    return log ? log.status : null;
  };

  const currentDhikr = dhikrPresets.find((d) => d.key === currentDhikrKey) || dhikrPresets[0];

  // Calculate today's pages read
  const todayPages = readingLogs
    .filter((r) => r.date === todayStr)
    .reduce((sum, r) => sum + r.pagesRead, 0);

  const khatmPercent = Math.min(100, Math.round((khatmGoal.currentPagesRead / khatmGoal.totalPages) * 100));

  return (
    <div className="space-y-6">
      {/* 1. HERO CARD: Deep Emerald to Prayer Accent, Gold Hairline, Big Countdown */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2E1C] via-[#123D28] to-[#2E8B4F] text-[#F3F0E4] p-6 lg:p-8 border border-[#C89B2E]/40 shadow-xl">
        {/* Subtle geometric pattern backdrop */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#C89B2E]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#123D28] border border-[#C89B2E]/50 text-xs font-semibold text-[#FBBF24] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
                {t('nextPrayer')}
              </span>
              <span className="text-xs text-[#9FB6A3]">
                {prayerTimes?.date.gregorian}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-serif">
                {nextPrayerInfo ? t(nextPrayerInfo.nextPrayer) : 'Fajr'}
              </h2>
              <span className="text-xl lg:text-2xl font-bold text-[#FBBF24] tabular-nums">
                {nextPrayerInfo?.nextTime}
              </span>
            </div>

            {/* Countdown at Hero Scale (44px mobile / 64px desktop per §4.3) */}
            <div className="pt-2">
              <p className="text-4xl lg:text-6xl font-extrabold tracking-tight text-[#F3F0E4] tabular-nums">
                {nextPrayerInfo?.formattedCountdown || '0h 0m'}
              </p>
              <p className="text-xs lg:text-sm text-[#9FB6A3] mt-1 flex items-center gap-2">
                <span>{t('timeRemaining')} {t('timeUntil')} {nextPrayerInfo ? t(nextPrayerInfo.nextPrayer) : ''}</span>
                <span className="text-stone-400">·</span>
                <span className="text-[#4ADE80] font-semibold">{prayerStreak} {t('todayStreak')}</span>
              </p>
            </div>
          </div>

          {/* Quick Action & Citation */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
            <button
              onClick={() => onNavigate('prayer')}
              className="px-5 py-2.5 rounded-xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-semibold text-xs lg:text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>{t('fullPrayerTimes')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-[11px] text-[#9FB6A3]/80 bg-[#0B2E1C]/60 px-3 py-1.5 rounded-lg border border-[#123D28]">
              {t('prayerViaAladhan')}
            </div>
          </div>
        </div>

        {/* Next prayer progress bar */}
        {nextPrayerInfo && (
          <div className="mt-6 pt-4 border-t border-[#123D28]/80">
            <div className="w-full bg-[#0B2E1C] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#4ADE80] h-full rounded-full transition-all duration-500"
                style={{ width: `${nextPrayerInfo.percentElapsed}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {/* 2. TODAY'S PRAYER TRACKER CHECKLIST (Real Cards, 20px padding, colored top strip) */}
      <section className="bg-white rounded-2xl p-5 lg:p-6 shadow-xs border border-stone-200/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2E8B4F]" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E1F2E7] text-[#2E8B4F] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#16241A]">{t('prayerTracker')}</h3>
              <p className="text-xs text-[#5D6B5A]">{t('checkOffObligatory')}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('prayer')}
            className="text-xs font-semibold text-[#2E8B4F] hover:underline"
          >
            {t('manageQadaSunnah')}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {prayersList.map((prayer) => {
            const status = getPrayerLogStatus(prayer);
            const time = prayerTimes ? prayerTimes[prayer] : '--:--';
            const isCompleted = status === 'on-time' || status === 'late' || status === 'qada';

            return (
              <div
                key={prayer}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-[#E1F2E7]/50 border-[#2E8B4F]/40 text-[#16241A]'
                    : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{t(prayer)}</span>
                  <span className="text-[11px] text-[#5D6B5A] font-medium">{time}</span>
                </div>

                <div className="mt-2 flex items-center gap-1.5">
                  <button
                    onClick={() => logPrayer(prayer, 'on-time')}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                      status === 'on-time'
                        ? 'bg-[#2E8B4F] text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-[#5D6B5A] hover:bg-stone-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{status === 'on-time' ? t('statusOnTime') : t('doneBtn')}</span>
                  </button>
                  <button
                    onClick={() => logPrayer(prayer, status === 'late' ? 'missed' : 'late')}
                    title="Toggle Late / Missed"
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                      status === 'late'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : status === 'missed'
                        ? 'bg-red-100 text-red-700 border-red-300'
                        : 'bg-white border-stone-200 text-stone-400 hover:bg-stone-100'
                    }`}
                  >
                    {status === 'late' ? t('statusLate') : status === 'missed' ? t('statusMissed') : '···'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. MULTI-COLUMN GRID: Left (Planner & Habits) + Right (Quran Khatm & Ramadan Hub) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT TWO COLUMNS: Prayer-Anchored Schedule & Daily Habits */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prayer-Anchored Schedule */}
          <section className="bg-white rounded-2xl p-5 lg:p-6 shadow-xs border border-stone-200/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1D7A9C]" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DCF0F6] text-[#1D7A9C] flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#16241A]">{t('productivityTitle')}</h3>
                  <p className="text-xs text-[#5D6B5A]">{t('timeBlockedSchedule')}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('productivity')}
                className="text-xs font-semibold text-[#1D7A9C] hover:underline"
              >
                {t('openDayPlanner')}
              </button>
            </div>

            <div className="space-y-2.5">
              {plannedBlocks.slice(0, 4).map((block) => (
                <div
                  key={block.id}
                  onClick={() => togglePlannedBlock(block.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    block.completed
                      ? 'bg-stone-50 border-stone-200 line-through text-stone-400'
                      : 'bg-white border-stone-200 hover:border-[#1D7A9C]/40 text-[#16241A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={block.completed}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-[#1D7A9C] focus:ring-[#1D7A9C] cursor-pointer"
                    />
                    <div>
                      <p className="text-xs lg:text-sm font-semibold">{block.title}</p>
                      <p className="text-[11px] text-[#5D6B5A]">
                        Around {t(block.prayerAnchor)} ({block.offsetMinutes >= 0 ? `+${block.offsetMinutes}m` : `${block.offsetMinutes}m`}) · {block.durationMinutes} mins
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      block.priorityTag === 'fardh'
                        ? 'bg-emerald-100 text-emerald-800'
                        : block.priorityTag === 'wajib'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {block.priorityTag}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Spiritual & Daily Habits */}
          <section className="bg-white rounded-2xl p-5 lg:p-6 shadow-xs border border-stone-200/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0E8C74]" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#DAF3EC] text-[#0E8C74] flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#16241A]">{t('habitsTitle')}</h3>
                  <p className="text-xs text-[#5D6B5A]">{t('dailySunnahHabits')}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('productivity')}
                className="text-xs font-semibold text-[#0E8C74] hover:underline"
              >
                {t('manageHabits')}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {habits.slice(0, 4).map((habit) => {
                const isDoneToday = !!habit.logs[todayStr];
                return (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isDoneToday
                        ? 'bg-[#DAF3EC]/40 border-[#0E8C74]/40 text-[#16241A]'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-white ${
                          isDoneToday ? 'bg-[#0E8C74]' : 'border border-stone-300'
                        }`}
                      >
                        {isDoneToday && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">{habit.name}</p>
                        {habit.nameArabic && (
                          <p className="text-[10px] text-[#5D6B5A] font-arabic">{habit.nameArabic}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#C89B2E] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {habit.streak}d
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Quran Khatm Ring, Digital Tasbih & Ramadan Banner */}
        <div className="space-y-6">
          {/* Qur'an Khatm Progress Card */}
          <section className="bg-white rounded-2xl p-5 lg:p-6 shadow-xs border border-stone-200/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C89B2E]" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0D8] text-[#C89B2E] flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#16241A]">{t('quranTracker')}</h4>
                  <p className="text-[11px] text-[#5D6B5A]">{t('khatmProgress')}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('quran')}
                className="text-xs font-semibold text-[#C89B2E] hover:underline"
              >
                {t('logPages')} →
              </button>
            </div>

            <div className="flex items-center gap-4 py-2">
              {/* Circular Progress Indicator */}
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-stone-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#C89B2E]"
                    strokeDasharray={`${khatmPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-extrabold text-[#16241A]">
                  {khatmPercent}%
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-[#5D6B5A]">{t('khatmProgress')}</p>
                <p className="text-lg font-extrabold text-[#16241A]">
                  {khatmGoal.currentPagesRead} / {khatmGoal.totalPages}
                </p>
                <p className="text-[11px] text-[#C89B2E] font-medium">
                  {todayPages} {t('pagesReadToday')}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-[#5D6B5A] flex justify-between">
              <span>{t('dailyGoalPages')}: {khatmGoal.targetPagesPerDay} pgs/day</span>
              <span className="font-semibold text-[#16241A]">{t('projectedFinish')}: {khatmGoal.targetFinishDate}</span>
            </div>
          </section>

          {/* Ramadan Countdown Banner */}
          <section
            onClick={() => onNavigate('ramadan')}
            className="rounded-2xl p-5 bg-gradient-to-br from-[#5B3FA8] to-[#3B257A] text-white shadow-md cursor-pointer hover:shadow-lg transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider text-purple-200">
                {t('ramadanTitle')}
              </span>
              <Moon className="w-5 h-5 text-amber-300" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">
              {t('tab30DayGrid')}
            </h4>
            <p className="text-xs text-purple-200 mb-3">
              {t('ramadanBannerDesc')}
            </p>
            <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-white/20">
              <span>{t('ramadanBannerTitle')}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </section>

          {/* Quick Digital Tasbih Widget */}
          <section className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200/80 text-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#5D6B5A]">{t('digitalTasbih')}</span>
              <button
                onClick={() => onNavigate('spiritual')}
                className="text-[11px] text-[#2E8B4F] font-semibold hover:underline"
              >
                {t('navSpiritual')} →
              </button>
            </div>

            <p className="text-xl font-bold font-arabic text-[#0B2E1C] mb-1">
              {currentDhikr.arabic}
            </p>
            <p className="text-xs text-[#5D6B5A] mb-3">{currentDhikr.transliteration}</p>

            {/* Tactile button */}
            <button
              onClick={incrementTasbih}
              className="w-24 h-24 mx-auto rounded-full bg-[#0B2E1C] hover:bg-[#123D28] text-white flex flex-col items-center justify-center shadow-lg active:scale-95 transition-transform border-4 border-[#C89B2E]/40"
            >
              <span className="text-2xl font-extrabold text-[#FBBF24] tabular-nums">
                {tasbihCount}
              </span>
              <span className="text-[10px] text-[#9FB6A3] font-medium">{t('tapToCount')}</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
