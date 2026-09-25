import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { PrayerName, PrayerStatus } from '../../types';
import {
  CALCULATION_METHODS,
  getAllCountries,
  getCitiesForCountry,
  findLocationByCountryAndCity,
} from '../../services/prayerService';
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

  const currentCountry = currentUser?.location?.country || 'Saudi Arabia';
  const currentCity = currentUser?.location?.city || 'Makkah';

  const countries = useMemo(() => {
    const list = getAllCountries();
    if (currentCountry && !list.includes(currentCountry)) {
      return [currentCountry, ...list];
    }
    return list;
  }, [currentCountry]);

  const citiesInCurrentCountry = useMemo(() => {
    const list = getCitiesForCountry(currentCountry);
    if (currentUser?.location) {
      if (!list.some((c) => c.city.toLowerCase() === currentUser.location.city.toLowerCase())) {
        return [currentUser.location, ...list];
      }
    }
    return list;
  }, [currentCountry, currentUser]);

  const handleCountryChange = (countryName: string) => {
    const cities = getCitiesForCountry(countryName);
    if (cities.length > 0 && currentUser) {
      updateProfile({ location: cities[0] });
    }
  };

  const handleCityChange = (cityName: string) => {
    const matched = citiesInCurrentCountry.find((c) => c.city === cityName);
    if (matched && currentUser) {
      updateProfile({ location: matched });
      return;
    }
    const loc = findLocationByCountryAndCity(currentCountry, cityName);
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
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#2E8B4F]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16241A] tracking-tight">{t('navPrayer')}</h2>
          </div>
          <p className="text-sm sm:text-base text-stone-600 font-medium mt-1">
            {t('aladhanPrecisionInfo')}
          </p>
        </div>

        {/* Quick Location (Country -> City) & Madhab Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 text-sm">
          {/* Country Selector */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-100 border border-stone-200">
            <MapPin className="w-3.5 h-3.5 text-[#2E8B4F] shrink-0" />
            <select
              value={currentCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="bg-transparent font-bold text-[#16241A] outline-none cursor-pointer text-xs sm:text-sm max-w-[130px] truncate"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-100 border border-stone-200">
            <select
              value={currentCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="bg-transparent font-bold text-[#16241A] outline-none cursor-pointer text-xs sm:text-sm max-w-[120px] truncate"
            >
              {citiesInCurrentCountry.map((loc) => (
                <option key={loc.city} value={loc.city}>
                  {loc.city}
                </option>
              ))}
            </select>
          </div>

          {/* Coordinates Chip */}
          {currentUser?.location && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#2E8B4F]/10 border border-[#2E8B4F]/20 text-[#2E8B4F] text-xs font-mono font-bold">
              <span>{currentUser.location.latitude.toFixed(2)}°, {currentUser.location.longitude.toFixed(2)}°</span>
            </div>
          )}

          {/* Madhab */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-100 border border-stone-200">
            <span className="text-stone-500 font-semibold text-xs">{t('Asr')}:</span>
            <select
              value={currentUser?.madhab || 'shafi'}
              onChange={(e) => handleMadhabChange(e.target.value as 'shafi' | 'hanafi')}
              className="bg-transparent font-bold text-[#16241A] outline-none cursor-pointer capitalize text-xs sm:text-sm"
            >
              <option value="shafi">{t('standardMadhab')}</option>
              <option value="hanafi">{t('hanafiMadhab')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S PRAYER TIMES TABLE */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {prayersList.map((prayer) => {
          const isNext = nextPrayerInfo?.nextPrayer === prayer;
          const time = prayerTimes ? prayerTimes[prayer] : '--:--';
          const status = getStatus(prayer);
          const isFardh = prayer !== 'Sunrise';

          return (
            <div
              key={prayer}
              className={`rounded-3xl p-5 sm:p-6 border transition-all flex flex-col justify-between ${
                isNext
                  ? 'bg-gradient-to-b from-[#123D28] to-[#0B2E1C] text-white border-[#C89B2E] shadow-md ring-2 ring-[#C89B2E]/40'
                  : 'bg-white text-[#16241A] border-stone-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm sm:text-base font-extrabold uppercase tracking-wider ${
                      isNext ? 'text-[#FBBF24]' : 'text-stone-600'
                    }`}
                  >
                    {t(prayer)}
                  </span>
                  {isNext && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] animate-ping" />
                  )}
                </div>

                <p
                  className={`text-2xl sm:text-3xl font-black mt-2.5 tabular-nums tracking-tight ${
                    isNext ? 'text-white' : 'text-[#16241A]'
                  }`}
                >
                  {time}
                </p>
              </div>

              {isFardh && (
                <div className="mt-4 pt-3.5 border-t border-stone-200/50">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => logPrayer(prayer, 'on-time')}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                        status === 'on-time'
                          ? 'bg-[#2E8B4F] text-white shadow-xs'
                          : isNext
                          ? 'bg-white/20 text-white hover:bg-white/30'
                          : 'bg-stone-100 text-[#16241A] hover:bg-stone-200'
                      }`}
                    >
                      {status === 'on-time' ? `✓ ${t('statusOnTime')}` : t('statusOnTime')}
                    </button>
                    <button
                      onClick={() => logPrayer(prayer, status === 'late' ? 'qada' : 'late')}
                      title="Mark Late or Qada"
                      className={`py-2 px-2.5 rounded-xl text-xs font-black cursor-pointer transition-colors ${
                        status === 'late'
                          ? 'bg-amber-500 text-white'
                          : status === 'qada'
                          ? 'bg-red-500 text-white'
                          : isNext
                          ? 'bg-white/20 text-stone-200 hover:bg-white/30'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
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

      <div className="text-right text-xs sm:text-sm text-stone-500 font-medium">
        {t('prayerViaAladhan')}
      </div>

      {/* 3. TWO-COLUMN: Qada Counter & Sunnah Prayers Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QADA MAKE-UP RUNNING COUNTER */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C1541F]" />
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FAE5D8] text-[#C1541F] flex items-center justify-center font-bold shadow-xs">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('qadaTracker')}</h3>
                <p className="text-sm sm:text-base text-stone-600 font-medium">{t('qadaDescription')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as (keyof typeof qadaCounts)[]).map((p) => {
              const count = qadaCounts[p];
              const prayerKey = (p.charAt(0).toUpperCase() + p.slice(1)) as PrayerName;
              return (
                <div
                  key={p}
                  className="p-4 sm:p-4.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between"
                >
                  <div>
                    <span className="text-base sm:text-lg font-bold uppercase text-[#16241A]">{t(prayerKey)}</span>
                    <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">{count} {t('daysRemaining')}</p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => adjustQada(p, -1)}
                      disabled={count === 0}
                      className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 text-white flex items-center justify-center font-bold transition-transform active:scale-95 cursor-pointer shadow-xs"
                      title={t('decrease')}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-12 text-center font-black text-xl sm:text-2xl tabular-nums text-[#16241A]">
                      {count}
                    </span>
                    <button
                      onClick={() => adjustQada(p, 1)}
                      className="w-10 h-10 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 flex items-center justify-center font-bold transition-transform active:scale-95 cursor-pointer shadow-xs"
                      title={t('increase')}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SUNNAH & VOLUNTARY PRAYERS */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2E8B4F]" />
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#E1F2E7] text-[#2E8B4F] flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('sunnahTracker')}</h3>
                <p className="text-sm sm:text-base text-stone-600 font-medium">{t('dailySunnahHabits')}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 mb-5">
            {[
              { type: 'tahajjud' as const, label: t('tahajjud'), defaultRakahs: 2 },
              { type: 'duha' as const, label: t('duha'), defaultRakahs: 4 },
              { type: 'witr' as const, label: t('witr'), defaultRakahs: 3 },
              { type: 'rawatib' as const, label: t('rawatib'), defaultRakahs: 2 },
            ].map((s) => (
              <button
                key={s.type}
                onClick={() => logSunnah(s.type, s.defaultRakahs)}
                className="p-4 sm:p-4.5 rounded-2xl border border-stone-200 hover:border-[#2E8B4F] text-left hover:bg-[#E1F2E7]/40 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <span className="text-base font-bold text-[#16241A] leading-snug group-hover:text-[#2E8B4F] transition-colors">{s.label}</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#2E8B4F] mt-3 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg self-start border border-emerald-200/60">
                  <Plus className="w-4 h-4" /> + {s.defaultRakahs} {t('rakahs')}
                </span>
              </button>
            ))}
          </div>

          {/* Recent Sunnah Logs */}
          <div className="pt-4 border-t border-stone-200/80">
            <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">{t('sunnahTracker')}</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sunnahLogs.length === 0 ? (
                <p className="text-sm text-stone-500 italic p-3 bg-stone-50 rounded-xl">No voluntary prayers logged today yet.</p>
              ) : (
                sunnahLogs.slice(0, 5).map((l) => (
                  <div key={l.id} className="text-sm sm:text-base flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="font-bold capitalize text-[#16241A]">{l.prayerType}</span>
                    <span className="text-xs sm:text-sm font-black text-[#2E8B4F] bg-emerald-100/60 px-2.5 py-1 rounded-lg">{l.rakahs} {t('rakahs')}</span>
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
