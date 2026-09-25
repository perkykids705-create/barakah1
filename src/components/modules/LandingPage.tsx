import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation, isRTL, getFontFamilyClass } from '../../i18n/translations';
import { BrandMark } from '../common/BrandMark';
import { CALCULATION_METHODS, POPULAR_LOCATIONS } from '../../services/prayerService';
import { Language, LocationConfig } from '../../types';
import {
  Clock,
  BookOpen,
  Moon,
  Users,
  Coins,
  Compass,
  ArrowRight,
  CheckCircle2,
  Globe,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface LandingPageProps {
  onSuccessfulAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSuccessfulAuth }) => {
  const { language, setLanguage, loginAs, signUpUser } = useApp();
  const t = useTranslation(language);
  const rtl = isRTL(language);
  const fontClass = getFontFamilyClass(language);

  const [authMode, setAuthMode] = useState<'landing' | 'login' | 'signup'>('landing');

  // Sign up inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [selectedLocation, setSelectedLocation] = useState<LocationConfig>(POPULAR_LOCATIONS[0]);
  const [calcMethod, setCalcMethod] = useState<number>(2);
  const [madhab, setMadhab] = useState<'shafi' | 'hanafi'>('shafi');
  const [errorMsg, setErrorMsg] = useState('');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ar', label: 'Arabic', native: 'العربية' },
    { code: 'ur', label: 'Urdu', native: 'اردو' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  ];

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please fill all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    signUpUser(name.trim(), email.trim(), selectedLang, selectedLocation, calcMethod, madhab);
    onSuccessfulAuth();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your email');
      return;
    }
    const role = loginEmail.toLowerCase().includes('admin') ? 'admin' : 'user';
    loginAs(loginEmail.trim(), role);
    onSuccessfulAuth();
  };

  const handleQuickDemo = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      loginAs('admin@barakahdaily.com', 'admin');
    } else {
      loginAs('tariq@barakahdaily.com', 'user');
    }
    onSuccessfulAuth();
  };

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} className={`min-h-screen bg-[#F7F4EC] text-[#16241A] ${fontClass} flex flex-col antialiased`}>
      {/* 1. TOP MARKETING NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#0B2E1C] border-b border-[#123D28] px-6 lg:px-12 py-4 flex items-center justify-between text-[#F3F0E4] shadow-md">
        <BrandMark variant="dark" size="md" />

        <div className="flex items-center gap-3">
          {/* Pre-login language switcher */}
          <div className="flex items-center gap-1 bg-[#123D28] px-2.5 py-1.5 rounded-xl border border-[#C89B2E]/40 text-xs">
            <Globe className="w-3.5 h-3.5 text-[#FBBF24]" />
            <select
              value={language}
              onChange={(e) => {
                const l = e.target.value as Language;
                setLanguage(l);
                setSelectedLang(l);
              }}
              className="bg-transparent font-bold text-white outline-none cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="text-black">
                  {l.label} ({l.native})
                </option>
              ))}
            </select>
          </div>

          {authMode === 'landing' ? (
            <button
              onClick={() => setAuthMode('login')}
              className="px-4 py-2 rounded-xl bg-[#2E8B4F] hover:bg-[#257341] text-white text-xs font-bold transition-all shadow-sm"
            >
              {t('signIn')}
            </button>
          ) : (
            <button
              onClick={() => setAuthMode('landing')}
              className="px-3 py-1.5 rounded-xl border border-[#C89B2E]/40 text-xs font-semibold text-[#F3F0E4] hover:bg-[#123D28]"
            >
              {t('backToOverview')}
            </button>
          )}
        </div>
      </header>

      {/* 2. AUTH MODALS OR LANDING HERO */}
      {authMode === 'landing' ? (
        <main className="flex-1 flex flex-col justify-between">
          {/* HERO SECTION */}
          <section className="px-6 lg:px-12 py-12 lg:py-20 max-w-6xl mx-auto w-full text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E1F2E7] border border-[#2E8B4F]/30 text-xs font-bold text-[#2E8B4F] shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#C89B2E]" />
              <span>{t('heroBadge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B2E1C] tracking-tight leading-tight max-w-4xl mx-auto font-serif">
              {t('heroHeadline')}
            </h1>

            <p className="text-base sm:text-lg text-[#5D6B5A] max-w-2xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setAuthMode('signup')}
                className="px-8 py-3.5 rounded-2xl bg-[#0B2E1C] hover:bg-[#123D28] text-[#FBBF24] font-extrabold text-sm shadow-xl transition-transform active:scale-95 flex items-center gap-2"
              >
                <span>{t('getStarted')}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={() => handleQuickDemo('user')}
                className="px-6 py-3.5 rounded-2xl bg-white border border-stone-300 hover:border-[#2E8B4F] text-[#16241A] font-bold text-sm shadow-xs transition-colors"
              >
                {t('exploreDemo')}
              </button>

              <button
                onClick={() => handleQuickDemo('admin')}
                className="px-6 py-3.5 rounded-2xl bg-[#FAF0D8] border border-[#C89B2E] text-[#C89B2E] hover:bg-[#faebd0] font-bold text-sm shadow-xs transition-colors"
              >
                {t('adminDemo')}
              </button>
            </div>

            {/* Citation trust tag */}
            <div className="pt-2 text-xs text-[#5D6B5A]">
              {t('trustTag')}
            </div>
          </section>

          {/* 3. CORE MODULE FEATURES GRID */}
          <section className="px-6 lg:px-12 py-12 bg-white border-t border-stone-200">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#16241A]">
                  {t('builtForWorship')}
                </h2>
                <p className="text-xs text-[#5D6B5A] mt-1">
                  {t('builtForWorshipDesc')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: t('navProductivity'),
                    desc: t('timeBlockedSchedule'),
                    icon: Clock,
                    accent: '#2E8B4F',
                    tint: '#E1F2E7',
                  },
                  {
                    title: t('navQuran'),
                    desc: t('readingKhatmPacing'),
                    icon: BookOpen,
                    accent: '#C89B2E',
                    tint: '#FAF0D8',
                  },
                  {
                    title: t('navRamadan'),
                    desc: t('ramadanDailyAnchor'),
                    icon: Moon,
                    accent: '#5B3FA8',
                    tint: '#ECE7F8',
                  },
                  {
                    title: t('groupKhatmTitle'),
                    desc: t('taskDescPlaceholder'),
                    icon: Users,
                    accent: '#0E8C74',
                    tint: '#DAF3EC',
                  },
                  {
                    title: t('subtabCalculator'),
                    desc: t('eligibleForZakat'),
                    icon: Coins,
                    accent: '#C1541F',
                    tint: '#FAE5D8',
                  },
                  {
                    title: t('familyTitle'),
                    desc: t('familyDesc'),
                    icon: Compass,
                    accent: '#1D7A9C',
                    tint: '#DCF0F6',
                  },
                ].map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={idx}
                      className="p-6 rounded-3xl border border-stone-200 bg-[#F7F4EC]/60 hover:bg-white hover:shadow-md transition-all space-y-3"
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: feat.tint, color: feat.accent }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-[#16241A]">{feat.title}</h3>
                      <p className="text-xs text-[#5D6B5A] leading-relaxed">{feat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="bg-[#0B2E1C] text-[#9FB6A3] px-6 lg:px-12 py-8 text-center text-xs border-t border-[#123D28]">
            <p className="text-[#F3F0E4] font-bold mb-1">BarakahDaily</p>
            <p>{t('prayerViaAladhan')}</p>
          </footer>
        </main>
      ) : authMode === 'signup' ? (
        /* SIGN UP WIZARD WITH LOCATION & METHOD ONBOARDING (PRD §6.1) */
        <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="bg-white rounded-3xl p-6 lg:p-10 border border-stone-200 shadow-xl max-w-lg w-full space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-extrabold text-[#16241A] font-serif">{t('createAccount')}</h2>
              <p className="text-xs text-[#5D6B5A]">{t('manageLocationMethods')}</p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5D6B5A] mb-1">{t('fullNameLabel')}</label>
                  <input
                    type="text"
                    placeholder={t('nameInputPlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 outline-none text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#5D6B5A] mb-1">{t('emailAddressLabel')}</label>
                  <input
                    type="email"
                    placeholder={t('emailInputPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 outline-none text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5D6B5A] mb-1">{t('passwordLabel')}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 outline-none text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#5D6B5A] mb-1">{t('confirmPasswordLabel')}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 outline-none text-xs"
                    required
                  />
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('preferredLangLabel')}</label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value as Language)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label} ({l.native})
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Selection */}
              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('selectCityLabel')}</label>
                <select
                  value={selectedLocation.city}
                  onChange={(e) => {
                    const loc = POPULAR_LOCATIONS.find((l) => l.city === e.target.value);
                    if (loc) setSelectedLocation(loc);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                >
                  {POPULAR_LOCATIONS.map((loc) => (
                    <option key={loc.city} value={loc.city}>
                      {loc.city}, {loc.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Calculation Method */}
              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('calcMethodLabel')}</label>
                <select
                  value={calcMethod}
                  onChange={(e) => setCalcMethod(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 outline-none"
                >
                  {CALCULATION_METHODS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Asr Juristic Madhab */}
              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('juristicMadhabLabel')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMadhab('shafi')}
                    className={`py-2 rounded-xl border ${
                      madhab === 'shafi' ? 'bg-[#2E8B4F] text-white font-bold' : 'bg-stone-50'
                    }`}
                  >
                    {t('standardMadhab')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMadhab('hanafi')}
                    className={`py-2 rounded-xl border ${
                      madhab === 'hanafi' ? 'bg-[#2E8B4F] text-white font-bold' : 'bg-stone-50'
                    }`}
                  >
                    {t('hanafiMadhab')}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#0B2E1C] hover:bg-[#123D28] text-[#FBBF24] font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md mt-4"
              >
                {t('completeOnboardingBtn')}
              </button>
            </form>

            <div className="text-center text-xs text-[#5D6B5A]">
              {t('haveAccount')}{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="font-bold text-[#2E8B4F] hover:underline"
              >
                {t('signIn')}
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* LOGIN MODAL */
        <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="bg-white rounded-3xl p-6 lg:p-10 border border-stone-200 shadow-xl max-w-md w-full space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-extrabold text-[#16241A] font-serif">{t('welcomeBack')}</h2>
              <p className="text-xs text-[#5D6B5A]">{t('loginSubtitle')}</p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('emailAddressLabel')}</label>
                <input
                  type="email"
                  placeholder="tariq@barakahdaily.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 outline-none text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[#5D6B5A] mb-1">{t('passwordLabel')}</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 outline-none text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#0B2E1C] hover:bg-[#123D28] text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                {t('signIn')}
              </button>
            </form>

            {/* Quick Demo Logins */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <p className="text-[11px] text-center text-[#5D6B5A] font-semibold uppercase">
                {t('instantDemoAccess')}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickDemo('user')}
                  className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#16241A] text-xs font-bold transition-colors"
                >
                  {t('exploreDemo')}
                </button>
                <button
                  onClick={() => handleQuickDemo('admin')}
                  className="py-2 px-3 rounded-xl bg-[#FAF0D8] hover:bg-[#faebd0] text-[#C89B2E] text-xs font-bold transition-colors"
                >
                  {t('adminDemo')}
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-[#5D6B5A]">
              {t('noAccount')}{' '}
              <button
                onClick={() => setAuthMode('signup')}
                className="font-bold text-[#2E8B4F] hover:underline"
              >
                {t('signUp')}
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};
