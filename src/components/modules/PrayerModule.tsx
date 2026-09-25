import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { PrayerName, PrayerStatus } from '../../types';
import { CALCULATION_METHODS, POPULAR_LOCATIONS } from '../../services/prayerService';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  MapPin,
  Flame,
  Plus,
  Minus,
  Check,
} from 'lucide-react';

export const PrayerModule: React.FC = () => {
  const {
    currentUser,
    language,
    prayerTimes,
    nextPrayerInfo,
    prayerLogs,
    logPrayer,
    prayerStreak,
    qadaCounts,
    adjustQada,
    sunnahLogs,
    logSunnah,
    updateProfile,
    refreshPrayerTimes,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = prayerLogs.filter((l) => l.date === todayStr);

  const prayersList: PrayerName[] = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const getStatus = (p: PrayerName): PrayerStatus | null => {
    const found = todayLogs.find((l) => l.prayer === p);
    return found ? found.status : null;
  };

  const [customSunnahType, setCustomSunnahType] = useState<'tahajjud' | 'duha' | 'witr' | 'rawatib'>('rawatib');
  const [customRakahs, setCustomRakahs] = useState<number>(2);

  const handleLocationChange = (cityName: string) => {
    const loc = POPULAR_LOCATIONS.find((l) => l.city === cityName);
    if (loc && currentUser) {
      updateProfile({ location: loc });
    }
  };

  const handleMethodChange = (methodId: number) => {
    if (currentUser) {
      updateProfile({ calculationMethod: methodId });
    }
  };

  const handleMadhabChange = (madhab: 'shafi' | 'hanafi') => {
    if (currentUser) {
      updateProfile({ madhab });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER & LOCATION / METHOD SETTINGS BAR */}
      <div className="bg-white rounded-2xl p-5 lg:p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2E8B4F]" />
            <h2 className="text-2xl font-extrabold text-[#16241A]">{t('navPrayer')}</h2>
          </div>
          <p className="text-xs text-[#5D6B5A] mt-1">
            {t('aladhanPrecisionInfo')}
          </p>
        </div>

        {/* Quick Location & Madhab Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200">
            <MapPin className="w-3.5 h-3.5 text-[#2E8B4F]" />
            <select
              value={currentUser?.location.city || 'London'}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="bg-transparent font-semibold text-[#16241A] outline-none cursor-pointer"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.city} value={loc.city}>
                  {loc.city}, {loc.country}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200">
            <span className="text-[#5D6B5A]">{t('Asr')}:</span>
            <select
              value={currentUser?.madhab || 'shafi'}
              onChange={(e) => handleMadhabChange(e.target.value as 'shafi' | 'hanafi')}
              className="bg-transparent font-semibold text-[#16241A] outline-none cursor-pointer capitalize"
            >
              <option value="shafi">{t('standardMadhab')}</option>
              <option value="hanafi">{t('hanafiMadhab')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S PRAYER TIMES TABLE (High Contrast AAA Target per PRD §4.2) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {prayersList.map((prayer) => {
          const isNext = nextPrayerInfo?.nextPrayer === prayer;
          const time = prayerTimes ? prayerTimes[prayer] : '--:--';
          const status = getStatus(prayer);
          const isFardh = prayer !== 'Sunrise';

          return (
            <div
              key={prayer}
              className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                isNext
                  ? 'bg-gradient-to-b from-[#123D28] to-[#0B2E1C] text-white border-[#C89B2E] shadow-md'
                  : 'bg-white text-[#16241A] border-stone-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isNext ? 'text-[#FBBF24]' : 'text-[#5D6B5A]'
                    }`}
                  >
                    {t(prayer)}
                  </span>
                  {isNext && (
                    <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-ping" />
                  )}
                </div>

                <p
                  className={`text-2xl font-extrabold mt-2 tabular-nums tracking-tight ${
                    isNext ? 'text-white' : 'text-[#16241A]'
                  }`}
                >
                  {time}
                </p>
              </div>

              {isFardh && (
                <div className="mt-4 pt-3 border-t border-stone-100/20">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => logPrayer(prayer, 'on-time')}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-colors ${
                        status === 'on-time'
                          ? 'bg-[#2E8B4F] text-white'
                          : isNext
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-stone-100 text-[#16241A] hover:bg-stone-200'
                      }`}
                    >
                      {status === 'on-time' ? `✓ ${t('statusOnTime')}` : t('statusOnTime')}
                    </button>
                    <button
                      onClick={() => logPrayer(prayer, status === 'late' ? 'qada' : 'late')}
                      title="Mark Late or Qada"
                      className={`py-1 px-2 rounded-lg text-[10px] font-bold ${
                        status === 'late'
                          ? 'bg-amber-500 text-white'
                          : status === 'qada'
                          ? 'bg-red-500 text-white'
                          : isNext
                          ? 'bg-white/10 text-stone-300'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {status === 'late' ? t('statusLate') : status === 'qada' ? t('statusQada') : '···'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-right text-[11px] text-[#5D6B5A]">
        {t('prayerViaAladhan')}
      </div>

      {/* 3. TWO-COLUMN: Qada Counter & Sunnah Prayers Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QADA MAKE-UP RUNNING COUNTER */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C1541F]" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAE5D8] text-[#C1541F] flex items-center justify-center font-bold">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#16241A]">{t('qadaTracker')}</h3>
                <p className="text-xs text-[#5D6B5A]">{t('qadaDescription')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as (keyof typeof qadaCounts)[]).map((p) => {
              const count = qadaCounts[p];
              const prayerKey = (p.charAt(0).toUpperCase() + p.slice(1)) as PrayerName;
              return (
                <div
                  key={p}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold uppercase text-[#16241A]">{t(prayerKey)}</span>
                    <p className="text-[11px] text-[#5D6B5A]">{count} {t('daysRemaining')}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustQada(p, -1)}
                      disabled={count === 0}
                      className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white flex items-center justify-center font-bold transition-transform active:scale-95"
                      title={t('decrease')}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-base tabular-nums">
                      {count}
                    </span>
                    <button
                      onClick={() => adjustQada(p, 1)}
                      className="w-8 h-8 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 flex items-center justify-center font-bold transition-transform active:scale-95"
                      title={t('increase')}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SUNNAH & VOLUNTARY PRAYERS */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2E8B4F]" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E1F2E7] text-[#2E8B4F] flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#16241A]">{t('sunnahTracker')}</h3>
                <p className="text-xs text-[#5D6B5A]">{t('dailySunnahHabits')}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {[
              { type: 'tahajjud' as const, label: t('tahajjud'), defaultRakahs: 2 },
              { type: 'duha' as const, label: t('duha'), defaultRakahs: 4 },
              { type: 'witr' as const, label: t('witr'), defaultRakahs: 3 },
              { type: 'rawatib' as const, label: t('rawatib'), defaultRakahs: 2 },
            ].map((s) => (
              <button
                key={s.type}
                onClick={() => logSunnah(s.type, s.defaultRakahs)}
                className="p-3 rounded-xl border border-stone-200 hover:border-[#2E8B4F] text-left hover:bg-[#E1F2E7]/30 transition-all flex flex-col justify-between"
              >
                <span className="text-xs font-bold text-[#16241A]">{s.label}</span>
                <span className="text-[11px] font-semibold text-[#2E8B4F] mt-2 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> + {s.defaultRakahs} {t('rakahs')}
                </span>
              </button>
            ))}
          </div>

          {/* Recent Sunnah Logs */}
          <div className="pt-3 border-t border-stone-100">
            <h4 className="text-xs font-bold text-[#5D6B5A] uppercase mb-2">{t('sunnahTracker')}</h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {sunnahLogs.length === 0 ? (
                <p className="text-xs text-[#5D6B5A] italic">No voluntary prayers logged today yet.</p>
              ) : (
                sunnahLogs.slice(0, 5).map((l) => (
                  <div key={l.id} className="text-xs flex items-center justify-between p-2 rounded-lg bg-stone-50">
                    <span className="font-semibold capitalize text-[#16241A]">{l.prayerType}</span>
                    <span className="text-[11px] font-bold text-[#2E8B4F]">{l.rakahs} {t('rakahs')}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
