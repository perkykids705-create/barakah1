import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import {
  RotateCcw,
  Sparkles,
  Calendar,
  Heart,
  Check,
  Volume2,
  BookOpen,
  Edit3,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Plus,
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
    deleteDailyReflection,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  const [activeTab, setActiveTab] = useState<'tasbih' | 'journal' | 'calendar'>('tasbih');

  // Journal state
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedJournalDate, setSelectedJournalDate] = useState<string>(todayStr);

  const activeReflection = dailyReflections[selectedJournalDate] || {
    date: selectedJournalDate,
    niyyah: '',
    gratitude: '',
    reflection: '',
  };

  const [niyyahInput, setNiyyahInput] = useState(activeReflection.niyyah);
  const [gratitudeInput, setGratitudeInput] = useState(activeReflection.gratitude);
  const [reflectionInput, setReflectionInput] = useState(activeReflection.reflection);
  const [journalSearch, setJournalSearch] = useState('');

  // Synchronize inputs when selectedJournalDate changes
  React.useEffect(() => {
    const target = dailyReflections[selectedJournalDate] || {
      date: selectedJournalDate,
      niyyah: '',
      gratitude: '',
      reflection: '',
    };
    setNiyyahInput(target.niyyah || '');
    setGratitudeInput(target.gratitude || '');
    setReflectionInput(target.reflection || '');
  }, [selectedJournalDate, dailyReflections]);

  const currentDhikr = dhikrPresets.find((d) => d.key === currentDhikrKey) || dhikrPresets[0];

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    saveDailyReflection(selectedJournalDate, {
      date: selectedJournalDate,
      niyyah: niyyahInput,
      gratitude: gratitudeInput,
      reflection: reflectionInput,
    });
  };

  const handleLoadEntryToEdit = (date: string) => {
    setSelectedJournalDate(date);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pastEntriesList = Object.values(dailyReflections)
    .filter((entry) => entry && (entry.niyyah || entry.gratitude || entry.reflection))
    .sort((a, b) => b.date.localeCompare(a.date));

  const filteredEntries = pastEntriesList.filter((entry) => {
    if (!journalSearch.trim()) return true;
    const q = journalSearch.toLowerCase();
    return (
      entry.date.includes(q) ||
      entry.niyyah?.toLowerCase().includes(q) ||
      entry.gratitude?.toLowerCase().includes(q) ||
      entry.reflection?.toLowerCase().includes(q)
    );
  });

  const formatDateLabel = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const islamicEvents = [
    { title: 'Ramadan 1st (Estimated)', hijri: '1 Ramadan 1448 AH', daysLeft: '45 days' },
    { title: 'Laylatul Qadr (Night of Power)', hijri: '27 Ramadan 1448 AH', daysLeft: '72 days' },
    { title: 'Eid al-Fitr', hijri: '1 Shawwal 1448 AH', daysLeft: '75 days' },
    { title: 'Day of Arafah', hijri: '9 Dhu al-Hijjah 1448 AH', daysLeft: '145 days' },
    { title: 'Eid al-Adha', hijri: '10 Dhu al-Hijjah 1448 AH', daysLeft: '146 days' },
    { title: 'Islamic New Year', hijri: '1 Muharram 1449 AH', daysLeft: '175 days' },
    { title: 'Day of Ashura', hijri: '10 Muharram 1449 AH', daysLeft: '184 days' },
    { title: 'Eid Milad un Nabi (Mawlid)', hijri: '12 Rabi al-Awwal 1449 AH', daysLeft: '245 days' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. SUB-TABS */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-stone-200 pb-3">
        {[
          { id: 'tasbih' as const, label: t('digitalTasbih') },
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

      {/* 3. TAB 2: DAILY GRATITUDE & NIYYAH JOURNAL */}
      {activeTab === 'journal' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#0E8C74] uppercase tracking-wider mb-1">
                <Heart className="w-4 h-4 text-emerald-600" />
                <span>Spiritual Anchoring & Muhasabah</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#16241A] tracking-tight">
                {t('gratitudeJournal')}
              </h3>
              <p className="text-sm sm:text-base text-stone-600 font-medium mt-1">
                Start your day with sincere intention (Niyyah), count your blessings with gratitude (Shukr), and reflect on personal growth.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-center">
                <span className="text-xxs font-extrabold uppercase text-emerald-700 tracking-wider block">Total Entries</span>
                <span className="text-xl sm:text-2xl font-black text-[#0B2E1C] tabular-nums">{pastEntriesList.length}</span>
              </div>
            </div>
          </div>

          {/* COMPOSER CARD: Write or Edit an Entry */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0E8C74] to-[#2E8B4F]" />

            {/* Date Selection & Context Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0E8C74] flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#16241A]">
                    {selectedJournalDate === todayStr ? "Today's Intention & Gratitude" : `Entry for ${formatDateLabel(selectedJournalDate)}`}
                  </h4>
                  <span className="text-xs text-stone-500 font-medium">
                    {dailyReflections[selectedJournalDate] ? "Existing entry loaded (you can edit and save updates below)" : "Compose your reflection for this day"}
                  </span>
                </div>
              </div>

              {/* Date Input & Quick Today Button */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <input
                  type="date"
                  value={selectedJournalDate}
                  onChange={(e) => setSelectedJournalDate(e.target.value)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-bold text-stone-800 bg-white shadow-2xs outline-none focus:border-[#0E8C74] cursor-pointer"
                />
                {selectedJournalDate !== todayStr && (
                  <button
                    type="button"
                    onClick={() => setSelectedJournalDate(todayStr)}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-extrabold transition-all cursor-pointer"
                  >
                    Today
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSaveJournal} className="space-y-5">
              {/* 1. Niyyah */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{t('niyyahHeading')} (Morning Intention)</span>
                  </label>
                  <span className="text-xxs font-bold text-stone-400">Pure purpose for Allah</span>
                </div>
                <textarea
                  rows={2}
                  placeholder={t('niyyahPlaceholder') || "e.g. To guard my speech, pray all prayers with presence, and help someone in need today..."}
                  value={niyyahInput}
                  onChange={(e) => setNiyyahInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-[#0E8C74] outline-none text-sm sm:text-base font-medium transition-all shadow-xxs"
                />
              </div>

              {/* 2. Gratitude (Shukr) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>{t('gratitudeHeading')} (Shukr)</span>
                  </label>
                  <span className="text-xxs font-bold text-stone-400">Blessings you cherish today</span>
                </div>
                <textarea
                  rows={3}
                  placeholder={t('gratitudeToolsPlaceholder') || "1. Alhamdulillah for waking up in good health\n2. Peaceful roof over my family\n3. An open door to make du'a..."}
                  value={gratitudeInput}
                  onChange={(e) => setGratitudeInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-[#0E8C74] outline-none text-sm sm:text-base font-medium transition-all shadow-xxs"
                />
              </div>

              {/* 3. Reflection (Tadabbur & Muhasabah) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>{t('reflectionHeading')} (Tadabbur & Muhasabah)</span>
                  </label>
                  <span className="text-xxs font-bold text-stone-400">Ayah, lesson, or evening introspection</span>
                </div>
                <textarea
                  rows={3}
                  placeholder={t('reflectionToolsPlaceholder') || "e.g. Hadith or Ayah that resonated with me today, how I reacted to a trial, or du'as answered..."}
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-[#0E8C74] outline-none text-sm sm:text-base font-medium transition-all shadow-xxs"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-stone-500 font-medium">
                  {dailyReflections[selectedJournalDate] && (
                    <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Saved in journal log
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {(niyyahInput || gratitudeInput || reflectionInput) && (
                    <button
                      type="button"
                      onClick={() => {
                        setNiyyahInput('');
                        setGratitudeInput('');
                        setReflectionInput('');
                      }}
                      className="px-4 py-3 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Clear Fields
                    </button>
                  )}

                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-2xl bg-[#0E8C74] hover:bg-[#0b705d] text-white font-black text-sm uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                    <span>{dailyReflections[selectedJournalDate] ? "Update Reflection" : t('saveReflectionBtn')}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* PAST ENTRIES & REFLECTIONS TIMELINE (Where entries display) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="text-xl sm:text-2xl font-black text-[#16241A] tracking-tight">
                    Your Reflection History & Past Entries
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-stone-100 text-stone-700">
                    {pastEntriesList.length}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
                  Revisit your spiritual journey, intentions, and counted blessings over time.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reflections..."
                  value={journalSearch}
                  onChange={(e) => setJournalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold outline-none focus:border-[#0E8C74]"
                />
              </div>
            </div>

            {/* List of Entries */}
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0E8C74] flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h5 className="text-base font-bold text-stone-800">
                  {journalSearch ? "No reflections matching your search" : "No journal entries yet"}
                </h5>
                <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                  {journalSearch
                    ? "Try searching for a different keyword, Surah, or blessing."
                    : "Set your first intention (Niyyah) or write what you are grateful for using the form above."}
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredEntries.map((entry) => {
                  const isToday = entry.date === todayStr;
                  const isSelectedForEdit = entry.date === selectedJournalDate;

                  return (
                    <div
                      key={entry.date}
                      className={`rounded-2xl p-5 sm:p-6 border transition-all space-y-4 ${
                        isSelectedForEdit
                          ? 'bg-emerald-50/40 border-[#0E8C74] ring-2 ring-[#0E8C74]/20 shadow-xs'
                          : 'bg-stone-50/70 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {/* Entry Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-base text-[#16241A]">
                            {formatDateLabel(entry.date)}
                          </span>
                          {isToday && (
                            <span className="px-2.5 py-0.5 rounded-full text-xxs font-black uppercase tracking-wider bg-[#0E8C74] text-white">
                              Today
                            </span>
                          )}
                          <span className="text-xs text-stone-400 font-mono">
                            {entry.date}
                          </span>
                        </div>

                        {/* Actions: Edit & Delete */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleLoadEntryToEdit(entry.date)}
                            className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-stone-600" />
                            <span>Edit in Composer</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete reflection for ${entry.date}?`)) {
                                deleteDailyReflection(entry.date);
                              }
                            }}
                            className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Entry Content Blocks */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Niyyah Block */}
                        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1.5">
                          <span className="text-xxs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Niyyah (Intention)</span>
                          </span>
                          <p className="text-xs sm:text-sm text-stone-800 font-semibold leading-relaxed whitespace-pre-wrap">
                            {entry.niyyah || <span className="text-stone-400 italic">No intention noted</span>}
                          </p>
                        </div>

                        {/* Gratitude Block */}
                        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60 space-y-1.5">
                          <span className="text-xxs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Shukr (Gratitude)</span>
                          </span>
                          <p className="text-xs sm:text-sm text-stone-800 font-semibold leading-relaxed whitespace-pre-wrap">
                            {entry.gratitude || <span className="text-stone-400 italic">No gratitude recorded</span>}
                          </p>
                        </div>

                        {/* Reflection Block */}
                        <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200/60 space-y-1.5">
                          <span className="text-xxs font-extrabold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                            <span>Tadabbur (Reflection)</span>
                          </span>
                          <p className="text-xs sm:text-sm text-stone-800 font-semibold leading-relaxed whitespace-pre-wrap">
                            {entry.reflection || <span className="text-stone-400 italic">No reflection recorded</span>}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
