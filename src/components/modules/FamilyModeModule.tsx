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
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#2E8B4F]" />
            <h2 className="text-2xl font-extrabold text-[#16241A]">{t('familyTitle')}</h2>
          </div>
          <p className="text-xs text-[#5D6B5A] mt-1">
            {t('familyDesc')}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs self-start md:self-center"
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
              className={`rounded-3xl p-6 border transition-all ${
                isSelected
                  ? 'bg-white border-[#2E8B4F] shadow-md ring-2 ring-[#2E8B4F]/20'
                  : 'bg-white border-stone-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#E1F2E7] text-[#2E8B4F] flex items-center justify-center font-bold text-base">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#16241A]">{member.name}</h4>
                    <span className="text-[11px] text-[#5D6B5A] capitalize">
                      {member.relationship} ({member.ageGroup})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveFamilyMemberId(isSelected ? null : member.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    isSelected ? 'bg-[#2E8B4F] text-white' : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {isSelected ? t('activeMode') : t('switchTo')}
                </button>
              </div>

              {/* Progress Summary */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-[10px] text-[#5D6B5A] uppercase font-bold">{t('todayStreak')}</span>
                  <p className="text-xl font-extrabold text-[#2E8B4F] mt-0.5 tabular-nums">
                    {member.prayerStreak} {t('daysRemaining')}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-center">
                  <span className="text-[10px] text-[#5D6B5A] uppercase font-bold">{t('childQuranProgress')}</span>
                  <p className="text-xl font-extrabold text-[#C89B2E] mt-0.5 tabular-nums">
                    {member.quranProgress} pgs
                  </p>
                </div>
              </div>

              {/* Today's Prayers Checklist */}
              <div>
                <p className="text-xs font-bold text-[#5D6B5A] uppercase mb-2">{t('prayerCheckoff')}</p>
                <div className="grid grid-cols-5 gap-1.5">
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
                        className={`p-2 rounded-xl text-center border transition-all text-xs font-bold ${
                          isDone
                            ? 'bg-[#E1F2E7] border-[#2E8B4F] text-[#2E8B4F]'
                            : 'bg-stone-50 border-stone-200 text-stone-400'
                        }`}
                      >
                        <span className="block text-[10px] uppercase font-bold">{t(p)}</span>
                        <span className="text-sm mt-0.5 block">{isDone ? '✓' : '—'}</span>
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
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-sm w-full space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-[#16241A]">{t('addFamilyProfile')}</h4>
            <p className="text-xs text-[#5D6B5A]">
              {t('familyDesc')}
            </p>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('fullNameLabel')}</label>
                <input
                  type="text"
                  placeholder={t('namePlaceholder')}
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('relationshipLabel')}</label>
                <select
                  value={newMemberRel}
                  onChange={(e) => setNewMemberRel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none capitalize"
                >
                  <option value="child">{t('relChild')}</option>
                  <option value="spouse">{t('relSpouse')}</option>
                  <option value="parent">{t('relParent')}</option>
                </select>
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('ageGroupLabel')}</label>
                <select
                  value={newMemberAge}
                  onChange={(e) => setNewMemberAge(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none capitalize"
                >
                  <option value="child">{t('ageChild')}</option>
                  <option value="teen">{t('ageTeen')}</option>
                  <option value="adult">{t('ageAdult')}</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#2E8B4F] text-white font-bold"
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
