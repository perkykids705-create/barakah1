import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { PrayerName, PrayerStatus } from '../../types';
import {
  HeartHandshake,
  Plus,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Users,
} from 'lucide-react';

export const FamilyModeModule: React.FC = () => {
  const {
    currentUser,
    language,
    familyMembers,
    activeFamilyMemberId,
    setActiveFamilyMemberId,
    addFamilyMember,
    logFamilyMemberPrayer,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRel, setNewMemberRel] = useState<'child' | 'spouse' | 'parent'>('child');
  const [newMemberAge, setNewMemberAge] = useState<'child' | 'teen' | 'adult'>('child');

  const prayersList: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    addFamilyMember(newMemberName.trim(), newMemberRel, newMemberAge);
    setNewMemberName('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#2E8B4F]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#16241A]">{t('familyTitle')}</h2>
          </div>
          <p className="text-sm sm:text-base text-[#5D6B5A] mt-1.5 max-w-xl">
            {t('familyDesc')}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-extrabold text-sm flex items-center gap-2 transition-colors shadow-xs self-start md:self-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addFamilyProfile')}</span>
        </button>
      </div>

      {/* 2. FAMILY MEMBERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {familyMembers.map((member) => {
          const isSelected = activeFamilyMemberId === member.id;
          return (
            <div
              key={member.id}
              className={`rounded-3xl p-6 sm:p-7 border transition-all ${
                isSelected
                  ? 'bg-white border-[#2E8B4F] shadow-lg ring-2 ring-[#2E8B4F]/20'
                  : 'bg-white border-stone-200 shadow-xs hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between pb-5 border-b border-stone-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-[#E1F2E7] text-[#2E8B4F] flex items-center justify-center font-black text-xl shadow-xs">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold text-[#16241A]">{member.name}</h4>
                    <span className="text-xs sm:text-sm font-semibold text-[#5D6B5A] capitalize">
                      {member.relationship} ({member.ageGroup})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveFamilyMemberId(isSelected ? null : member.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#2E8B4F] text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {isSelected ? t('activeMode') : t('switchTo')}
                </button>
              </div>

              {/* Progress Summary */}
              <div className="grid grid-cols-2 gap-3.5 my-5">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-xs text-[#5D6B5A] uppercase font-bold tracking-wider">{t('todayStreak')}</span>
                  <p className="text-2xl font-black text-[#2E8B4F] mt-1 tabular-nums">
                    {member.prayerStreak} {t('daysRemaining')}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-xs text-[#5D6B5A] uppercase font-bold tracking-wider">{t('childQuranProgress')}</span>
                  <p className="text-2xl font-black text-[#C89B2E] mt-1 tabular-nums">
                    {member.quranProgress} pgs
                  </p>
                </div>
              </div>

              {/* Today's Prayers Checklist */}
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-[#5D6B5A] uppercase tracking-wider mb-2.5">{t('prayerCheckoff')}</p>
                <div className="grid grid-cols-5 gap-2">
                  {prayersList.map((p) => {
                    const status = member.todayPrayers[p];
                    const isDone = status === 'on-time' || status === 'late';
                    return (
                      <button
                        key={p}
                        onClick={() =>
                          logFamilyMemberPrayer(
                            member.id,
                            p,
                            status === 'on-time' ? 'late' : 'on-time'
                          )
                        }
                        className={`p-3 rounded-2xl text-center border transition-all cursor-pointer ${
                          isDone
                            ? 'bg-[#E1F2E7] border-[#2E8B4F] text-[#2E8B4F] shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-400'
                        }`}
                      >
                        <span className="block text-xs uppercase font-extrabold">{t(p)}</span>
                        <span className="text-base sm:text-lg font-black mt-1 block">{isDone ? '✓' : '—'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-5 shadow-2xl">
            <div>
              <h4 className="text-xl font-extrabold text-[#16241A]">{t('addFamilyProfile')}</h4>
              <p className="text-xs sm:text-sm text-[#5D6B5A] mt-1">
                {t('familyDesc')}
              </p>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-sm font-semibold">
              <div>
                <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('fullNameLabel')}</label>
                <input
                  type="text"
                  placeholder={t('namePlaceholder')}
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#2E8B4F]/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('relationshipLabel')}</label>
                <select
                  value={newMemberRel}
                  onChange={(e) => setNewMemberRel(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none capitalize focus:ring-2 focus:ring-[#2E8B4F]/30 bg-white"
                >
                  <option value="child">{t('relChild')}</option>
                  <option value="spouse">{t('relSpouse')}</option>
                  <option value="parent">{t('relParent')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('ageGroupLabel')}</label>
                <select
                  value={newMemberAge}
                  onChange={(e) => setNewMemberAge(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none capitalize focus:ring-2 focus:ring-[#2E8B4F]/30 bg-white"
                >
                  <option value="child">{t('ageChild')}</option>
                  <option value="teen">{t('ageTeen')}</option>
                  <option value="adult">{t('ageAdult')}</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm cursor-pointer transition-colors"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-extrabold text-sm cursor-pointer transition-colors shadow-xs"
                >
                  {t('createProfileBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
