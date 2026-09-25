import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { RamadanDayRecord, TaraweehLog, IftarMealItem } from '../../types';
import {
  Moon,
  Sparkles,
  Calendar,
  Utensils,
  BookOpen,
  Heart,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Calculator,
  Compass,
} from 'lucide-react';

export const RamadanModule: React.FC = () => {
  const {
    language,
    prayerTimes,
    ramadanDays,
    updateRamadanDay,
    ramadanGoals,
    updateRamadanGoals,
    taraweehLogs,
    addTaraweehLog,
    iftarMeals,
    addIftarMeal,
    deleteIftarMeal,
    fidyaSettings,
    updateFidyaSettings,
    ramadanJournals,
    saveRamadanJournal,
    eidChecklist,
    updateEidChecklist,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  const [activeSubTab, setActiveSubTab] = useState<
    'grid' | 'taraweeh' | 'laylatul_qadr' | 'iftar' | 'fidya' | 'journal' | 'eid'
  >('grid');

  // I'tikaf mode state
  const [itikafModeActive, setItikafModeActive] = useState<boolean>(false);

  // New Taraweeh Form
  const [tarMosque, setTarMosque] = useState('Central Jamia Mosque');
  const [tarRakahs, setTarRakahs] = useState<number>(20);
  const [tarJuz, setTarJuz] = useState<number>(1);
  const [tarNotes, setTarNotes] = useState('');

  // New Iftar Meal Form
  const [mealTitle, setMealTitle] = useState('');
  const [mealDesc, setMealDesc] = useState('');
  const [mealIngredients, setMealIngredients] = useState('');
  const [mealGuests, setMealGuests] = useState<number>(4);

  // Journal form
  const [journalDay, setJournalDay] = useState<number>(1);
  const [journalGratitude, setJournalGratitude] = useState('');
  const [journalReflection, setJournalReflection] = useState('');

  // Eid gift form
  const [newGiftRecipient, setNewGiftRecipient] = useState('');
  const [newGiftItem, setNewGiftItem] = useState('');

  // Fidya calculations
  const totalFidyaDue = fidyaSettings.daysMissed * fidyaSettings.ratePerDay;

  // Laylatul Qadr odd nights
  const oddNights = [21, 23, 25, 27, 29];

  const handleAddTaraweeh = (e: React.FormEvent) => {
    e.preventDefault();
    addTaraweehLog({
      date: new Date().toISOString().split('T')[0],
      mosque: tarMosque,
      rakahs: tarRakahs,
      juzCovered: tarJuz,
      notes: tarNotes,
    });
    setTarNotes('');
  };

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealTitle.trim()) return;
    addIftarMeal({
      title: mealTitle.trim(),
      description: mealDesc.trim(),
      sunnahItem: mealTitle.toLowerCase().includes('date') || mealTitle.toLowerCase().includes('water'),
      ingredients: mealIngredients.split(',').map((i) => i.trim()).filter(Boolean),
      guests: mealGuests,
    });
    setMealTitle('');
    setMealDesc('');
    setMealIngredients('');
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    saveRamadanJournal(
      journalDay,
      `Day ${journalDay} reflection on spiritual elevation and patience`,
      journalGratitude,
      journalReflection
    );
    setJournalGratitude('');
    setJournalReflection('');
  };

  const handleAddEidGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGiftRecipient || !newGiftItem) return;
    const newGifts = [
      ...eidChecklist.giftsPlanned,
      { id: `g_${Date.now()}`, recipient: newGiftRecipient, gift: newGiftItem, ready: false },
    ];
    updateEidChecklist({ giftsPlanned: newGifts });
    setNewGiftRecipient('');
    setNewGiftItem('');
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO RAMADAN BANNER (Suhoor & Iftar Live Times) */}
      <div className="rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-[#5B3FA8] via-[#482F8C] to-[#2E1866] text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA] animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-200">
                {t('ramadanTitle')} · {t('ramadanDailyAnchor')}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif text-white">
              {t('ramadanBannerTitle')}
            </h2>
            <p className="text-sm sm:text-base text-purple-200 mt-1 font-medium">
              {t('ramadanBannerDesc')}
            </p>
          </div>

          {/* Suhoor & Iftar Cards */}
          <div className="flex items-center gap-3.5">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/20 text-center min-w-[140px] shadow-sm">
              <span className="text-xs sm:text-sm uppercase font-bold text-purple-200 block">
                {t('suhoorEnds')}
              </span>
              <p className="text-2xl sm:text-3xl font-black mt-1 text-white tabular-nums">
                {prayerTimes ? prayerTimes.Fajr : '05:12'}
              </p>
              <span className="text-xs text-amber-300 font-semibold">{t('stopEatingBefore')}</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#C89B2E]/25 border border-[#C89B2E]/70 text-center min-w-[140px] shadow-sm">
              <span className="text-xs sm:text-sm uppercase font-bold text-amber-200 block">
                {t('iftarTime')}
              </span>
              <p className="text-2xl sm:text-3xl font-black mt-1 text-[#FBBF24] tabular-nums">
                {prayerTimes ? prayerTimes.Maghrib : '18:45'}
              </p>
              <span className="text-xs text-emerald-300 font-semibold">{t('breakFastAtAdhan')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-stone-200 pb-3">
        {[
          { id: 'grid' as const, label: t('tab30DayGrid') },
          { id: 'taraweeh' as const, label: t('tabTaraweeh') },
          { id: 'laylatul_qadr' as const, label: t('tabLaylatulQadr') },
          { id: 'iftar' as const, label: t('tabIftarPlanner') },
          { id: 'fidya' as const, label: t('tabFidya') },
          { id: 'journal' as const, label: t('tabRamadanJournal') },
          { id: 'eid' as const, label: t('tabEidPrep') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4.5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-[#5B3FA8] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. SUBTAB 1: 30-DAY RAMADAN TRACKER GRID */}
      {activeSubTab === 'grid' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#5B3FA8]" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('fastingTrackerGrid')}</h3>
                <p className="text-sm sm:text-base text-stone-600 font-medium">
                  {t('fastingGridHint')}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm font-semibold text-[#16241A]">
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#2E8B4F]" /> {t('fastedStatus')}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-[#E0A526]" /> {t('excusedStatus')}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-stone-300" /> {t('pendingStatus')}
                </span>
              </div>
            </div>

            {/* 30-Day Heatmap Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-10 gap-3">
              {ramadanDays.map((day) => {
                const isFasted = day.fasted === 'yes';
                const isExcused = day.fasted === 'excused';

                return (
                  <div
                    key={day.day}
                    onClick={() => {
                      const nextStatus = day.fasted === 'yes' ? 'excused' : day.fasted === 'excused' ? 'no' : 'yes';
                      updateRamadanDay(day.day, { fasted: nextStatus });
                    }}
                    className={`min-h-[72px] min-w-[48px] rounded-2xl p-2.5 flex flex-col justify-between items-center cursor-pointer border-2 transition-all select-none ${
                      isFasted
                        ? 'bg-[#E1F2E7] border-[#2E8B4F] text-[#0B2E1C] shadow-xs'
                        : isExcused
                        ? 'bg-[#FAF0D8] border-[#E0A526] text-amber-900'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-400 text-stone-700'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-black">D{day.day}</span>
                    <span className="text-xs sm:text-sm font-extrabold">
                      {isFasted ? '✓' : isExcused ? 'Ex' : '—'}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      {day.taraweehAttended && (
                        <span className="w-2 h-2 rounded-full bg-[#5B3FA8]" title="Taraweeh" />
                      )}
                      {day.charityGiven > 0 && (
                        <span className="w-2 h-2 rounded-full bg-[#C1541F]" title="Charity" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. SUBTAB 2: TARAWEEH TRACKER */}
      {activeSubTab === 'taraweeh' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5">{t('logTaraweehNight')}</h4>
            <form onSubmit={handleAddTaraweeh} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('mosqueAttended')}</label>
                <input
                  type="text"
                  placeholder={t('mosquePlaceholder')}
                  value={tarMosque}
                  onChange={(e) => setTarMosque(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('rakahsCompleted')}</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTarRakahs(8)}
                    className={`py-3 rounded-xl border font-bold text-sm sm:text-base cursor-pointer ${
                      tarRakahs === 8 ? 'bg-[#5B3FA8] text-white' : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    {t('rakahs8')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTarRakahs(20)}
                    className={`py-3 rounded-xl border font-bold text-sm sm:text-base cursor-pointer ${
                      tarRakahs === 20 ? 'bg-[#5B3FA8] text-white' : 'bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    {t('rakahs20')}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('juzCoveredNight')}</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tarJuz}
                  onChange={(e) => setTarJuz(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('imamNotes')}</label>
                <input
                  type="text"
                  placeholder={t('imamNotesPlaceholder')}
                  value={tarNotes}
                  onChange={(e) => setTarNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#5B3FA8] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider cursor-pointer shadow-xs"
              >
                {t('recordTaraweeh')}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5">{t('taraweehHistory')}</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {taraweehLogs.map((log) => (
                <div key={log.id} className="p-4 sm:p-4.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold text-[#16241A]">{log.mosque}</p>
                    <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                      {log.rakahs} {t('rakahs')} · {t('juzParaLabel')} {log.juzCovered} {log.notes && `· "${log.notes}"`}
                    </p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#5B3FA8] bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                    {log.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. SUBTAB 3: LAYLATUL QADR & I'TIKAF MODE */}
      {activeSubTab === 'laylatul_qadr' && (
        <div className="space-y-6">
          {/* Dua card */}
          <div className="bg-[#0B2E1C] text-[#F3F0E4] rounded-3xl p-6 lg:p-8 border border-[#C89B2E] shadow-xl text-center space-y-4">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#FBBF24]">
              {t('laylatulQadrTitle')}
            </span>
            <p className="text-3xl lg:text-4xl font-arabic leading-relaxed text-[#FAF0D8]">
              اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
            </p>
            <p className="text-sm italic text-[#C5E1D0] font-medium">
              Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni
            </p>
            <p className="text-base sm:text-lg font-medium text-[#F3F0E4] max-w-xl mx-auto leading-relaxed">
              "{t('laylatulQadrDua')}"
            </p>
          </div>

          {/* Odd Nights Checklist & I'tikaf Toggle */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h4 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('oddNightsTitle')}</h4>
                <p className="text-sm sm:text-base text-stone-600 font-medium">{t('seekNightDesc')}</p>
              </div>

              {/* I'tikaf mode toggle */}
              <button
                onClick={() => setItikafModeActive(!itikafModeActive)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold border transition-colors flex items-center gap-2 cursor-pointer ${
                  itikafModeActive
                    ? 'bg-[#0B2E1C] text-[#FBBF24] border-[#C89B2E]'
                    : 'bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('itikafMode')}: {itikafModeActive ? t('itikafActive') : t('itikafOff')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
              {oddNights.map((night) => (
                <div key={night} className="p-5 rounded-2xl border-2 border-purple-200 bg-purple-50/70 text-center">
                  <span className="text-xs sm:text-sm font-extrabold text-purple-900 uppercase tracking-wider">{t('dayNumber')} {night}</span>
                  <p className="text-xl font-black text-[#5B3FA8] mt-1">{t('oddNightLabel')}</p>
                  <p className="text-xs text-purple-700 font-semibold mt-2">{t('specialQiyamIstighfar')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. SUBTAB 4: IFTAR MEAL & GROCERY PLANNER */}
      {activeSubTab === 'iftar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5">{t('addIftarMenuItem')}</h4>
            <form onSubmit={handleAddMeal} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('dishTitle')}</label>
                <input
                  type="text"
                  placeholder={t('dishTitlePlaceholder')}
                  value={mealTitle}
                  onChange={(e) => setMealTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('dishDesc')}</label>
                <input
                  type="text"
                  placeholder={t('dishDescPlaceholder')}
                  value={mealDesc}
                  onChange={(e) => setMealDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('groceryIngredients')}</label>
                <input
                  type="text"
                  placeholder={t('groceryPlaceholder')}
                  value={mealIngredients}
                  onChange={(e) => setMealIngredients(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('expectedGuests')}</label>
                <input
                  type="number"
                  min="1"
                  value={mealGuests}
                  onChange={(e) => setMealGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#5B3FA8] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider cursor-pointer shadow-xs"
              >
                {t('addMenuBtn')}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-3.5">
            <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5">{t('plannedIftarDishes')}</h4>
            {iftarMeals.map((meal) => (
              <div key={meal.id} className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base sm:text-lg font-bold text-[#16241A]">{meal.title}</span>
                    {meal.sunnahItem && (
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                        {t('sunnahLabel')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">{meal.description}</p>
                  {meal.ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      {meal.ingredients.map((ing, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs text-stone-700 font-medium">
                          {ing}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteIftarMeal(meal.id)}
                  className="text-stone-300 hover:text-red-500 p-2 cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SUBTAB 5: FIDYA & KAFFARAH CALCULATOR */}
      {activeSubTab === 'fidya' && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs max-w-xl mx-auto space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF0D8] text-[#C89B2E] flex items-center justify-center font-bold shadow-xs">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('fidyaCalculatorTitle')}</h4>
              <p className="text-sm sm:text-base text-stone-600 font-medium">{t('daysMissedLabel')}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('daysMissedLabel')}</label>
              <input
                type="number"
                min="1"
                max="30"
                value={fidyaSettings.daysMissed}
                onChange={(e) => updateFidyaSettings({ daysMissed: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('fidyaRatePerDay')} ($USD / Local)</label>
              <input
                type="number"
                min="1"
                value={fidyaSettings.ratePerDay}
                onChange={(e) => updateFidyaSettings({ ratePerDay: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
              />
            </div>

            <div className="pt-5 border-t border-stone-200/80 flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600 font-semibold">{t('totalFidyaDueLabel')}</p>
                <p className="text-3xl font-black text-[#C89B2E] tabular-nums mt-0.5">
                  ${totalFidyaDue} USD
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. SUBTAB 6: RAMADAN JOURNAL */}
      {activeSubTab === 'journal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5">{t('ramadanDailyJournal')}</h4>
            <form onSubmit={handleSaveJournal} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('selectDay')} (1–30)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={journalDay}
                  onChange={(e) => setJournalDay(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('gratitudeLabel')}</label>
                <textarea
                  rows={2}
                  placeholder={t('gratitudePlaceholder')}
                  value={journalGratitude}
                  onChange={(e) => setJournalGratitude(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('reflectionLabel')}</label>
                <textarea
                  rows={4}
                  placeholder={t('reflectionPlaceholder')}
                  value={journalReflection}
                  onChange={(e) => setJournalReflection(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#5B3FA8] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider cursor-pointer shadow-xs"
              >
                {t('saveReflection')}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-3.5">
            <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5">{t('savedReflections')}</h4>
            {ramadanJournals.map((j) => (
              <div key={j.day} className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#5B3FA8]">{t('dayNumber')} {j.day}</span>
                  <span className="text-xs sm:text-sm text-stone-500 font-semibold">{j.date}</span>
                </div>
                <p className="text-sm sm:text-base text-[#16241A] font-bold">{t('gratitudeLabel')}: {j.gratitude}</p>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">{j.reflection}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. SUBTAB 7: EID PREP & ZAKAT AL-FITR */}
      {activeSubTab === 'eid' && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h4 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('eidPrepTitle')}</h4>
            <p className="text-sm sm:text-base text-stone-600 font-medium">{t('zakatFitrStatus')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Zakat al-Fitr */}
            <div className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/50 space-y-3.5">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-emerald-800">{t('zakatFitrStatus')}</span>
              <p className="text-base sm:text-lg font-bold text-[#16241A]">
                {eidChecklist.zakatFitrPaid ? t('fitrPaid') : t('fitrPending')}
              </p>
              <div className="flex items-center gap-3.5 pt-2">
                <button
                  onClick={() => updateEidChecklist({ zakatFitrPaid: !eidChecklist.zakatFitrPaid })}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-colors cursor-pointer ${
                    eidChecklist.zakatFitrPaid
                      ? 'bg-[#2E8B4F] text-white shadow-xs'
                      : 'bg-white border border-stone-300 text-stone-700'
                  }`}
                >
                  {eidChecklist.zakatFitrPaid ? `✓ ${t('fitrPaid')}` : t('markAsPaid')}
                </button>
                <span className="text-sm font-bold text-stone-700">
                  Rate: ${eidChecklist.zakatFitrAmount} / person
                </span>
              </div>
            </div>

            {/* Eid Prayer Location */}
            <div className="p-6 rounded-3xl border border-stone-200 bg-stone-50 space-y-3.5">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-stone-700">{t('eidSunnahs')}</span>
              <div>
                <label className="block text-xs sm:text-sm text-stone-600 font-bold mb-1">{t('mosqueAttended')}</label>
                <input
                  type="text"
                  value={eidChecklist.prayerLocation}
                  onChange={(e) => updateEidChecklist({ prayerLocation: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold bg-white"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-stone-600 font-bold mb-1">{t('iftarTime')}</label>
                <input
                  type="text"
                  value={eidChecklist.prayerTime}
                  onChange={(e) => updateEidChecklist({ prayerTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold bg-white"
                />
              </div>
            </div>
          </div>

          {/* Eid Gifts Planner */}
          <div className="pt-5 border-t border-stone-200">
            <h5 className="text-base sm:text-lg font-bold text-[#16241A] mb-3">{t('giftsLovedOnes')}</h5>
            <form onSubmit={handleAddEidGift} className="flex flex-wrap gap-2.5 mb-4">
              <input
                type="text"
                placeholder={t('recipientPlaceholder')}
                value={newGiftRecipient}
                onChange={(e) => setNewGiftRecipient(e.target.value)}
                className="px-4 py-2.5 rounded-2xl border border-stone-200 text-sm outline-none"
              />
              <input
                type="text"
                placeholder={t('giftPlaceholder')}
                value={newGiftItem}
                onChange={(e) => setNewGiftItem(e.target.value)}
                className="px-4 py-2.5 rounded-2xl border border-stone-200 text-sm outline-none"
              />
              <button type="submit" className="px-5 py-2.5 rounded-2xl bg-[#5B3FA8] text-white text-sm font-bold cursor-pointer shadow-xs">
                + {t('addGift')}
              </button>
            </form>

            <div className="space-y-2.5">
              {eidChecklist.giftsPlanned.map((gift) => (
                <div key={gift.id} className="p-3.5 sm:p-4 rounded-2xl border border-stone-200 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-bold text-[#16241A]">{gift.recipient}</span>
                    <span className="text-stone-600"> — {gift.gift}</span>
                  </div>
                  <button
                    onClick={() => {
                      const updated = eidChecklist.giftsPlanned.map((g) =>
                        g.id === gift.id ? { ...g, ready: !g.ready } : g
                      );
                      updateEidChecklist({ giftsPlanned: updated });
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold cursor-pointer ${
                      gift.ready ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {gift.ready ? `✓ ${t('fitrPaid')}` : t('pendingStatus')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
