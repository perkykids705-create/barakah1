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
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        {[
          { id: 'tasbih' as const, label: t('digitalTasbih') },
          { id: 'qibla' as const, label: t('qiblaCompass') },
          { id: 'journal' as const, label: t('gratitudeJournal') },
          { id: 'calendar' as const, label: t('islamicEvents') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === tab.id
                ? 'bg-[#0E8C74] text-white shadow-xs'
                : 'text-[#5D6B5A] hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. TAB 1: DIGITAL TASBIH COUNTER (Tactile press-and-bounce per PRD §4.7) */}
      {activeTab === 'tasbih' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#0E8C74]" />

            {/* Dhikr Selector */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-[#5D6B5A] uppercase">Select Adhkar</span>
              <select
                value={currentDhikrKey}
                onChange={(e) => {
                  setCurrentDhikrKey(e.target.value);
                  resetTasbih();
                }}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold outline-none"
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
              <h3 className="text-3xl lg:text-4xl font-arabic text-[#0B2E1C] leading-relaxed">
                {currentDhikr.arabic}
              </h3>
              <p className="text-sm font-semibold text-[#16241A]">{currentDhikr.transliteration}</p>
              <p className="text-xs text-[#5D6B5A]">"{currentDhikr.translation}"</p>
            </div>

            {/* Large tactile counting button */}
            <div className="relative py-4 flex flex-col items-center justify-center">
              <button
                onClick={incrementTasbih}
                className="w-48 h-48 rounded-full bg-gradient-to-b from-[#0B2E1C] to-[#123D28] text-white flex flex-col items-center justify-center shadow-xl active:scale-95 transition-all cursor-pointer border-8 border-[#0E8C74]/30 hover:border-[#0E8C74]"
              >
                <span className="text-5xl font-extrabold text-[#FBBF24] tabular-nums tracking-tight">
                  {tasbihCount}
                </span>
                <span className="text-xs text-[#9FB6A3] font-medium mt-1">
                  Target: {currentDhikr.defaultTarget}
                </span>
              </button>

              <button
                onClick={resetTasbih}
                className="mt-6 flex items-center gap-1.5 text-xs text-[#5D6B5A] hover:text-[#16241A] font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
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
            <h3 className="text-xl font-extrabold text-[#16241A] mb-1">{t('qiblaCompass')}</h3>
            <p className="text-xs text-[#5D6B5A] mb-6">
              Calculated for {currentUser?.location.city}, {currentUser?.location.country}
            </p>

            {/* Compass dial */}
            <div className="relative w-64 h-64 mx-auto my-6 rounded-full border-4 border-stone-200 bg-stone-50 flex items-center justify-center shadow-inner">
              {/* Compass markings */}
              <span className="absolute top-2 text-xs font-bold text-red-600">N</span>
              <span className="absolute bottom-2 text-xs font-bold text-stone-400">S</span>
              <span className="absolute right-2 text-xs font-bold text-stone-400">E</span>
              <span className="absolute left-2 text-xs font-bold text-stone-400">W</span>

              {/* Bearing needle pointing towards Kaaba */}
              <div
                className="w-full h-full absolute flex items-center justify-center transition-transform duration-700"
                style={{ transform: `rotate(${qiblaBearing}deg)` }}
              >
                <div className="w-1.5 h-28 bg-gradient-to-t from-transparent via-[#C89B2E] to-[#2E8B4F] rounded-full relative">
                  <div className="w-4 h-4 bg-[#2E8B4F] rounded-full absolute -top-1 -left-1.5 border-2 border-white flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-[#FBBF24] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Center badge */}
              <div className="w-14 h-14 rounded-full bg-[#0B2E1C] text-[#FBBF24] flex items-center justify-center text-xs font-extrabold shadow-md z-10">
                Kaaba
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 inline-block">
              <p className="text-3xl font-extrabold text-[#0B2E1C] tabular-nums">
                {qiblaBearing}°
              </p>
              <p className="text-xs text-[#2E8B4F] font-semibold mt-0.5">
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
            <h3 className="text-xl font-extrabold text-[#16241A]">{t('gratitudeJournal')}</h3>
            <p className="text-xs text-[#5D6B5A]">Start and anchor your day with pure intention (Niyyah) and gratitude</p>
          </div>

          <form onSubmit={handleSaveJournal} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-[#5D6B5A] mb-1">
                {t('niyyahHeading')}
              </label>
              <textarea
                rows={2}
                placeholder={t('niyyahPlaceholder')}
                value={niyyahInput}
                onChange={(e) => setNiyyahInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-[#5D6B5A] mb-1">
                {t('gratitudeHeading')}
              </label>
              <textarea
                rows={3}
                placeholder={t('gratitudeToolsPlaceholder')}
                value={gratitudeInput}
                onChange={(e) => setGratitudeInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-[#5D6B5A] mb-1">
                {t('reflectionHeading')}
              </label>
              <textarea
                rows={3}
                placeholder={t('reflectionToolsPlaceholder')}
                value={reflectionInput}
                onChange={(e) => setReflectionInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#0E8C74] text-white font-bold text-xs uppercase tracking-wider"
            >
              {t('saveReflectionBtn')}
            </button>
          </form>
        </div>
      )}

      {/* 5. TAB 4: ISLAMIC CALENDAR EVENTS */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-xl font-extrabold text-[#16241A] mb-1">{t('islamicEvents')}</h3>
          <p className="text-xs text-[#5D6B5A] mb-4">Upcoming milestones in the Hijri lunar calendar</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {islamicEvents.map((evt, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#16241A]">{evt.title}</p>
                  <p className="text-xs text-[#5D6B5A] mt-0.5">{evt.hijri}</p>
                </div>
                <span className="text-xs font-bold text-[#0E8C74] bg-[#DAF3EC] px-2.5 py-1 rounded-lg">
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
