import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL, getFontFamilyClass } from '../../i18n/translations';
import { BrandMark } from '../common/BrandMark';
import { Language } from '../../types';
import {
  Home,
  Clock,
  BookOpen,
  Moon,
  CalendarCheck,
  Compass,
  Coins,
  Users,
  HeartHandshake,
  Settings,
  ShieldCheck,
  ChevronDown,
  Globe,
  Bell,
  LogOut,
  X,
  Menu,
  Sparkles,
} from 'lucide-react';

export type ActiveTab =
  | 'home'
  | 'prayer'
  | 'quran'
  | 'ramadan'
  | 'productivity'
  | 'spiritual'
  | 'zakat'
  | 'group_khatm'
  | 'family'
  | 'settings'
  | 'admin';

interface AppShellProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  setActiveTab,
  children,
}) => {
  const {
    currentUser,
    language,
    setLanguage,
    signOut,
    prayerTimes,
    nextPrayerInfo,
    activeNotification,
    dismissNotification,
    familyMembers,
    activeFamilyMemberId,
    setActiveFamilyMemberId,
  } = useApp();

  const t = useTranslation(language);
  const rtl = isRTL(language);
  const fontClass = getFontFamilyClass(language);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Module items for sidebar and navigation
  const navItems = [
    {
      id: 'home' as ActiveTab,
      label: t('navHome'),
      icon: Home,
      glowColor: '#4ADE80',
      accentColor: '#2E8B4F',
    },
    {
      id: 'prayer' as ActiveTab,
      label: t('navPrayer'),
      icon: Clock,
      glowColor: '#4ADE80',
      accentColor: '#2E8B4F',
    },
    {
      id: 'quran' as ActiveTab,
      label: t('navQuran'),
      icon: BookOpen,
      glowColor: '#FBBF24',
      accentColor: '#C89B2E',
    },
    {
      id: 'ramadan' as ActiveTab,
      label: t('navRamadan'),
      icon: Moon,
      glowColor: '#A78BFA',
      accentColor: '#5B3FA8',
    },
    {
      id: 'productivity' as ActiveTab,
      label: t('navProductivity'),
      icon: CalendarCheck,
      glowColor: '#38BDF8',
      accentColor: '#1D7A9C',
    },
    {
      id: 'spiritual' as ActiveTab,
      label: t('navSpiritual'),
      icon: Compass,
      glowColor: '#2DD4BF',
      accentColor: '#0E8C74',
    },
    {
      id: 'zakat' as ActiveTab,
      label: t('navZakat'),
      icon: Coins,
      glowColor: '#FB923C',
      accentColor: '#C1541F',
    },
    {
      id: 'group_khatm' as ActiveTab,
      label: t('navGroupKhatm'),
      icon: Users,
      glowColor: '#2DD4BF',
      accentColor: '#0E8C74',
    },
    {
      id: 'family' as ActiveTab,
      label: t('navFamily'),
      icon: HeartHandshake,
      glowColor: '#4ADE80',
      accentColor: '#2E8B4F',
    },
    {
      id: 'settings' as ActiveTab,
      label: t('navSettings'),
      icon: Settings,
      glowColor: '#9FB6A3',
      accentColor: '#5D6B5A',
    },
  ];

  // If user is admin, allow admin tab
  if (currentUser?.role === 'admin') {
    navItems.push({
      id: 'admin' as ActiveTab,
      label: t('navAdmin'),
      icon: ShieldCheck,
      glowColor: '#FBBF24',
      accentColor: '#C89B2E',
    });
  }

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ar', label: 'Arabic', native: 'العربية' },
    { code: 'ur', label: 'Urdu', native: 'اردو' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  ];

  const currentFamilyMember = familyMembers.find((m) => m.id === activeFamilyMemberId);

  return (
    <div
      dir={rtl ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-[#F7F4EC] text-[#16241A] ${fontClass} flex flex-col lg:flex-row antialiased selection:bg-[#C89B2E]/20`}
    >
      {/* IN-APP NOTIFICATION BANNER */}
      {activeNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 bg-[#0B2E1C] border border-[#C89B2E] text-[#F3F0E4] px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-ping" />
            <span className="text-sm font-medium">{activeNotification}</span>
          </div>
          <button
            onClick={dismissNotification}
            className="text-[#9FB6A3] hover:text-[#F3F0E4] p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DESKTOP SIDEBAR (~280px, #0B2E1C surface top-to-bottom) */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0B2E1C] text-[#F3F0E4] shrink-0 min-h-screen border-r border-[#123D28] shadow-2xl relative z-20">
        {/* Brand Lockup */}
        <div className="p-6 border-b border-[#123D28]">
          <BrandMark variant="dark" size="md" />
        </div>

        {/* Next Prayer Live Widget in Sidebar */}
        {nextPrayerInfo && (
          <div className="mx-4 my-4 p-4 rounded-2xl bg-[#123D28] border border-[#C89B2E]/40 shadow-inner">
            <div className="flex items-center justify-between text-xs text-[#9FB6A3] font-bold mb-1">
              <span>{t('nextPrayer')}</span>
              <span className="text-[#FBBF24] font-extrabold">{nextPrayerInfo.nextTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-black text-base text-[#F3F0E4]">{t(nextPrayerInfo.nextPrayer)}</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#0B2E1C] text-[#4ADE80]">
                {nextPrayerInfo.formattedCountdown} {t('timeRemaining')}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Modules List */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#123D28] text-[#F3F0E4] shadow-sm'
                    : 'text-[#9FB6A3] hover:text-[#F3F0E4] hover:bg-[#123D28]/60'
                }`}
                style={{
                  borderLeft: isActive && !rtl ? `4px solid ${item.glowColor}` : 'none',
                  borderRight: isActive && rtl ? `4px solid ${item.glowColor}` : 'none',
                }}
              >
                <Icon
                  className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105"
                  style={{ color: isActive ? item.glowColor : '#9FB6A3' }}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Account Bar & Family Switcher */}
        <div className="p-4 border-t border-[#123D28] bg-[#0B2E1C]/90">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-9 h-9 rounded-full bg-[#123D28] border border-[#C89B2E] flex items-center justify-center text-sm font-black text-[#FBBF24] shrink-0">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-[#F3F0E4] truncate">
                  {currentFamilyMember ? `${currentFamilyMember.name} (Family)` : currentUser?.name}
                </p>
                <p className="text-xs text-[#9FB6A3] truncate">{currentUser?.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              title={t('signOut')}
              className="p-2 text-[#9FB6A3] hover:text-red-400 hover:bg-[#123D28] rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {familyMembers.length > 0 && (
            <div className="mt-2 pt-2 border-t border-[#123D28]/60 flex items-center justify-between text-xs font-semibold">
              <span className="text-[#9FB6A3]">{t('profileLabel')}:</span>
              <select
                value={activeFamilyMemberId || ''}
                onChange={(e) => setActiveFamilyMemberId(e.target.value || null)}
                className="bg-[#123D28] text-xs font-bold text-[#F3F0E4] rounded-lg px-2.5 py-1 border border-[#C89B2E]/40 outline-none"
              >
                <option value="">{currentUser?.name} ({t('relParent')})</option>
                {familyMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* SLIM TOP BAR (Mobile & Desktop) */}
        <header className="sticky top-0 z-30 bg-[#F7F4EC]/95 backdrop-blur-md border-b border-[#0B2E1C]/10 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Left Slot: Mobile Brand / Page Title */}
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <BrandMark variant="light" size="sm" showWordmark={false} />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-black text-[#16241A] tracking-tight">
                {navItems.find((n) => n.id === activeTab)?.label || 'BarakahDaily'}
              </h1>
              {prayerTimes && (
                <p className="text-xs text-[#5D6B5A] flex items-center gap-1.5 font-medium">
                  <span className="font-bold text-[#0B2E1C]">{prayerTimes.date.hijriDate}</span>
                  <span className="text-stone-300">·</span>
                  <span>{currentUser?.location.city}, {currentUser?.location.country}</span>
                </p>
              )}
            </div>
          </div>

          {/* Right Slot: Language Switcher & Landing / Profile CTA */}
          <div className="flex items-center gap-2">
            {/* Direct Link to Landing Page / Sign Out */}
            <button
              onClick={signOut}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#0B2E1C]/15 hover:border-red-300 hover:bg-red-50 text-xs font-bold text-stone-700 hover:text-red-600 shadow-xs transition-colors cursor-pointer"
              title="Sign out & view Landing / Login / Sign-up page"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-500" />
              <span>{t('landingPageLabel') || 'Landing Page'}</span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#0B2E1C]/15 hover:border-[#0B2E1C]/30 text-xs sm:text-sm font-bold text-[#16241A] shadow-xs transition-colors cursor-pointer"
                title={t('selectLanguage')}
              >
                <Globe className="w-4 h-4 text-[#C89B2E]" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#5D6B5A]" />
              </button>

              {langMenuOpen && (
                <div
                  className={`absolute ${rtl ? 'left-0' : 'right-0'} mt-2 w-48 bg-white border border-[#0B2E1C]/15 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in duration-150`}
                >
                  <p className="px-3.5 py-1 text-xs font-bold text-[#5D6B5A] uppercase tracking-wider">
                    {t('selectLanguage')}
                  </p>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between hover:bg-[#F7F4EC] transition-colors cursor-pointer ${
                        language === l.code ? 'font-extrabold text-[#2E8B4F] bg-[#E1F2E7]/40' : 'text-[#16241A] font-semibold'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-xs text-[#5D6B5A]">{l.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#0B2E1C]/10 text-[#0B2E1C] hover:bg-[#E1F2E7] transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* MOBILE SLIDE-OUT MENU FOR MORE TABS */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end lg:hidden">
            <div className="bg-[#0B2E1C] rounded-t-3xl p-6 text-[#F3F0E4] max-h-[85vh] overflow-y-auto border-t-2 border-[#C89B2E]">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#123D28]">
                <BrandMark variant="dark" size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-[#123D28] text-[#9FB6A3] hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#123D28] text-white border-2 border-[#C89B2E] shadow-md'
                          : 'bg-[#0e3822] text-[#E1EFE4] hover:bg-[#123D28] border border-[#1b4b32]'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" style={{ color: isActive ? item.glowColor : '#9FB6A3' }} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#123D28] flex items-center justify-between">
                <div>
                  <p className="text-sm font-extrabold text-white">{currentUser?.name}</p>
                  <p className="text-xs text-[#9FB6A3] mt-0.5">{currentUser?.email}</p>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-900/50 hover:bg-red-900/80 text-red-200 text-xs font-bold border border-red-800 transition-colors cursor-pointer"
                >
                  {t('signOut')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY CONTAINER */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAV BAR (Fixed, #0B2E1C trust surface, min 56px tap target) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B2E1C] border-t border-[#123D28] px-2 py-2 shadow-2xl flex items-center justify-around h-18 safe-area-pb">
        {[
          { id: 'home' as ActiveTab, label: t('navHome'), icon: Home, glow: '#4ADE80' },
          { id: 'prayer' as ActiveTab, label: t('navPrayer'), icon: Clock, glow: '#4ADE80' },
          { id: 'quran' as ActiveTab, label: t('navQuran'), icon: BookOpen, glow: '#FBBF24' },
          { id: 'ramadan' as ActiveTab, label: t('navRamadan'), icon: Moon, glow: '#A78BFA' },
          { id: 'productivity' as ActiveTab, label: t('navProductivity'), icon: CalendarCheck, glow: '#38BDF8' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 min-h-[52px] flex flex-col items-center justify-center py-1 select-none transition-transform active:scale-95 cursor-pointer"
            >
              <div
                className={`flex items-center justify-center w-11 h-7 rounded-full transition-all ${
                  isActive ? 'bg-[#123D28] ring-1 ring-[#C89B2E]/50' : ''
                }`}
              >
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{ color: isActive ? tab.glow : '#AEC1B1' }}
                />
              </div>
              <span
                className={`text-xs font-bold tracking-tight mt-1 text-center transition-colors line-clamp-1 ${
                  isActive ? 'text-white font-black' : 'text-[#AEC1B1]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
