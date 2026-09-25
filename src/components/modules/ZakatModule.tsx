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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">{t('calculateZakat')}</h3>
                <p className="text-sm sm:text-base text-stone-600 font-medium mt-0.5">{t('nisabExplanation')}</p>
              </div>

              {/* Nisab choice */}
              <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-2xl border border-stone-200 text-sm font-semibold shrink-0">
                <span className="text-stone-600">{t('nisabStandardLabel')}:</span>
                <button
                  onClick={() => setNisabStandard('gold')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer ${
                    nisabStandard === 'gold' ? 'bg-[#C1541F] text-white font-bold shadow-xs' : 'text-stone-700'
                  }`}
                >
                  {t('nisabGoldLabel')}
                </button>
                <button
                  onClick={() => setNisabStandard('silver')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer ${
                    nisabStandard === 'silver' ? 'bg-[#C1541F] text-white font-bold shadow-xs' : 'text-stone-700'
                  }`}
                >
                  {t('nisabSilverLabel')}
                </button>
              </div>
            </div>

            {/* Inline Nisab explanation */}
            <div className="p-4 rounded-2xl bg-[#FAE5D8]/50 border border-[#C1541F]/30 text-sm text-[#C1541F] flex items-start gap-3">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">
                <strong>{t('nisabStandardLabel')}:</strong> {t('nisabExplanation')} Current threshold for {nisabStandard} is{' '}
                <strong className="font-extrabold">${nisabThreshold.toFixed(2)} USD</strong>.
              </p>
            </div>

            {/* Form grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('cashSavingsLabel')} ($)</label>
                <input
                  type="number"
                  value={cash}
                  onChange={(e) => setCash(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('investmentsLabel')} ($)</label>
                <input
                  type="number"
                  value={investments}
                  onChange={(e) => setInvestments(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Gold Owned (grams)</label>
                <div className="flex gap-2.5">
                  <input
                    type="number"
                    value={goldGrams}
                    onChange={(e) => setGoldGrams(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                  />
                  <input
                    type="number"
                    value={goldPrice}
                    onChange={(e) => setGoldPrice(Number(e.target.value))}
                    title="Price/gram"
                    placeholder="$/g"
                    className="w-28 px-3 py-3 rounded-2xl border border-stone-200 outline-none text-center text-base font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">Silver Owned (grams)</label>
                <div className="flex gap-2.5">
                  <input
                    type="number"
                    value={silverGrams}
                    onChange={(e) => setSilverGrams(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                  />
                  <input
                    type="number"
                    value={silverPrice}
                    onChange={(e) => setSilverPrice(Number(e.target.value))}
                    title="Price/gram"
                    placeholder="$/g"
                    className="w-28 px-3 py-3 rounded-2xl border border-stone-200 outline-none text-center text-base font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1.5">{t('businessAssets')} ($)</label>
                <input
                  type="number"
                  value={businessInventory}
                  onChange={(e) => setBusinessInventory(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-red-700 mb-1.5">Less: Immediate Liabilities / Debts ($)</label>
                <input
                  type="number"
                  value={debts}
                  onChange={(e) => setDebts(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-red-200 bg-red-50/40 outline-none text-red-900 text-base font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#C1541F]" />
              <h4 className="text-sm sm:text-base font-extrabold text-stone-500 uppercase tracking-wider mb-4">
                Zakat Assessment
              </h4>

              <div className="space-y-3.5 pb-5 border-b border-stone-200/80 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600 font-medium">Gross Zakatable Wealth:</span>
                  <span className="font-bold text-[#16241A] tabular-nums">${totalAssets.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600 font-medium">Deductible Debts:</span>
                  <span className="font-bold text-red-600 tabular-nums">-${debts.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span className="text-[#16241A]">Net Zakatable Pool:</span>
                  <span className="text-[#16241A] tabular-nums">${netZakatable.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600 font-medium">
                  <span>Nisab Threshold ({nisabStandard}):</span>
                  <span className="tabular-nums font-bold">${nisabThreshold.toFixed(2)}</span>
                </div>
              </div>

              {/* Big Due Number */}
              <div className="py-5 text-center">
                <span className="text-sm font-bold text-stone-500 block">
                  {isEligibleForZakat ? 'Total Zakat Due (2.5%)' : 'Wealth Below Nisab Threshold'}
                </span>
                <p className="text-4xl sm:text-5xl font-black text-[#C1541F] mt-2 tabular-nums tracking-tight">
                  ${zakatDue.toFixed(2)}
                </p>
                <span className="text-xs sm:text-sm text-stone-500 font-medium mt-1.5 block">
                  {isEligibleForZakat ? 'Purification due on lunar year anniversary' : 'No Zakat obligation applies'}
                </span>
              </div>

              <button
                onClick={handleSaveCalculation}
                className="w-full py-3.5 rounded-2xl bg-[#C1541F] hover:bg-[#a94515] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                Save Calculation Record
              </button>
            </div>

            {/* Prior Year History */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
              <h5 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3.5 flex items-center gap-2">
                <History className="w-4 h-4" /> Prior Year Calculations
              </h5>
              <div className="space-y-2.5">
                {zakatCalculations.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between text-sm">
                    <div>
                      <span className="font-bold text-[#16241A]">{c.date}</span>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">Net: ${c.netZakatable.toLocaleString()}</p>
                    </div>
                    <span className="font-extrabold text-[#C1541F] self-center">
                      ${c.zakatDue.toFixed(2)} Paid
                    </span>
                  </div>
                ))}
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

      {/* 4. TAB 3: CHARITY GOALS */}
      {activeTab === 'goals' && (
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs max-w-xl mx-auto space-y-6">
          <h4 className="text-xl sm:text-2xl font-extrabold text-[#16241A] tracking-tight">Annual Giving Goal</h4>
          <p className="text-sm sm:text-base text-stone-600 font-medium">Set an intentional target for your charitable contributions</p>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-stone-500">Current Progress</span>
                <p className="text-3xl sm:text-4xl font-black text-[#C1541F] tabular-nums mt-0.5">
                  ${charityGoal.currentAmount} / ${charityGoal.targetAmount}
                </p>
              </div>
              <span className="text-base sm:text-lg font-black text-[#16241A]">{goalPercent}%</span>
            </div>

            <div className="w-full bg-stone-100 rounded-full h-4 overflow-hidden border border-stone-200/60">
              <div
                className="bg-[#C1541F] h-full rounded-full transition-all duration-500"
                style={{ width: `${goalPercent}%` }}
              />
            </div>

            <div className="pt-5 border-t border-stone-200/80">
              <label className="block text-sm font-bold text-stone-700 mb-1.5">Adjust Target Goal ($)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={charityGoal.targetAmount}
                  onChange={(e) => updateCharityGoal({ targetAmount: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-base font-semibold outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
