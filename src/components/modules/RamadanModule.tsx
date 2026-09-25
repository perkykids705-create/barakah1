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
              <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                {t('ramadanTitle')} · {t('ramadanDailyAnchor')}
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight font-serif text-white">
              {t('ramadanBannerTitle')}
            </h2>
            <p className="text-xs text-purple-200 mt-1">
              {t('ramadanBannerDesc')}
            </p>
          </div>

          {/* Suhoor & Iftar Cards */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-center min-w-[130px]">
              <span className="text-[10px] uppercase font-bold text-purple-200 block">
                {t('suhoorEnds')}
              </span>
              <p className="text-2xl font-extrabold mt-1 text-white tabular-nums">
                {prayerTimes ? prayerTimes.Fajr : '05:12'}
              </p>
              <span className="text-[10px] text-amber-300 font-semibold">{t('stopEatingBefore')}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#C89B2E]/20 border border-[#C89B2E]/60 text-center min-w-[130px]">
              <span className="text-[10px] uppercase font-bold text-amber-200 block">
                {t('iftarTime')}
              </span>
              <p className="text-2xl font-extrabold mt-1 text-[#FBBF24] tabular-nums">
                {prayerTimes ? prayerTimes.Maghrib : '18:45'}
              </p>
              <span className="text-[10px] text-emerald-300 font-semibold">{t('breakFastAtAdhan')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
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
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSubTab === tab.id
                ? 'bg-[#5B3FA8] text-white shadow-xs'
                : 'text-[#5D6B5A] hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. SUBTAB 1: 30-DAY RAMADAN TRACKER GRID (PRD §4.5: Large filled squares min 40px mobile) */}
      {activeSubTab === 'grid' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#5B3FA8]" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-[#16241A]">{t('fastingTrackerGrid')}</h3>
                <p className="text-xs text-[#5D6B5A]">
                  {t('fastingGridHint')}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-[#16241A]">
                  <span className="w-3 h-3 rounded-md bg-[#2E8B4F]" /> {t('fastedStatus')}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-[#16241A]">
                  <span className="w-3 h-3 rounded-md bg-[#E0A526]" /> {t('excusedStatus')}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-[#16241A]">
                  <span className="w-3 h-3 rounded-md bg-stone-200" /> {t('pendingStatus')}
                </span>
              </div>
            </div>

            {/* 30-Day Heatmap Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-10 gap-2.5">
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
                    className={`min-h-[64px] min-w-[40px] rounded-2xl p-2 flex flex-col justify-between items-center cursor-pointer border transition-all select-none ${
                      isFasted
                        ? 'bg-[#E1F2E7] border-[#2E8B4F] text-[#0B2E1C] shadow-xs'
                        : isExcused
                        ? 'bg-[#FAF0D8] border-[#E0A526] text-amber-900'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-600'
                    }`}
                  >
                    <span className="text-[11px] font-bold">D{day.day}</span>
                    <span className="text-[10px] font-semibold">
                      {isFasted ? '✓' : isExcused ? 'Ex' : '—'}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      {day.taraweehAttended && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5B3FA8]" title="Taraweeh" />
                      )}
                      {day.charityGiven > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C1541F]" title="Charity" />
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
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <h4 className="text-base font-bold text-[#16241A] mb-4">{t('logTaraweehNight')}</h4>
            <form onSubmit={handleAddTaraweeh} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('mosqueAttended')}</label>
                <input
                  type="text"
                  placeholder={t('mosquePlaceholder')}
                  value={tarMosque}
                  onChange={(e) => setTarMosque(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('rakahsCompleted')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTarRakahs(8)}
                    className={`py-2 rounded-xl border font-bold ${
                      tarRakahs === 8 ? 'bg-[#5B3FA8] text-white' : 'bg-stone-50'
                    }`}
                  >
                    {t('rakahs8')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTarRakahs(20)}
                    className={`py-2 rounded-xl border font-bold ${
                      tarRakahs === 20 ? 'bg-[#5B3FA8] text-white' : 'bg-stone-50'
                    }`}
                  >
                    {t('rakahs20')}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('juzCoveredNight')}</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tarJuz}
                  onChange={(e) => setTarJuz(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('imamNotes')}</label>
                <input
                  type="text"
                  placeholder={t('imamNotesPlaceholder')}
                  value={tarNotes}
                  onChange={(e) => setTarNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#5B3FA8] text-white font-bold text-xs uppercase"
              >
                {t('recordTaraweeh')}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <h4 className="text-base font-bold text-[#16241A] mb-4">{t('taraweehHistory')}</h4>
            <div className="space-y-3">
              {taraweehLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#16241A]">{log.mosque}</p>
                    <p className="text-xs text-[#5D6B5A] mt-0.5">
                      {log.rakahs} {t('rakahs')} · {t('juzParaLabel')} {log.juzCovered} {log.notes && `· "${log.notes}"`}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#5B3FA8] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
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
            <span className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">
              {t('laylatulQadrTitle')}
            </span>
            <p className="text-2xl lg:text-3xl font-arabic leading-relaxed text-[#FAF0D8]">
              اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي
            </p>
            <p className="text-xs italic text-[#9FB6A3]">
              Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni
            </p>
            <p className="text-sm font-medium text-[#F3F0E4] max-w-xl mx-auto">
              "{t('laylatulQadrDua')}"
            </p>
          </div>

          {/* Odd Nights Checklist & I'tikaf Toggle */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h4 className="text-lg font-bold text-[#16241A]">{t('oddNightsTitle')}</h4>
                <p className="text-xs text-[#5D6B5A]">{t('seekNightDesc')}</p>
              </div>

              {/* I'tikaf mode toggle */}
              <button
                onClick={() => setItikafModeActive(!itikafModeActive)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
                  itikafModeActive
                    ? 'bg-[#0B2E1C] text-[#FBBF24] border-[#C89B2E]'
                    : 'bg-stone-100 text-[#5D6B5A] border-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('itikafMode')}: {itikafModeActive ? t('itikafActive') : t('itikafOff')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {oddNights.map((night) => (
                <div key={night} className="p-4 rounded-xl border border-purple-200 bg-purple-50 text-center">
                  <span className="text-xs font-bold text-purple-900">{t('dayNumber')} {night}</span>
                  <p className="text-lg font-extrabold text-[#5B3FA8] mt-1">{t('oddNightLabel')}</p>
                  <p className="text-[10px] text-purple-700 mt-2">{t('specialQiyamIstighfar')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. SUBTAB 4: IFTAR MEAL & GROCERY PLANNER */}
      {activeSubTab === 'iftar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <h4 className="text-base font-bold text-[#16241A] mb-4">{t('addIftarMenuItem')}</h4>
            <form onSubmit={handleAddMeal} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('dishTitle')}</label>
                <input
                  type="text"
                  placeholder={t('dishTitlePlaceholder')}
                  value={mealTitle}
                  onChange={(e) => setMealTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('dishDesc')}</label>
                <input
                  type="text"
                  placeholder={t('dishDescPlaceholder')}
                  value={mealDesc}
                  onChange={(e) => setMealDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('groceryIngredients')}</label>
                <input
                  type="text"
                  placeholder={t('groceryPlaceholder')}
                  value={mealIngredients}
                  onChange={(e) => setMealIngredients(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('expectedGuests')}</label>
                <input
                  type="number"
                  min="1"
                  value={mealGuests}
                  onChange={(e) => setMealGuests(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#5B3FA8] text-white font-bold text-xs uppercase"
              >
                {t('addMenuBtn')}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
            <h4 className="text-base font-bold text-[#16241A] mb-4">{t('plannedIftarDishes')}</h4>
            {iftarMeals.map((meal) => (
              <div key={meal.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#16241A]">{meal.title}</span>
                    {meal.sunnahItem && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {t('sunnahLabel')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5D6B5A] mt-1">{meal.description}</p>
                  {meal.ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {meal.ingredients.map((ing, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[10px] text-stone-600 font-medium">
                          {ing}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteIftarMeal(meal.id)}
                  className="text-stone-300 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SUBTAB 5: FIDYA & KAFFARAH CALCULATOR */}
      {activeSubTab === 'fidya' && (
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-stone-200 shadow-xs max-w-xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0D8] text-[#C89B2E] flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#16241A]">{t('fidyaCalculatorTitle')}</h4>
              <p className="text-xs text-[#5D6B5A]">{t('daysMissedLabel')}</p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-[#5D6B5A] mb-1">{t('daysMissedLabel')}</label>
              <input
                type="number"
                min="1"
                max="30"
                value={fidyaSettings.daysMissed}
                onChange={(e) => updateFidyaSettings({ daysMissed: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-[#5D6B5A] mb-1">{t('fidyaRatePerDay')} ($USD / Local)</label>
              <input
                type="number"
                min="1"
                value={fidyaSettings.ratePerDay}
                onChange={(e) => updateFidyaSettings({ ratePerDay: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
              />
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#5D6B5A]">{t('totalFidyaDueLabel')}</p>
                <p className="text-2xl font-extrabold text-[#C89B2E] tabular-nums">
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
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <h4 className="text-base font-bold text-[#16241A] mb-4">{t('ramadanDailyJournal')}</h4>
            <form onSubmit={handleSaveJournal} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('selectDay')} (1–30)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={journalDay}
                  onChange={(e) => setJournalDay(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('gratitudeLabel')}</label>
                <textarea
                  rows={2}
                  placeholder={t('gratitudePlaceholder')}
                  value={journalGratitude}
                  onChange={(e) => setJournalGratitude(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('reflectionLabel')}</label>
                <textarea
                  rows={4}
                  placeholder={t('reflectionPlaceholder')}
                  value={journalReflection}
                  onChange={(e) => setJournalReflection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#5B3FA8] text-white font-bold text-xs uppercase"
              >
                {t('saveReflection')}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-3">
            <h4 className="text-base font-bold text-[#16241A] mb-4">{t('savedReflections')}</h4>
            {ramadanJournals.map((j) => (
              <div key={j.day} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5B3FA8]">{t('dayNumber')} {j.day}</span>
                  <span className="text-[11px] text-[#5D6B5A]">{j.date}</span>
                </div>
                <p className="text-xs text-[#16241A] font-semibold">{t('gratitudeLabel')}: {j.gratitude}</p>
                <p className="text-xs text-[#5D6B5A] leading-relaxed">{j.reflection}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. SUBTAB 7: EID PREP & ZAKAT AL-FITR */}
      {activeSubTab === 'eid' && (
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h4 className="text-lg font-bold text-[#16241A]">{t('eidPrepTitle')}</h4>
            <p className="text-xs text-[#5D6B5A]">{t('zakatFitrStatus')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Zakat al-Fitr */}
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3">
              <span className="text-xs font-bold uppercase text-emerald-800">{t('zakatFitrStatus')}</span>
              <p className="text-sm font-semibold text-[#16241A]">
                {eidChecklist.zakatFitrPaid ? t('fitrPaid') : t('fitrPending')}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => updateEidChecklist({ zakatFitrPaid: !eidChecklist.zakatFitrPaid })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    eidChecklist.zakatFitrPaid
                      ? 'bg-[#2E8B4F] text-white'
                      : 'bg-white border border-stone-300 text-stone-700'
                  }`}
                >
                  {eidChecklist.zakatFitrPaid ? `✓ ${t('fitrPaid')}` : t('markAsPaid')}
                </button>
                <span className="text-xs font-bold text-stone-600">
                  Rate: ${eidChecklist.zakatFitrAmount} / person
                </span>
              </div>
            </div>

            {/* Eid Prayer Location */}
            <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
              <span className="text-xs font-bold uppercase text-stone-700">{t('eidSunnahs')}</span>
              <div>
                <label className="block text-[11px] text-[#5D6B5A] font-semibold">{t('mosqueAttended')}</label>
                <input
                  type="text"
                  value={eidChecklist.prayerLocation}
                  onChange={(e) => updateEidChecklist({ prayerLocation: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#5D6B5A] font-semibold">{t('iftarTime')}</label>
                <input
                  type="text"
                  value={eidChecklist.prayerTime}
                  onChange={(e) => updateEidChecklist({ prayerTime: e.target.value })}
                  className="w-full mt-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold bg-white"
                />
              </div>
            </div>
          </div>

          {/* Eid Gifts Planner */}
          <div className="pt-4 border-t border-stone-200">
            <h5 className="text-sm font-bold text-[#16241A] mb-3">{t('giftsLovedOnes')}</h5>
            <form onSubmit={handleAddEidGift} className="flex flex-wrap gap-2 mb-4">
              <input
                type="text"
                placeholder={t('recipientPlaceholder')}
                value={newGiftRecipient}
                onChange={(e) => setNewGiftRecipient(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs outline-none"
              />
              <input
                type="text"
                placeholder={t('giftPlaceholder')}
                value={newGiftItem}
                onChange={(e) => setNewGiftItem(e.target.value)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs outline-none"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-[#5B3FA8] text-white text-xs font-bold">
                + {t('addGift')}
              </button>
            </form>

            <div className="space-y-2">
              {eidChecklist.giftsPlanned.map((gift) => (
                <div key={gift.id} className="p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#16241A]">{gift.recipient}</span>
                    <span className="text-[#5D6B5A]"> — {gift.gift}</span>
                  </div>
                  <button
                    onClick={() => {
                      const updated = eidChecklist.giftsPlanned.map((g) =>
                        g.id === gift.id ? { ...g, ready: !g.ready } : g
                      );
                      updateEidChecklist({ giftsPlanned: updated });
                    }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                      gift.ready ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
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
