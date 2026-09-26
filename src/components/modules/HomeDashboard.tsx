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
              <ArrowRight className={`w-3.5 h-3.5 transition-transform ${rtl ? 'rotate-180' : ''}`} />
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

      {/* 2. TODAY'S PRAYER TRACKER CHECKLIST */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-stone-200/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2E8B4F]" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E1F2E7] text-[#2E8B4F] flex items-center justify-center font-bold shadow-xs shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('prayerTracker')}</h3>
              <p className="text-sm sm:text-base text-stone-600 font-medium">{t('checkOffObligatory')}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('prayer')}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#2E8B4F] text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t('manageQadaSunnah')}</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${rtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {prayersList.map((prayer) => {
            const status = getPrayerLogStatus(prayer);
            const time = prayerTimes ? prayerTimes[prayer] : '--:--';
            const isCompleted = status === 'on-time' || status === 'late' || status === 'qada';

            return (
              <div
                key={prayer}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-[#E1F2E7]/70 border-[#2E8B4F]/50 text-[#16241A] shadow-xs'
                    : 'bg-stone-50/80 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base sm:text-lg font-black text-[#16241A]">{t(prayer)}</span>
                  <span className="text-xs sm:text-sm text-stone-700 font-bold bg-white/90 px-2 py-0.5 rounded-lg border border-stone-200/80">{time}</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => logPrayer(prayer, 'on-time')}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      status === 'on-time'
                        ? 'bg-[#2E8B4F] text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{status === 'on-time' ? t('statusOnTime') : t('doneBtn')}</span>
                  </button>
                  <button
                    onClick={() => logPrayer(prayer, status === 'late' ? 'missed' : 'late')}
                    title="Toggle Late / Missed"
                    className={`px-3 py-2 rounded-xl text-xs font-black border transition-colors cursor-pointer ${
                      status === 'late'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : status === 'missed'
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-100'
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
          <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-stone-200/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#1D7A9C]" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#DCF0F6] text-[#1D7A9C] flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('productivityTitle')}</h3>
                  <p className="text-sm sm:text-base text-stone-600 font-medium">{t('timeBlockedSchedule')}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('productivity')}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#DCF0F6] hover:bg-[#cae8f2] text-[#1D7A9C] text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t('openDayPlanner')}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${rtl ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="space-y-3">
              {plannedBlocks.slice(0, 4).map((block) => (
                <div
                  key={block.id}
                  onClick={() => togglePlannedBlock(block.id)}
                  className={`p-4 sm:p-4.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    block.completed
                      ? 'bg-stone-50 border-stone-200 line-through text-stone-400'
                      : 'bg-white border-stone-200 hover:border-[#1D7A9C]/50 hover:shadow-xs text-[#16241A]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-3">
                    <input
                      type="checkbox"
                      checked={block.completed}
                      onChange={() => {}}
                      className="w-5 h-5 rounded-md text-[#1D7A9C] focus:ring-[#1D7A9C] cursor-pointer shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-base sm:text-lg font-bold text-[#16241A] leading-snug truncate">{block.title}</p>
                      <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                        Around {t(block.prayerAnchor)} ({block.offsetMinutes >= 0 ? `+${block.offsetMinutes}m` : `${block.offsetMinutes}m`}) · {block.durationMinutes} mins
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-xl uppercase tracking-wider shrink-0 ${
                      block.priorityTag === 'fardh'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300/70'
                        : block.priorityTag === 'wajib'
                        ? 'bg-sky-100 text-sky-900 border border-sky-300/70'
                        : block.priorityTag === 'sunnah'
                        ? 'bg-teal-100 text-teal-900 border border-teal-300/70'
                        : block.priorityTag === 'nafl'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300/70'
                        : 'bg-stone-200 text-stone-800 border border-stone-300/70'
                    }`}
                  >
                    {block.priorityTag}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Spiritual & Daily Habits */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-stone-200/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0E8C74]" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#DAF3EC] text-[#0E8C74] flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('habitsTitle')}</h3>
                  <p className="text-sm sm:text-base text-stone-600 font-medium">{t('dailySunnahHabits')}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('productivity')}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#DAF3EC] hover:bg-[#c4ece1] text-[#0E8C74] text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t('manageHabits')}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${rtl ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {habits.slice(0, 4).map((habit) => {
                const isDoneToday = !!habit.logs[todayStr];
                return (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className={`p-4 sm:p-4.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isDoneToday
                        ? 'bg-[#DAF3EC]/50 border-[#0E8C74]/50 text-[#16241A] shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 transition-colors ${
                          isDoneToday ? 'bg-[#0E8C74]' : 'border-2 border-stone-300'
                        }`}
                      >
                        {isDoneToday && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-[#16241A] leading-snug">{habit.name}</p>
                        {habit.nameArabic && (
                          <p className="text-sm text-[#0E8C74] font-arabic font-semibold mt-0.5">{habit.nameArabic}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#9A7218] bg-[#FAF0D8] border border-[#C89B2E]/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0">
                      <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
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
          <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-stone-200/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C89B2E]" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF0D8] text-[#C89B2E] flex items-center justify-center font-bold shadow-xs shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('quranTracker')}</h4>
                  <p className="text-sm text-stone-600 font-medium">{t('khatmProgress')}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('quran')}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF0D8] hover:bg-[#f3e3be] text-[#9A7218] text-sm font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{t('logPages')}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${rtl ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-5 py-3">
              {/* Circular Progress Indicator */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center">
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
                <span className="absolute text-lg sm:text-xl font-black text-[#16241A]">
                  {khatmPercent}%
                </span>
              </div>

              <div className="space-y-1.5 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-stone-500 uppercase tracking-wider">{t('khatmProgress')}</p>
                <p className="text-2xl sm:text-3xl font-black text-[#16241A] tracking-tight">
                  {khatmGoal.currentPagesRead} <span className="text-base font-semibold text-stone-400">/ {khatmGoal.totalPages}</span>
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF0D8] border border-[#C89B2E]/40 text-xs sm:text-sm font-bold text-[#9A7218]">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>{todayPages} {t('pagesReadToday')}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-200/80 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/60">
                <p className="text-xs text-stone-500 font-semibold">{t('dailyGoalPages')}</p>
                <p className="text-base font-bold text-[#16241A] mt-0.5">{khatmGoal.targetPagesPerDay} <span className="text-xs font-normal text-stone-500">pgs/day</span></p>
              </div>
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/60">
                <p className="text-xs text-stone-500 font-semibold">{t('projectedFinish')}</p>
                <p className="text-base font-bold text-[#16241A] mt-0.5 truncate">{khatmGoal.targetFinishDate}</p>
              </div>
            </div>
          </section>

          {/* Ramadan Countdown Banner */}
          <section
            onClick={() => onNavigate('ramadan')}
            className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#5B3FA8] via-[#4A2F97] to-[#351E75] text-white shadow-lg cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-100 border border-white/20">
                {t('ramadanTitle')}
              </span>
              <Moon className="w-6 h-6 text-amber-300 group-hover:scale-110 transition-transform" />
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-white mb-2 leading-snug">
              {t('tab30DayGrid')}
            </h4>
            <p className="text-sm sm:text-base text-purple-100/90 mb-4 leading-relaxed font-medium">
              {t('ramadanBannerDesc')}
            </p>
            <div className="flex items-center justify-between text-sm sm:text-base font-bold pt-3.5 border-t border-white/20 text-white">
              <span>{t('ramadanBannerTitle')}</span>
              <span className="p-1.5 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
                <ArrowRight className={`w-4.5 h-4.5 transition-transform ${rtl ? 'rotate-180' : ''}`} />
              </span>
            </div>
          </section>

          {/* Quick Digital Tasbih Widget */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-stone-200/80 text-center">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base sm:text-lg font-extrabold text-[#16241A]">{t('digitalTasbih')}</span>
              <button
                onClick={() => onNavigate('spiritual')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-[#2E8B4F] text-xs sm:text-sm font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{t('navSpiritual')}</span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${rtl ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <p className="text-2xl sm:text-3xl font-extrabold font-arabic text-[#0B2E1C] my-3 leading-relaxed">
              {currentDhikr.arabic}
            </p>
            <p className="text-sm sm:text-base font-bold text-[#16241A] mb-1">
              {currentDhikr.transliteration}
            </p>
            {currentDhikr.translation && (
              <p className="text-xs sm:text-sm text-stone-500 font-medium mb-5 max-w-xs mx-auto">
                "{currentDhikr.translation}"
              </p>
            )}

            {/* Tactile button */}
            <button
              onClick={incrementTasbih}
              className="w-32 h-32 sm:w-36 sm:h-36 mx-auto rounded-full bg-gradient-to-br from-[#0B2E1C] via-[#123D28] to-[#1E5738] hover:brightness-110 text-white flex flex-col items-center justify-center shadow-xl active:scale-95 transition-all border-4 border-[#C89B2E]/60 hover:border-[#FBBF24] cursor-pointer"
            >
              <span className="text-3xl sm:text-4xl font-black text-[#FBBF24] tabular-nums tracking-tight">
                {tasbihCount}
              </span>
              <span className="text-xs sm:text-sm text-[#C5E1D0] font-bold mt-1">{t('tapToCount')}</span>
            </button>
          </section>
        </div>
      </div>

      {/* 4. SPIRITUAL ESSENTIALS QUICK HUB */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-stone-200/80">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('exploreDemo')}</h3>
            <p className="text-sm sm:text-base text-stone-600 font-medium">{t('tagline')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('spiritual')}
            className="p-5 rounded-2xl border border-stone-200 hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#16241A] mb-1">{t('qiblaCompass')}</h4>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">{t('bearingTowardsKaaba')}</p>
          </button>

          <button
            onClick={() => onNavigate('zakat')}
            className="p-5 rounded-2xl border border-stone-200 hover:border-amber-500/50 hover:bg-amber-50/30 transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#16241A] mb-1">{t('navZakat')}</h4>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">{t('calculateZakat')}</p>
          </button>

          <button
            onClick={() => onNavigate('group_khatm')}
            className="p-5 rounded-2xl border border-stone-200 hover:border-sky-500/50 hover:bg-sky-50/30 transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#16241A] mb-1">{t('groupKhatmTitle')}</h4>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">{t('activeTasks')}</p>
          </button>

          <button
            onClick={() => onNavigate('family')}
            className="p-5 rounded-2xl border border-stone-200 hover:border-teal-500/50 hover:bg-teal-50/30 transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-[#16241A] mb-1">{t('familyTitle')}</h4>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">{t('childProgress')}</p>
          </button>
        </div>
      </section>
    </div>
  );
};
