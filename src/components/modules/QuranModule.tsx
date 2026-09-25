import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { SURAHS_LIST, SAMPLE_VERSES, calculateNextSpacedRevision } from '../../services/quranData';
import { SurahMeta, HifzRecord } from '../../types';
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  Search,
  Bookmark,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Check,
  Award,
} from 'lucide-react';

export const QuranModule: React.FC = () => {
  const {
    language,
    readingLogs,
    logQuranReading,
    khatmGoal,
    updateKhatmGoal,
    hifzRecords,
    updateHifzStatus,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  const [activeTab, setActiveTab] = useState<'reading' | 'surahs' | 'hifz'>('reading');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);

  // Page logging inputs
  const [pagesInput, setPagesInput] = useState<number>(10);
  const [juzInput, setJuzInput] = useState<number>(1);
  const [notesInput, setNotesInput] = useState<string>('');

  const filteredSurahs = SURAHS_LIST.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.arabicName.includes(searchQuery) ||
      s.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString() === searchQuery.trim()
  );

  const khatmPercent = Math.min(100, Math.round((khatmGoal.currentPagesRead / khatmGoal.totalPages) * 100));

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pagesInput > 0) {
      logQuranReading(Number(pagesInput), Number(juzInput), notesInput);
      setNotesInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. MODULE SUB-NAV TABS */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => { setActiveTab('reading'); setSelectedSurah(null); }}
            className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
              activeTab === 'reading' && !selectedSurah
                ? 'bg-[#C89B2E] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('readingKhatmPacing')}
          </button>
          <button
            onClick={() => setActiveTab('surahs')}
            className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
              activeTab === 'surahs' || selectedSurah
                ? 'bg-[#C89B2E] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('surahReader')}
          </button>
          <button
            onClick={() => { setActiveTab('hifz'); setSelectedSurah(null); }}
            className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
              activeTab === 'hifz'
                ? 'bg-[#C89B2E] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t('hifzTrackerTab')}
          </button>
        </div>
      </div>

      {/* 2. TAB 1: READING & KHATM PACING */}
      {activeTab === 'reading' && !selectedSurah && (
        <div className="space-y-6">
          {/* Khatm Pacing Hero Card */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#C89B2E]" />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#C89B2E] uppercase tracking-wider mb-2">
                  <Award className="w-5 h-5" />
                  <span>{t('khatmProgress')}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#16241A] tracking-tight">
                  {khatmGoal.currentPagesRead} / {khatmGoal.totalPages}
                </h3>
                <p className="text-sm sm:text-base text-stone-600 font-medium mt-1">
                  {t('dailyGoalPages')}: <span className="font-bold text-[#16241A]">{khatmGoal.targetPagesPerDay} pgs/day</span> · {t('projectedFinish')}:{' '}
                  <span className="font-bold text-[#16241A]">{khatmGoal.targetFinishDate}</span>
                </p>
              </div>

              {/* Goal modifier */}
              <div className="flex items-center gap-2.5 bg-stone-50 p-2.5 rounded-2xl border border-stone-200">
                <span className="text-sm text-stone-600 font-bold">{t('dailyGoalPages')}:</span>
                {[10, 20, 30].map((pg) => (
                  <button
                    key={pg}
                    onClick={() => updateKhatmGoal(pg)}
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                      khatmGoal.targetPagesPerDay === pg
                        ? 'bg-[#C89B2E] text-white shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80'
                    }`}
                  >
                    {pg} pgs
                  </button>
                ))}
              </div>
            </div>

            {/* Thick Legible Progress Bar */}
            <div className="mt-6 space-y-2.5">
              <div className="flex justify-between text-sm sm:text-base font-bold">
                <span className="text-[#C89B2E]">{khatmPercent}% Complete</span>
                <span className="text-stone-500">{(604 - khatmGoal.currentPagesRead)} {t('pagesLeft')}</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden p-0.5 border border-stone-200/60">
                <div
                  className="bg-gradient-to-r from-[#C89B2E] to-[#FBBF24] h-full rounded-full transition-all duration-500"
                  style={{ width: `${khatmPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Log Pages Form & Recent Log List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
              <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5 flex items-center gap-2.5">
                <Bookmark className="w-5 h-5 text-[#C89B2E]" />
                <span>{t('logPages')}</span>
              </h4>

              <form onSubmit={handleLogSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">
                    {t('pagesReadToday')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="604"
                    value={pagesInput}
                    onChange={(e) => setPagesInput(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none focus:border-[#C89B2E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">
                    {t('juzParaLabel')} (1–30)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={juzInput}
                    onChange={(e) => setJuzInput(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none focus:border-[#C89B2E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1.5">
                    {t('notesPlaceholder')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('notesPlaceholder')}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base outline-none focus:border-[#C89B2E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#C89B2E] hover:bg-[#b88c24] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                >
                  {t('recordReadingBtn')}
                </button>
              </form>
            </div>

            {/* Recent Reading History */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
              <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5">
                Reading History & Insights
              </h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {readingLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 sm:p-4.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="text-base font-bold text-[#16241A]">
                        {log.pagesRead} Pages Read · Juz {log.juz}
                      </p>
                      {log.notes && <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">{log.notes}</p>}
                    </div>
                    <span className="text-xs sm:text-sm text-stone-500 font-semibold bg-white px-3 py-1 rounded-xl border border-stone-200/60">{log.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB 2: SURAH DIRECTORY & FULL READING VIEW */}
      {(activeTab === 'surahs' || selectedSurah) && (
        <div className="space-y-6">
          {selectedSurah ? (
            /* IN-DEPTH READER VIEW */
            <div className="bg-white rounded-3xl p-6 lg:p-10 border border-stone-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between pb-5 border-b border-stone-200/80">
                <button
                  onClick={() => setSelectedSurah(null)}
                  className="text-sm sm:text-base font-bold text-[#C89B2E] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  ← Back to Surah Catalog
                </button>
                <div className="text-right">
                  <span className="text-sm font-semibold text-stone-500">Surah {selectedSurah.number}</span>
                  <h3 className="text-2xl font-bold font-serif text-[#16241A]">{selectedSurah.name} ({selectedSurah.arabicName})</h3>
                </div>
              </div>

              {/* Verses Container */}
              <div className="space-y-8 max-w-3xl mx-auto">
                {SAMPLE_VERSES[selectedSurah.number] ? (
                  SAMPLE_VERSES[selectedSurah.number].map((ayah) => (
                    <div key={ayah.ayahNumber} className="space-y-3 pb-6 border-b border-stone-200/70">
                      {/* Arabic Ayah in Scheherazade New */}
                      <p
                        dir="rtl"
                        className="text-3xl lg:text-4xl leading-loose font-arabic text-[#0B2E1C] text-right font-normal"
                      >
                        {ayah.arabic} <span className="text-xl font-sans text-[#C89B2E]">({ayah.ayahNumber})</span>
                      </p>
                      {/* Transliteration */}
                      <p className="text-sm italic text-stone-600 font-medium">{ayah.transliteration}</p>
                      {/* Translation */}
                      <p className="text-base sm:text-lg font-medium text-[#16241A] leading-relaxed">
                        {ayah.translation}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-5xl font-arabic text-[#0B2E1C]">{selectedSurah.arabicName}</p>
                    <p className="text-xl text-[#16241A] font-bold">
                      Surah {selectedSurah.name} ({selectedSurah.englishTranslation})
                    </p>
                    <p className="text-sm sm:text-base text-stone-600 font-medium">
                      {selectedSurah.totalVerses} Verses · Revealed in {selectedSurah.revelationType} · Juz {selectedSurah.juz}
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          logQuranReading(Math.ceil(selectedSurah.totalVerses / 15), selectedSurah.juz, `Recited Surah ${selectedSurah.name}`);
                          setSelectedSurah(null);
                        }}
                        className="px-6 py-3 rounded-2xl bg-[#2E8B4F] text-white font-extrabold text-sm sm:text-base shadow-sm hover:bg-[#257341] cursor-pointer"
                      >
                        ✓ Mark Surah Recited & Log Pages
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* SURAH DIRECTORY BROWSER */
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-4 text-stone-400" />
                <input
                  type="text"
                  placeholder={t('searchSurahPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-stone-200 bg-white text-base font-medium outline-none focus:border-[#C89B2E] shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSurahs.map((surah) => (
                  <div
                    key={surah.number}
                    onClick={() => setSelectedSurah(surah)}
                    className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-[#C89B2E] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-10 h-10 rounded-xl bg-stone-100 text-[#16241A] text-sm font-bold flex items-center justify-center tabular-nums">
                        {surah.number}
                      </span>
                      <div>
                        <p className="text-base font-bold text-[#16241A]">{surah.name}</p>
                        <p className="text-xs sm:text-sm text-stone-600 font-medium">
                          {surah.englishTranslation} · {surah.totalVerses} Ayahs
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold font-arabic text-[#C89B2E]">
                      {surah.arabicName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 3: HIFZ (MEMORIZATION) TRACKER */}
      {activeTab === 'hifz' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] mb-1 tracking-tight">
              Surah-by-Surah Memorization & Revision Scheduler
            </h3>
            <p className="text-sm sm:text-base text-stone-600 font-medium mb-5">
              Spaced repetition intervals schedule automatic review dates so you never forget memorized verses.
            </p>

            <div className="space-y-3.5">
              {SURAHS_LIST.slice(0, 15).map((surah) => {
                const record = hifzRecords[surah.number] || {
                  surahNumber: surah.number,
                  status: 'not-started',
                  masteryLevel: 0,
                };

                return (
                  <div
                    key={surah.number}
                    className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-sm font-extrabold flex items-center justify-center text-[#16241A]">
                        {surah.number}
                      </span>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-base sm:text-lg font-bold text-[#16241A]">{surah.name}</span>
                          <span className="text-sm sm:text-base font-arabic text-[#C89B2E] font-bold">{surah.arabicName}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                          Status: <span className="font-bold uppercase text-[#16241A]">{record.status}</span>
                          {record.nextRevisionDue && ` · Next revision: ${record.nextRevisionDue}`}
                        </p>
                      </div>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => updateHifzStatus(surah.number, 'not-started')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                          record.status === 'not-started'
                            ? 'bg-stone-300 text-stone-900 shadow-2xs'
                            : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        Not Started
                      </button>
                      <button
                        onClick={() => updateHifzStatus(surah.number, 'in-progress')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                          record.status === 'in-progress'
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateHifzStatus(surah.number, 'memorized')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                          record.status === 'memorized'
                            ? 'bg-[#2E8B4F] text-white shadow-2xs'
                            : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        Memorized
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
