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
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'calculator'
              ? 'bg-[#C1541F] text-white shadow-xs'
              : 'text-[#5D6B5A] hover:bg-stone-100'
          }`}
        >
          {t('subtabCalculator')}
        </button>
        <button
          onClick={() => setActiveTab('sadaqah')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'sadaqah'
              ? 'bg-[#C1541F] text-white shadow-xs'
              : 'text-[#5D6B5A] hover:bg-stone-100'
          }`}
        >
          {t('subtabSadaqah')}
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'goals'
              ? 'bg-[#C1541F] text-white shadow-xs'
              : 'text-[#5D6B5A] hover:bg-stone-100'
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
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-xl font-extrabold text-[#16241A]">{t('calculateZakat')}</h3>
                <p className="text-xs text-[#5D6B5A]">{t('nisabExplanation')}</p>
              </div>

              {/* Nisab choice */}
              <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-xl border border-stone-200 text-xs font-semibold">
                <span className="text-[#5D6B5A]">{t('nisabStandardLabel')}:</span>
                <button
                  onClick={() => setNisabStandard('gold')}
                  className={`px-2.5 py-1 rounded-lg ${
                    nisabStandard === 'gold' ? 'bg-[#C1541F] text-white font-bold' : 'text-stone-700'
                  }`}
                >
                  {t('nisabGoldLabel')}
                </button>
                <button
                  onClick={() => setNisabStandard('silver')}
                  className={`px-2.5 py-1 rounded-lg ${
                    nisabStandard === 'silver' ? 'bg-[#C1541F] text-white font-bold' : 'text-stone-700'
                  }`}
                >
                  {t('nisabSilverLabel')}
                </button>
              </div>
            </div>

            {/* Inline Nisab explanation per PRD §4.6 */}
            <div className="p-3.5 rounded-xl bg-[#FAE5D8]/50 border border-[#C1541F]/30 text-xs text-[#C1541F] flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>{t('nisabStandardLabel')}:</strong> {t('nisabExplanation')} Current threshold for {nisabStandard} is{' '}
                <strong>${nisabThreshold.toFixed(2)} USD</strong>.
              </p>
            </div>

            {/* Form grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('cashSavingsLabel')} ($)</label>
                <input
                  type="number"
                  value={cash}
                  onChange={(e) => setCash(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('investmentsLabel')} ($)</label>
                <input
                  type="number"
                  value={investments}
                  onChange={(e) => setInvestments(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">Gold Owned (grams)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={goldGrams}
                    onChange={(e) => setGoldGrams(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                  />
                  <input
                    type="number"
                    value={goldPrice}
                    onChange={(e) => setGoldPrice(Number(e.target.value))}
                    title="Price/gram"
                    placeholder="$/g"
                    className="w-24 px-2 py-2 rounded-xl border border-stone-200 outline-none text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">Silver Owned (grams)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={silverGrams}
                    onChange={(e) => setSilverGrams(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                  />
                  <input
                    type="number"
                    value={silverPrice}
                    onChange={(e) => setSilverPrice(Number(e.target.value))}
                    title="Price/gram"
                    placeholder="$/g"
                    className="w-24 px-2 py-2 rounded-xl border border-stone-200 outline-none text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('businessAssets')} ($)</label>
                <input
                  type="number"
                  value={businessInventory}
                  onChange={(e) => setBusinessInventory(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-red-700 mb-1">Less: Immediate Liabilities / Debts ($)</label>
                <input
                  type="number"
                  value={debts}
                  onChange={(e) => setDebts(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-red-200 bg-red-50/30 outline-none text-red-900"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#C1541F]" />
              <h4 className="text-sm font-bold text-[#5D6B5A] uppercase tracking-wider mb-4">
                Zakat Assessment
              </h4>

              <div className="space-y-3 pb-4 border-b border-stone-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5D6B5A]">Gross Zakatable Wealth:</span>
                  <span className="font-bold text-[#16241A] tabular-nums">${totalAssets.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5D6B5A]">Deductible Debts:</span>
                  <span className="font-bold text-red-600 tabular-nums">-${debts.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-[#16241A]">Net Zakatable Pool:</span>
                  <span className="text-[#16241A] tabular-nums">${netZakatable.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#5D6B5A]">
                  <span>Nisab Threshold ({nisabStandard}):</span>
                  <span className="tabular-nums">${nisabThreshold.toFixed(2)}</span>
                </div>
              </div>

              {/* Big Due Number */}
              <div className="py-4 text-center">
                <span className="text-xs font-semibold text-[#5D6B5A] block">
                  {isEligibleForZakat ? 'Total Zakat Due (2.5%)' : 'Wealth Below Nisab Threshold'}
                </span>
                <p className="text-4xl font-extrabold text-[#C1541F] mt-1 tabular-nums">
                  ${zakatDue.toFixed(2)}
                </p>
                <span className="text-[11px] text-[#5D6B5A] mt-1 block">
                  {isEligibleForZakat ? 'Purification due on lunar year anniversary' : 'No Zakat obligation applies'}
                </span>
              </div>

              <button
                onClick={handleSaveCalculation}
                className="w-full py-3 rounded-xl bg-[#C1541F] hover:bg-[#a94515] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Save Calculation Record
              </button>
            </div>

            {/* Prior Year History */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
              <h5 className="text-xs font-bold text-[#5D6B5A] uppercase mb-3 flex items-center gap-1.5">
                <History className="w-4 h-4" /> Prior Year Calculations
              </h5>
              <div className="space-y-2">
                {zakatCalculations.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#16241A]">{c.date}</span>
                      <p className="text-[11px] text-[#5D6B5A]">Net: ${c.netZakatable.toLocaleString()}</p>
                    </div>
                    <span className="font-bold text-[#C1541F] self-center">
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
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <h4 className="text-base font-bold text-[#16241A] mb-4">{t('addSadaqah')}</h4>
            <form onSubmit={handleAddSadaqah} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[#5D6B5A] mb-1">Amount ($ USD)</label>
                <input
                  type="number"
                  min="1"
                  value={sadaqahAmount}
                  onChange={(e) => setSadaqahAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">Cause / Purpose</label>
                <input
                  type="text"
                  placeholder="e.g. Water well, Food parcels, Medical aid"
                  value={sadaqahCause}
                  onChange={(e) => setSadaqahCause(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">Recipient / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Islamic Relief, Local Masjid"
                  value={sadaqahRecipient}
                  onChange={(e) => setSadaqahRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">Niyyah / Note</label>
                <input
                  type="text"
                  placeholder="e.g. In memory of grandparents"
                  value={sadaqahNote}
                  onChange={(e) => setSadaqahNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#C1541F] text-white font-bold text-xs uppercase"
              >
                Log Charity
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <h4 className="text-base font-bold text-[#16241A] mb-4">Sadaqah History</h4>
            <div className="space-y-3">
              {sadaqahLogs.map((entry) => (
                <div key={entry.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#16241A]">{entry.cause}</span>
                      <span className="text-xs text-[#5D6B5A]">({entry.recipient})</span>
                    </div>
                    {entry.note && <p className="text-xs text-[#5D6B5A] mt-0.5 italic">"{entry.note}"</p>}
                    <p className="text-[11px] text-stone-400 mt-1">{entry.date}</p>
                  </div>
                  <span className="text-base font-extrabold text-[#2E8B4F] tabular-nums">
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
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-stone-200 shadow-xs max-w-xl mx-auto space-y-6">
          <h4 className="text-lg font-bold text-[#16241A]">Annual Giving Goal</h4>
          <p className="text-xs text-[#5D6B5A]">Set an intentional target for your charitable contributions</p>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs text-[#5D6B5A]">Current Progress</span>
                <p className="text-3xl font-extrabold text-[#C1541F] tabular-nums">
                  ${charityGoal.currentAmount} / ${charityGoal.targetAmount}
                </p>
              </div>
              <span className="text-sm font-bold text-[#16241A]">{goalPercent}%</span>
            </div>

            <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#C1541F] h-full rounded-full transition-all duration-500"
                style={{ width: `${goalPercent}%` }}
              />
            </div>

            <div className="pt-4 border-t border-stone-100">
              <label className="block text-xs font-bold text-[#5D6B5A] mb-1">Adjust Target Goal ($)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={charityGoal.targetAmount}
                  onChange={(e) => updateCharityGoal({ targetAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm font-semibold outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
