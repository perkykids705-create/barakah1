import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { ZakatCalculation, SadaqahEntry } from '../../types';
import {
  Coins,
  Calculator,
  Heart,
  Plus,
  ArrowRight,
  TrendingUp,
  History,
  Info,
  Calendar,
  Target,
  Sparkles,
  CheckCircle2,
  Trash2,
  Edit3,
  Clock,
  X,
  Gift,
  Check,
} from 'lucide-react';

export const ZakatModule: React.FC = () => {
  const {
    language,
    zakatCalculations,
    saveZakatCalculation,
    sadaqahLogs,
    addSadaqah,
    charityGoal,
    updateCharityGoal,
    charityGoals,
    startCharityGoal,
    deleteCharityGoal,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  const [activeTab, setActiveTab] = useState<'calculator' | 'sadaqah' | 'goals'>('calculator');

  // Zakat Calculator Inputs
  const [cash, setCash] = useState<number>(12500);
  const [goldGrams, setGoldGrams] = useState<number>(35);
  const [goldPrice, setGoldPrice] = useState<number>(85); // per gram USD
  const [silverGrams, setSilverGrams] = useState<number>(0);
  const [silverPrice, setSilverPrice] = useState<number>(1.1); // per gram USD
  const [investments, setInvestments] = useState<number>(5000);
  const [businessInventory, setBusinessInventory] = useState<number>(0);
  const [debts, setDebts] = useState<number>(1200);
  const [nisabStandard, setNisabStandard] = useState<'gold' | 'silver'>('gold');

  // Sadaqah Form
  const [sadaqahAmount, setSadaqahAmount] = useState<number>(50);
  const [sadaqahCause, setSadaqahCause] = useState('');
  const [sadaqahRecipient, setSadaqahRecipient] = useState('');
  const [sadaqahNote, setSadaqahNote] = useState('');

  // Charity Goals Workflow State
  const [showStartGoalModal, setShowStartGoalModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);

  // New Goal Fields
  const todayStr = new Date().toISOString().split('T')[0];
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('Sadaqah Jariyah');
  const [newGoalPeriod, setNewGoalPeriod] = useState<'annual' | 'monthly' | 'campaign'>('campaign');
  const [newGoalStartDate, setNewGoalStartDate] = useState(todayStr);
  const [newGoalTargetDate, setNewGoalTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return d.toISOString().split('T')[0];
  });
  const [newGoalStartingAmount, setNewGoalStartingAmount] = useState<number>(0);
  const [newGoalTargetAmount, setNewGoalTargetAmount] = useState<number>(1000);
  const [newGoalNotes, setNewGoalNotes] = useState('');

  // Quick Contribute to Active Goal
  const [contributeAmount, setContributeAmount] = useState<number>(50);
  const [contributeNote, setContributeNote] = useState('');
  const [contributeRecipient, setContributeRecipient] = useState('Charity Foundation');

  // Edit Goal Target State
  const [editTargetAmount, setEditTargetAmount] = useState<number>(charityGoal.targetAmount || 1200);
  const [editGoalTitle, setEditGoalTitle] = useState<string>(charityGoal.title || 'Annual Sadaqah Goal');
  const [editGoalTargetDate, setEditGoalTargetDate] = useState<string>(charityGoal.targetDate || '2026-12-31');

  // Calculations
  const goldTotal = goldGrams * goldPrice;
  const silverTotal = silverGrams * silverPrice;
  const totalAssets = cash + goldTotal + silverTotal + investments + businessInventory;
  const netZakatable = Math.max(0, totalAssets - debts);

  // Nisab threshold: Gold = 87.48g * goldPrice; Silver = 612.36g * silverPrice
  const nisabThreshold = nisabStandard === 'gold' ? 87.48 * goldPrice : 612.36 * silverPrice;
  const isEligibleForZakat = netZakatable >= nisabThreshold;
  const zakatDue = isEligibleForZakat ? netZakatable * 0.025 : 0;

  const handleSaveCalculation = () => {
    saveZakatCalculation({
      date: new Date().toISOString().split('T')[0],
      cash,
      goldGrams,
      goldPricePerGram: goldPrice,
      silverGrams,
      silverPricePerGram: silverPrice,
      investments,
      businessInventory,
      debts,
      nisabType: nisabStandard,
      nisabThreshold,
      netZakatable,
      zakatDue,
      currency: 'USD',
    });
  };

  const handleAddSadaqah = (e: React.FormEvent) => {
    e.preventDefault();
    if (sadaqahAmount <= 0 || !sadaqahCause.trim()) return;
    addSadaqah({
      date: new Date().toISOString().split('T')[0],
      amount: Number(sadaqahAmount),
      cause: sadaqahCause.trim(),
      recipient: sadaqahRecipient.trim() || 'Charity organization',
      note: sadaqahNote.trim(),
      currency: 'USD',
    });
    setSadaqahCause('');
    setSadaqahRecipient('');
    setSadaqahNote('');
  };

  const goalPercent = Math.min(100, Math.round((charityGoal.currentAmount / charityGoal.targetAmount) * 100));

  return (
    <div className="space-y-6">
      {/* 1. SUB-TABS */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-[#C1541F] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          {t('subtabCalculator')}
        </button>
        <button
          onClick={() => setActiveTab('sadaqah')}
          className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
            activeTab === 'sadaqah'
              ? 'bg-[#C1541F] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          {t('subtabSadaqah')}
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
            activeTab === 'goals'
              ? 'bg-[#C1541F] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          {t('subtabCharityGoals')}
        </button>
      </div>

      {/* 2. TAB 1: ZAKAT CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          {/* Inputs Form (Full width top) */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs space-y-6">
            
            {/* Header with Title and Nisab Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#C1541F] uppercase tracking-wider mb-1">
                  <Coins className="w-4 h-4" />
                  <span>Annual Fardh Obligation</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#16241A] tracking-tight">
                  {t('calculateZakat')}
                </h3>
              </div>

              {/* Nisab choice button group */}
              <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-sm font-bold shrink-0 self-start md:self-center">
                <span className="text-stone-600 pl-2 text-xs uppercase tracking-wider">{t('nisabStandardLabel')}:</span>
                <button
                  type="button"
                  onClick={() => setNisabStandard('gold')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    nisabStandard === 'gold'
                      ? 'bg-[#C1541F] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {t('nisabGoldLabel')}
                </button>
                <button
                  type="button"
                  onClick={() => setNisabStandard('silver')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                    nisabStandard === 'silver'
                      ? 'bg-[#C1541F] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  {t('nisabSilverLabel')}
                </button>
              </div>
            </div>

            {/* Nisab explanation banner with full width */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAE5D8]/50 border border-[#C1541F]/30 text-sm text-[#C1541F] flex items-start gap-3.5">
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#C1541F]" />
              <div className="space-y-1">
                <p className="leading-relaxed font-semibold text-stone-800">
                  {t('nisabExplanation')}
                </p>
                <p className="text-xs sm:text-sm font-medium text-stone-700">
                  Current active threshold ({nisabStandard === 'gold' ? '87.48g Gold' : '612.36g Silver'}):{' '}
                  <span className="font-black text-[#C1541F] text-base">${nisabThreshold.toFixed(2)} USD</span>
                </p>
              </div>
            </div>

            {/* Form grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1.5">
                  {t('cashSavingsLabel')} ($ USD)
                </label>
                <input
                  type="number"
                  value={cash}
                  onChange={(e) => setCash(Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1.5">
                  {t('investmentsLabel')} ($ USD)
                </label>
                <input
                  type="number"
                  value={investments}
                  onChange={(e) => setInvestments(Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1.5">
                  {t('businessAssets')} ($ USD)
                </label>
                <input
                  type="number"
                  value={businessInventory}
                  onChange={(e) => setBusinessInventory(Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1.5">
                  Gold Owned
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="block text-xxs font-bold text-stone-500 uppercase mb-1">Grams</span>
                    <input
                      type="number"
                      value={goldGrams}
                      onChange={(e) => setGoldGrams(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs"
                    />
                  </div>
                  <div>
                    <span className="block text-xxs font-bold text-stone-500 uppercase mb-1">Price ($/g)</span>
                    <input
                      type="number"
                      value={goldPrice}
                      onChange={(e) => setGoldPrice(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1.5">
                  Silver Owned
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="block text-xxs font-bold text-stone-500 uppercase mb-1">Grams</span>
                    <input
                      type="number"
                      value={silverGrams}
                      onChange={(e) => setSilverGrams(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs"
                    />
                  </div>
                  <div>
                    <span className="block text-xxs font-bold text-stone-500 uppercase mb-1">Price ($/g)</span>
                    <input
                      type="number"
                      value={silverPrice}
                      onChange={(e) => setSilverPrice(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-black text-rose-800 uppercase tracking-wider mb-1.5">
                  Less: Immediate Liabilities / Debts ($)
                </label>
                <input
                  type="number"
                  value={debts}
                  onChange={(e) => setDebts(Number(e.target.value))}
                  className="w-full bg-rose-50/50 border border-rose-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-rose-950 outline-none focus:border-rose-500 transition-all shadow-xxs"
                />
              </div>
            </div>
          </div>

          {/* Results Summary & History Section (Placed Below Zakat Calculator) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Zakat Assessment Dashboard Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs relative overflow-hidden flex flex-col justify-between space-y-6">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#C1541F]" />
              
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-stone-100 pb-3">
                  <h4 className="text-lg sm:text-xl font-black text-[#16241A] flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#C1541F]" />
                    <span>Zakat Assessment & Obligation Summary</span>
                  </h4>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200 self-start sm:self-auto">
                    Threshold: {nisabStandard === 'gold' ? 'Gold (87.48g)' : 'Silver (612.36g)'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                  {/* Left: Financial breakdown */}
                  <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/80 text-sm flex flex-col justify-center">
                    <div className="flex justify-between">
                      <span className="text-stone-600 font-medium">Gross Zakatable Wealth:</span>
                      <span className="font-extrabold text-[#16241A] tabular-nums">${totalAssets.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600 font-medium">Deductible Liabilities / Debts:</span>
                      <span className="font-extrabold text-red-600 tabular-nums">-${debts.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-black text-base border-t border-stone-200 pt-2.5">
                      <span className="text-[#16241A]">Net Zakatable Pool:</span>
                      <span className="text-[#16241A] tabular-nums">${netZakatable.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-stone-600 font-medium text-xs pt-0.5">
                      <span>Nisab Threshold ({nisabStandard}):</span>
                      <span className="tabular-nums font-bold text-stone-800">${nisabThreshold.toFixed(2)} USD</span>
                    </div>
                  </div>

                  {/* Right: Big Due Amount Display */}
                  <div className="text-center p-5 rounded-2xl bg-[#FAE5D8]/40 border border-[#C1541F]/20 flex flex-col justify-center items-center">
                    <span className="text-xs sm:text-sm font-extrabold text-stone-600 uppercase tracking-wider block">
                      {isEligibleForZakat ? 'Total Zakat Due (2.5%)' : 'Wealth Below Nisab'}
                    </span>
                    <p className="text-4xl sm:text-5xl font-black text-[#C1541F] my-2 tabular-nums tracking-tight">
                      ${zakatDue.toFixed(2)}
                    </p>
                    <span className="text-xs text-stone-500 font-semibold block">
                      {isEligibleForZakat
                        ? 'Payable once per lunar year on surplus wealth'
                        : 'No mandatory Zakat obligation at this time'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveCalculation}
                  className="w-full py-3.5 rounded-2xl bg-[#C1541F] hover:bg-[#a94515] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <Coins className="w-5 h-5" />
                  <span>Save Calculation Record</span>
                </button>
              </div>
            </div>

            {/* Prior Year History Card */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <h5 className="text-sm font-extrabold text-stone-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#C1541F]" />
                  <span>Prior Year Calculations</span>
                </h5>
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {zakatCalculations.length === 0 ? (
                    <p className="text-xs text-stone-400 font-bold text-center py-8">No saved calculation records yet.</p>
                  ) : (
                    zakatCalculations.map((c) => (
                      <div key={c.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center text-sm">
                        <div>
                          <span className="font-extrabold text-[#16241A]">{c.date}</span>
                          <p className="text-xs text-stone-500 font-medium mt-0.5">Net: ${c.netZakatable.toLocaleString()}</p>
                        </div>
                        <span className="font-black text-[#C1541F] tabular-nums">
                          ${c.zakatDue.toFixed(2)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 text-xs text-stone-400 font-medium text-center">
                History is preserved for your tax & lunar year tracking
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. TAB 2: SADAQAH LOG */}
      {activeTab === 'sadaqah' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5">{t('addSadaqah')}</h4>
            <form onSubmit={handleAddSadaqah} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Amount ($ USD)</label>
                <input
                  type="number"
                  min="1"
                  value={sadaqahAmount}
                  onChange={(e) => setSadaqahAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Cause / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Water well, Food parcels, Medical aid"
                  value={sadaqahCause}
                  onChange={(e) => setSadaqahCause(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Recipient / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Islamic Relief, Local Masjid"
                  value={sadaqahRecipient}
                  onChange={(e) => setSadaqahRecipient(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Niyyah / Note</label>
                <input
                  type="text"
                  placeholder="e.g. In memory of grandparents"
                  value={sadaqahNote}
                  onChange={(e) => setSadaqahNote(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#C1541F] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider cursor-pointer shadow-xs"
              >
                Log Charity
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
            <h4 className="text-lg sm:text-xl font-extrabold text-[#16241A] mb-5">Sadaqah History</h4>
            <div className="space-y-3.5">
              {sadaqahLogs.map((entry) => (
                <div key={entry.id} className="p-4 sm:p-5 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-base font-bold text-[#16241A]">{entry.cause}</span>
                      <span className="text-sm text-stone-600 font-medium">({entry.recipient})</span>
                    </div>
                    {entry.note && <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5 italic">"{entry.note}"</p>}
                    <p className="text-xs text-stone-400 mt-1">{entry.date}</p>
                  </div>
                  <span className="text-lg sm:text-xl font-black text-[#2E8B4F] tabular-nums">
                    +${entry.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 3: CHARITY GOAL TRACKER & CAMPAIGNS */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#C1541F] uppercase tracking-wider mb-1">
                <Heart className="w-4 h-4" />
                <span>Intentional Philanthropy & Sadaqah Jariyah</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#16241A] tracking-tight">
                Charity Goal Tracker & Campaigns
              </h3>
              <p className="text-sm sm:text-base text-stone-600 font-medium mt-1">
                Set intentional starting dates and deadlines to monitor your charitable journey with purpose and barakah.
              </p>
            </div>

            {/* Action: Start New Goal */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setNewGoalTitle('');
                  setNewGoalStartingAmount(0);
                  setNewGoalTargetAmount(1000);
                  setNewGoalStartDate(todayStr);
                  setShowStartGoalModal(true);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#C1541F] hover:bg-[#a94515] text-white font-extrabold text-sm sm:text-base shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>+ Start New Charity Goal</span>
              </button>
            </div>
          </div>

          {/* ACTIVE GOAL HERO SHOWCASE */}
          <div className="bg-gradient-to-br from-white via-amber-50/20 to-orange-50/30 rounded-3xl p-6 sm:p-8 border-2 border-[#C1541F]/30 shadow-md space-y-6 relative overflow-hidden">
            {/* Top decorative badge & title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#C1541F] text-white shadow-2xs">
                    ● Active Giving Goal
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                    {charityGoal.category || 'General Sadaqah'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-stone-500 bg-white border border-stone-200">
                    {charityGoal.period === 'annual' ? 'Annual Target' : charityGoal.period === 'monthly' ? 'Monthly Target' : 'Special Campaign'}
                  </span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-black text-[#16241A] tracking-tight">
                  {charityGoal.title || 'Annual Sadaqah & Giving Goal'}
                </h4>
              </div>

              {/* Start Date & Target Deadline timeline badge */}
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center gap-4 text-xs font-bold self-start md:self-center">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C1541F]" />
                  <div>
                    <span className="block text-stone-400 uppercase text-xxs font-extrabold">Goal Started</span>
                    <span className="text-stone-800 font-black">{charityGoal.startDate || 'Jan 1, 2026'}</span>
                  </div>
                </div>
                <div className="h-6 w-px bg-stone-200" />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="block text-stone-400 uppercase text-xxs font-extrabold">Target Deadline</span>
                    <span className="text-stone-800 font-black">{charityGoal.targetDate || 'Dec 31, 2026'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Progress Block */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="text-xs sm:text-sm font-extrabold text-stone-500 uppercase tracking-wider">
                    Total Funds Contributed / Goal Target
                  </span>
                  <p className="text-3xl sm:text-4xl font-black text-[#C1541F] tabular-nums mt-1 tracking-tight">
                    ${charityGoal.currentAmount.toLocaleString()}
                    <span className="text-xl sm:text-2xl text-stone-400 font-bold">
                      {' '}/ ${charityGoal.targetAmount.toLocaleString()} USD
                    </span>
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-stone-900">
                    {goalPercent}%
                  </span>
                  <span className="text-xs font-extrabold text-stone-500 uppercase">
                    Achieved
                  </span>
                </div>
              </div>

              {/* High fidelity progress bar */}
              <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden border border-stone-200/80 p-0.5 shadow-inner">
                <div
                  className="bg-gradient-to-r from-[#C1541F] to-[#E07A5F] h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>

              {/* Remaining calculation & milestones */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-stone-600 pt-1">
                <span>
                  {charityGoal.currentAmount >= charityGoal.targetAmount ? (
                    <strong className="text-emerald-700 font-black">🎉 Goal Target Achieved! Alhamdulillah.</strong>
                  ) : (
                    <span>
                      <strong className="text-[#C1541F]">${(charityGoal.targetAmount - charityGoal.currentAmount).toLocaleString()} USD</strong> remaining to reach goal
                    </span>
                  )}
                </span>
                
                <div className="flex items-center gap-3 text-stone-400">
                  <span className={goalPercent >= 25 ? 'text-[#C1541F] font-black' : ''}>25%</span>
                  <span>·</span>
                  <span className={goalPercent >= 50 ? 'text-[#C1541F] font-black' : ''}>50%</span>
                  <span>·</span>
                  <span className={goalPercent >= 75 ? 'text-[#C1541F] font-black' : ''}>75%</span>
                  <span>·</span>
                  <span className={goalPercent >= 100 ? 'text-emerald-600 font-black' : ''}>100%</span>
                </div>
              </div>

              {charityGoal.notes && (
                <div className="mt-3 p-3.5 rounded-2xl bg-white/80 border border-stone-200 text-xs sm:text-sm text-stone-600 italic">
                  <span className="font-extrabold text-stone-800 not-italic">Niyyah & Purpose: </span>
                  "{charityGoal.notes}"
                </div>
              )}
            </div>

            {/* Hero Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200/80">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowContributeModal(true)}
                  className="px-5 py-3 rounded-2xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3px]" />
                  <span>+ Log Contribution to this Goal</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditTargetAmount(charityGoal.targetAmount);
                    setEditGoalTitle(charityGoal.title || 'Giving Goal');
                    setEditGoalTargetDate(charityGoal.targetDate || '2026-12-31');
                    setShowEditGoalModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Adjust Target / Edit</span>
                </button>
              </div>
            </div>
          </div>

          {/* ALL STARTED CHARITY GOALS & CAMPAIGNS DIRECTORY */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <h4 className="text-lg sm:text-xl font-black text-[#16241A] tracking-tight">
                  All Started Goals & Giving Campaigns
                </h4>
                <p className="text-xs sm:text-sm text-stone-500 font-medium">
                  Switch between campaigns, track multiple initiatives, and fulfill your intentions.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-stone-100 text-stone-700">
                {charityGoals?.length || 1} Total Campaigns
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {charityGoals?.map((g) => {
                const isSelected = (g.id || 'goal_default') === (charityGoal.id || 'goal_default');
                const percent = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));

                return (
                  <div
                    key={g.id || g.title}
                    className={`rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-amber-50/40 border-[#C1541F] ring-2 ring-[#C1541F]/30 shadow-xs'
                        : 'bg-stone-50/60 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-700 text-xxs font-extrabold uppercase">
                              {g.category || 'Charity'}
                            </span>
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-md bg-[#C1541F] text-white text-xxs font-black uppercase">
                                Active
                              </span>
                            )}
                          </div>
                          <h5 className="text-base font-black text-[#16241A]">{g.title}</h5>
                        </div>

                        {charityGoals.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteCharityGoal(g.id || '')}
                            className="text-stone-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                            title="Delete goal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-3 text-xs font-semibold text-stone-500">
                        <span>Started: <strong className="text-stone-700">{g.startDate || 'Jan 1, 2026'}</strong></span>
                        <span>·</span>
                        <span>Deadline: <strong className="text-stone-700">{g.targetDate || 'Dec 31, 2026'}</strong></span>
                      </div>

                      {/* Mini Progress */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-xs font-black">
                          <span className="text-stone-700">${g.currentAmount.toLocaleString()} / ${g.targetAmount.toLocaleString()} USD</span>
                          <span className="text-[#C1541F]">{percent}%</span>
                        </div>
                        <div className="w-full bg-stone-200/70 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#C1541F] h-full rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {g.notes && (
                        <p className="text-xs text-stone-500 italic bg-white p-2 rounded-xl border border-stone-200/60">
                          "{g.notes}"
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                      {isSelected ? (
                        <span className="text-xs font-extrabold text-[#C1541F] flex items-center gap-1">
                          <Check className="w-4 h-4" />
                          <span>Currently Selected</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => updateCharityGoal(g)}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Select as Active Goal
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          updateCharityGoal(g);
                          setShowContributeModal(true);
                        }}
                        className="px-3 py-1.5 rounded-xl text-stone-700 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Contribute</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MODAL 1: START NEW CHARITY GOAL */}
          {showStartGoalModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-stone-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#C1541F]">
                      <Target className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#16241A]">Start New Charity Goal</h4>
                      <p className="text-xs text-stone-500 font-semibold">Define your starting date, deadline & philanthropic target</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowStartGoalModal(false)}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newGoalTitle.trim() || newGoalTargetAmount <= 0) return;
                    startCharityGoal({
                      title: newGoalTitle.trim(),
                      category: newGoalCategory,
                      period: newGoalPeriod,
                      startDate: newGoalStartDate,
                      targetDate: newGoalTargetDate,
                      currentAmount: Number(newGoalStartingAmount) || 0,
                      targetAmount: Number(newGoalTargetAmount),
                      currency: 'USD',
                      notes: newGoalNotes.trim(),
                      status: 'active',
                    });
                    setShowStartGoalModal(false);
                  }}
                  className="space-y-4"
                >
                  {/* Goal Title */}
                  <div className="space-y-1">
                    <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                      Goal / Campaign Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramadan 2026 Water Well Project, Orphan Sponsorship"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs"
                    />
                  </div>

                  {/* Category & Period */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                        Charity Category
                      </label>
                      <select
                        value={newGoalCategory}
                        onChange={(e) => setNewGoalCategory(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs cursor-pointer"
                      >
                        <option value="Sadaqah Jariyah">Sadaqah Jariyah (Ongoing)</option>
                        <option value="Water & Sanitation">Clean Water Wells</option>
                        <option value="Orphan Sponsorship">Orphan & Widow Care</option>
                        <option value="Food & Emergency Aid">Food & Emergency Relief</option>
                        <option value="Masjid & Education">Masjid & Islamic Schools</option>
                        <option value="General Sadaqah">General Voluntary Charity</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                        Timeline Period
                      </label>
                      <select
                        value={newGoalPeriod}
                        onChange={(e) => setNewGoalPeriod(e.target.value as 'annual' | 'monthly' | 'campaign')}
                        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs cursor-pointer"
                      >
                        <option value="campaign">Specific Campaign (Custom Dates)</option>
                        <option value="annual">Annual Goal (Full Year)</option>
                        <option value="monthly">Monthly Recurring Goal</option>
                      </select>
                    </div>
                  </div>

                  {/* Start Date & Target Deadline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                        Goal Starting Date
                      </label>
                      <input
                        type="date"
                        required
                        value={newGoalStartDate}
                        onChange={(e) => setNewGoalStartDate(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                        Target Deadline
                      </label>
                      <input
                        type="date"
                        required
                        value={newGoalTargetDate}
                        onChange={(e) => setNewGoalTargetDate(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Starting Amount & Target Amount */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                        Starting Seed Funds ($ USD)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newGoalStartingAmount}
                        onChange={(e) => setNewGoalStartingAmount(Number(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                        Target Goal Amount ($ USD)
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={newGoalTargetAmount}
                        onChange={(e) => setNewGoalTargetAmount(Number(e.target.value))}
                        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs"
                      />
                    </div>
                  </div>

                  {/* Notes / Niyyah */}
                  <div className="space-y-1">
                    <label className="block text-xs sm:text-sm font-black text-stone-700 uppercase tracking-wider mb-1">
                      Niyyah (Intention) & Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. In loving memory of parents; may Allah accept it as ongoing barakah"
                      value={newGoalNotes}
                      onChange={(e) => setNewGoalNotes(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold text-stone-800 outline-none focus:border-[#C1541F] transition-all shadow-xxs"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="pt-3 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowStartGoalModal(false)}
                      className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#C1541F] hover:bg-[#a94515] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 stroke-[3px]" />
                      <span>Start Charity Goal</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL 2: QUICK CONTRIBUTE TO ACTIVE GOAL */}
          {showContributeModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#16241A]">Log Contribution</h4>
                      <p className="text-xs text-stone-500 font-semibold">Towards: {charityGoal.title}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowContributeModal(false)}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (contributeAmount <= 0) return;
                    addSadaqah({
                      date: todayStr,
                      amount: Number(contributeAmount),
                      cause: charityGoal.title || 'Charity Campaign',
                      recipient: contributeRecipient.trim() || 'Charity Organization',
                      note: contributeNote.trim() || `Contributed towards ${charityGoal.title}`,
                      currency: 'USD',
                    });
                    setShowContributeModal(false);
                    setContributeNote('');
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1">
                      Contribution Amount ($ USD)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={contributeAmount}
                      onChange={(e) => setContributeAmount(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-lg font-black text-stone-900 outline-none focus:border-[#C1541F]"
                    />
                  </div>

                  {/* Preset chips */}
                  <div className="flex flex-wrap items-center gap-2">
                    {[10, 25, 50, 100, 250].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setContributeAmount(amt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          contributeAmount === amt
                            ? 'bg-[#C1541F] text-white'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        +${amt}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1">
                      Recipient / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Islamic Relief, Local Masjid"
                      value={contributeRecipient}
                      onChange={(e) => setContributeRecipient(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-bold text-stone-800 outline-none focus:border-[#C1541F]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1">
                      Note / Intention (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Monthly voluntary Sadaqah fulfillment"
                      value={contributeNote}
                      onChange={(e) => setContributeNote(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-bold text-stone-800 outline-none focus:border-[#C1541F]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowContributeModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-extrabold text-xs uppercase tracking-wider shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm Contribution</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL 3: EDIT GOAL TARGET / DETAILS */}
          {showEditGoalModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700">
                      <Edit3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#16241A]">Edit Goal Target</h4>
                      <p className="text-xs text-stone-500 font-semibold">Adjust target amounts and deadlines</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEditGoalModal(false)}
                    className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateCharityGoal({
                      title: editGoalTitle.trim(),
                      targetAmount: Number(editTargetAmount),
                      targetDate: editGoalTargetDate,
                    });
                    setShowEditGoalModal(false);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1">
                      Goal Title
                    </label>
                    <input
                      type="text"
                      required
                      value={editGoalTitle}
                      onChange={(e) => setEditGoalTitle(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-bold text-stone-800 outline-none focus:border-[#C1541F]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1">
                      Target Goal Amount ($ USD)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editTargetAmount}
                      onChange={(e) => setEditTargetAmount(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-bold text-stone-800 outline-none focus:border-[#C1541F]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1">
                      Target Deadline Date
                    </label>
                    <input
                      type="date"
                      required
                      value={editGoalTargetDate}
                      onChange={(e) => setEditGoalTargetDate(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-bold text-stone-800 outline-none focus:border-[#C1541F] cursor-pointer"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditGoalModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#C1541F] hover:bg-[#a94515] text-white font-extrabold text-xs uppercase tracking-wider shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
