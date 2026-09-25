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
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveTab('reading'); setSelectedSurah(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'reading' && !selectedSurah
                ? 'bg-[#C89B2E] text-white shadow-sm'
                : 'text-[#5D6B5A] hover:bg-stone-100'
            }`}
          >
            {t('readingKhatmPacing')}
          </button>
          <button
            onClick={() => setActiveTab('surahs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'surahs' || selectedSurah
                ? 'bg-[#C89B2E] text-white shadow-sm'
                : 'text-[#5D6B5A] hover:bg-stone-100'
            }`}
          >
            {t('surahReader')}
          </button>
          <button
            onClick={() => { setActiveTab('hifz'); setSelectedSurah(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'hifz'
                ? 'bg-[#C89B2E] text-white shadow-sm'
                : 'text-[#5D6B5A] hover:bg-stone-100'
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
                <div className="flex items-center gap-2 text-xs font-bold text-[#C89B2E] uppercase tracking-wider mb-2">
                  <Award className="w-4 h-4" />
                  <span>{t('khatmProgress')}</span>
                </div>
                <h3 className="text-3xl font-extrabold text-[#16241A] tracking-tight">
                  {khatmGoal.currentPagesRead} / {khatmGoal.totalPages}
                </h3>
                <p className="text-xs text-[#5D6B5A] mt-1">
                  {t('dailyGoalPages')}: {khatmGoal.targetPagesPerDay} · {t('projectedFinish')}:{' '}
                  <span className="font-bold text-[#16241A]">{khatmGoal.targetFinishDate}</span>
                </p>
              </div>

              {/* Goal modifier */}
              <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200">
                <span className="text-xs text-[#5D6B5A] font-medium">{t('dailyGoalPages')}:</span>
                {[10, 20, 30].map((pg) => (
                  <button
                    key={pg}
                    onClick={() => updateKhatmGoal(pg)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      khatmGoal.targetPagesPerDay === pg
                        ? 'bg-[#C89B2E] text-white'
                        : 'bg-white text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {pg} pgs
                  </button>
                ))}
              </div>
            </div>

            {/* Thick Legible Progress Bar (PRD §4.5) */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#C89B2E]">{khatmPercent}% Complete</span>
                <span className="text-stone-400">{(604 - khatmGoal.currentPagesRead)} {t('pagesLeft')}</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3.5 overflow-hidden p-0.5">
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
            <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
              <h4 className="text-base font-bold text-[#16241A] mb-4 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#C89B2E]" />
                <span>{t('logPages')}</span>
              </h4>

              <form onSubmit={handleLogSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5D6B5A] mb-1">
                    {t('pagesReadToday')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="604"
                    value={pagesInput}
                    onChange={(e) => setPagesInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold outline-none focus:border-[#C89B2E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D6B5A] mb-1">
                    {t('juzParaLabel')} (1–30)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={juzInput}
                    onChange={(e) => setJuzInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold outline-none focus:border-[#C89B2E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D6B5A] mb-1">
                    {t('notesPlaceholder')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('notesPlaceholder')}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#C89B2E]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#C89B2E] hover:bg-[#b88c24] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  {t('recordReadingBtn')}
                </button>
              </form>
            </div>

            {/* Recent Reading History */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
              <h4 className="text-base font-bold text-[#16241A] mb-4">
                Reading History & Insights
              </h4>
              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {readingLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#16241A]">
                        {log.pagesRead} Pages Read · Juz {log.juz}
                      </p>
                      {log.notes && <p className="text-[11px] text-[#5D6B5A] mt-0.5">{log.notes}</p>}
                    </div>
                    <span className="text-[11px] text-[#5D6B5A] font-semibold">{log.date}</span>
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
            /* IN-DEPTH READER VIEW (PRD §4.3: Scheherazade New 30px/36px) */
            <div className="bg-white rounded-3xl p-6 lg:p-10 border border-stone-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <button
                  onClick={() => setSelectedSurah(null)}
                  className="text-xs font-bold text-[#C89B2E] hover:underline flex items-center gap-1"
                >
                  ← Back to Surah Catalog
                </button>
                <div className="text-right">
                  <span className="text-xs text-[#5D6B5A]">Surah {selectedSurah.number}</span>
                  <h3 className="text-xl font-bold font-serif text-[#16241A]">{selectedSurah.name} ({selectedSurah.arabicName})</h3>
                </div>
              </div>

              {/* Verses Container */}
              <div className="space-y-8 max-w-3xl mx-auto">
                {SAMPLE_VERSES[selectedSurah.number] ? (
                  SAMPLE_VERSES[selectedSurah.number].map((ayah) => (
                    <div key={ayah.ayahNumber} className="space-y-3 pb-6 border-b border-stone-100">
                      {/* Arabic Ayah in Scheherazade New */}
                      <p
                        dir="rtl"
                        className="text-3xl lg:text-4xl leading-loose font-arabic text-[#0B2E1C] text-right font-normal"
                      >
                        {ayah.arabic} <span className="text-xl font-sans text-[#C89B2E]">({ayah.ayahNumber})</span>
                      </p>
                      {/* Transliteration */}
                      <p className="text-xs italic text-[#5D6B5A]">{ayah.transliteration}</p>
                      {/* Translation */}
                      <p className="text-sm font-medium text-[#16241A] leading-relaxed">
                        {ayah.translation}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <p className="text-4xl font-arabic text-[#0B2E1C]">{selectedSurah.arabicName}</p>
                    <p className="text-base text-[#16241A] font-semibold">
                      Surah {selectedSurah.name} ({selectedSurah.englishTranslation})
                    </p>
                    <p className="text-xs text-[#5D6B5A]">
                      {selectedSurah.totalVerses} Verses · Revealed in {selectedSurah.revelationType} · Juz {selectedSurah.juz}
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          logQuranReading(Math.ceil(selectedSurah.totalVerses / 15), selectedSurah.juz, `Recited Surah ${selectedSurah.name}`);
                          setSelectedSurah(null);
                        }}
                        className="px-6 py-2.5 rounded-xl bg-[#2E8B4F] text-white font-bold text-xs shadow-sm hover:bg-[#257341]"
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
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder={t('searchSurahPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 bg-white text-sm outline-none focus:border-[#C89B2E] shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredSurahs.map((surah) => (
                  <div
                    key={surah.number}
                    onClick={() => setSelectedSurah(surah)}
                    className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#C89B2E] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-stone-100 text-[#16241A] text-xs font-bold flex items-center justify-center tabular-nums">
                        {surah.number}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-[#16241A]">{surah.name}</p>
                        <p className="text-[11px] text-[#5D6B5A]">
                          {surah.englishTranslation} · {surah.totalVerses} Ayahs
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-bold font-arabic text-[#C89B2E]">
                      {surah.arabicName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 3: HIFZ (MEMORIZATION) TRACKER WITH SPACED REPETITION */}
      {activeTab === 'hifz' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <h3 className="text-lg font-bold text-[#16241A] mb-1">
              Surah-by-Surah Memorization & Revision Scheduler
            </h3>
            <p className="text-xs text-[#5D6B5A] mb-4">
              Spaced repetition intervals schedule automatic review dates so you never forget memorized verses.
            </p>

            <div className="space-y-3">
              {SURAHS_LIST.slice(0, 15).map((surah) => {
                const record = hifzRecords[surah.number] || {
                  surahNumber: surah.number,
                  status: 'not-started',
                  masteryLevel: 0,
                };

                return (
                  <div
                    key={surah.number}
                    className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-xs font-bold flex items-center justify-center">
                        {surah.number}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#16241A]">{surah.name}</span>
                          <span className="text-xs font-arabic text-[#C89B2E]">{surah.arabicName}</span>
                        </div>
                        <p className="text-[11px] text-[#5D6B5A]">
                          Status: <span className="font-bold uppercase">{record.status}</span>
                          {record.nextRevisionDue && ` · Next revision: ${record.nextRevisionDue}`}
                        </p>
                      </div>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        onClick={() => updateHifzStatus(surah.number, 'not-started')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          record.status === 'not-started'
                            ? 'bg-stone-300 text-stone-800'
                            : 'bg-white border text-stone-500'
                        }`}
                      >
                        Not Started
                      </button>
                      <button
                        onClick={() => updateHifzStatus(surah.number, 'in-progress')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          record.status === 'in-progress'
                            ? 'bg-amber-500 text-white'
                            : 'bg-white border text-stone-500'
                        }`}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateHifzStatus(surah.number, 'memorized')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          record.status === 'memorized'
                            ? 'bg-[#2E8B4F] text-white'
                            : 'bg-white border text-stone-500'
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
