import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL } from '../../i18n/translations';
import { PrayerName, PrayerStatus, FamilyMember } from '../../types';
import {
  HeartHandshake,
  Plus,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Users,
  Star,
  Sun,
  Moon,
  Heart,
  Smile,
  Sparkles,
  Trash2,
  Edit3,
  Share2,
  Flame,
  Trophy,
  ShieldCheck,
  Check,
  X,
  Droplet,
  MessageCircle,
} from 'lucide-react';

export const FamilyModeModule: React.FC = () => {
  const {
    currentUser,
    language,
    familyMembers,
    activeFamilyMemberId,
    setActiveFamilyMemberId,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    logFamilyMemberPrayer,
    logFamilyQuranProgress,
    awardFamilyStar,
    familyDuas,
    addFamilyDua,
    toggleFamilyDuaAnswered,
    deleteFamilyDua,
    familyJamaahPrayers,
    toggleFamilyJamaahPrayer,
    familySunnahDone,
    toggleFamilySunnahDone,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);

  // Localization helpers for members, badges, relationships, age groups, and Du'as
  const getLocalizedMemberName = (member: FamilyMember): string => {
    if (member.id === 'fam_1') return t('defaultMember1Name');
    if (member.id === 'fam_2') return t('defaultMember2Name');
    if (member.id === 'fam_3') return t('defaultMember3Name');
    return member.name;
  };

  const getLocalizedRelationship = (rel: string): string => {
    if (rel === 'child') return t('relChild');
    if (rel === 'spouse') return t('relSpouse');
    if (rel === 'parent') return t('relParent');
    return rel;
  };

  const getLocalizedAgeGroup = (age: string): string => {
    if (age === 'child') return t('ageChild');
    if (age === 'teen') return t('ageTeen');
    if (age === 'adult') return t('ageAdult');
    return age;
  };

  const getLocalizedHifzSurah = (surah?: string): string => {
    if (!surah) return '';
    if (surah.includes('Amma') || surah.includes('30')) {
      return language === 'ur' ? 'پارہ 30 (عم)' : language === 'ar' ? 'جزء ٣٠ (عم)' : language === 'hi' ? 'पारा 30 (अम्मा)' : language === 'bn' ? '৩০তম পারা (আম্মা)' : surah;
    }
    if (surah.includes('Mulk')) {
      return language === 'ur' ? 'سورۃ الملک' : language === 'ar' ? 'سورة الملك' : language === 'hi' ? 'सूरह अल-मुल्क' : language === 'bn' ? 'সূরা আল-মুলক' : surah;
    }
    if (surah.includes('Rahman')) {
      return language === 'ur' ? 'سورۃ الرحمن' : language === 'ar' ? 'سورة الرحمن' : language === 'hi' ? 'सूरह अर-रहमान' : language === 'bn' ? 'সূরা আর-রহমান' : surah;
    }
    if (surah.includes('Baqarah')) {
      return language === 'ur' ? 'سورۃ البقرۃ' : language === 'ar' ? 'سورة البقرة' : language === 'hi' ? 'सूरह अल-बक़रा' : language === 'bn' ? 'সূরা আল-বাকারা' : surah;
    }
    return surah;
  };

  const getLocalizedBadgeTitle = (title: string): string => {
    if (title === 'Fajr Champion') return t('badgeFajrChampion');
    if (title === 'Wudu Master') return t('badgeWuduMaster');
    if (title === "Qur'an Hafizah Journey") return t('badgeQuranHafiz');
    if (title === 'Kindness Star') return t('badgeKindnessStar');
    if (title === 'Home Pillar') return t('badgeHomePillar');
    if (title === 'Welcome to Family Barakah') return t('badgeWelcome');
    return title;
  };

  const getLocalizedBadgeDesc = (desc: string): string => {
    if (desc === 'Woke up for Fajr with father') return t('badgeFajrChampionDesc');
    if (desc === 'Learned Sunnah steps of Wudu') return t('badgeWuduMasterDesc');
    if (desc === 'Completed Juz 29 revision') return t('badgeQuranHafizDesc');
    if (desc === 'Helped prepare evening dinner and Iftar') return t('badgeKindnessStarDesc');
    if (desc === 'Led family daily Hadith reading') return t('badgeHomePillarDesc');
    if (desc === 'Joined household worship circle') return t('badgeWelcomeDesc');
    return desc;
  };

  const getLocalizedDuaText = (dua: { id: string; text: string }): string => {
    if (dua.id === 'dua_1') return t('defaultDua1Text');
    if (dua.id === 'dua_2') return t('defaultDua2Text');
    if (dua.id === 'dua_3') return t('defaultDua3Text');
    return dua.text;
  };

  // Active sub-tab inside Family Module
  const [activeTab, setActiveTab] = useState<'profiles' | 'jamaah' | 'badges' | 'duas'>('profiles');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<FamilyMember | null>(null);
  const [starAwardMember, setStarAwardMember] = useState<FamilyMember | null>(null);
  const [starCountInput, setStarCountInput] = useState<number>(3);
  const [starReasonInput, setStarReasonInput] = useState<string>('');

  // Add Member Form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRel, setNewMemberRel] = useState<'child' | 'spouse' | 'parent'>('child');
  const [newMemberAge, setNewMemberAge] = useState<'child' | 'teen' | 'adult'>('child');
  const [newTargetPages, setNewTargetPages] = useState<number>(30);
  const [newHifzSurah, setNewHifzSurah] = useState<string>('Juz 30 (Amma)');

  // New Du'a Form
  const [newDuaText, setNewDuaText] = useState('');
  const [newDuaAuthor, setNewDuaAuthor] = useState('');

  const prayersList: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    addFamilyMember(
      newMemberName.trim(),
      newMemberRel,
      newMemberAge,
      Number(newTargetPages) || 30,
      newHifzSurah.trim() || 'Juz 30 (Amma)'
    );
    setNewMemberName('');
    setNewTargetPages(30);
    setNewHifzSurah('Juz 30 (Amma)');
    setShowAddModal(false);
  };

  const handleEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    updateFamilyMember(editingMember.id, {
      name: editingMember.name,
      relationship: editingMember.relationship,
      ageGroup: editingMember.ageGroup,
      targetQuranPages: Number(editingMember.targetQuranPages) || 30,
      hifzSurah: editingMember.hifzSurah,
    });
    setEditingMember(null);
  };

  const handleAwardStarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!starAwardMember) return;
    awardFamilyStar(starAwardMember.id, Number(starCountInput) || 1, starReasonInput.trim());
    setStarAwardMember(null);
    setStarReasonInput('');
    setStarCountInput(3);
  };

  const handleAddDuaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDuaText.trim()) return;
    addFamilyDua(newDuaText.trim(), newDuaAuthor.trim() || currentUser?.name || 'Family');
    setNewDuaText('');
    setNewDuaAuthor('');
  };

  // Aggregated household stats
  const totalHouseholdStars = familyMembers.reduce((sum, m) => sum + (m.barakahStars || 0), 0);
  const totalHouseholdPages = familyMembers.reduce((sum, m) => sum + (m.quranProgress || 0), 0);
  const totalJamaahPrayersCount = Object.values(familyJamaahPrayers).filter(Boolean).length;

  const activeMember = familyMembers.find((m) => m.id === activeFamilyMemberId);

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER */}
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

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-extrabold text-sm flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addFamilyProfile')}</span>
          </button>
        </div>
      </div>

      {/* 2. ACTIVE HOUSEHOLD CONTEXT BANNER */}
      {activeMember ? (
        <div className="bg-[#FAF0D8] border border-[#C89B2E]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C89B2E] text-white flex items-center justify-center font-black">
              {activeMember.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#8A6715]">
                {t('activeMode')}: <strong className="text-[#16241A]">{getLocalizedMemberName(activeMember)}</strong>
              </p>
              <p className="text-xs text-stone-600 font-medium">
                {t('activeMemberBannerDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveFamilyMemberId(null)}
            className="px-4 py-2 rounded-xl bg-white border border-[#C89B2E]/40 hover:bg-[#FAF0D8] text-xs font-extrabold text-[#8A6715] transition-colors cursor-pointer self-start sm:self-auto"
          >
            {t('switchToPrimary')} ({currentUser?.name})
          </button>
        </div>
      ) : null}

      {/* 3. HOUSEHOLD QUICK STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#2E8B4F] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xxs font-extrabold uppercase tracking-wider text-stone-500">{t('profilesStatLabel')}</span>
            <p className="text-xl font-black text-[#16241A] tabular-nums">{familyMembers.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-xxs font-extrabold uppercase tracking-wider text-stone-500">{t('barakahStarsStatLabel')}</span>
            <p className="text-xl font-black text-amber-600 tabular-nums">{totalHouseholdStars}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xxs font-extrabold uppercase tracking-wider text-stone-500">{t('quranPagesStatLabel')}</span>
            <p className="text-xl font-black text-teal-700 tabular-nums flex items-baseline gap-1" dir={rtl ? 'rtl' : 'ltr'}>
              <span>{totalHouseholdPages}</span>
              <span className="text-xs font-bold text-teal-600">{t('pagesShort')}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xxs font-extrabold uppercase tracking-wider text-stone-500">{t('jamaahTodayStatLabel')}</span>
            <p className="text-xl font-black text-rose-600 tabular-nums" dir="ltr">
              {totalJamaahPrayersCount} / 5
            </p>
          </div>
        </div>
      </div>

      {/* 4. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('profiles')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'profiles'
              ? 'bg-[#2E8B4F] text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('familyTabsProfiles')}</span>
        </button>

        <button
          onClick={() => setActiveTab('jamaah')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'jamaah'
              ? 'bg-[#2E8B4F] text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>{t('familyTabsJamaah')}</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'badges'
              ? 'bg-[#2E8B4F] text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t('familyTabsBadges')}</span>
        </button>

        <button
          onClick={() => setActiveTab('duas')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'duas'
              ? 'bg-[#2E8B4F] text-white shadow-xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{t('familyTabsDuas')}</span>
        </button>
      </div>

      {/* 5. TAB 1: PROFILES & PRAYERS */}
      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {familyMembers.map((member) => {
            const isSelected = activeFamilyMemberId === member.id;
            const targetPages = member.targetQuranPages || 30;
            const quranPercent = Math.min(100, Math.round(((member.quranProgress || 0) / targetPages) * 100));

            return (
              <div
                key={member.id}
                className={`rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#2E8B4F] shadow-lg ring-2 ring-[#2E8B4F]/20'
                    : 'bg-white border-stone-200 shadow-xs hover:border-stone-300'
                }`}
              >
                <div>
                  {/* Card Top Row */}
                  <div className="flex items-center justify-between pb-5 border-b border-stone-100">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-[#E1F2E7] text-[#2E8B4F] flex items-center justify-center font-black text-xl shadow-xs shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-extrabold text-[#16241A]">{getLocalizedMemberName(member)}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                            {getLocalizedRelationship(member.relationship)}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-500">
                            {getLocalizedAgeGroup(member.ageGroup)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveFamilyMemberId(isSelected ? null : member.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#2E8B4F] text-white shadow-xs' : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {isSelected ? t('activeMode') : t('switchTo')}
                      </button>

                      <button
                        onClick={() => setEditingMember(member)}
                        className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                        title={t('editProfile')}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setMemberToDelete(member)}
                        className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title={t('deleteProfile')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Badges & Stars Row */}
                  <div className="flex items-center justify-between mt-4 pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span className="text-xs font-black text-amber-900">{member.barakahStars || 0}</span>
                      </div>
                      <button
                        onClick={() => setStarAwardMember(member)}
                        className="text-xxs font-extrabold text-[#2E8B4F] hover:text-[#257341] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{t('awardStarBtn')}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-stone-500">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span>{member.prayerStreak} {t('todayStreak')}</span>
                    </div>
                  </div>

                  {/* Qur'an & Hifz Progress */}
                  <div className="my-4 p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-stone-700 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                        <span>{getLocalizedHifzSurah(member.hifzSurah) || 'Juz 30 (Amma)'}</span>
                      </span>
                      <span className="text-teal-800 font-extrabold flex items-center gap-1" dir={rtl ? 'rtl' : 'ltr'}>
                        <span dir="ltr">{member.quranProgress || 0} / {targetPages}</span>
                        <span>{t('pagesShort')}</span>
                        <span dir="ltr">({quranPercent}%)</span>
                      </span>
                    </div>

                    <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-teal-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${quranPercent}%` }}
                      />
                    </div>

                    {/* Quick Log Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-xxs font-extrabold uppercase text-stone-400">{t('logQuranBtn')}:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => logFamilyQuranProgress(member.id, 1)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-teal-600 text-teal-800 text-xs font-black transition-colors cursor-pointer"
                        >
                          +1 {t('pageUnit')}
                        </button>
                        <button
                          onClick={() => logFamilyQuranProgress(member.id, 5)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-teal-600 text-teal-800 text-xs font-black transition-colors cursor-pointer"
                        >
                          +5 {t('pageUnit')}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Today's Prayers Checklist */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-extrabold text-[#5D6B5A] uppercase tracking-wider">{t('prayerCheckoff')}</p>
                      <span className="text-xxs font-bold text-stone-400">{t('prayerTapHint')}</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {prayersList.map((p) => {
                        const status = member.todayPrayers[p];
                        const isDone = status === 'on-time' || status === 'late';
                        const isLate = status === 'late';

                        return (
                          <button
                            key={p}
                            onClick={() => {
                              let nextStatus: PrayerStatus = 'on-time';
                              if (status === 'on-time') nextStatus = 'late';
                              else if (status === 'late') nextStatus = 'missed';
                              else nextStatus = 'on-time';
                              logFamilyMemberPrayer(member.id, p, nextStatus);
                            }}
                            className={`p-2.5 rounded-2xl text-center border transition-all cursor-pointer ${
                              status === 'on-time'
                                ? 'bg-[#E1F2E7] border-[#2E8B4F] text-[#2E8B4F] shadow-xs'
                                : isLate
                                ? 'bg-amber-50 border-amber-300 text-amber-800'
                                : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-400'
                            }`}
                            title={`${p}: ${status || 'Not logged'}`}
                          >
                            <span className="block text-xxs uppercase font-extrabold">{t(p)}</span>
                            <span className="text-base font-black mt-1 block">
                              {status === 'on-time' ? '✓' : isLate ? '⏱' : '—'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Earned Badges Row */}
                {member.badges && member.badges.length > 0 && (
                  <div className="pt-4 border-t border-stone-100 mt-4 flex items-center gap-1.5 flex-wrap">
                    <span className="text-xxs font-extrabold uppercase text-stone-400 mr-1">{t('badgesLabel')}</span>
                    {member.badges.slice(0, 3).map((b) => (
                      <span
                        key={b.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xxs font-bold bg-amber-50 text-amber-900 border border-amber-200"
                        title={getLocalizedBadgeDesc(b.description)}
                      >
                        <Trophy className="w-3 h-3 text-amber-600" />
                        <span>{getLocalizedBadgeTitle(b.title)}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 6. TAB 2: HOUSEHOLD JAMA'AH & SUNNAH */}
      {activeTab === 'jamaah' && (
        <div className="space-y-6">
          {/* Jama'ah Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <HeartHandshake className="w-5 h-5 text-[#2E8B4F]" />
                  <h3 className="text-lg sm:text-xl font-black text-[#16241A]">{t('jamaahTitle')}</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-xl">
                  {t('jamaahSubtitle')}
                </p>
              </div>

              <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold flex items-center gap-1.5 self-start md:self-center">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t('jamaah27x')}</span>
              </span>
            </div>

            {/* Prayers Toggle Buttons */}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-3">{t('prayedInJamaahToday')}:</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {prayersList.map((p) => {
                  const isDone = !!familyJamaahPrayers[p];
                  return (
                    <button
                      key={p}
                      onClick={() => toggleFamilyJamaahPrayer(p)}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[90px] ${
                        isDone
                          ? 'bg-[#E1F2E7] border-[#2E8B4F] text-[#0B2E1C] shadow-sm'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                      }`}
                    >
                      <span className="text-xs font-black uppercase">{t(p)}</span>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mt-2 ${
                        isDone ? 'bg-[#2E8B4F] text-white' : 'bg-stone-200 text-stone-400'
                      }`}>
                        {isDone ? '✓' : '+'}
                      </span>
                      <span className="text-xxs font-extrabold mt-1 text-[#2E8B4F]">
                        {isDone ? t('jamaahLogged') : t('tapToMark')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Daily Household Sunnah Challenge */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#2E8B4F] text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5" />
                <span>{t('dailySunnahChallengeTitle')}</span>
              </span>

              <button
                onClick={toggleFamilySunnahDone}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  familySunnahDone
                    ? 'bg-[#2E8B4F] text-white shadow-xs'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{familySunnahDone ? t('completedTodayCheck') : t('markCompleted')}</span>
              </button>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-black text-[#16241A]">
                "{t('dailySunnahChallengeTask')}"
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 italic mt-1 font-medium">
                {t('dailySunnahChallengeHadith')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB 3: BARAKAH STARS & BADGES */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#16241A]">{t('familyTabsBadges')}</h3>
                <p className="text-xs sm:text-sm text-stone-600 font-medium">
                  {t('barakahStarsSubtitle')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{t('totalHouseholdStarsLabel')}: {totalHouseholdStars}</span>
                </span>
              </div>
            </div>

            {/* List per member */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {familyMembers.map((m) => (
                <div key={m.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-extrabold text-[#16241A]">{getLocalizedMemberName(m)}</h4>
                      <span className="text-xxs font-bold text-stone-500 uppercase">{getLocalizedRelationship(m.relationship)}</span>
                    </div>

                    <button
                      onClick={() => setStarAwardMember(m)}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t('awardStarBtn')}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-amber-800 tabular-nums">{m.barakahStars || 0}</p>
                      <span className="text-xxs font-bold text-stone-400">{t('starsEarnedLabel')}</span>
                    </div>
                  </div>

                  {/* Badges List */}
                  <div className="space-y-2 pt-2 border-t border-stone-200/60">
                    <span className="text-xxs font-extrabold uppercase text-stone-500">{t('badgesAndAchievements')}</span>
                    {m.badges && m.badges.length > 0 ? (
                      <div className="space-y-1.5">
                        {m.badges.map((b) => (
                          <div key={b.id} className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs">
                            <p className="font-extrabold text-[#16241A] flex items-center gap-1.5">
                              <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>{getLocalizedBadgeTitle(b.title)}</span>
                            </p>
                            <p className="text-stone-500 text-xxs mt-0.5">{getLocalizedBadgeDesc(b.description)}</p>
                            <span className="text-stone-400 text-xxs block mt-0.5" dir="ltr">{b.awardedAt}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xxs text-stone-400 italic">{t('noBadgesYet')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB 4: FAMILY DU'A BOARD */}
      {activeTab === 'duas' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#16241A]">{t('familyTabsDuas')}</h3>
                <p className="text-xs sm:text-sm text-stone-600 font-medium">
                  {t('familyDuasSubtitle')}
                </p>
              </div>
            </div>

            {/* Add Du'a Box */}
            <form onSubmit={handleAddDuaSubmit} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <textarea
                rows={2}
                value={newDuaText}
                onChange={(e) => setNewDuaText(e.target.value)}
                placeholder={t('familyDuaPlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#2E8B4F]/30 bg-white"
                required
              />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <input
                  type="text"
                  value={newDuaAuthor}
                  onChange={(e) => setNewDuaAuthor(e.target.value)}
                  placeholder={t('requestedByPlaceholder')}
                  className="w-full sm:w-64 px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold outline-none bg-white"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#2E8B4F] hover:bg-[#257341] text-white text-xs font-extrabold cursor-pointer transition-colors shadow-xs"
                >
                  {t('addDuaBtn')}
                </button>
              </div>
            </form>

            {/* List of Du'as */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {familyDuas.map((dua) => (
                <div
                  key={dua.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    dua.answered
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-500">
                      By <strong className="text-stone-800">{dua.addedBy}</strong> · <span dir="ltr">{dua.createdAt}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleFamilyDuaAnswered(dua.id)}
                        className={`px-2.5 py-1 rounded-lg text-xxs font-extrabold uppercase transition-colors cursor-pointer ${
                          dua.answered
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {dua.answered ? t('answeredBadge') : t('keepInDua')}
                      </button>

                      <button
                        onClick={() => deleteFamilyDua(dua.id)}
                        className="p-1 rounded-lg text-stone-400 hover:text-red-500 cursor-pointer"
                        title={t('removeDuaTooltip')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-bold text-[#16241A] leading-relaxed whitespace-pre-wrap">
                    "{getLocalizedDuaText(dua)}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD FAMILY MEMBER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="text-xl font-extrabold text-[#16241A]">{t('addFamilyProfile')}</h4>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                ✕
              </button>
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

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('targetPagesLabel')}</label>
                  <input
                    type="number"
                    min="5"
                    max="604"
                    value={newTargetPages}
                    onChange={(e) => setNewTargetPages(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('hifzSurahLabel')}</label>
                  <input
                    type="text"
                    value={newHifzSurah}
                    onChange={(e) => setNewHifzSurah(e.target.value)}
                    placeholder="e.g. Juz Amma, Mulk..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none"
                  />
                </div>
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

      {/* MODAL 2: EDIT FAMILY MEMBER */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h4 className="text-xl font-extrabold text-[#16241A]">{t('editProfile')}</h4>
              <button onClick={() => setEditingMember(null)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleEditMember} className="space-y-4 text-sm font-semibold">
              <div>
                <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('fullNameLabel')}</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#2E8B4F]/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('relationshipLabel')}</label>
                  <select
                    value={editingMember.relationship}
                    onChange={(e) => setEditingMember({ ...editingMember, relationship: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none capitalize bg-white"
                  >
                    <option value="child">{t('relChild')}</option>
                    <option value="spouse">{t('relSpouse')}</option>
                    <option value="parent">{t('relParent')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('ageGroupLabel')}</label>
                  <select
                    value={editingMember.ageGroup}
                    onChange={(e) => setEditingMember({ ...editingMember, ageGroup: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none capitalize bg-white"
                  >
                    <option value="child">{t('ageChild')}</option>
                    <option value="teen">{t('ageTeen')}</option>
                    <option value="adult">{t('ageAdult')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('targetPagesLabel')}</label>
                  <input
                    type="number"
                    min="5"
                    max="604"
                    value={editingMember.targetQuranPages || 30}
                    onChange={(e) => setEditingMember({ ...editingMember, targetQuranPages: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('hifzSurahLabel')}</label>
                  <input
                    type="text"
                    value={editingMember.hifzSurah || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, hifzSurah: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="flex-1 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm cursor-pointer transition-colors"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-[#2E8B4F] hover:bg-[#257341] text-white font-extrabold text-sm cursor-pointer transition-colors shadow-xs"
                >
                  {t('saveProfileBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: AWARD BARAKAH STAR */}
      {starAwardMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <h4 className="text-lg font-black text-[#16241A]">{t('awardStarBtn')}</h4>
                <p className="text-xs text-stone-500 font-bold">{getLocalizedMemberName(starAwardMember)}</p>
              </div>
            </div>

            <form onSubmit={handleAwardStarSubmit} className="space-y-4 text-sm font-semibold">
              <div>
                <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('starsCountLabel')}</label>
                <div className="flex items-center gap-2">
                  {[1, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setStarCountInput(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        starCountInput === num
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      +{num} ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm text-[#5D6B5A] mb-1.5">{t('reasonStarLabel')}</label>
                <input
                  type="text"
                  value={starReasonInput}
                  onChange={(e) => setStarReasonInput(e.target.value)}
                  placeholder={t('starReasonPlaceholder')}
                  className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 outline-none text-xs font-bold"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStarAwardMember(null)}
                  className="flex-1 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm cursor-pointer transition-colors"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm cursor-pointer transition-colors shadow-xs"
                >
                  {t('awardStarBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE MEMBER CONFIRMATION */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-lg font-black text-stone-900">{t('confirmDeleteProfileTitle')}</h4>
                <p className="text-xs text-stone-500 font-bold">{getLocalizedMemberName(memberToDelete)}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 font-medium leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              {t('confirmDeleteProfileMsg')}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs uppercase hover:bg-stone-100 transition-colors cursor-pointer"
              >
                {t('cancelBtn')}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteFamilyMember(memberToDelete.id);
                  setMemberToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-xs cursor-pointer transition-colors"
              >
                {t('deleteProfile')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
