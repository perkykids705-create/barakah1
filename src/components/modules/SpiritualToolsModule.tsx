import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { calculateQiblaBearing } from '../../services/prayerService';
import {
  Compass,
  RotateCcw,
  Sparkles,
  Calendar,
  Heart,
  Check,
  Volume2,
} from 'lucide-react';

export const SpiritualToolsModule: React.FC = () => {
  const {
    currentUser,
    language,
    dhikrPresets,
    tasbihCount,
    currentDhikrKey,
    setCurrentDhikrKey,
    incrementTasbih,
    resetTasbih,
    dailyReflections,
    saveDailyReflection,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  const [activeTab, setActiveTab] = useState<'tasbih' | 'qibla' | 'journal' | 'calendar'>('tasbih');

  // Qibla calculations
  const lat = currentUser?.location.latitude || 51.5074;
  const lng = currentUser?.location.longitude || -0.1278;
  const qiblaBearing = calculateQiblaBearing(lat, lng);

  // Journal state
  const todayStr = new Date().toISOString().split('T')[0];
  const todayReflection = dailyReflections[todayStr] || {
    date: todayStr,
    niyyah: '',
    gratitude: '',
    reflection: '',
  };

  const [niyyahInput, setNiyyahInput] = useState(todayReflection.niyyah);
  const [gratitudeInput, setGratitudeInput] = useState(todayReflection.gratitude);
  const [reflectionInput, setReflectionInput] = useState(todayReflection.reflection);

  const currentDhikr = dhikrPresets.find((d) => d.key === currentDhikrKey) || dhikrPresets[0];

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    saveDailyReflection(todayStr, {
      date: todayStr,
      niyyah: niyyahInput,
      gratitude: gratitudeInput,
      reflection: reflectionInput,
    });
  };

  const islamicEvents = [
    { title: 'Ramadan 1st (Estimated)', hijri: '1 Ramadan 1448 AH', daysLeft: '45 days' },
    { title: 'Laylatul Qadr (Night of Power)', hijri: '27 Ramadan 1448 AH', daysLeft: '72 days' },
    { title: 'Eid al-Fitr', hijri: '1 Shawwal 1448 AH', daysLeft: '75 days' },
    { title: 'Day of Arafah', hijri: '9 Dhu al-Hijjah 1448 AH', daysLeft: '145 days' },
    { title: 'Eid al-Adha', hijri: '10 Dhu al-Hijjah 1448 AH', daysLeft: '146 days' },
    { title: 'Islamic New Year', hijri: '1 Muharram 1449 AH', daysLeft: '175 days' },
    { title: 'Day of Ashura', hijri: '10 Muharram 1449 AH', daysLeft: '184 days' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. SUB-TABS */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-stone-200 pb-3">
        {[
          { id: 'tasbih' as const, label: t('digitalTasbih') },
          { id: 'qibla' as const, label: t('qiblaCompass') },
          { id: 'journal' as const, label: t('gratitudeJournal') },
          { id: 'calendar' as const, label: t('islamicEvents') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0E8C74] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. TAB 1: DIGITAL TASBIH COUNTER */}
      {activeTab === 'tasbih' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#0E8C74]" />

            {/* Dhikr Selector */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs sm:text-sm font-bold text-stone-500 uppercase tracking-wider">Select Adhkar</span>
              <select
                value={currentDhikrKey}
                onChange={(e) => {
                  setCurrentDhikrKey(e.target.value);
                  resetTasbih();
                }}
                className="px-4 py-2 rounded-xl border border-stone-200 bg-stone-50 text-sm font-bold outline-none cursor-pointer"
              >
                {dhikrPresets.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.transliteration} ({d.defaultTarget}x)
                  </option>
                ))}
              </select>
            </div>

            {/* Arabic phrase */}
            <div className="space-y-2 mb-8">
              <h3 className="text-3xl lg:text-4xl font-arabic text-[#0B2E1C] leading-relaxed font-bold">
                {currentDhikr.arabic}
              </h3>
              <p className="text-base sm:text-lg font-bold text-[#16241A]">{currentDhikr.transliteration}</p>
              <p className="text-sm sm:text-base text-stone-600 font-medium max-w-md mx-auto">"{currentDhikr.translation}"</p>
            </div>

            {/* Large tactile counting button */}
            <div className="relative py-4 flex flex-col items-center justify-center">
              <button
                onClick={incrementTasbih}
                className="w-52 h-52 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-[#0B2E1C] via-[#123D28] to-[#1E5738] hover:brightness-110 text-white flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-all cursor-pointer border-8 border-[#0E8C74]/40 hover:border-[#0E8C74]"
              >
                <span className="text-5xl sm:text-6xl font-black text-[#FBBF24] tabular-nums tracking-tight">
                  {tasbihCount}
                </span>
                <span className="text-xs sm:text-sm text-[#C5E1D0] font-bold mt-1">
                  Target: {currentDhikr.defaultTarget}
                </span>
              </button>

              <button
                onClick={resetTasbih}
                className="mt-6 flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 font-bold px-4 py-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('resetCount')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB 2: QIBLA COMPASS */}
      {activeTab === 'qibla' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-sm text-center">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight mb-1">{t('qiblaCompass')}</h3>
            <p className="text-sm sm:text-base text-stone-600 font-medium mb-6">
              Calculated for {currentUser?.location.city}, {currentUser?.location.country}
            </p>

            {/* Compass dial */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-6 rounded-full border-4 border-stone-200 bg-stone-50 flex items-center justify-center shadow-inner">
              {/* Compass markings */}
              <span className="absolute top-2.5 text-sm font-extrabold text-red-600">N</span>
              <span className="absolute bottom-2.5 text-sm font-extrabold text-stone-400">S</span>
              <span className="absolute right-2.5 text-sm font-extrabold text-stone-400">E</span>
              <span className="absolute left-2.5 text-sm font-extrabold text-stone-400">W</span>

              {/* Bearing needle pointing towards Kaaba */}
              <div
                className="w-full h-full absolute flex items-center justify-center transition-transform duration-700"
                style={{ transform: `rotate(${qiblaBearing}deg)` }}
              >
                <div className="w-2 h-32 bg-gradient-to-t from-transparent via-[#C89B2E] to-[#2E8B4F] rounded-full relative">
                  <div className="w-5 h-5 bg-[#2E8B4F] rounded-full absolute -top-1 -left-1.5 border-2 border-white flex items-center justify-center shadow-xs">
                    <span className="w-2 h-2 bg-[#FBBF24] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Center badge */}
              <div className="w-16 h-16 rounded-full bg-[#0B2E1C] text-[#FBBF24] flex items-center justify-center text-sm font-black shadow-md z-10">
                Kaaba
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 inline-block shadow-2xs">
              <p className="text-3xl sm:text-4xl font-black text-[#0B2E1C] tabular-nums">
                {qiblaBearing}°
              </p>
              <p className="text-xs sm:text-sm text-[#2E8B4F] font-bold mt-1">
                {t('bearingTowardsKaaba')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 3: DAILY GRATITUDE & NIYYAH JOURNAL */}
      {activeTab === 'journal' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('gratitudeJournal')}</h3>
            <p className="text-sm sm:text-base text-stone-600 font-medium mt-0.5">Start and anchor your day with pure intention (Niyyah) and gratitude</p>
          </div>

          <form onSubmit={handleSaveJournal} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">
                {t('niyyahHeading')}
              </label>
              <textarea
                rows={2}
                placeholder={t('niyyahPlaceholder')}
                value={niyyahInput}
                onChange={(e) => setNiyyahInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 outline-none text-base font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">
                {t('gratitudeHeading')}
              </label>
              <textarea
                rows={3}
                placeholder={t('gratitudeToolsPlaceholder')}
                value={gratitudeInput}
                onChange={(e) => setGratitudeInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 outline-none text-base font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">
                {t('reflectionHeading')}
              </label>
              <textarea
                rows={3}
                placeholder={t('reflectionToolsPlaceholder')}
                value={reflectionInput}
                onChange={(e) => setReflectionInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 outline-none text-base font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#0E8C74] hover:bg-[#0b705d] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider cursor-pointer shadow-xs"
            >
              {t('saveReflectionBtn')}
            </button>
          </form>
        </div>
      )}

      {/* 5. TAB 4: ISLAMIC CALENDAR EVENTS */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-sm space-y-5">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight mb-1">{t('islamicEvents')}</h3>
          <p className="text-sm sm:text-base text-stone-600 font-medium mb-5">Upcoming milestones in the Hijri lunar calendar</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {islamicEvents.map((evt, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/70 flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-[#16241A]">{evt.title}</p>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">{evt.hijri}</p>
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-[#0E8C74] bg-[#DAF3EC] px-3.5 py-1.5 rounded-xl border border-[#0E8C74]/30">
                  {evt.daysLeft}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
